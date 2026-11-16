import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '**/tests/**/*.browser.spec.ts',
  testIgnore: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/storybook-static/**'],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
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
  ],
});
