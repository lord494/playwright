import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

// Wave A1 — Delete confirms via NATIVE BROWSER CONFIRM (not a Vuetify dialog).
//   7.1 — Dismiss path: confirm message is shown and the row stays
//   7.2 — Accept path: row is removed from /available-trailers
//   7.3 — After accept, the trailer reappears on the /trailers table
//
// Side effect: 7.2/7.3 permanently move the picked trailer back to /trailers.
// Each parallel worker targets a different row (via workerIndex in availableTrailerData),
// so workers do not collide within a single run.

test('Klik na minus ikonu prikazuje native confirm sa porukom o uklanjanju (test 7.1)', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);

    const { message } = await availableTrailerSetup.deleteTrailerDismissAndCapture(availableTrailerData.number);
    expect(message).toContain(availableTrailerData.number);
    expect(message.toLowerCase()).toContain('remove');

    // After dismiss, the row must still be present
    await expect(availableTrailerSetup.getRowByTrailerNumber(availableTrailerData.number).first()).toBeVisible({ timeout: 5000 });
});

test('Confirm brise trailer sa Available Trailers i trailer se pojavljuje na /trailers (testovi 7.2 + 7.3)', async ({ availableTrailerSetup, availableTrailerData, loggedPage }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);

    // 7.2 — Accept the native confirm; row disappears from /available-trailers
    await availableTrailerSetup.deleteTrailerAccept(availableTrailerData.number);
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await expect(availableTrailerSetup.getRowByTrailerNumber(availableTrailerData.number)).toHaveCount(0, { timeout: 10000 });

    // 7.3 — Trailer reappears on /trailers (column 2 = "Trl #")
    // /trailers has per-column filters; the trailer-number filter is labelled "Trailer/VIN #".
    // The input re-renders after focus, so we click via the locator and type via page.keyboard.
    await loggedPage.goto(Constants.trailerUrl, { waitUntil: 'networkidle', timeout: 20000 });
    const trailerVinFilter = loggedPage.getByLabel('Trailer/VIN #', { exact: true });
    await trailerVinFilter.waitFor({ state: 'visible', timeout: 10000 });
    await trailerVinFilter.click();
    await loggedPage.keyboard.type(availableTrailerData.number, { delay: 40 });
    await loggedPage.waitForResponse(
        r => r.url().includes('/api/trailers') && (r.status() === 200 || r.status() === 304),
        { timeout: 15000 }
    ).catch(() => { });

    const row = loggedPage.locator('tbody tr', {
        has: loggedPage.locator('td:nth-child(2)', { hasText: availableTrailerData.number })
    });
    await expect(row.first()).toBeVisible({ timeout: 10000 });
});
