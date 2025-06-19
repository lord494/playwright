import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get17RandomNumbers, get6RandomNumber } from '../../helpers/dateUtilis';
import { AddAvailableTrailersPage } from '../../page/trailer/addAvailableTrailer.page';
import { AvailableTrailersPage } from '../../page/trailer/availableTrailer.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.availableTrailerUrl, { waitUntil: 'networkidle' });
});

test('Korisnik moze da doda trailer', async ({ page }) => {
    const add = new AddAvailableTrailersPage(page);
    const trailer = new AvailableTrailersPage(page);
    await trailer.clickElement(trailer.addButton);
    await page.waitForLoadState('networkidle');
    const trailerNumber = get6RandomNumber().join('');
    await add.fillTrailerNumber(add.trailerNumber, trailerNumber);
    await add.selectTrailerType(add.trailertype.last(), add.dryVanType);
    await add.selectTrailerYear(add.trailerYear, add.year2002);
    await add.selectPickUpDate(add.pickUpDate, add.currentDate);
    await add.selectDealerhip(add.dealership, add.kemonipexDealreship);
    await add.selectTrailerMake(add.trailerMake.last(), add.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await add.fillVinNumber(add.vinNumber, randomNumberString);
    await add.clickSaveButton();
    await add.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await trailer.enterTrailerName(trailer.trailerNumberFilter, trailerNumber);
    await page.waitForLoadState('networkidle');
    await page.locator('.v-progress-linear__background.primary').waitFor({ state: 'hidden', timeout: 10000 });
    await expect(trailer.trailerNameColumn.first()).toContainText(trailerNumber);
    await expect(trailer.trailerTypeColumn.first()).toContainText('Dry van');
    await expect(trailer.trailerYearColumn.first()).toContainText('2002');
    await expect(trailer.trailerMakeColumn.first()).toContainText('HYUNDAI');
    await expect(trailer.dealershipColumn.first()).toContainText('KEMOINPEX');
    await expect(trailer.vinNumberColumn.first()).toContainText(randomNumberString);
});

test('Trailer number polje mora biti unique', async ({ page }) => {
    const add = new AddAvailableTrailersPage(page);
    const trailer = new AvailableTrailersPage(page);
    await page.goto(Constants.availableTrailerUrl, { waitUntil: 'networkidle' });
    await trailer.trailerNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    const name = await trailer.trailerNameColumn.first().textContent();
    await trailer.clickElement(trailer.addButton);
    await page.waitForLoadState('networkidle');
    await add.fillTrailerNumber(add.trailerNumber, (name ?? '').replace(/\s/g, ''));
    await add.selectTrailerType(add.trailertype.last(), add.dryVanType);
    await add.selectTrailerYear(add.trailerYear, add.year2002);
    await add.selectPickUpDate(add.pickUpDate, add.currentDate);
    await add.selectDealerhip(add.dealership, add.kemonipexDealreship);
    await add.selectTrailerMake(add.trailerMake.last(), add.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await add.fillVinNumber(add.vinNumber, randomNumberString);
    await add.clickSaveButton();
    await expect(page.getByText('This field must be unique')).toBeVisible();
});

test('Vin number polje mora biti unique', async ({ page }) => {
    const add = new AddAvailableTrailersPage(page);
    const trailer = new AvailableTrailersPage(page);
    await page.waitForLoadState('networkidle');
    const vin = await trailer.vinNumberColumn.first().textContent();
    await trailer.clickElement(trailer.addButton);
    await page.waitForLoadState('networkidle');
    const trailerNumber = get6RandomNumber().join('');
    await add.fillTrailerNumber(add.trailerNumber, trailerNumber);
    await add.selectTrailerType(add.trailertype.last(), add.dryVanType);
    await add.selectTrailerYear(add.trailerYear, add.year2002);
    await add.selectPickUpDate(add.pickUpDate, add.currentDate);
    await add.selectDealerhip(add.dealership, add.kemonipexDealreship);
    await add.selectTrailerMake(add.trailerMake.last(), add.trailerMakeOption);
    await add.fillVinNumber(add.vinNumber, (vin ?? '').replace(/\s/g, ''));
    await add.clickSaveButton();
    await expect(page.getByText('This field must be unique')).toBeVisible();
});