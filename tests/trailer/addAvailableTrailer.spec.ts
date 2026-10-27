import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

test.afterEach(async ({ availableTrailerSetup, trailerData }) => {
    try {
        await availableTrailerSetup.searchTrailer(trailerData.number!);
        if (await availableTrailerSetup.getRowByTrailerNumber(trailerData.number!).count() > 0) {
            await availableTrailerSetup.deleteTrailerAccept(trailerData.number!).catch(() => { });
        }
    } catch { }
});

test('Korisnik moze da izabere trailer u Add Available modalu i podaci se poklapaju sa fixture podacima', async ({ trailerData, availableTrailerSetup }) => {
    await availableTrailerSetup.openAddModalAndSelectTrailer(trailerData.number!);
    await expect(availableTrailerSetup.addAvailableTrailerNumberField).toHaveValue(trailerData.number!);
    await expect(availableTrailerSetup.addAvailableTypeSelection).toHaveText(trailerData.type!);
    await expect(availableTrailerSetup.addAvailableYearInput).toHaveValue(trailerData.year!);
    await expect(availableTrailerSetup.addAvailableAvailabilitySelection).toHaveText(trailerData.available!);
    await expect(availableTrailerSetup.addAvailableStatusSelection).toHaveText(trailerData.status!);
    await availableTrailerSetup.cancelAddAvailable();
});

test('Korisnik moze da doda trailer u Available Trailers i red prikazuje tacne podatke', async ({ trailerData, availableTrailerSetup }) => {
    await availableTrailerSetup.openAddModalAndSelectTrailer(trailerData.number!);
    await expect(availableTrailerSetup.addAvailableTrailerNumberField).toHaveValue(trailerData.number!);
    await expect(availableTrailerSetup.addAvailableTypeSelection).toHaveText(trailerData.type!);
    await expect(availableTrailerSetup.addAvailableYearInput).toHaveValue(trailerData.year!);
    await availableTrailerSetup.confirmAddAvailable();
    await availableTrailerSetup.searchTrailer(trailerData.number!);
    await expect(availableTrailerSetup.getRowByTrailerNumber(trailerData.number!).first()).toBeVisible({ timeout: 10000 });
    await expect(availableTrailerSetup.availableRowTrailerNumberCell(trailerData.number!)).toContainText(trailerData.number!);
    await expect(availableTrailerSetup.availableRowTypeCell(trailerData.number!)).toContainText(trailerData.type!);
    await expect(availableTrailerSetup.availableRowYearCell(trailerData.number!)).toContainText(trailerData.year!);
});
