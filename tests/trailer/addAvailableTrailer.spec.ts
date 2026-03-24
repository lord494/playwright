import { Constants } from '../../helpers/constants';
import { expectIcon } from '../../helpers/dateUtilis';
import { test, expect } from '../fixtures/fixtures';


test.describe.serial('CRUD available trailer', () => {
    let extractedTrailerNumber: string | null

    test('Add available trailer', async ({ trailerData, availableTrailerSetup }) => {
        await availableTrailerSetup.clickElement(availableTrailerSetup.addButton);
        await availableTrailerSetup.enterAndSelectAvailableTrailer(availableTrailerSetup.trailerNumberInModal, trailerData.number ?? '', availableTrailerSetup.page.getByRole('option', { name: trailerData.number ?? '' }).locator('div').first());
        await availableTrailerSetup.clickSaveButton();
        await availableTrailerSetup.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304);
        await availableTrailerSetup.enterTrailerName(availableTrailerSetup.trailerNumberFilter, trailerData.number ?? '');
        await availableTrailerSetup.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304);
        await expect(availableTrailerSetup.trailerNameColumn).toContainText(trailerData.number ?? '');
        const trailerNumber = await availableTrailerSetup.trailerNameColumn.textContent();
        extractedTrailerNumber = trailerNumber?.trim() ?? null;
        await expect(availableTrailerSetup.trailerTypeColumn).toContainText(trailerData.type ?? '');
        await expect(availableTrailerSetup.trailerYearColumn).toContainText(trailerData.year ?? '');
        const truckNumber = await availableTrailerSetup.truckColumn.textContent();
        await expect(truckNumber === trailerData.truckNumber || truckNumber === "").toBeTruthy();
        const driverOrThirdParty = await availableTrailerSetup.driverThirdPartyColumn.textContent();
        await expect(driverOrThirdParty?.trim() === trailerData.driver?.trim() || driverOrThirdParty?.trim() === trailerData.thirdParty?.trim() || driverOrThirdParty?.trim() === "").toBeTruthy();
        const yard = await availableTrailerSetup.yardColumn.textContent();
        await expect(yard === trailerData.yard || yard === "").toBeTruthy();
        await expect(availableTrailerSetup.trailerYearColumn).toContainText(trailerData.year?.trim() ?? '');
        const rentOrBuy = await availableTrailerSetup.rentOrBuyColumn.textContent();
        await expect(rentOrBuy === trailerData.rentOrBuy || rentOrBuy === "").toBeTruthy();
        const available = await availableTrailerSetup.availabilityColumn.textContent();
        await expect(available === trailerData.available || available === "").toBeTruthy();
        const status = await availableTrailerSetup.statusColumn.textContent();
        await expect(status === trailerData.status || status === "").toBeTruthy();
        const brokerage = await availableTrailerSetup.brokerageColumn.textContent();
        await expect(brokerage === trailerData.brokerage || brokerage === "").toBeTruthy();
        await expectIcon(availableTrailerSetup.towingColumn, trailerData.towingIcon);
        await expectIcon(availableTrailerSetup.loadedColumn, trailerData.loadedIcon);
        // const targetTowingClass = await availableTrailerSetup.towingColumn.locator('i').getAttribute('class');
        // if (trailerData.towingIcon === 'mdi-check') {
        //     await expect(targetTowingClass).toContain('mdi-check');
        // } else if (trailerData.towingIcon === 'mdi-close-octagon-outline') {
        //     await expect(targetTowingClass).toContain('mdi-close-octagon-outline');
        // }
        // const loadedIconClass = await availableTrailerSetup.loadedColumn.locator('i').getAttribute('class');
        // if (trailerData.loadedIcon === 'mdi-check') {
        //     await expect(loadedIconClass).toContain('mdi-check');
        // } else if (trailerData.loadedIcon === 'mdi-close-octagon-outline') {
        //     await expect(loadedIconClass).toContain('mdi-close-octagon-outline');
        // }
    });

    test('Edit available trailer', async ({ availableTrailerSetup, addAvailableTrailer }) => {
        await addAvailableTrailer.page.goto(Constants.availableTrailerUrl, { waitUntil: 'networkidle', timeout: 10000 });
        await availableTrailerSetup.enterTrailerName(availableTrailerSetup.trailerNumberFilter, extractedTrailerNumber ?? '');
        await availableTrailerSetup.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304);
        await expect(availableTrailerSetup.trailerNameColumn).toContainText(extractedTrailerNumber ?? '');
        await availableTrailerSetup.clickElement(availableTrailerSetup.pencilIcon);
        await addAvailableTrailer.check(addAvailableTrailer.signCheckbox);
        await addAvailableTrailer.check(addAvailableTrailer.salesReadyCheckbox);
        await addAvailableTrailer.selectTodayDate(addAvailableTrailer.assignDateField, addAvailableTrailer.currentDate.last());
        await addAvailableTrailer.paymentStartDateField.click();
        await addAvailableTrailer.selectPaymentStatus(addAvailableTrailer.paymentStartDateField, addAvailableTrailer.currentDate.last());
        await addAvailableTrailer.selectPaymentStatus(addAvailableTrailer.paymentStatusField, addAvailableTrailer.paidOptionFromPaymentStatusMenu);
        await addAvailableTrailer.selectSalesUser(addAvailableTrailer.userMenu, Constants.salesPerson, addAvailableTrailer.testSalesOptionFromUserMenu);
    });

    // test('Korisnik moze da doda trailer', async ({ addAvailableTrailer, availableTrailerSetup }) => {
    //     await availableTrailerSetup.clickElement(availableTrailerSetup.addButton);
    //     await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    //     const trailerNumber = get6RandomNumber().join('');
    //     await addAvailableTrailer.fillTrailerNumber(addAvailableTrailer.trailerNumber, trailerNumber);
    //     await addAvailableTrailer.selectTrailerType(addAvailableTrailer.trailertype.last(), addAvailableTrailer.dryVanType);
    //     await addAvailableTrailer.selectTrailerYear(addAvailableTrailer.trailerYear, addAvailableTrailer.year2002);
    //     await addAvailableTrailer.selectPickUpDate(addAvailableTrailer.pickUpDate, addAvailableTrailer.currentDate);
    //     await addAvailableTrailer.selectDealerhip(addAvailableTrailer.dealership, addAvailableTrailer.kemonipexDealreship);
    //     await addAvailableTrailer.selectTrailerMake(addAvailableTrailer.trailerMake.last(), addAvailableTrailer.trailerMakeOption);
    //     const randomNumberString = get17RandomNumbers().join('');
    //     await addAvailableTrailer.fillVinNumber(addAvailableTrailer.vinNumber, randomNumberString);
    //     await addAvailableTrailer.clickSaveButton();
    //     await addAvailableTrailer.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    //     await availableTrailerSetup.page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    //     await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    //     await availableTrailerSetup.page.waitForTimeout(2000);
    //     await availableTrailerSetup.enterTrailerName(availableTrailerSetup.trailerNumberFilter, trailerNumber);
    //     await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    //     await availableTrailerSetup.page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    //     await expect(availableTrailerSetup.trailerNameColumn.first()).toContainText(trailerNumber);
    //     await expect(availableTrailerSetup.trailerTypeColumn.first()).toContainText('Dry van');
    //     await expect(availableTrailerSetup.trailerYearColumn.first()).toContainText('2002');
    //     await expect(availableTrailerSetup.trailerMakeColumn.first()).toContainText('HYUNDAI');
    //     await expect(availableTrailerSetup.dealershipColumn.first()).toContainText('KEMOINPEX');
    //     await expect(availableTrailerSetup.vinNumberColumn.first()).toContainText(randomNumberString);
    // });

    // test('Trailer number polje mora biti unique', async ({ addAvailableTrailer, availableTrailerSetup }) => {
    //     await availableTrailerSetup.page.goto(Constants.availableTrailerUrl, { waitUntil: 'networkidle' });
    //     await availableTrailerSetup.trailerNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    //     const name = await availableTrailerSetup.trailerNameColumn.first().textContent();
    //     await availableTrailerSetup.clickElement(availableTrailerSetup.addButton);
    //     await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    //     await addAvailableTrailer.fillTrailerNumber(addAvailableTrailer.trailerNumber, (name ?? '').replace(/\s/g, ''));
    //     await addAvailableTrailer.selectTrailerType(addAvailableTrailer.trailertype.last(), addAvailableTrailer.dryVanType);
    //     await addAvailableTrailer.selectTrailerYear(addAvailableTrailer.trailerYear, addAvailableTrailer.year2002);
    //     await addAvailableTrailer.selectPickUpDate(addAvailableTrailer.pickUpDate, addAvailableTrailer.currentDate);
    //     await addAvailableTrailer.selectDealerhip(addAvailableTrailer.dealership, addAvailableTrailer.kemonipexDealreship);
    //     await addAvailableTrailer.selectTrailerMake(addAvailableTrailer.trailerMake.last(), addAvailableTrailer.trailerMakeOption);
    //     const randomNumberString = get17RandomNumbers().join('');
    //     await addAvailableTrailer.fillVinNumber(addAvailableTrailer.vinNumber, randomNumberString);
    //     await addAvailableTrailer.clickSaveButton();
    //     await expect(availableTrailerSetup.page.getByText('This field must be unique')).toBeVisible();
    // });

    // test('Vin number polje mora biti unique', async ({ addAvailableTrailer, availableTrailerSetup }) => {
    //     const vin = await availableTrailerSetup.vinNumberColumn.first().textContent();
    //     await availableTrailerSetup.clickElement(availableTrailerSetup.addButton);
    //     await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    //     const trailerNumber = get6RandomNumber().join('');
    //     await addAvailableTrailer.fillTrailerNumber(addAvailableTrailer.trailerNumber, trailerNumber);
    //     await addAvailableTrailer.selectTrailerType(addAvailableTrailer.trailertype.last(), addAvailableTrailer.dryVanType);
    //     await addAvailableTrailer.selectTrailerYear(addAvailableTrailer.trailerYear, addAvailableTrailer.year2002);
    //     await addAvailableTrailer.selectPickUpDate(addAvailableTrailer.pickUpDate, addAvailableTrailer.currentDate);
    //     await addAvailableTrailer.selectDealerhip(addAvailableTrailer.dealership, addAvailableTrailer.kemonipexDealreship);
    //     await addAvailableTrailer.selectTrailerMake(addAvailableTrailer.trailerMake.last(), addAvailableTrailer.trailerMakeOption);
    //     await addAvailableTrailer.fillVinNumber(addAvailableTrailer.vinNumber, (vin ?? '').replace(/\s/g, ''));
    //     await addAvailableTrailer.clickSaveButton();
    //     await expect(addAvailableTrailer.page.getByText('This field must be unique')).toBeVisible();
    // });
});