import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

// `createdTrailer` creates a worker-unique trailer and filters the /trailers table down to
// it, so every test here edits/asserts/deletes its OWN row. This removes the cross-worker
// contention that existed when the tests edited and deleted the shared first() trailer.

test('Korisnik moze da edituje trailer - In company', async ({ createdTrailer, editTrailer, trailerOverview }) => {
    await trailerOverview.openEditModalForRow(createdTrailer.number);
    await editTrailer.check(editTrailer.inCompanyCheckbox);
    await editTrailer.selectDriver(editTrailer.driverMenu, Constants.driverName, editTrailer.driverOption);
    await editTrailer.page.waitForLoadState('networkidle', { timeout: 10000 });
    await editTrailer.addTruckIfEmpty(editTrailer.truckField.first(), Constants.truckName, editTrailer.truckOption);
    await editTrailer.selectRentOrBuy(editTrailer.rentBuyMenu, editTrailer.rentOption);
    await editTrailer.selectCompany(editTrailer.companyMenu, editTrailer.companyOption);
    await editTrailer.fillPhoneNumber(editTrailer.driverPhoneField.first(), Constants.phoneNumberOfUserApp);
    await editTrailer.plateField.clear();
    await editTrailer.fillPlate(editTrailer.plateField, Constants.plateNumber);
    await editTrailer.selectDriverState(editTrailer.driverStateMenu, editTrailer.driverStateOption);
    await editTrailer.selectOwner(editTrailer.ownerMenu, editTrailer.ownerOption);
    await editTrailer.selectStatus(editTrailer.statusMenu, editTrailer.statusOption);
    await editTrailer.selectAvailability(editTrailer.availabilityMenu, editTrailer.availabilityOption);
    await editTrailer.clickSaveButton();
    await editTrailer.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    // Reload /trailers and re-filter to this trailer: the edit save can drop the column filter,
    // and the trailer sorts off the first page, so assert on the row located by NUMBER (not the
    // global .first(), which would read whatever row happens to be first).
    await trailerOverview.page.goto(Constants.trailerUrl, { waitUntil: 'networkidle', timeout: 20000 });
    await trailerOverview.searchByTrailerNumber(createdTrailer.number);
    const num = createdTrailer.number;
    await expect(trailerOverview.cellInRow(num, 5)).toContainText(Constants.driverName);
    await expect(trailerOverview.cellInRow(num, 4)).toContainText(Constants.truckName);
    await expect(trailerOverview.cellInRow(num, 26)).toContainText(Constants.rent);
    await expect(trailerOverview.cellInRow(num, 7)).toContainText(Constants.rocketCompany);
    await expect(trailerOverview.cellInRow(num, 11)).toContainText(Constants.phoneNumberOfUserApp);
    await expect(trailerOverview.cellInRow(num, 17)).toContainText(Constants.plateNumber);
    await expect(trailerOverview.cellInRow(num, 8)).toContainText(Constants.ownerTrailer);
    await expect(trailerOverview.cellInRow(num, 29)).toContainText(Constants.stolenStatus);
    await expect(trailerOverview.cellInRow(num, 28)).toContainText(Constants.available);
    await trailerOverview.deleteRowByTrailerNumber(num);
});

test('Korisnik moze da edituje trailer - Out of company', async ({ createdTrailer, editTrailer, trailerOverview }) => {
    await trailerOverview.openEditModalForRow(createdTrailer.number);
    await editTrailer.check(editTrailer.outOfCompanyCheckbox);
    await editTrailer.selectThirdParty(editTrailer.thirdPartyMenu, editTrailer.thirdPartyOption);
    await editTrailer.selectRentOrBuy(editTrailer.rentBuyMenu, editTrailer.rentOption);
    await editTrailer.page.waitForLoadState('networkidle', { timeout: 10000 });
    await editTrailer.plateField.clear();
    await editTrailer.fillPlate(editTrailer.plateField, Constants.plateNumber);
    await editTrailer.selectDriverState(editTrailer.driverStateMenu, editTrailer.driverStateOption);
    await editTrailer.selectOwner(editTrailer.ownerMenu, editTrailer.ownerOption);
    await editTrailer.selectStatus(editTrailer.statusMenu, editTrailer.statusOption);
    await editTrailer.selectAvailability(editTrailer.availabilityMenu, editTrailer.availabilityOption);
    await editTrailer.clickSaveButton();
    await editTrailer.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    // Reload + re-filter, then assert on the row located by NUMBER (see In-company test).
    await trailerOverview.page.goto(Constants.trailerUrl, { waitUntil: 'networkidle', timeout: 20000 });
    await trailerOverview.searchByTrailerNumber(createdTrailer.number);
    const num = createdTrailer.number;
    await expect(trailerOverview.cellInRow(num, 6)).toContainText(Constants.owner);
    await expect(trailerOverview.cellInRow(num, 26)).toContainText(Constants.rent);
    await expect(trailerOverview.cellInRow(num, 17)).toContainText(Constants.plateNumber);
    await expect(trailerOverview.cellInRow(num, 8)).toContainText(Constants.ownerTrailer);
    await expect(trailerOverview.cellInRow(num, 29)).toContainText(Constants.stolenStatus);
    await expect(trailerOverview.cellInRow(num, 28)).toContainText(Constants.available);
    await trailerOverview.deleteRowByTrailerNumber(num);
});
