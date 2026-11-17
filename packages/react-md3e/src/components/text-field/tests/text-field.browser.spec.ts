import { expect, test } from '@playwright/test';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const forest = createTheme({ sourceColor: '#386a20' });
const rgb = (hex: string) =>
  `rgb(${hex
    .slice(1)
    .match(/../g)!
    .map((part) => parseInt(part, 16))
    .join(', ')})`;

test('floating labels and outline notches follow focus, values and native label/helper relationships', async ({
  page,
}) => {
  await page.goto('/fields');

  const input = page.getByRole('textbox', { name: 'Traveler', exact: true });
  const root = input.locator('..').locator('..');
  const label = root.locator('label');

  await expect(label).toHaveCSS('font-size', '16px');
  await expect(input).toHaveAccessibleDescription('Enter your full name');
  await expect(input.locator('..')).toHaveCSS('height', '56px');
  await label.click({ force: true });
  await expect(input).toBeFocused();
  await expect(label).toHaveCSS('font-size', '12px');
  await input.fill('Alex Morgan');
  await page.getByRole('heading', { name: 'TextField states' }).click();
  await expect(label).toHaveCSS('font-size', '12px');
  await expect(page.getByTestId('traveler-value')).toHaveText('Alex Morgan');

  const legendWidth = await root.locator('legend').evaluate((node) => node.getBoundingClientRect().width);

  expect(legendWidth).toBeGreaterThan(20);
  await input.fill('');
  await page.getByRole('heading', { name: 'TextField states' }).click();
  await expect(label).toHaveCSS('font-size', '16px');
  await expect(page.getByRole('textbox', { name: 'Server name' })).toHaveValue('Alex');
});

test('filled label moves continuously on focus, blur and reversal during an active transition', async ({ page }) => {
  await page.goto('/fields');

  const frames = await page.getByRole('textbox', { name: 'Filled traveler' }).evaluate((control) => {
    const input = control as HTMLInputElement;
    const label = input.parentElement!.querySelector('label')!;
    const position = () => label.getBoundingClientRect().top;
    const seek = (animations: Animation[], time: number) => {
      for (const animation of animations) {
        animation.currentTime = time;
      }

      return position();
    };
    const pause = () => {
      position();

      const animations = label.getAnimations();

      animations.forEach((animation) => animation.pause());

      return animations;
    };
    const resting = position();

    input.focus();

    const entering = pause();
    const enteringDuration = Math.max(
      ...entering.map((animation) => Number(animation.effect!.getComputedTiming().duration)),
    );
    const focusFrames = [0, 0.05, 0.15, 1].map((progress) => seek(entering, enteringDuration * progress));

    entering.forEach((animation) => animation.finish());

    const floating = position();

    input.blur();

    const leaving = pause();
    const leavingDuration = Math.max(
      ...leaving.map((animation) => Number(animation.effect!.getComputedTiming().duration)),
    );
    const blurFrames = [0, 0.05, 0.15, 1].map((progress) => seek(leaving, leavingDuration * progress));

    leaving.forEach((animation) => animation.finish());
    input.focus();

    const interrupted = pause();
    const beforeReversal = seek(interrupted, 50);

    input.blur();

    const returning = pause();
    const afterReversal = seek(returning, 0);

    returning.forEach((animation) => animation.finish());

    return { resting, floating, focusFrames, blurFrames, beforeReversal, afterReversal };
  });

  expect(frames.resting - frames.floating).toBeGreaterThan(4);
  expect(Math.abs(frames.focusFrames[0]! - frames.resting)).toBeLessThan(0.5);
  expect(Math.abs(frames.blurFrames[0]! - frames.floating)).toBeLessThan(0.5);
  expect(Math.abs(frames.beforeReversal - frames.afterReversal)).toBeLessThan(0.5);

  for (let index = 1; index < frames.focusFrames.length; index += 1) {
    expect(frames.focusFrames[index]!).toBeLessThanOrEqual(frames.focusFrames[index - 1]! + 0.5);
    expect(frames.blurFrames[index]!).toBeGreaterThanOrEqual(frames.blurFrames[index - 1]! - 0.5);
  }

  expect(Math.abs(frames.focusFrames.at(-1)! - frames.floating)).toBeLessThan(0.5);
  expect(Math.abs(frames.blurFrames.at(-1)! - frames.resting)).toBeLessThan(0.5);
});

