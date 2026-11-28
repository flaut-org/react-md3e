import { defineConfig } from '@playwright/test';
import quick from './playwright.ui.config';

export default defineConfig({
  ...quick,
  testMatch: '**/tests/*.quality.spec.ts',
  outputDir: 'test-results/ui-extended',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/ui-extended', open: 'never' }],
    [
      './packages/react-md3e/tests/browser/ui-quality/spec-reporter.ts',
      { outputDir: 'test-results/ui-extended/coverage' },
    ],
  ],
  projects: [
    ...(['chromium', 'firefox', 'webkit'] as const).flatMap((browserName) =>
      (['no-preference', 'reduce'] as const).map((reducedMotion) => ({
        name: `${browserName}-${reducedMotion}`,
        testIgnore: '**/tests/*.touch.quality.spec.ts',
        use: { browserName, reducedMotion, viewport: { width: 1000, height: 720 } },
      })),
    ),
    {
      name: 'chromium-touch',
      testMatch: '**/tests/*.touch.quality.spec.ts',
      testIgnore: [],
      use: { browserName: 'chromium', hasTouch: true, isMobile: true, viewport: { width: 390, height: 700 } },
    },
  ],
});
