import { test, expect } from '../../../../tests/browser/ui-quality/storybook';

test('[TF-001] long resting label reserves trailing icon space in LTR and RTL', async ({ page, story }, testInfo) => {
  for (const direction of ['ltr', 'rtl']) {
    await story('qa-datepicker--localized', { qaDirection: direction, qaFontScale: 1.5 });

    const root = page.locator('[data-md3-text-field]');
    const geometry = await root.evaluate((node) => {
      const label = node.querySelector('label')!.getBoundingClientRect();
      const icon = node.querySelector('[data-md3-field-trailing]')!.getBoundingClientRect();

      return {
        overlap: Math.min(label.right, icon.right) - Math.max(label.left, icon.left),
        labelWidth: label.width,
        iconWidth: icon.width,
      };
    });

    expect(geometry.labelWidth).toBeGreaterThan(40);
    expect(geometry.iconWidth).toBeGreaterThan(20);
    expect(geometry.overlap, 'TF-001:label-must-not-overlap-trailing-adornment').toBeLessThanOrEqual(-11);
    await testInfo.attach(`localized-${direction}.png`, { body: await page.screenshot(), contentType: 'image/png' });
  }
});
