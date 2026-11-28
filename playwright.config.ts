import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '**/tests/**/*.browser.spec.ts',
  testIgnore: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/storybook-static/**'],
  fullyParallel: true,
  outputDir: 'test-results/browser',
  forbidOnly: true,
  retries: 0,
  workers: 2,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/browser', open: 'never' }],
    ['./packages/react-md3e/tests/browser/ui-quality/spec-reporter.ts'],
  ],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run start --workspace=@react-md3e/next-fixture -- --port 3100',
      url: 'http://127.0.0.1:3100',
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: 'npm run serve:storybook -- --port 6106',
      url: 'http://127.0.0.1:6106',
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: 'npm run serve:vite-fixture',
      url: 'http://127.0.0.1:3200/root/',
      reuseExistingServer: false,
      timeout: 30000,
    },
  ],
});
