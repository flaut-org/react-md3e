import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { pauseMotionOnAttributeChange } from '../../../../tests/browser/pause-motion';

async function sampleMotionThroughFrames(element: Locator) {
  await element.evaluate(async (root) => {
    const animations = root
      .getAnimations({ subtree: true })
      .filter((animation) => Number.isFinite(Number(animation.effect?.getComputedTiming().endTime ?? Infinity)));

    if (animations.length === 0) {
      throw new Error('Expected captured CSS motion before sampling frames.');
    }

    await Promise.all(animations.map((animation) => animation.ready));

    const duration = Math.max(...animations.map((animation) => Number(animation.effect!.getComputedTiming().endTime)));

    for (let step = 0; step < 13; step += 1) {
      for (const animation of animations) {
        animation.currentTime = (duration * step) / 13;
      }

      // Deliver real layout/ResizeObserver frames at fixed native animation times.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    }

    for (const animation of animations) {
      if (Number(animation.currentTime) < Number(animation.effect!.getComputedTiming().endTime)) {
        animation.play();
      } else {
        animation.finish();
      }
    }

    // Resume the last part on the native clock so Base UI performs its real animation-end handoff.
    await Promise.all(animations.map((animation) => animation.finished.catch(() => {})));
  });
}

interface TextFrame {
  readonly time: number;
  readonly popup: boolean;
  readonly ending: boolean;
  readonly left: number;
  readonly right: number;
  readonly contentLeft: number;
  readonly contentRight: number;
  readonly indent: number;
  readonly base: string | undefined;
}

for (const [scheme, width, direction] of [
  ['expressive', 680, 'ltr'],
  ['standard', 680, 'ltr'],
  ['expressive', 720, 'ltr'],
  ['expressive', 680, 'rtl'],
] as const) {
  test(`${scheme} ${width}px ${direction}: native text stays inside the input and reaches center before native handoff`, async ({
    page,
  }) => {
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-appbar--centered-search&viewMode=story&globals=motionScheme:${scheme}`,
    );
    await page.getByRole('searchbox').waitFor();
    await page
      .locator('[data-md3-theme]')
      .first()
      .evaluate((node, value) => {
        node.setAttribute('dir', value);
      }, direction);
    await expect(page.getByRole('searchbox')).toHaveCSS('direction', direction);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-md3-search-anchor] [data-md3-search-bar]').evaluate((node, value) => {
      node.style.setProperty('inline-size', `${value}px`);
    }, width);
    await page.evaluate(() => {
      const state = { frame: 0, frames: [] as TextFrame[] };
      const text = document.createElement('span');

      Object.assign(text.style, { position: 'fixed', visibility: 'hidden', whiteSpace: 'pre' });
      document.body.append(text);

      const record = () => {
        const popup = document.querySelector('[data-md3-search-view]');
        const parent = popup ?? document.querySelector('[data-md3-search-anchor]')!;
        const input = parent.querySelector<HTMLInputElement>('[data-md3-search-input]')!;
        const style = getComputedStyle(input);
        const rect = input.getBoundingClientRect();
        const rtl = style.direction === 'rtl';

        text.textContent = input.value || input.placeholder;
        text.style.font = style.font;
        text.style.letterSpacing = style.letterSpacing;

        const range = document.createRange();

        range.selectNodeContents(text);

        const textWidth = range.getBoundingClientRect().width;
        const contentLeft = rect.left + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
        const contentRight = rect.right - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth);
        const available = contentRight - contentLeft;
        const indent = parseFloat(style.textIndent) || 0;
        let offset = 0;

        if (style.textAlign === 'center') {
          offset = (available - textWidth) / 2;
        } else if (style.textAlign === 'right' || (style.textAlign === 'start' && rtl)) {
          offset = available - textWidth;
        }

        const left = contentLeft + offset + indent * (rtl ? -1 : 1) - input.scrollLeft;

        const times =
          popup?.getAnimations({ subtree: true }).map((animation) => Number(animation.currentTime ?? 0)) ?? [];

        state.frames.push({
          time: times.length ? Math.max(...times) : (state.frames.at(-1)?.time ?? 0),
          popup: !!popup,
          ending: !!popup?.hasAttribute('data-ending-style'),
          left,
          right: left + textWidth,
          contentLeft,
          contentRight,
          indent,
          base: popup ? getComputedStyle(popup).getPropertyValue('--_search-view-input-base') : undefined,
        });
        state.frame = requestAnimationFrame(record);
      };

      Reflect.set(window, '__searchTextFrames', state);
      Reflect.set(window, '__stopSearchTextFrames', () => {
        cancelAnimationFrame(state.frame);
        text.remove();

        return state.frames;
      });
      record();
    });
    await pauseMotionOnAttributeChange(page.locator('body'), 'data-starting-style', {
      value: null,
      selector: '[data-md3-search-view]',
    });
    await page.getByRole('searchbox').click();

    const view = page.getByRole('dialog');

    await expect(view.getByRole('searchbox')).toBeFocused();
    await expect(view.getByRole('searchbox')).toHaveCSS('direction', direction);
    await expect(view).not.toHaveAttribute('data-starting-style');
    await sampleMotionThroughFrames(view);
    await pauseMotionOnAttributeChange(view, 'data-ending-style');
    await page.keyboard.press('Escape');
    await sampleMotionThroughFrames(view);
    await expect(view).toHaveCount(0);
    await expect(page.getByRole('searchbox')).toBeFocused();

    const frames = await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      return (Reflect.get(window, '__stopSearchTextFrames') as () => TextFrame[])();
    });
    const opening = frames.filter((frame) => frame.popup && !frame.ending);
    const closing = frames.filter((frame) => frame.ending);
    const restored = frames.find((frame, index) => index > 0 && !frame.popup && frames[index - 1]?.ending);
    const distance = Math.max(...opening.map((frame) => frame.indent), ...closing.map((frame) => frame.indent));
    const earlyReturn = closing.filter((frame) => frame.time <= 250).at(-1)!;

    expect(opening.length).toBeGreaterThan(5);
    expect(closing.length).toBeGreaterThan(5);
    expect(distance).toBeGreaterThan(100);
    expect(new Set([...opening, ...closing].map((frame) => frame.base)).size).toBe(1);

    for (const frame of [...opening, ...closing]) {
      expect(frame.left).toBeGreaterThanOrEqual(frame.contentLeft - 0.5);
      expect(frame.right).toBeLessThanOrEqual(frame.contentRight + 0.5);
      expect(frame.indent).toBeGreaterThanOrEqual(-0.01);
      expect(frame.indent).toBeLessThanOrEqual(distance + 0.5);
    }

    expect(earlyReturn.indent).toBeGreaterThan(distance * 0.95);
    expect(restored).toBeDefined();

    // Unmount may fall between frames; the remaining distance must fit the preceding smooth frame step.
    const lastStep = Math.abs(closing.at(-1)!.left - closing.at(-2)!.left);

    expect(Math.abs(closing.at(-1)!.left - restored!.left)).toBeLessThan(Math.max(0.75, lastStep * 2));
  });
}

for (const interaction of ['pointer', 'typing', 'Enter', 'composition'] as const) {
  test(`search reactivates during exit through ${interaction}, preserving the first edit and focus`, async ({
    page,
  }) => {
    await page.goto('http://127.0.0.1:6106/iframe.html?id=components-appbar--search-app-bar&viewMode=story');
    await page.getByRole('searchbox').click();

    const view = page.getByRole('dialog');
    const field = view.getByRole('searchbox');

    await expect(field).toBeFocused();
    await expect(view).not.toHaveAttribute('data-starting-style');
    await view.evaluate(async (node) => {
      await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
    });
    await page.keyboard.press('Escape');
    await expect(view).toHaveAttribute('data-ending-style');

    if (interaction === 'pointer') {
      await expect(view.locator('[data-md3-search-results]')).toHaveCSS('opacity', '0');

      const bounds = (await field.boundingBox())!;

      // A real click during motion must react immediately; locator.click would wait for a stable layout.
      await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    } else if (interaction === 'typing') {
      await page.keyboard.type('K');
    } else if (interaction === 'composition') {
      await field.dispatchEvent('compositionstart');
      await field.evaluate((node: HTMLInputElement) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(node, '京');
        node.dispatchEvent(new InputEvent('input', { bubbles: true, data: '京', isComposing: true }));
      });
      await expect(view).toHaveAttribute('data-ending-style');
      await field.dispatchEvent('compositionend', { data: '京' });
    } else {
      await page.keyboard.press('Enter');
    }

    await expect(view).not.toHaveAttribute('data-ending-style');
    await expect(field).toBeFocused();

    let expectedValue = '';

    if (interaction === 'typing') {
      expectedValue = 'K';
    } else if (interaction === 'composition') {
      expectedValue = '京';
    }

    await expect(field).toHaveValue(expectedValue);
    await expect(view.locator('[data-md3-search-results]')).toHaveCSS('opacity', '1');
    await page.keyboard.press('Escape');
    await expect(view).toHaveCount(0);
  });
}