test('required/type validation, native multiline values, disabled and readOnly remain functional', async ({ page }) => {
  await page.goto('/fields');
  await page.getByRole('button', { name: 'Submit booking' }).click();
  await expect(page.getByTestId('booking-values')).toHaveText('');

  const email = page.getByRole('textbox', { name: 'Email', exact: true });

  await email.fill('bad-email');
  expect(await email.evaluate((node) => (node as HTMLInputElement).validity.typeMismatch)).toBe(true);
  await email.fill('alex@example.com');
  await page.getByRole('textbox', { name: 'Form notes' }).fill('Window seat\nVegetarian meal');
  await page.getByRole('combobox', { name: 'Booking city' }).click();
  await page.getByRole('option', { name: 'Rome', exact: true }).click();
  await page.getByRole('button', { name: 'Submit booking' }).click();
  await expect(page.getByTestId('booking-values')).toHaveText(
    JSON.stringify({ email: 'alex@example.com', notes: 'Window seat\nVegetarian meal', city: 'ROM' }),
  );
  await expect(page.getByRole('textbox', { name: 'Disabled name' })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Read-only name' })).toHaveAttribute('readonly');
  await page.getByRole('textbox', { name: 'Read-only name' }).focus();
  await page.keyboard.type('ignored');
  await expect(page.getByRole('textbox', { name: 'Read-only name' })).toHaveValue('Saved name');
});

test('input/root refs and native attributes work through slot composition', async ({ page }) => {
  await page.goto('/fields');

  const traveler = page.getByRole('textbox', { name: 'Traveler', exact: true });

  await page.getByRole('button', { name: 'Focus traveler' }).click();
  await expect(traveler).toBeFocused();
  await expect(traveler).toHaveAttribute('maxlength', '30');
  await page.getByRole('button', { name: 'Check field refs' }).click();
  await expect(traveler.locator('..').locator('..')).toHaveAttribute('data-ref-checked', 'true');
  await expect(page.getByRole('combobox', { name: 'Destination', exact: true })).toHaveAttribute(
    'data-ref-checked',
    'true',
  );

  const price = page.getByRole('spinbutton', { name: 'Price' });

  await expect(price.locator('..')).toContainText('€');
  await expect(price.locator('..')).toContainText('EUR');
});

test('filled/outlined themes, errors, RTL, reduced motion and forced colors use precompiled CSS', async ({ page }) => {
  await page.goto('/fields');

  const filled = page.getByRole('textbox', { name: 'Filled traveler' });

  expect(await filled.evaluate((node) => getComputedStyle(node, '::placeholder').opacity)).toBe('0');
  await expect(filled.locator('..')).toHaveCSS('background-color', rgb(forest.schemes.light.surfaceContainerHighest));
  await expect(filled.locator('..')).toHaveCSS('border-top-left-radius', '8px');
  await expect(filled).toHaveCSS('font-family', 'Arial, sans-serif');

  const invalid = page.getByRole('textbox', { name: 'Invalid name' });

  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
  await expect(invalid).toHaveAccessibleDescription('Use the name on your passport');
  await expect(invalid.locator('..').locator('fieldset')).toHaveCSS(
    'border-top-color',
    rgb(forest.schemes.light.error),
  );
  await expect(page.getByRole('textbox', { name: 'Dark name' })).toHaveCSS('color', rgb(forest.schemes.dark.onSurface));
  await expect(page.getByRole('textbox', { name: 'RTL name' }).locator('..')).toHaveCSS('direction', 'rtl');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await filled.focus();
  expect(await filled.evaluate((node) => getComputedStyle(node, '::placeholder').opacity)).toBe('1');
  await expect(filled.locator('..').locator('label')).toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(invalid.locator('..').locator('fieldset')).toHaveCSS('border-top-style', 'solid');
});

test('TextField arrives styled before hydration, streams and works in Storybook', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/fields');
    await expect(server.getByRole('textbox', { name: 'Server name' })).toHaveValue('Alex');
    await expect(server.getByRole('textbox', { name: 'Server name' })).toHaveAccessibleDescription(
      'Name shown on your booking',
    );
    await expect(server.getByRole('textbox', { name: 'Server filled' }).locator('..')).toHaveCSS('height', '56px');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('textbox', { name: 'Streamed name' })).toHaveValue('Alex');
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-textfield--controlled&viewMode=story&globals=colorScheme:dark',
  );
  await page.getByRole('textbox', { name: 'Traveler name' }).fill('Taylor');
  await expect(page.getByText('Value: Taylor')).toBeVisible();
});
