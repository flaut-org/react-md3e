import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './packages/react-md3e',
  testMatch: '**/tests/*.{visual,quality}.spec.ts',
  testIgnore: '**/tests/*.touch.quality.spec.ts',
  globalSetup: './packages/react-md3e/tests/browser/ui-quality/global-setup.ts',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  timeout: 30000,
  updateSnapshots: 'none',
  snapshotPathTemplate: '{testDir}/{testFileDir}/baselines/{platform}/{projectName}/{arg}{ext}',
  outputDir: 'test-results/ui',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/ui', open: 'never' }],
    ['./packages/react-md3e/tests/browser/ui-quality/spec-reporter.ts', { outputDir: 'test-results/ui/coverage' }],
  ],
  expect: {
    toHaveScreenshot: { threshold: 0.1, maxDiffPixels: 0, animations: 'disabled', caret: 'hide', scale: 'css' },
  },
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:6106',
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    reducedMotion: 'no-preference',
    deviceScaleFactor: 1,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    video: process.env.UI_QA_REVIEW ? 'on' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium-light', use: { viewport: { width: 1000, height: 720 } } },
    {
      name: 'chromium-dark-compact',
      testMatch: '**/tests/*.visual.spec.ts',
      use: { viewport: { width: 390, height: 700 }, colorScheme: 'dark' },
    },
  ],
  webServer: {
    command: 'npm run serve:storybook -- --port 6106',
    url: 'http://127.0.0.1:6106/iframe.html',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
