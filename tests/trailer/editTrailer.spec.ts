import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailersPage } from '../../page/trailer/trailer.page';
import { AddTrailersPage } from '../../page/trailer/addTrailer.page';
import { get17RandomNumbers, get6RandomNumber } from '../../helpers/dateUtilis';
import { EditTrailersPage } from '../../page/trailer/editTrailer.page';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeEach(async ({ page }) => {
    const trailer = new TrailersPage(page);
    const add = new AddTrailersPage(page);
    await page.goto(Constants.trailerUrl);
    await trailer.truckColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await trailer.clickElement(trailer.addButton);
    await page.waitForLoadState('networkidle');
    const trailerNumber = get6RandomNumber().join('');
    await add.fillTrailerNumber(add.trailerNumber, trailerNumber);
    await add.selectTrailerType(add.trailertype, add.dryVanType);
    await add.selectTrailerYear(add.trailerYear, add.year2002);
    await add.selectPickUpDate(add.pickUpDate, add.currentDate);
    await add.selectDealerhip(add.dealership, add.kemonipexDealreship);
    await add.selectTrailerMake(add.trailerMake, add.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await add.fillVinNumber(add.vinNumber, randomNumberString);
    await add.clickSaveButton();
    await add.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da edituje trailer - In company', async ({ page }) => {
    const edit = new EditTrailersPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.pencilIcon.first());
    await edit.check(edit.inCompanyCheckbox);
    await edit.selectDriver(edit.driverMenu, Constants.driverName, edit.driverOption);
    await page.waitForLoadState('networkidle');
    await edit.addTruckIfEmpty(edit.truckField.first(), Constants.truckName, edit.truckOption);
    await edit.selectRentOrBuy(edit.rentBuyMenu, edit.rentOption);
    await edit.selectCompany(edit.companyMenu, edit.companyOption);
    await edit.fillPhoneNumber(edit.driverPhoneField.first(), Constants.phoneNumberOfUserApp);
    await edit.selectYard(edit.yardField, edit.yardOption);
    await edit.plateField.clear();
    await edit.fillPlate(edit.plateField, Constants.plateNumber);
    await edit.selectDriverState(edit.driverStateMenu, edit.driverStateOption);
    await edit.selectOwner(edit.ownerMenu, edit.ownerOption);
    await edit.selectStatus(edit.statusMenu, edit.statusOption);
    await edit.selectAvailability(edit.availabilityMenu, edit.availabilityOption);
    await edit.clickSaveButton();
    await edit.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await expect(trailer.driverNameColumn.first()).toContainText(Constants.driverName);
    await expect(trailer.truckColumn.first()).toContainText(Constants.truckName);
    await expect(trailer.rentOrBuyColumn.first()).toContainText(Constants.rent);
    await expect(trailer.companyNameColumn.first()).toContainText(Constants.rocketCompany);
    await expect(trailer.driverPhoneColumn.first()).toContainText(Constants.phoneNumberOfUserApp);
    await expect(trailer.yardColumn.first()).toContainText(Constants.novaYarda);
    await expect(trailer.plateColumn.first()).toContainText(Constants.plateNumber);
    await expect(trailer.ownerNameColumn.first()).toContainText(Constants.ownerTrailer);
    await expect(trailer.statusColumn.first()).toContainText(Constants.stolenStatus);
    await expect(trailer.availabilityColumn.first()).toContainText(Constants.available);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await edit.clickElement(trailer.deleteIcon.first());
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da edituje trailer - Out of company', async ({ page }) => {
    const edit = new EditTrailersPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.pencilIcon.first());
    await edit.check(edit.outOfCompanyCheckbox);
    await edit.selectThirdParty(edit.thirdPartyMenu, edit.thirdPartyOption);
    await edit.selectRentOrBuy(edit.rentBuyMenu, edit.rentOption);
    await edit.fillPhoneNumber(edit.driverPhoneField.first(), Constants.phoneNumberOfUserApp);
    await page.waitForLoadState('networkidle');
    await edit.selectYard(edit.yardField, edit.yardOption);
    await edit.plateField.clear();
    await edit.fillPlate(edit.plateField, Constants.plateNumber);
    await edit.selectDriverState(edit.driverStateMenu, edit.driverStateOption);
    await edit.selectOwner(edit.ownerMenu, edit.ownerOption);
    await edit.selectStatus(edit.statusMenu, edit.statusOption);
    await edit.selectAvailability(edit.availabilityMenu, edit.availabilityOption);
    await edit.clickSaveButton();
    await edit.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await expect(trailer.thirdPartyColumn.first()).toContainText(Constants.owner);
    await expect(trailer.rentOrBuyColumn.first()).toContainText(Constants.rent);
    await expect(trailer.driverPhoneColumn.first()).toContainText(Constants.phoneNumberOfUserApp);
    await expect(trailer.yardColumn.first()).toContainText(Constants.novaYarda);
    await expect(trailer.plateColumn.first()).toContainText(Constants.plateNumber);
    await expect(trailer.ownerNameColumn.first()).toContainText(Constants.ownerTrailer);
    await expect(trailer.statusColumn.first()).toContainText(Constants.stolenStatus);
    await expect(trailer.availabilityColumn.first()).toContainText(Constants.available);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await edit.clickElement(trailer.deleteIcon.first());
    await page.waitForLoadState('networkidle');
});
