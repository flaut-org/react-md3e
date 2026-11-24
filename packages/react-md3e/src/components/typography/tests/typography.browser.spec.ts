import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createTheme } from '@flaut-travel/react-md3e/theme';

const theme = createTheme({
  typography: {
    brandFontFamily: 'Georgia, serif',
    plainFontFamily: 'Arial, sans-serif',
    bodyLarge: { fontSize: 18, lineHeight: 28 },
    bodyLargeEmphasized: { fontSize: 18, lineHeight: 28, fontWeight: 600 },
  },
});

test('all baseline/emphasized variants use the matching theme metrics and font families', async ({ page }) => {
  await page.goto('/typography');

  for (const [role, style] of Object.entries(theme.typography)) {
    const id = role.endsWith('Emphasized') ? `${role.replace(/Emphasized$/, '')}-emphasized` : role;
    const text = page.getByTestId(`type-${id}`);

    await expect(text).toHaveCSS('font-family', style.fontFamily);
    await expect(text).toHaveCSS('font-size', `${style.fontSize}px`);
    await expect(text).toHaveCSS('line-height', `${style.lineHeight}px`);
    await expect(text).toHaveCSS('font-weight', String(style.fontWeight));
    expect(
      await text.evaluate((node) => {
        const spacing = getComputedStyle(node).letterSpacing;

        return spacing === 'normal' ? 0 : parseFloat(spacing);
      }),
    ).toBeCloseTo(style.letterSpacing, 3);
  }

  await expect(page.getByRole('heading', { name: 'Material 3 typography', level: 1 })).toHaveCSS('font-size', '36px');
});

test('semantic elements, inline emphasis, inherited metrics and custom components remain independent', async ({
  page,
}) => {
  await page.goto('/typography');
  await expect(page.getByRole('heading', { name: 'A second-level section', level: 2 })).toHaveCSS('font-size', '22px');
  await expect(page.getByTestId('rich-text').locator('strong')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('rich-text').locator('b')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('rich-text').locator('em')).toHaveCSS('font-style', 'italic');
  await expect(page.getByTestId('rich-text').locator('i')).toHaveCSS('font-style', 'italic');
  await expect(page.getByTestId('inherited-text')).toHaveCSS('font-size', '18px');
  await expect(page.getByTestId('inherited-text')).toHaveCSS('line-height', '28px');
  await expect(page.getByTestId('semantic-strong')).toHaveJSProperty('tagName', 'STRONG');
  await expect(page.getByTestId('semantic-strong')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('semantic-em')).toHaveCSS('font-style', 'italic');
  await expect(page.getByTestId('custom-link')).toHaveAttribute('href', '/');
  await expect(page.getByTestId('custom-link')).toHaveJSProperty('tagName', 'A');
  await expect(page.getByTestId('toggled-type')).toHaveJSProperty('tagName', 'SPAN');
});

test('theme colors inherit from surfaces, select dark values and work with static CSS exports', async ({ page }) => {
  await page.goto('/typography');

  const colors = createTheme({ sourceColor: '#386a20' });
  const rgb = (hex: string) =>
    `rgb(${hex
      .slice(1)
      .match(/../g)!
      .map((part) => parseInt(part, 16))
      .join(', ')})`;

  await expect(page.getByTestId('inherited-color')).toHaveCSS('color', rgb(colors.schemes.light.onPrimaryContainer));
  await expect(page.getByTestId('explicit-color')).toHaveCSS('color', rgb(colors.schemes.light.onPrimaryContainer));
  await expect(page.getByTestId('dark-text')).toHaveCSS('color', rgb(colors.schemes.dark.primary));
  await expect(page.getByTestId('dark-text')).toHaveCSS('font-weight', '600');
  await expect(page.getByTestId('static-type')).toHaveCSS('font-family', 'Arial, sans-serif');
  await expect(page.getByTestId('static-type')).toHaveCSS('font-weight', '500');
});

test('truncation keeps content, logical alignment respects RTL and rem metrics respect root sizing', async ({
  page,
}) => {
  await page.goto('/typography');

  const truncated = page.getByTestId('truncated-text');

  await expect(truncated).toHaveCSS('white-space', 'nowrap');
  await expect(truncated).toHaveCSS('text-overflow', 'ellipsis');
  expect(await truncated.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
  await expect(truncated).toContainText('remaining available in the DOM');
  await expect(page.getByTestId('logical-alignment')).toHaveCSS('direction', 'rtl');
  await expect(page.getByTestId('logical-alignment')).toHaveCSS('text-align', 'end');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '20px';
  });
  await expect(page.getByTestId('type-bodyLarge')).toHaveCSS('font-size', '22.5px');
  await expect(page.getByTestId('type-bodyLarge')).toHaveCSS('line-height', '35px');
});

test('client consumers can forward refs, events and attribute changes without inserting styles', async ({ page }) => {
  await page.goto('/typography');

  const styles = await page.locator('style').count();

  await expect(page.getByTestId('toggled-type')).toHaveCSS('font-weight', '500');
  await page.getByRole('button', { name: 'Toggle emphasis' }).click();
  await expect(page.getByTestId('toggled-type')).toHaveCSS('font-weight', '700');
  await expect(page.getByTestId('toggled-type')).toHaveAttribute('data-ref-checked', 'true');
  await expect(page.getByTestId('typed-link')).toHaveAttribute('data-ref-checked', 'true');
  await page.getByTestId('typed-link').click();
  await expect(page.getByTestId('typography-followed')).toHaveText('true');
  expect(await page.locator('style').count()).toBe(styles);
});

test('Typography arrives styled without JavaScript and in streamed RSC content', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });

  try {
    const server = await context.newPage();

    await server.goto('http://127.0.0.1:3100/typography');
    await expect(server.getByTestId('type-bodyLarge-emphasized')).toHaveCSS('font-weight', '600');
    await expect(server.getByRole('heading', { name: 'Material 3 typography', level: 1 })).toHaveCSS(
      'font-size',
      '36px',
    );
    await expect(server.locator('.typography-gallery [data-md3-typography]')).toHaveCount(30);
  } finally {
    await context.close();
  }

  await page.goto('/streaming');
  await expect(page.getByRole('heading', { name: 'Streamed typography', level: 2 })).toHaveCSS('font-weight', '500');
  await expect(page.getByTestId('streamed-typography')).toHaveCSS('font-size', '24px');
});

test('Storybook renders all 30 styles, narrow layouts remain usable, and accessibility checks pass', async ({
  page,
}) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-typography--type-scale&viewMode=story&globals=brand:forest;colorScheme:dark;a11y.manual:!true',
  );
  await expect(page.locator('.typography-example-row [data-md3-typography]')).toHaveCount(30);
  await expect(page.locator('[data-variant="displayLarge"][data-emphasized="true"]')).toHaveCSS(
    'font-family',
    'Georgia, serif',
  );
  await expect(page.locator('[data-variant="labelSmall"][data-emphasized="true"]')).toHaveCSS('font-weight', '700');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/typography');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
