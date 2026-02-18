import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da edituje trailer - In company', async ({ editTrailerSetup, editTrailer, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.pencilIcon.first());
    await editTrailer.check(editTrailer.inCompanyCheckbox);
    await editTrailer.selectDriver(editTrailer.driverMenu, Constants.driverName, editTrailer.driverOption);
    await editTrailer.page.waitForLoadState('networkidle', { timeout: 10000 });
    await editTrailer.addTruckIfEmpty(editTrailer.truckField.first(), Constants.truckName, editTrailer.truckOption);
    await editTrailer.selectRentOrBuy(editTrailer.rentBuyMenu, editTrailer.rentOption);
    await editTrailer.selectCompany(editTrailer.companyMenu, editTrailer.companyOption);
    await editTrailer.fillPhoneNumber(editTrailer.driverPhoneField.first(), Constants.phoneNumberOfUserApp);
    await editTrailer.selectYard(editTrailer.yardField, editTrailer.yardOption);
    await editTrailer.plateField.clear();
    await editTrailer.fillPlate(editTrailer.plateField, Constants.plateNumber);
    await editTrailer.selectDriverState(editTrailer.driverStateMenu, editTrailer.driverStateOption);
    await editTrailer.selectOwner(editTrailer.ownerMenu, editTrailer.ownerOption);
    await editTrailer.selectStatus(editTrailer.statusMenu, editTrailer.statusOption);
    await editTrailer.selectAvailability(editTrailer.availabilityMenu, editTrailer.availabilityOption);
    await editTrailer.clickSaveButton();
    await editTrailer.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await expect(trailerOverview.driverNameColumn.first()).toContainText(Constants.driverName);
    await expect(trailerOverview.truckColumn.first()).toContainText(Constants.truckName);
    await expect(trailerOverview.rentOrBuyColumn.first()).toContainText(Constants.rent);
    await expect(trailerOverview.companyNameColumn.first()).toContainText(Constants.rocketCompany);
    await expect(trailerOverview.driverPhoneColumn.first()).toContainText(Constants.phoneNumberOfUserApp);
    await expect(trailerOverview.yardColumn.first()).toContainText(Constants.novaYarda);
    await expect(trailerOverview.plateColumn.first()).toContainText(Constants.plateNumber);
    await expect(trailerOverview.ownerNameColumn.first()).toContainText(Constants.ownerTrailer);
    await expect(trailerOverview.statusColumn.first()).toContainText(Constants.stolenStatus);
    await expect(trailerOverview.availabilityColumn.first()).toContainText(Constants.available);
    trailerOverview.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await editTrailer.clickElement(trailerOverview.deleteIcon.first());
    await trailerOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
});

test('Korisnik moze da edituje trailer - Out of company', async ({ editTrailerSetup, editTrailer, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.pencilIcon.first());
    await editTrailer.check(editTrailer.outOfCompanyCheckbox);
    await editTrailer.selectThirdParty(editTrailer.thirdPartyMenu, editTrailer.thirdPartyOption);
    await editTrailer.selectRentOrBuy(editTrailer.rentBuyMenu, editTrailer.rentOption);
    await editTrailer.fillPhoneNumber(editTrailer.driverPhoneField.first(), Constants.phoneNumberOfUserApp);
    await editTrailer.page.waitForLoadState('networkidle', { timeout: 10000 });
    await editTrailer.selectYard(editTrailer.yardField, editTrailer.yardOption);
    await editTrailer.plateField.clear();
    await editTrailer.fillPlate(editTrailer.plateField, Constants.plateNumber);
    await editTrailer.selectDriverState(editTrailer.driverStateMenu, editTrailer.driverStateOption);
    await editTrailer.selectOwner(editTrailer.ownerMenu, editTrailer.ownerOption);
    await editTrailer.selectStatus(editTrailer.statusMenu, editTrailer.statusOption);
    await editTrailer.selectAvailability(editTrailer.availabilityMenu, editTrailer.availabilityOption);
    await editTrailer.clickSaveButton();
    await editTrailer.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await expect(trailerOverview.thirdPartyColumn.first()).toContainText(Constants.owner);
    await expect(trailerOverview.rentOrBuyColumn.first()).toContainText(Constants.rent);
    await expect(trailerOverview.driverPhoneColumn.first()).toContainText(Constants.phoneNumberOfUserApp);
    await expect(trailerOverview.yardColumn.first()).toContainText(Constants.novaYarda);
    await expect(trailerOverview.plateColumn.first()).toContainText(Constants.plateNumber);
    await expect(trailerOverview.ownerNameColumn.first()).toContainText(Constants.ownerTrailer);
    await expect(trailerOverview.statusColumn.first()).toContainText(Constants.stolenStatus);
    await expect(trailerOverview.availabilityColumn.first()).toContainText(Constants.available);
    trailerOverview.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await editTrailer.clickElement(trailerOverview.deleteIcon.first());
    await editTrailer.page.waitForLoadState('networkidle', { timeout: 10000 });
});
