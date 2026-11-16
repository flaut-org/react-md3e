import { expect, test } from '@playwright/test';

const inkSelector = '[data-md3-ripple-ink]';

test('pointer ripple grows from the press position, survives a hold, and fades after release without style insertion', async ({
  page,
}) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: 'Count clicks', exact: true });
  const ink = button.locator(inkSelector);
  const styleCount = await page.locator('style').count();

  await button.scrollIntoViewIfNeeded();

  const box = (await button.boundingBox())!;

  await page.mouse.move(box.x + 12, box.y + box.height / 2);
  await page.mouse.down();
  await expect(ink).toHaveCount(1);
  await expect(ink).toHaveCSS('animation-duration', '0.45s');

  const origin = await ink.evaluate((element) => ({
    x: parseFloat((element as HTMLElement).style.getPropertyValue('--_ripple-start-x')),
    size: parseFloat((element as HTMLElement).style.getPropertyValue('--_ripple-size')),
    center: parseFloat((element as HTMLElement).style.getPropertyValue('--_ripple-end-x')),
  }));

  expect(origin.x + origin.size / 2).toBeCloseTo(12, 0);
  expect(origin.x).toBeLessThan(origin.center);

  const initialWidth = (await ink.boundingBox())!.width;

  await expect.poll(async () => (await ink.boundingBox())!.width).toBeGreaterThan(initialWidth);
  await page.waitForTimeout(250);
  await expect(ink).not.toHaveAttribute('data-leaving', 'true');
  await page.mouse.up();
  await expect(ink).toHaveAttribute('data-leaving', 'true');
  await expect(ink).toHaveCount(0);
  await expect(page.getByTestId('click-count')).toHaveText('1');
  // A quick click must still produce a visible press before its fade starts.
  await button.click();
  await expect(ink).toHaveCount(1);
  await expect(ink).not.toHaveAttribute('data-leaving', 'true');
  await button.click();
  await expect(ink).toHaveCount(0);
  await expect(page.getByTestId('click-count')).toHaveText('3');
  expect(await page.locator('style').count()).toBe(styleCount);
});

test('Space, Enter, and assistive activation use one centered ripple and preserve button behavior', async ({
  page,
}) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: 'Count clicks', exact: true });
  const ink = button.locator(inkSelector);

  await button.focus();
  await page.keyboard.down('Space');
  await expect(ink).toHaveCount(1);
  expect(
    await ink.evaluate((element) => {
      const { style } = element as HTMLElement;

      return (
        style.getPropertyValue('--_ripple-start-x') === style.getPropertyValue('--_ripple-end-x') &&
        style.getPropertyValue('--_ripple-start-y') === style.getPropertyValue('--_ripple-end-y')
      );
    }),
  ).toBe(true);
  await page.keyboard.up('Space');
  await expect(ink).toHaveCount(1);
  await expect(page.getByTestId('click-count')).toHaveText('1');
  await expect(ink).toHaveCount(0);
  await page.keyboard.down('Enter');
  await expect(ink).toHaveCount(1);
  await expect(page.getByTestId('click-count')).toHaveText('2');
  await page.keyboard.up('Enter');
  await expect(ink).toHaveCount(0);
  await button.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(ink).toHaveCount(1);
  await expect(page.getByTestId('click-count')).toHaveText('3');
  await expect(ink).toHaveCount(0);
});

test('touch delay avoids scroll flashes and pointer cancellation clears an active ripple', async ({
  page,
  browser,
}) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: 'Count clicks', exact: true });
  const ink = button.locator(inkSelector);
  const point = {
    pointerId: 7,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: 50,
    clientY: 50,
  };

  await button.dispatchEvent('pointerdown', point);
  await expect(ink).toHaveCount(0);
  await button.dispatchEvent('pointercancel', point);
  await page.waitForTimeout(200);
  await expect(ink).toHaveCount(0);
  await button.dispatchEvent('pointerdown', point);
  await expect(ink).toHaveCount(1);
  await button.dispatchEvent('pointercancel', point);
  await expect(ink).toHaveCount(0);
  await button.dispatchEvent('pointerdown', point);
  await button.dispatchEvent('pointerup', point);
  await expect(ink).toHaveCount(1);
  await expect(ink).toHaveCount(0);

  const touch = await browser.newContext({ hasTouch: true, isMobile: true });

  try {
    const touchPage = await touch.newPage();

    await touchPage.goto('http://127.0.0.1:3100/');
    await touchPage.getByRole('button', { name: 'Count clicks', exact: true }).tap();
    await expect(touchPage.getByTestId('click-count')).toHaveText('1');
    await expect(touchPage.locator(inkSelector)).toHaveCount(0);
  } finally {
    await touch.close();
  }
});

test('disabled, disableRipple, reduced motion, and forced colors suppress ripple while retaining focus feedback', async ({
  page,
}) => {
  await page.goto('/');

  const disabled = page.getByRole('button', { name: 'Disabled action', exact: true });

  await disabled.dispatchEvent('pointerdown', { isPrimary: true, button: 0 });
  await expect(disabled.locator(inkSelector)).toHaveCount(0);

  const without = page.getByRole('button', { name: 'No ripple', exact: true });

  await without.click();
  await expect(without.locator(inkSelector)).toHaveCount(0);
  await without.focus();
  await page.keyboard.press('Space');
  await expect(without).toHaveCSS('outline-style', 'solid');

  const button = page.getByRole('button', { name: 'Count clicks', exact: true });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.click();
  await expect(button.locator(inkSelector)).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference', forcedColors: 'active' });
  await button.click();
  await expect(button.locator(inkSelector)).toHaveCount(0);
});
