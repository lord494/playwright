import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { AddTrailersPage } from '../../page/trailer/addTrailer.page';
import { get17RandomNumbers, get6RandomNumber } from '../../helpers/dateUtilis';
import { EditTrailersPage } from '../../page/trailer/editTrailer.page';
import { AvailableTrailersPage } from '../../page/trailer/availableTrailer.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const trailer = new AvailableTrailersPage(page);
    const add = new AddTrailersPage(page);
    await page.goto(Constants.availableTrailerUrl, { waitUntil: 'networkidle' });
    await trailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await trailer.clickElement(trailer.addButton);
    await page.waitForLoadState('networkidle');
    const trailerNumber = get6RandomNumber().join('');
    await add.fillTrailerNumber(add.trailerNumber, trailerNumber);
    await page.waitForLoadState('networkidle');
    await add.selectTrailerType(add.trailertype.last(), add.dryVanType);
    await page.waitForLoadState('networkidle');
    await add.selectTrailerYear(add.trailerYear, add.year2002);
    await page.waitForLoadState('networkidle');
    await add.selectPickUpDate(add.pickUpDate, add.currentDate);
    await page.waitForLoadState('networkidle');
    await add.selectDealerhip(add.dealership, add.kemonipexDealreship);
    await page.waitForLoadState('networkidle');
    await add.selectTrailerMake(add.trailerMake.last(), add.trailerMakeOption);
    await page.waitForLoadState('networkidle');
    const randomNumberString = get17RandomNumbers().join('');
    await add.fillVinNumber(add.vinNumber, randomNumberString);
    await page.waitForLoadState('networkidle');
    await add.clickSaveButton();
    await page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    await add.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await trailer.enterTrailerName(trailer.trailerNumberFilter, trailerNumber);
    await page.waitForLoadState('networkidle');
    const trailerCell = page.locator(`td:nth-child(1):has-text("${trailerNumber}")`);
    await expect(trailerCell).toBeVisible({ timeout: 10000 });
    const row = trailerCell.locator('xpath=ancestor::tr');
    const pencil = row.locator('.mdi.mdi-pencil');
    await expect(pencil).toBeVisible({ timeout: 10000 });
    await pencil.click();
});

test('Korisnik moze da edituje trailer - In company', async ({ page }) => {
    const edit = new EditTrailersPage(page);
    const trailer = new AvailableTrailersPage(page);
    await edit.check(edit.inCompanyCheckbox);
    await page.waitForLoadState('networkidle');
    await edit.selectDriver(edit.driverMenu, Constants.driverName, edit.driverOption);
    await page.waitForLoadState('networkidle');
    await edit.addTruckIfEmpty(edit.truckField.first(), Constants.truckName, edit.truckOption);
    await page.waitForLoadState('networkidle');
    await edit.selectRentOrBuy(edit.rentBuyMenu, edit.rentOption);
    await page.waitForLoadState('networkidle');
    await edit.selectCompany(edit.companyMenu, edit.companyOption);
    await page.waitForLoadState('networkidle');
    await edit.fillPhoneNumber(edit.driverPhoneField.first(), Constants.phoneNumberOfUserApp);
    await page.waitForLoadState('networkidle');
    await edit.selectYard(edit.yardField, edit.yardOption);
    await page.waitForLoadState('networkidle');
    await edit.plateField.clear();
    await edit.fillPlate(edit.plateField, Constants.plateNumber);
    await page.waitForLoadState('networkidle');
    await edit.selectDriverState(edit.driverStateMenu, edit.driverStateOption);
    await page.waitForLoadState('networkidle');
    await edit.selectOwner(edit.ownerMenu, edit.ownerOption);
    await page.waitForLoadState('networkidle');
    await edit.selectStatus(edit.statusMenu, edit.statusOption);
    await page.waitForLoadState('networkidle');
    await edit.selectAvailability(edit.availabilityMenu, edit.availabilityOption);
    await page.waitForLoadState('networkidle');
    await edit.clickSaveButton();
    await page.waitForLoadState('networkidle');
    await edit.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
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
});

test('Korisnik moze da edituje trailer - Out of company', async ({ page }) => {
    const edit = new EditTrailersPage(page);
    const trailer = new AvailableTrailersPage(page);
    await edit.check(edit.outOfCompanyCheckbox);
    await edit.selectThirdParty(edit.thirdPartyMenu, edit.thirdPartyOption);
    await page.waitForLoadState('networkidle');
    await edit.selectRentOrBuy(edit.rentBuyMenu, edit.rentOption);
    await page.waitForLoadState('networkidle');
    await edit.fillPhoneNumber(edit.driverPhoneField.first(), Constants.phoneNumberOfUserApp);
    await page.waitForLoadState('networkidle');
    await edit.selectYard(edit.yardField, edit.yardOption);
    await page.waitForLoadState('networkidle');
    await edit.plateField.clear();
    await page.waitForLoadState('networkidle');
    await edit.fillPlate(edit.plateField, Constants.plateNumber);
    await page.waitForLoadState('networkidle');
    await edit.selectDriverState(edit.driverStateMenu, edit.driverStateOption);
    await page.waitForLoadState('networkidle');
    await edit.selectOwner(edit.ownerMenu, edit.ownerOption);
    await page.waitForLoadState('networkidle');
    await edit.selectStatus(edit.statusMenu, edit.statusOption);
    await page.waitForLoadState('networkidle');
    await edit.selectAvailability(edit.availabilityMenu, edit.availabilityOption);
    await page.waitForLoadState('networkidle');
    await edit.clickSaveButton();
    await page.waitForLoadState('networkidle');
    await edit.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    await expect(trailer.thirdPartyColumn.first()).toContainText(Constants.owner);
    await expect(trailer.rentOrBuyColumn.first()).toContainText(Constants.rent);
    await expect(trailer.driverPhoneColumn.first()).toContainText(Constants.phoneNumberOfUserApp);
    await expect(trailer.yardColumn.first()).toContainText(Constants.novaYarda);
    await expect(trailer.plateColumn.first()).toContainText(Constants.plateNumber);
    await expect(trailer.ownerNameColumn.first()).toContainText(Constants.ownerTrailer);
    await expect(trailer.statusColumn.first()).toContainText(Constants.stolenStatus);
    await expect(trailer.availabilityColumn.first()).toContainText(Constants.available);
});
