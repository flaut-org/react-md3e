import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

test('avatar sizes, shapes, accessible initials and real img markup render before JavaScript and in streams', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/selection-controls');
    await expect(server.getByRole('img', { name: 'Alex Morgan' })).toHaveText('AM');
    await expect(server.getByTestId('initial-avatar')).toHaveCSS('width', '40px');
    await expect(server.getByTestId('small-avatar')).toHaveCSS('width', '32px');
    await expect(server.getByTestId('small-avatar')).toHaveCSS('border-radius', '12px');
    await expect(server.getByTestId('large-avatar')).toHaveCSS('width', '56px');
    await expect(server.getByTestId('large-avatar')).toHaveCSS('border-radius', '0px');
    await expect(server.getByTestId('server-image-avatar').locator('img')).toHaveAttribute('src', '/avatar.svg');
    await expect(server.getByTestId('server-image-avatar')).toContainText('TR');
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('img', { name: 'Streamed avatar' })).toHaveCSS('width', '40px');
});
test('image failure shows fallback; source changes recover and fail again with native callbacks and lazy loading', async ({
  page,
}) => {
  await page.goto('/selection-controls');

  const avatar = page.getByTestId('changing-avatar');

  await avatar.scrollIntoViewIfNeeded();
  await expect(avatar).toHaveAccessibleName('Sam Rivers');
  await expect(avatar.locator('img')).toHaveAttribute('loading', 'lazy');
  await expect(avatar.locator('img')).toHaveAttribute('data-error', '');
  await expect(avatar).toContainText('SR');
  await expect(avatar.locator('img')).toHaveCSS('visibility', 'hidden');
  await page.getByRole('button', { name: 'Load avatar image' }).click();
  await expect(page.getByTestId('avatar-event')).toHaveText('loaded');
  await expect(avatar.locator('img')).toHaveCSS('visibility', 'visible');
  await expect(avatar).toHaveText('');
  await page.getByRole('button', { name: 'Break avatar image' }).click();
  await expect(page.getByTestId('avatar-event')).toHaveText('error');
  await expect(avatar).toHaveText('SR');
  await expect(avatar.locator('img')).toHaveCSS('visibility', 'hidden');
  await expect(page.getByTestId('automatic-initial-avatar')).toHaveText('Z');
  await expect(page.getByTestId('decorative-avatar')).toHaveAttribute('aria-hidden', 'true');
});
test('image loading keeps a stable box and fallback without style insertion', async ({ page }) => {
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });

  await page.route('**/avatar.svg', async (route) => {
    await pending;
    await route.continue();
  });
  await page.goto('/selection-controls', { waitUntil: 'domcontentloaded' });

  const avatar = page.getByTestId('server-image-avatar');
  const styles = await page.locator('style').count();

  try {
    await expect(avatar).toHaveText('TR');
    await expect(avatar).toHaveCSS('height', '40px');
    release();
    await expect(avatar.locator('img')).toHaveCSS('visibility', 'visible');
    await expect(avatar).toHaveText('');
    await expect(avatar).toHaveCSS('height', '40px');
    expect(await page.locator('style').count()).toBe(styles);
  } finally {
    release();
  }
});
test('avatar themes, Storybook image/list composition and forced colors retain accessible output', async ({ page }) => {
  // Playwright owns this axe scan; keep Storybook's automatic scan from using the same axe instance.
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-avatar--playground&viewMode=story&globals=brand:forest;colorScheme:dark;a11y.manual:!true',
  );

  const avatar = page.getByRole('img', { name: 'Alex Morgan' });
  const color = createTheme({ sourceColor: '#386a20', keyColors: { secondary: '#5d6355', tertiary: '#386568' } })
    .schemes.dark.primaryContainer;

  await expect(avatar).toHaveCSS(
    'background-color',
    `rgb(${color
      .slice(1)
      .match(/../g)!
      .map((part) => parseInt(part, 16))
      .join(', ')})`,
  );
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(avatar).toHaveCSS('border-top-width', '1px');

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(result.violations).toEqual([]);
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-avatar--image&viewMode=story');
  await expect(page.getByRole('img', { name: 'Alex Morgan' }).locator('img')).toHaveCSS('visibility', 'visible');
  await page.goto('http://127.0.0.1:6106/iframe.html?id=components-avatar--in-list&viewMode=story');
  await expect(page.getByRole('listitem').locator('[data-md3-avatar]')).toHaveCSS('width', '40px');
});
