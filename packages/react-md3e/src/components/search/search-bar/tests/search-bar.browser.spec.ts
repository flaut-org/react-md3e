import { expect, test } from '@playwright/test';

test('standalone search renders themed 56px input and participates in native forms/reset', async ({ page }) => {
  await page.goto('/search');

  const field = page.getByRole('searchbox', { name: 'Standalone search', exact: true });
  const bar = field.locator('..');

  await expect(field).toHaveValue('Initial query');
  expect(await bar.evaluate((node) => node.getBoundingClientRect().height)).toBe(56);
  expect(await field.evaluate((node) => getComputedStyle(node).fontSize)).toBe('16px');
  await field.fill('Porto');
  await field.press('Enter');
  await expect(page.getByTestId('search-form-value')).toHaveText('Porto');
  await page.getByRole('button', { name: 'Reset standalone' }).click();
  await expect(field).toHaveValue('Initial query');
  await bar.getByRole('button', { name: 'Clear search' }).click();
  await expect(field).toHaveValue('');
  await expect(field).toBeFocused();
  await expect(bar.getByRole('button', { name: 'Clear search' })).toHaveCount(0);
});

test('read-only, disabled and clear opt-out preserve search bar semantics', async ({ page }) => {
  await page.goto('/search');

  const readonly = page.getByRole('searchbox', { name: 'Read-only search', exact: true });

  await expect(readonly).toHaveAttribute('readonly', '');
  await expect(readonly.locator('..').getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('searchbox', { name: 'Disabled search', exact: true })).toBeDisabled();
  await expect(page.getByRole('searchbox', { name: 'No clear action' }).locator('..').getByRole('button')).toHaveCount(
    0,
  );
  await page.getByRole('searchbox', { name: 'Readonly view' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('SearchBar renders without JavaScript and has an isolated Storybook entry', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/search');

    const field = server.getByRole('searchbox', { name: 'Server search bar', exact: true });

    await expect(field).toHaveValue('Server-rendered query');
    expect(await field.locator('..').evaluate((node) => node.getBoundingClientRect().height)).toBe(56);
    await expect(server.getByRole('searchbox', { name: 'Server search', exact: true })).toBeVisible();
  } finally {
    await context.close();
  }

  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-searchbar--with-query&viewMode=story');
  await expect(page.getByRole('searchbox', { name: 'Search', exact: true })).toHaveValue('Paris');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('');
});
