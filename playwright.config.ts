import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  workers: 1,
  use: {
    headless: true,
    baseURL: 'https://staging.superegoholding.app',
    browserName: 'chromium',
    trace: 'on-first-retry',
    storageState: 'auth.json',
  },
  globalSetup: require.resolve('./globalSetup'),
});
