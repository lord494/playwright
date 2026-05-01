# CLAUDE.md

## Project
Playwright e2e + API test suite for a web application (Vue.js + Vuetify UI). Tests run with 4 workers in CI — they **MUST be fully independent**.

## Stack
- Playwright 1.50
- TypeScript 5.7
- Node 22
- mailparser + node-imap (for OTP login flow)

## Structure
```
page/         # Page object classes, one folder per feature (recruitment, shop, drivers, ...)
tests/        # Test spec files, structure mirrors page/ folder
  api/        # API tests
  fixtures/   # Playwright test.extend() fixtures (NOT test data!)
helpers/      # BasePage, Constants, dateUtilis, login, runOtp
services/     # API service classes (TrailerService, TruckService)
auth/         # storageState (auth.json) from global setup
.github/workflows/  # CI: runs only tests from changed feature folders
```

**Mapping:** for feature `xyz`, page objects go in `page/xyz/`, tests in `tests/xyz/`. CI uses this for change detection.

## Commands
```bash
npx playwright test                          # all tests
npx playwright test tests/recruitment        # single feature
npx playwright test --headed                 # with browser UI
npx playwright test --debug                  # pause at every step
npx playwright test --workers=1              # serial (for flakiness diagnosis)
npx playwright codegen <url>                 # generate selectors
npx playwright show-report                   # open HTML report
```

## Page Object conventions
- Every class **extends `BasePage`** from `helpers/base.ts`
- Constructor: `super(page); this.page = page;` followed by locator declarations
- Locators are `readonly` fields declared in the class (NOT inline inside methods)
- PascalCase for class (`RecruitmentPage`), camelCase for fields (`addNewEmployeeButton`)
- File: `page/<feature>/<FeatureName>Page.ts`
- Actions are `async` methods (`selectRecruiter()`, `searchPhoneNumber()`)
- Use BasePage helper methods (`fillInputField`, `selectRecruiterFromMenu`) instead of direct `.fill()` / `.click()` where they exist

## Selector strategy (Vuetify UI)
Priority from best to worst:
1. `page.getByRole('button', { name: 'X' })` — primary for interactive elements
2. `getByRole('tab' | 'textbox' | 'table', { name: 'X' })`
3. Vuetify CSS classes when no role exists: `.mdi-pencil`, `.v-dialog--active`, `.v-list-item__title`
4. Filter pattern for list items: `.locator('.v-list-item__title').filter({ hasText: 'X' })`
5. Positional for tables: `tr td:nth-child(N)`

DO NOT use: XPath, theme classes (`.theme--light`), generic utility classes that frontend may change.

## Test conventions
- Test names are **in Serbian**, format: `'Korisnik moze da [action]'` or `'Korisnik ne moze da [action]'`
  - Example: `test('Korisnik moze da izabere Truck opciju iz Franchise iz menija', ...)`
  - This is a project convention — do not translate to English
- `import { test } from '../fixtures/fixtures'` (NOT directly from `@playwright/test` for the test runner)
- `import { expect } from '@playwright/test'` (expect comes from there)
- `import { Constants } from '../../helpers/constants'`
- Spec file: `tests/<feature>/<name>.spec.ts`

## Fixtures pattern
Page object fixtures live in `tests/fixtures/fixtures.ts`. Pattern:
```ts
shopPage: async ({ loggedPage }, use) => {
    const shop = new ShopPage(loggedPage);
    await loggedPage.goto(Constants.shopUrl, { waitUntil: 'networkidle' });
    await use(shop);
}
```
- Fixture handles **page navigation** — test receives an already-loaded page
- `loggedPage` uses `storageState: 'auth.json'` — DO NOT re-login per test
- New page object → add fixture in `fixtures.ts`, DO NOT instantiate in test

## Test data
- **Constants** (`helpers/constants.ts`): static values — URLs, names, postal codes, franchise names, all hardcoded strings
- **dateUtilis** (`helpers/dateUtilis.ts`): helper functions for dynamic generation (random numbers, dates, SSNs)
- DO NOT hardcode strings in spec files — always go through Constants

## Independence rules — CRITICAL (4 workers)
- Every test must pass when run alone: `npx playwright test --workers=1 -g "test name"`
- DO NOT share state between tests (no global variables, no implicit ordering)
- Cleanup in `afterEach`, NEVER in `afterAll`
- A test that creates data must use a unique identifier (timestamp, random) OR clean up after itself
- `deleteLastIf20OrMore()` pattern for controlled test entity collections

## Async rules
- NEVER use `page.waitForTimeout(N)` — use `waitForResponse`, `waitFor({ state })`, or page-specific wrappers (`waitForShopLoads`)
- For API responses:
  ```ts
  await page.waitForResponse(res =>
      res.url().includes('/api/employees') &&
      (res.status() === 200 || res.status() === 304)
  );
  ```
- Page object actions return `Promise<void>` (or a concrete type) and `await` everything internally

## API testing
- API tests in `tests/api/`
- Service classes in `services/` (`TrailerService.ts`, `truckService.ts`) hold API calls
- Use Playwright `request` fixture, NOT fetch or axios

## OTP / Auth flow
- `helpers/login.ts` + `helpers/runOtp.page.ts` — OTP is read from mailbox (mailparser + node-imap)
- Global setup populates `auth.json`, fixtures consume it as `storageState`
- DO NOT touch the OTP flow in regular tests — use the `loggedPage` fixture

## Gotchas
- `.v-dialog--active` matches **only the active** Vuetify dialog — when looking for a button inside a dialog, scope through `dialogBox.locator(...)` to avoid catching closed ones
- Tables have a `progressbar` that blocks interaction during loading — wait for it to disappear before clicking
- Vuetify snack message (`.v-snack__content`) disappears after 3-5s — assert immediately after the action
- If `auth.json` expires, all tests fail — regenerate via global setup, not manually
- Constants contains some Serbian-language values for certain entries — check before adding duplicates
- CI only runs tests from `tests/<feature>/` folders matching changed `page/<feature>/` or `tests/<feature>/` paths — if you create a page without a matching test folder, it will not run in CI
