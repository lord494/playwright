import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';


test('Klik na minus ikonu prikazuje native confirm sa porukom o uklanjanju (test 7.1)', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);

    const { message } = await availableTrailerSetup.deleteTrailerDismissAndCapture(availableTrailerData.number);
    expect(message).toContain(availableTrailerData.number);
    expect(message.toLowerCase()).toContain('remove');
    await expect(availableTrailerSetup.getRowByTrailerNumber(availableTrailerData.number).first()).toBeVisible({ timeout: 5000 });
});

test('Confirm brise trailer sa Available Trailers i trailer se pojavljuje na /trailers (testovi 7.2 + 7.3)', async ({ availableTrailerSetup, availableTrailerData, loggedPage }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await availableTrailerSetup.deleteTrailerAccept(availableTrailerData.number);
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await expect(availableTrailerSetup.getRowByTrailerNumber(availableTrailerData.number)).toHaveCount(0, { timeout: 10000 });
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
