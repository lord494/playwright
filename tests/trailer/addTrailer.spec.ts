import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailersPage } from '../../page/trailer/trailer.page';
import { AddTrailersPage } from '../../page/trailer/addTrailer.page';
import { get17RandomNumbers, get6RandomNumber } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.trailerUrl);
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da doda trailer', async ({ page }) => {
    const add = new AddTrailersPage(page);
    const trailer = new TrailersPage(page);
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
    await expect(trailer.trailerNameColumn.first()).toContainText(trailerNumber);
    await expect(trailer.trailerTypeColumn.first()).toContainText('Dry van');
    await expect(trailer.trailerYearColumn.first()).toContainText('2002');
    await expect(trailer.trailerMakeColumn.first()).toContainText('HYUNDAI');
    await expect(trailer.dealershipColumn.first()).toContainText('KEMOINPEX');
    await expect(trailer.vinNumberColumn.first()).toContainText(randomNumberString);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await trailer.clickElement(trailer.deleteIcon.first());
    await page.waitForLoadState('networkidle');
});

test('Trailer number polje mora biti unique', async ({ page }) => {
    const add = new AddTrailersPage(page);
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    const name = await trailer.trailerNameColumn.first().textContent();
    await trailer.clickElement(trailer.addButton);
    await page.waitForLoadState('networkidle');
    await add.fillTrailerNumber(add.trailerNumber, (name ?? '').replace(/\s/g, ''));
    await add.selectTrailerType(add.trailertype, add.dryVanType);
    await add.selectTrailerYear(add.trailerYear, add.year2002);
    await add.selectPickUpDate(add.pickUpDate, add.currentDate);
    await add.selectDealerhip(add.dealership, add.kemonipexDealreship);
    await add.selectTrailerMake(add.trailerMake, add.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await add.fillVinNumber(add.vinNumber, randomNumberString);
    await add.clickSaveButton();
    await expect(page.getByText('This field must be unique')).toBeVisible();
});

test('Vin number polje mora biti unique', async ({ page }) => {
    const add = new AddTrailersPage(page);
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    const vin = await trailer.vinNumberColumn.first().textContent();
    await trailer.clickElement(trailer.addButton);
    await page.waitForLoadState('networkidle');
    const trailerNumber = get6RandomNumber().join('');
    await add.fillTrailerNumber(add.trailerNumber, trailerNumber);
    await add.selectTrailerType(add.trailertype, add.dryVanType);
    await add.selectTrailerYear(add.trailerYear, add.year2002);
    await add.selectPickUpDate(add.pickUpDate, add.currentDate);
    await add.selectDealerhip(add.dealership, add.kemonipexDealreship);
    await add.selectTrailerMake(add.trailerMake, add.trailerMakeOption);
    await add.fillVinNumber(add.vinNumber, (vin ?? '').replace(/\s/g, ''));
    await add.clickSaveButton();
    await expect(page.getByText('This field must be unique')).toBeVisible();
});