import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { injectKnownDefect } from './mutations';

export type StoryGlobals = Record<string, string | number>;
export type OpenStory = (id: string, globals?: StoryGlobals) => Promise<void>;

/** Uses built public exports, local fonts and a fixed wall clock. Native timers/rAF keep running. */
export async function openStory(page: Page, id: string, globals: StoryGlobals = {}) {
  await page.clock.setFixedTime(new Date('2024-02-29T12:00:00Z'));

  const scheme = await page.evaluate(() => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const settings = { colorScheme: scheme, brand: 'material', motionScheme: 'expressive', ...globals };
  const query = new URLSearchParams({
    id,
    viewMode: 'story',
    globals: `${Object.entries(settings)
      .map(([name, value]) => `${name}:${value}`)
      .join(';')};a11y.manual:!true`,
  });

  await page.goto(`/iframe.html?${query}`);
  await expect(page.locator('#storybook-root > *').first()).toBeVisible();
  await expect(page.locator('.sb-errordisplay')).toBeHidden();

  const fontsLoaded = await page.evaluate(async () => {
    const fonts = await Promise.all(
      [400, 500, 600, 700].map((weight) => document.fonts.load(`${weight} 16px Roboto`, 'AaБб')),
    );

    await document.fonts.ready;

    return fonts.every((faces) => faces.length > 0) && document.fonts.check('16px Roboto');
  });

  expect(fontsLoaded, 'All bundled Roboto weights must be loaded').toBe(true);
}

export const test = base.extend<{ story: OpenStory; browserDiagnostics: void }>({
  story: async ({ page }, provide) => {
    await provide(async (id, globals) => {
      await openStory(page, id, globals);

      if (process.env.UI_QA_MUTATION) {
        await injectKnownDefect(page, process.env.UI_QA_MUTATION);
      }
    });
  },
  browserDiagnostics: [
    async ({ page, browser, browserName }, provide, testInfo) => {
      const diagnostics: string[] = [];

      await testInfo.attach('browser-environment.json', {
        body: JSON.stringify(
          {
            browser: browserName,
            version: browser.version(),
            platform: process.platform,
            architecture: process.arch,
            node: process.version,
            playwright: testInfo.config.version,
            project: testInfo.project.name,
          },
          null,
          2,
        ),
        contentType: 'application/json',
      });

      page.on('console', (message) => {
        if (['error', 'warning'].includes(message.type())) {
          diagnostics.push(`${message.type()}: ${message.text()}`);
        }
      });
      page.on('pageerror', (error) => diagnostics.push(`pageerror: ${error.message}`));
      await page.route('**/*', async (route) => {
        const url = new URL(route.request().url());

        if (['http:', 'https:'].includes(url.protocol) && url.origin !== 'http://127.0.0.1:6106') {
          diagnostics.push(`Unexpected external request: ${url.origin}${url.pathname}`);
          await route.abort();
        } else {
          await route.continue();
        }
      });
      await provide();
      await testInfo.attach('browser-console.json', {
        body: JSON.stringify(diagnostics, null, 2),
        contentType: 'application/json',
      });
      expect(diagnostics, 'Browser errors, warnings and external dependencies').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
