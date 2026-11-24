import { expect, test } from '@playwright/test';

test('Storybook loads local Roboto files for regular, medium, semibold and bold text', async ({ page }) => {
  await page.goto(
    'http://127.0.0.1:6106/iframe.html?id=components-typography--type-scale&viewMode=story&globals=brand:material',
  );
  await expect(page.locator('.typography-example-row [data-md3-typography]')).toHaveCount(30);
  await page.evaluate(() => document.fonts.ready);

  const client = await page.context().newCDPSession(page);

  try {
    await client.send('DOM.enable');
    await client.send('CSS.enable');

    const tree = (await client.send('DOM.getDocument')) as { root: { nodeId: number } };
    const selector = '.typography-example-row [data-variant="bodyLarge"][data-emphasized="false"]';

    for (const weight of ['400', '500', '600', '700']) {
      await page.locator(selector).evaluate((node, value) => {
        node.style.setProperty('font-weight', value);
        node.replaceChildren(document.createTextNode('Roboto Подорожі'));
      }, weight);
      await page.evaluate((value) => document.fonts.load(`${value} 16px Roboto`, 'Roboto Подорожі'), weight);
      await expect(page.locator(selector)).toHaveCSS('font-weight', weight);

      const { nodeId } = await client.send('DOM.querySelector', { nodeId: tree.root.nodeId, selector });
      const { fonts } = (await client.send('CSS.getPlatformFontsForNode', { nodeId })) as {
        fonts: { familyName: string; isCustomFont: boolean; glyphCount: number }[];
      };

      expect(fonts.length).toBeGreaterThan(0);

      for (const font of fonts) {
        // Chromium may expose a static face's legacy family name, for example "Roboto Medium".
        expect(font).toMatchObject({ familyName: expect.stringMatching(/^Roboto(?:\s|$)/), isCustomFont: true });
        expect(font.glyphCount).toBeGreaterThan(0);
      }
    }
  } finally {
    await client.detach();
  }
});
