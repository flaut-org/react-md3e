import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/** Static contrast checks observe the opaque surface after native entry, with motion enabled. */
export async function waitForOverlayEntry(overlay: Locator) {
  await expect(overlay).toHaveCSS('opacity', '1');
  await expect
    .poll(
      () =>
        overlay.evaluate(
          (node) =>
            node
              .getAnimations()
              .filter(
                (animation) =>
                  animation.playState === 'running' && animation.effect?.getTiming().iterations !== Infinity,
              ).length,
        ),
      { intervals: [16] },
    )
    .toBe(0);
}

/** Assert visible geometry AND hit testing; DOM presence / intersection alone cannot detect covered overlays. */
export async function expectUsableOverlay(overlay: Locator, control: Locator, requirement = 'overlay') {
  await expect(overlay).toBeVisible();
  await expect(control).toBeVisible();
  await expect(control).toBeEnabled();
  await expect(control, `${requirement}:control-viewport`).toBeInViewport({ ratio: 1 });
  await control.click({ trial: true });
  await expect
    .poll(() =>
      overlay.evaluate((node) => {
        const box = node.getBoundingClientRect();

        return (
          box.width > 0 &&
          box.height > 0 &&
          box.x >= -1 &&
          box.y >= -1 &&
          box.right <= window.innerWidth + 1 &&
          box.bottom <= window.innerHeight + 1
        );
      }),
    )
    .toBe(true);
}

export async function repeatOpenClose(trigger: Locator, overlay: Locator, close: () => Promise<void>, count = 4) {
  for (let index = 0; index < count; index += 1) {
    await trigger.click();
    await expect(overlay).toBeVisible();
    await close();
    await expect(overlay).toBeHidden();
  }
}

/** Interrupt a nonmodal popup's entry with real input; its dismissal may intentionally be instant. */
export async function interruptOpenClose(page: Page, trigger: Locator, overlay: Locator, count = 3) {
  const box = await trigger.boundingBox();

  expect(box).not.toBeNull();

  const click = () => page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);

  for (let index = 0; index < count; index += 1) {
    await click();
    await expect(overlay).toBeVisible();

    if (!reduced) {
      await expect
        .poll(
          () => overlay.evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
          { message: 'Wait for the actual native entry to begin', intervals: [16], timeout: 1500 },
        )
        .toBe(true);
      expect(
        await overlay.evaluate((node) => node.getAnimations().some((animation) => animation.playState === 'running')),
        'Entry must still be running immediately before interruption',
      ).toBe(true);
    }

    await click();
    await expect(overlay).toBeHidden();
    await click();
    await expect(overlay).toBeVisible();
    await expect(overlay).not.toHaveAttribute('data-closed');
    await page.keyboard.press('Escape');
    await expect(overlay).toBeHidden();
  }
}
