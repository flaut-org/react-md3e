import { expect, test } from '@playwright/test';

test('loading Button preserves its name and width, disables activation and uses compiled motion', async ({ page }) => {
  await page.goto('/essentials');

  const button = page.getByRole('button', { name: 'Find flights', exact: true });
  const { width } = (await button.boundingBox())!;
  const styles = await page.locator('style').count();

  await button.click();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  await expect(button).toBeDisabled();
  await expect(button.locator('[data-md3-button-loading]')).toBeVisible();
  expect((await button.boundingBox())!.width).toBe(width);
  await expect(page.getByTestId('essentials-clicks')).toHaveText('1');
  await page.getByRole('button', { name: 'Finish loading', exact: true }).click();
  await expect(button).toBeEnabled();
  expect(await page.locator('style').count()).toBe(styles);
});

test('Button renders native and Next links with typed refs and disabled navigation', async ({ page }) => {
  await page.goto('/essentials');

  const link = page.getByRole('link', { name: 'All articles', exact: true });

  await expect(link).toHaveAttribute('href', '/typography');
  await expect(link).toHaveJSProperty('tagName', 'A');
  await link.click();
  await expect(link).toHaveAttribute('data-ref-checked', 'true');

  const disabled = page.getByRole('link', { name: 'Disabled link', exact: true });

  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect(disabled).not.toHaveAttribute('href');
  await disabled.dispatchEvent('click');
  await expect(page).toHaveURL(/essentials$/);
  await page.getByRole('link', { name: 'Next link button', exact: true }).click();
  await expect(page).toHaveURL(/typography$/);
});

test('custom native elements retain button keyboard semantics and disabled links use inactive appearance', async ({
  page,
}) => {
  await page.goto('/essentials');

  const action = page.getByRole('button', { name: 'Custom element action', exact: true });

  await expect(action).toHaveJSProperty('tagName', 'DIV');
  await action.focus();
  await action.press('Space');
  await expect(page.getByTestId('essentials-clicks')).toHaveText('1');
  await action.press('Enter');
  await expect(page.getByTestId('essentials-clicks')).toHaveText('2');
  await expect(page.getByRole('link', { name: 'Disabled link', exact: true })).toHaveCSS('cursor', 'default');
});
