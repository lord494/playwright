
// ovaj config radi ali sam ga zakomentarisao jer zelim da probam da napravim novi sa boljim reporterima za CI i lokalno, a da se ne gubi funkcionalnost prethodnog. Ako nesto ne radi, vracamo se na ovaj zakomentarisani config.

// import { defineConfig } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests',
//   timeout: 30000,
//   fullyParallel: false,
//   workers: 1,
//   use: {
//     headless: true,
//     baseURL: 'https://staging.vrlz.app',
//     browserName: 'chromium',
//     trace: 'retain-on-failure',
//     storageState: 'auth.json',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     timezoneId: 'Europe/Belgrade',
//   },
//   reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
//   globalSetup: require.resolve('./globalSetup'),
// });

import { defineConfig } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,

  /**
   * Lokalno ne ponavljamo pale testove.
   * U CI-u svaki pali test dobija još jedan pokušaj.
   *
   * Ovo nam omogućava da razlikujemo:
   * - stvarno pale testove
   * - flaky testove koji prođu iz drugog pokušaja
   */
  retries: isCI ? 1 : 0,
  outputDir: 'test-results',

  use: {
    headless: true,
    baseURL: 'https://staging.vrlz.app',
    browserName: 'chromium',

    storageState: 'auth.json',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    timezoneId: 'Europe/Belgrade',
  },

  /**
   * U CI-u generišemo:
   *
   * 1. line reporter:
   *    čitljiv terminal output
   *
   * 2. github reporter:
   *    annotations na odgovarajućim linijama koda u GitHub Actions
   *
   * 3. JSON reporter:
   *    strukturisane rezultate koje će čitati naša skripta
   *
   * 4. HTML reporter:
   *    standardni Playwright report za ručnu analizu
   *
   * Lokalno zadržavamo line i HTML reporter.
   */
  reporter: isCI
    ? [
      ['line'],
      ['github'],
      [
        'json',
        {
          outputFile: 'test-results/results.json',
        },
      ],
      [
        'html',
        {
          outputFolder: 'playwright-report',
          open: 'never',
        },
      ],
    ]
    : [
      ['line'],
      [
        'html',
        {
          outputFolder: 'playwright-report',
          open: 'never',
        },
      ],
    ],

  globalSetup: require.resolve('./globalSetup'),
});