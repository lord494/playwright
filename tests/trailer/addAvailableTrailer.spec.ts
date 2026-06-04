import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

// Add Available Trailer flow (opened from /available-trailers via the + button).
// Selecting a trailer in the autocomplete auto-fills its read-only Type/Year/Availability/
// Status from that trailer's /trailers record. `trailerData` supplies a worker-specific
// known trailer (with an existing available-trailer record, so the modal offers it and Save
// dispatches a PUT). Verified against staging.vrlz.app DOM (2026-06-03).

// The add test below moves the trailer from /trailers into /available-trailers. Restore the
// baseline afterwards so the worker's candidate stays on /trailers for the next test.
test.afterEach(async ({ availableTrailerSetup, trailerData }) => {
    try {
        await availableTrailerSetup.searchTrailer(trailerData.number!);
        if (await availableTrailerSetup.getRowByTrailerNumber(trailerData.number!).count() > 0) {
            await availableTrailerSetup.deleteTrailerAccept(trailerData.number!).catch(() => { });
        }
    } catch { /* best-effort teardown */ }
});

test('Korisnik moze da izabere trailer u Add Available modalu i podaci se poklapaju sa fixture podacima', async ({ trailerData, availableTrailerSetup }) => {
    await availableTrailerSetup.openAddModalAndSelectTrailer(trailerData.number!);

    // The modal must mirror the selected trailer's /trailers record.
    await expect(availableTrailerSetup.addAvailableTrailerNumberField).toHaveValue(trailerData.number!);
    await expect(availableTrailerSetup.addAvailableTypeSelection).toHaveText(trailerData.type!);
    await expect(availableTrailerSetup.addAvailableYearInput).toHaveValue(trailerData.year!);
    await expect(availableTrailerSetup.addAvailableAvailabilitySelection).toHaveText(trailerData.available!);
    await expect(availableTrailerSetup.addAvailableStatusSelection).toHaveText(trailerData.status!);

    // Only after the data is verified do we close the modal (same as before — via Cancel).
    await availableTrailerSetup.cancelAddAvailable();
});

test('Korisnik moze da doda trailer u Available Trailers i red prikazuje tacne podatke', async ({ trailerData, availableTrailerSetup }) => {
    await availableTrailerSetup.openAddModalAndSelectTrailer(trailerData.number!);

    // Same verification as above — the modal mirrors the /trailers record.
    await expect(availableTrailerSetup.addAvailableTrailerNumberField).toHaveValue(trailerData.number!);
    await expect(availableTrailerSetup.addAvailableTypeSelection).toHaveText(trailerData.type!);
    await expect(availableTrailerSetup.addAvailableYearInput).toHaveValue(trailerData.year!);

    // This time actually add the trailer instead of cancelling.
    await availableTrailerSetup.confirmAddAvailable();

    // The added trailer must now be visible in the Available Trailers table...
    await availableTrailerSetup.searchTrailer(trailerData.number!);
    await expect(availableTrailerSetup.getRowByTrailerNumber(trailerData.number!).first()).toBeVisible({ timeout: 10000 });

    // ...and its table columns (1=Trailer, 2=Type, 3=Year) must match the fixture data.
    await expect(availableTrailerSetup.availableRowTrailerNumberCell(trailerData.number!)).toContainText(trailerData.number!);
    await expect(availableTrailerSetup.availableRowTypeCell(trailerData.number!)).toContainText(trailerData.type!);
    await expect(availableTrailerSetup.availableRowYearCell(trailerData.number!)).toContainText(trailerData.year!);
});
