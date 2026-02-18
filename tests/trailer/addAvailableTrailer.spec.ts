import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get17RandomNumbers, get6RandomNumber } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';


test('Korisnik moze da doda trailer', async ({ addAvailableTrailer, availableTrailerSetup }) => {
    await availableTrailerSetup.clickElement(availableTrailerSetup.addButton);
    await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    const trailerNumber = get6RandomNumber().join('');
    await addAvailableTrailer.fillTrailerNumber(addAvailableTrailer.trailerNumber, trailerNumber);
    await addAvailableTrailer.selectTrailerType(addAvailableTrailer.trailertype.last(), addAvailableTrailer.dryVanType);
    await addAvailableTrailer.selectTrailerYear(addAvailableTrailer.trailerYear, addAvailableTrailer.year2002);
    await addAvailableTrailer.selectPickUpDate(addAvailableTrailer.pickUpDate, addAvailableTrailer.currentDate);
    await addAvailableTrailer.selectDealerhip(addAvailableTrailer.dealership, addAvailableTrailer.kemonipexDealreship);
    await addAvailableTrailer.selectTrailerMake(addAvailableTrailer.trailerMake.last(), addAvailableTrailer.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await addAvailableTrailer.fillVinNumber(addAvailableTrailer.vinNumber, randomNumberString);
    await addAvailableTrailer.clickSaveButton();
    await addAvailableTrailer.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await availableTrailerSetup.page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    await availableTrailerSetup.page.waitForTimeout(2000);
    await availableTrailerSetup.enterTrailerName(availableTrailerSetup.trailerNumberFilter, trailerNumber);
    await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    await availableTrailerSetup.page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    await expect(availableTrailerSetup.trailerNameColumn.first()).toContainText(trailerNumber);
    await expect(availableTrailerSetup.trailerTypeColumn.first()).toContainText('Dry van');
    await expect(availableTrailerSetup.trailerYearColumn.first()).toContainText('2002');
    await expect(availableTrailerSetup.trailerMakeColumn.first()).toContainText('HYUNDAI');
    await expect(availableTrailerSetup.dealershipColumn.first()).toContainText('KEMOINPEX');
    await expect(availableTrailerSetup.vinNumberColumn.first()).toContainText(randomNumberString);
});

test('Trailer number polje mora biti unique', async ({ addAvailableTrailer, availableTrailerSetup }) => {
    await availableTrailerSetup.page.goto(Constants.availableTrailerUrl, { waitUntil: 'networkidle' });
    await availableTrailerSetup.trailerNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    const name = await availableTrailerSetup.trailerNameColumn.first().textContent();
    await availableTrailerSetup.clickElement(availableTrailerSetup.addButton);
    await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    await addAvailableTrailer.fillTrailerNumber(addAvailableTrailer.trailerNumber, (name ?? '').replace(/\s/g, ''));
    await addAvailableTrailer.selectTrailerType(addAvailableTrailer.trailertype.last(), addAvailableTrailer.dryVanType);
    await addAvailableTrailer.selectTrailerYear(addAvailableTrailer.trailerYear, addAvailableTrailer.year2002);
    await addAvailableTrailer.selectPickUpDate(addAvailableTrailer.pickUpDate, addAvailableTrailer.currentDate);
    await addAvailableTrailer.selectDealerhip(addAvailableTrailer.dealership, addAvailableTrailer.kemonipexDealreship);
    await addAvailableTrailer.selectTrailerMake(addAvailableTrailer.trailerMake.last(), addAvailableTrailer.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await addAvailableTrailer.fillVinNumber(addAvailableTrailer.vinNumber, randomNumberString);
    await addAvailableTrailer.clickSaveButton();
    await expect(availableTrailerSetup.page.getByText('This field must be unique')).toBeVisible();
});

test('Vin number polje mora biti unique', async ({ addAvailableTrailer, availableTrailerSetup }) => {
    const vin = await availableTrailerSetup.vinNumberColumn.first().textContent();
    await availableTrailerSetup.clickElement(availableTrailerSetup.addButton);
    await availableTrailerSetup.page.waitForLoadState('networkidle', { timeout: 10000 });
    const trailerNumber = get6RandomNumber().join('');
    await addAvailableTrailer.fillTrailerNumber(addAvailableTrailer.trailerNumber, trailerNumber);
    await addAvailableTrailer.selectTrailerType(addAvailableTrailer.trailertype.last(), addAvailableTrailer.dryVanType);
    await addAvailableTrailer.selectTrailerYear(addAvailableTrailer.trailerYear, addAvailableTrailer.year2002);
    await addAvailableTrailer.selectPickUpDate(addAvailableTrailer.pickUpDate, addAvailableTrailer.currentDate);
    await addAvailableTrailer.selectDealerhip(addAvailableTrailer.dealership, addAvailableTrailer.kemonipexDealreship);
    await addAvailableTrailer.selectTrailerMake(addAvailableTrailer.trailerMake.last(), addAvailableTrailer.trailerMakeOption);
    await addAvailableTrailer.fillVinNumber(addAvailableTrailer.vinNumber, (vin ?? '').replace(/\s/g, ''));
    await addAvailableTrailer.clickSaveButton();
    await expect(addAvailableTrailer.page.getByText('This field must be unique')).toBeVisible();
});