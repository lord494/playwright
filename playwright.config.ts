import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  use: {
    headless: true,
    baseURL: 'https://staging.superegoholding.app',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    storageState: 'auth.json',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    timezoneId: 'Europe/Belgrade',
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  globalSetup: require.resolve('./globalSetup'),
});
