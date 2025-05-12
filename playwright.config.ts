import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true, // Omogućava da se testovi unutar istog fajla izvršavaju paralelno
  workers: 1, // Možeš podesiti broj paralelnih radnika (ili ostaviti Playwright da automatski odredi)
  use: {
    headless: true,
    baseURL: 'https://staging.superegoholding.app',
    browserName: 'chromium',
    trace: 'on-first-retry',
    storageState: 'auth.json',
  },
  globalSetup: require.resolve('./globalSetup'),
});
