import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

test('checkbox supports labels, Space, mixed state, controlled changes, event veto and both refs', async ({ page }) => {
  await page.goto('/selection-controls');

  const updates = page.getByRole('checkbox', { name: 'Travel updates', exact: true });
  const mixed = page.getByRole('checkbox', { name: 'Select all', exact: true });

  await expect(updates).not.toBeChecked();
  await expect(mixed).toHaveAttribute('aria-checked', 'mixed');
  await updates.focus();
  await page.keyboard.press('Space');
  await expect(updates).toBeChecked();
  await mixed.click();
  await expect(mixed).toHaveAttribute('aria-checked', 'false');
  await expect(updates).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Veto checkbox' }).click();
  await expect(page.getByRole('checkbox', { name: 'Veto checkbox' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Change controls from code' }).click();
  await expect(updates).toBeChecked();
  await page.getByRole('button', { name: 'Check control refs' }).click();
  await expect(updates).toHaveAttribute('data-ref-checked', 'true');
  await expect(page.getByRole('radio', { name: 'Economy', exact: true })).toHaveAttribute('data-ref-checked', 'true');
});

test('native form input names, values and required validation are preserved', async ({ page }) => {
  await page.goto('/selection-controls');
  await page.getByRole('button', { name: 'Submit preferences' }).click();
  await expect(page.getByTestId('submitted-preferences')).toHaveText('');
  expect(await page.locator('#terms').evaluate((node) => (node as HTMLInputElement).validity.valueMissing)).toBe(true);
  await page.getByRole('checkbox', { name: 'Accept terms' }).click();
  await page.getByRole('checkbox', { name: 'Travel updates', exact: true }).click();
  await page.getByRole('radio', { name: 'Business', exact: true }).click();
  await page.getByRole('button', { name: 'Submit preferences' }).click();
  await expect(page.getByTestId('submitted-preferences')).toHaveText(
    '{"newsletter":"yes","terms":"accepted","cabin":"business"}',
  );
});

test('disabled/readOnly reject changes; ripple, focus, error and reduced motion use compiled CSS', async ({ page }) => {
  await page.goto('/selection-controls');

  const disabled = page.getByRole('checkbox', { name: 'Disabled checkbox' });
  const locked = page.getByRole('checkbox', { name: 'Read-only checkbox' });

  await expect(disabled).toBeDisabled();
  await disabled.evaluate((node) => (node as HTMLElement).click());
  await locked.click();
  await locked.focus();
  await page.keyboard.press('Space');
  await expect(locked).toBeChecked();
  await expect(disabled).toBeChecked();
  await expect(locked.locator('[data-md3-ripple-ink]')).toHaveCount(0);

  const checkbox = page.getByRole('checkbox', { name: 'Travel updates', exact: true });
  const styleCount = await page.locator('style').count();

  await checkbox.scrollIntoViewIfNeeded();

  const box = (await checkbox.boundingBox())!;

  expect(box.width).toBe(48);
  expect(box.height).toBe(48);
  await page.mouse.move(box.x + 24, box.y + 24);
  await page.mouse.down();
  await expect(checkbox.locator('[data-md3-ripple-ink]')).toHaveCount(1);
  await page.mouse.up();
  await expect(checkbox.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Without ripple' }).click();
  await expect(page.getByRole('checkbox', { name: 'Without ripple' }).locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: 'Error checkbox' })).toHaveAttribute('aria-invalid', 'true');
  await checkbox.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(checkbox).toHaveCSS('outline-style', 'solid');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await checkbox.click();
  await expect(checkbox.locator('[data-md3-ripple-ink]')).toHaveCount(0);
  await expect(checkbox.locator('[data-indicator]')).toHaveCSS('transition-duration', '0s');
  expect(await page.locator('style').count()).toBe(styleCount);
});

test('checkbox SSR, streaming, Storybook themes, forced colors and accessible labeling are supported', async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/selection-controls');
    await expect(server.getByRole('checkbox', { name: 'Server checkbox' })).toBeChecked();
    await expect(server.getByRole('checkbox', { name: 'Server checkbox' })).toHaveCSS('width', '48px');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('checkbox', { name: 'Streamed checkbox' })).toBeChecked();
  await page.goto('/selection-controls');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-checkbox--checked&viewMode=story&globals=brand:forest;colorScheme:dark',
  );

  const { primary } = createTheme({ sourceColor: '#386a20', keyColors: { secondary: '#5d6355', tertiary: '#386568' } })
    .schemes.dark;
  const fill = await page
    .getByRole('checkbox', { name: 'Travel updates' })
    .locator('[data-indicator]')
    .evaluate((node) => getComputedStyle(node).backgroundColor);

  expect(fill).toBe(
    `rgb(${primary
      .slice(1)
      .match(/../g)!
      .map((part) => parseInt(part, 16))
      .join(', ')})`,
  );
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByRole('checkbox', { name: 'Travel updates' }).locator('[data-indicator]')).toHaveCSS(
    'forced-color-adjust',
    'none',
  );
});
