import { expect, test } from '@playwright/test';
import { pauseMotionOnAttributeChange } from '../../../../tests/browser/pause-motion';

for (const story of ['search-app-bar', 'centered-search']) {
  test(`${story}: Escape retains the focus frame through the exit and native focus restoration`, async ({ page }) => {
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-appbar--${story}&viewMode=story&globals=colorScheme:dark`,
    );
    await page.getByRole('searchbox').click();

    const view = page.getByRole('dialog');

    await expect(view.getByRole('searchbox')).toBeFocused();
    await expect(view).not.toHaveAttribute('data-starting-style');

    const expected = await view.evaluate(async (node) => {
      await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));

      return getComputedStyle(node.querySelector('[data-md3-search-bar]')!).boxShadow;
    });

    expect(expected).not.toBe('none');
    await page.evaluate(() => {
      const state = { frame: 0, shadows: [] as string[] };
      const record = () => {
        const popup = document.querySelector('[data-md3-search-view]');
        const bar =
          popup?.querySelector('[data-md3-search-bar]') ??
          document.querySelector('[data-md3-search-anchor] [data-md3-search-bar]')!;

        state.shadows.push(getComputedStyle(bar).boxShadow);
        state.frame = requestAnimationFrame(record);
      };

      Reflect.set(window, '__searchFocusFrames', state);
      record();
    });
    await page.keyboard.press('Escape');
    await expect(view).toHaveCount(0);
    await expect(page.getByRole('searchbox')).toBeFocused();

    const shadows = await page.evaluate(async () => {
      for (let index = 0; index < 12; index += 1) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      }

      const state = Reflect.get(window, '__searchFocusFrames') as { frame: number; shadows: string[] };

      cancelAnimationFrame(state.frame);
      Reflect.deleteProperty(window, '__searchFocusFrames');

      return state.shadows;
    });

    expect(shadows.length).toBeGreaterThan(12);
    expect(shadows.every((shadow) => shadow === expected)).toBe(true);
    await page.getByRole('button', { name: 'More options', exact: true }).click();
    await expect(page.locator('[data-md3-search-anchor] [data-md3-search-bar]')).toHaveCSS('box-shadow', 'none');
  });
}

for (const [story, query, closeByPointer] of [
  ['search-app-bar', '', false],
  ['centered-search', '', false],
  ['centered-search', 'Kyiv', true],
] as const) {
  test(`${story} ${query || 'placeholder'}: text and adornments reach their source positions before handoff`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      // Independent DOM text layout reference: the implementation measures native input text with canvas.
      Reflect.set(window, '__readSearchTextLeft', (input: HTMLInputElement) => {
        const style = getComputedStyle(input);
        const span = document.createElement('span');

        span.textContent = input.value || input.placeholder;
        Object.assign(span.style, {
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: style.font,
          letterSpacing: style.letterSpacing,
        });
        document.body.append(span);

        const range = document.createRange();

        range.selectNodeContents(span);

        const { width } = range.getBoundingClientRect();
        const rect = input.getBoundingClientRect();
        const left = parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
        const available =
          rect.width -
          parseFloat(style.borderLeftWidth) -
          parseFloat(style.borderRightWidth) -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight);
        const rtl = style.direction === 'rtl';
        const right =
          style.textAlign === 'right' || (style.textAlign === 'start' && rtl) || (style.textAlign === 'end' && !rtl);
        let offset = 0;

        if (style.textAlign === 'center') {
          offset = (available - width) / 2;
        } else if (right) {
          offset = available - width;
        }

        span.remove();

        return rect.left + left + offset + (parseFloat(style.textIndent) || 0) * (rtl ? -1 : 1) - input.scrollLeft;
      });
    });
    await page.goto(
      `http://127.0.0.1:6106/iframe.html?id=components-appbar--${story}&viewMode=story&globals=colorScheme:dark`,
    );
    await page.evaluate(() => document.fonts.ready);

    const source = page.locator('[data-md3-search-anchor]');
    const input = source.getByRole('searchbox');

    if (query) {
      await input.click();
      await page.getByRole('dialog').getByRole('searchbox').fill(query);
      await page.getByRole('dialog').getByRole('button', { name: 'Back', exact: true }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }

    const targetTextLeft = await input.evaluate((node) =>
      (Reflect.get(window, '__readSearchTextLeft') as (input: HTMLInputElement) => number)(node as HTMLInputElement),
    );
    const sourceStar = source.locator('[data-md3-search-trailing]');
    const targetStar = (await sourceStar.count()) ? await sourceStar.boundingBox() : null;

    if (targetStar) {
      await sourceStar.locator('button').evaluate((node) => node.setAttribute('id', 'original-search-adornment'));
    }

    await input.evaluate((node) =>
      node
        .closest<HTMLElement>('[data-md3-theme]')!
        .style.setProperty('--md-sys-motion-spring-default-spatial-duration', '1000ms'),
    );
    await input.click();

    const view = page.getByRole('dialog');

    await expect(view).not.toHaveAttribute('data-starting-style');
    await view.evaluate(async (node) => {
      await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
    });

    await pauseMotionOnAttributeChange(view, 'data-ending-style');

    if (closeByPointer) {
      await view.getByRole('button', { name: 'Back', exact: true }).click();
    } else {
      await page.keyboard.press('Escape');
    }

    await expect(view).toHaveAttribute('data-ending-style');

    const frames = await view.evaluate((node) => {
      const animations = node.getAnimations({ subtree: true });
      const readText = Reflect.get(window, '__readSearchTextLeft') as (input: HTMLInputElement) => number;

      animations.forEach((animation) => animation.pause());

      const samples = [0, 40, 100, 1000].map((time) => {
        for (const animation of animations) {
          animation.currentTime = time;
        }

        const back = node.querySelector('[data-md3-search-back]')!;
        const leading = node.querySelector('[data-md3-search-source-leading]')!;
        const trailing = node.querySelector('[data-md3-search-source-trailing]')!;

        return {
          text: readText(node.querySelector<HTMLInputElement>('[data-md3-search-input]')!),
          backOpacity: Number(getComputedStyle(back).opacity),
          leadingOpacity: Number(getComputedStyle(leading).opacity),
          trailingOpacity: Number(getComputedStyle(trailing).opacity),
          trailingRect: trailing.getBoundingClientRect().toJSON(),
        };
      });

      animations.forEach((animation) => animation.finish());

      return samples;
    });

    expect(frames[1]!.backOpacity).toBeGreaterThan(0);
    expect(frames[1]!.backOpacity).toBeLessThan(1);
    expect(frames[1]!.leadingOpacity).toBeGreaterThan(0);
    expect(frames[1]!.leadingOpacity).toBeLessThan(1);
    expect(frames.at(-1)!.backOpacity).toBe(0);
    expect(frames.at(-1)!.leadingOpacity).toBe(1);
    expect(frames.at(-1)!.text).toBeCloseTo(targetTextLeft, 0);

    if (targetStar) {
      expect(frames[1]!.trailingOpacity).toBeGreaterThan(0);
      expect(frames[1]!.trailingOpacity).toBeLessThan(1);
      expect(frames.at(-1)!.trailingRect.x).toBeCloseTo(targetStar.x, 0);
      expect(frames.at(-1)!.trailingRect.width).toBeCloseTo(targetStar.width, 0);
      expect(Math.abs(frames[1]!.text - frames[0]!.text)).toBeGreaterThan(1);
      expect(Math.abs(frames[1]!.text - targetTextLeft)).toBeGreaterThan(1);
      await expect(page.locator('#original-search-adornment')).toHaveCount(1);
    }

    await expect(view).toHaveCount(0);
    await expect(source).toBeVisible();
  });
}
