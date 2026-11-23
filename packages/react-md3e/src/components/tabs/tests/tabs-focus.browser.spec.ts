import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import reference from './tabs-focus.reference.json' with { type: 'json' };

const focusRing = (tab: Locator) => tab.locator('[data-md3-tab-focus-ring]');

async function sampleRing(tab: Locator, elapsed: number) {
  return tab.evaluate((element, time) => {
    const ring = element.querySelector<HTMLElement>('[data-md3-tab-focus-ring]')!;

    ring.getBoundingClientRect();

    const animations = ring.getAnimations();

    for (const animation of animations) {
      animation.pause();
      animation.currentTime = time;
    }

    const bounds = ring.getBoundingClientRect();
    const tabBounds = element.getBoundingClientRect();
    const style = getComputedStyle(ring);
    const content = element.querySelector('[data-md3-tab-content]')!.getBoundingClientRect();

    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      tabX: tabBounds.x,
      tabY: tabBounds.y,
      tabWidth: tabBounds.width,
      bottomInset: tabBounds.bottom - bounds.bottom,
      radius: parseFloat(style.borderTopLeftRadius),
      thickness: parseFloat(style.borderTopWidth),
      color: style.borderTopColor,
      animationCount: animations.length,
      duration: animations[0]?.effect?.getTiming().duration,
      contentX: content.x,
      contentY: content.y,
      contentWidth: content.width,
      contentHeight: content.height,
    };
  }, elapsed);
}

test('focus frame matches the reference geometry for selected and unselected primary/secondary tabs', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tabs');

  for (const [id, inset] of [
    ['icon-tabs', reference.geometry.selectedPrimaryBottomInset],
    ['secondary-tabs', reference.geometry.selectedSecondaryBottomInset],
  ] as const) {
    const root = page.getByTestId(id);
    const selected = root.getByRole('tab').first();
    const unselected = root.getByRole('tab').nth(1);

    await selected.focus();

    const activeFrame = await sampleRing(selected, 0);

    expect(activeFrame.radius).toBe(reference.geometry.radius);
    expect(activeFrame.thickness).toBe(reference.geometry.restThickness);
    expect(activeFrame.bottomInset).toBe(inset);
    expect(activeFrame.x).toBe(activeFrame.tabX);
    expect(activeFrame.y).toBe(activeFrame.tabY);
    expect(activeFrame.width).toBe(activeFrame.tabWidth);
    await selected.press('ArrowRight');
    await expect(unselected).toBeFocused();
    await expect(focusRing(selected)).toBeHidden();

    const inactiveFrame = await sampleRing(unselected, 0);

    expect(inactiveFrame.bottomInset).toBe(reference.geometry.unselectedBottomInset);
    expect(inactiveFrame.radius).toBe(reference.geometry.radius);
    await expect(selected).toHaveAttribute('aria-selected', 'true');
  }
});

test('focus pulses inward once, settles and restarts on re-entry without moving content or the indicator', async ({
  page,
}) => {
  await page.goto('/tabs');

  const root = page.getByTestId('icon-tabs');
  const selected = root.getByRole('tab').first();
  const unselected = root.getByRole('tab').nth(1);
  const styleCount = await page.locator('style').count();
  const indicator = root.locator('[data-md3-tab-indicator]');

  await expect(indicator).toBeVisible();
  await selected.focus();

  const initial = await sampleRing(selected, 0);
  const indicatorBounds = await indicator.boundingBox();

  expect(initial.animationCount).toBe(1);
  expect(initial.duration).toBe(reference.motion.duration);

  for (const frame of reference.motion.samples) {
    const sample = await sampleRing(selected, frame.time);

    expect(Math.abs(sample.thickness - frame.thickness)).toBeLessThanOrEqual(reference.motion.thicknessTolerance);
    expect(sample.x).toBe(initial.x);
    expect(sample.y).toBe(initial.y);
    expect(sample.width).toBe(initial.width);
    expect(sample.height).toBe(initial.height);
    expect([sample.contentX, sample.contentY, sample.contentWidth, sample.contentHeight]).toEqual([
      initial.contentX,
      initial.contentY,
      initial.contentWidth,
      initial.contentHeight,
    ]);
    expect(await indicator.boundingBox()).toEqual(indicatorBounds);
  }

  await selected.press('ArrowRight');
  await expect(focusRing(selected)).toBeHidden();
  await expect(focusRing(unselected)).toBeVisible();
  await unselected.press('ArrowLeft');

  const restarted = await sampleRing(selected, reference.motion.duration / 2);

  expect(restarted.thickness).toBe(reference.geometry.peakThickness);
  await expect(page.locator('style')).toHaveCount(styleCount);
});

test('pointer focus stays quiet and reduced motion/forced colors preserve a stable keyboard frame', async ({
  page,
}) => {
  await page.goto('/tabs');

  const root = page.getByTestId('icon-tabs');
  const first = root.getByRole('tab').first();
  const second = root.getByRole('tab').nth(1);

  await first.click();
  await expect(focusRing(first)).toBeHidden();
  await first.press('ArrowRight');
  await expect(focusRing(second)).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });

  const reduced = await sampleRing(second, reference.motion.duration / 2);
  const highlight = await second.evaluate((element) => {
    const probe = element.ownerDocument.createElement('span');

    probe.style.color = 'Highlight';
    element.append(probe);

    const value = getComputedStyle(probe).color;

    probe.remove();

    return value;
  });

  expect(reduced.animationCount).toBe(0);
  expect(reduced.thickness).toBe(reference.geometry.restThickness);
  expect(reduced.color).toBe(highlight);
  await expect(focusRing(second)).toHaveCSS('forced-color-adjust', 'none');
});
