import { expect } from '@playwright/test';
import { get17RandomNumbers, get6RandomNumber } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda trailer', async ({ trailerOverviewSetup, addTrailer }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addButton);
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
    const trailerNumber = get6RandomNumber().join('');
    await addTrailer.fillTrailerNumber(addTrailer.trailerNumber, trailerNumber);
    await addTrailer.selectTrailerType(addTrailer.trailertype, addTrailer.dryVanType);
    await addTrailer.selectTrailerYear(addTrailer.trailerYear, addTrailer.year2002);
    await addTrailer.selectPickUpDate(addTrailer.pickUpDate, addTrailer.currentDate);
    await addTrailer.selectDealerhip(addTrailer.dealership, addTrailer.kemonipexDealreship);
    await addTrailer.selectTrailerMake(addTrailer.trailerMake, addTrailer.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await addTrailer.fillVinNumber(addTrailer.vinNumber, randomNumberString);
    await addTrailer.clickSaveButton();
    await addTrailer.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    const trailerNameColumn = await trailerOverviewSetup.page.locator(`//td[@class='trailer-number']/div[normalize-space()='${trailerNumber}']/ancestor::tr/td[2]`).textContent();
    const trailerTypeColumn = await trailerOverviewSetup.page.locator(`//td[@class='trailer-number']/div[normalize-space()='${trailerNumber}']/ancestor::tr/td[3]`).textContent();
    const trailerYearColumn = await trailerOverviewSetup.page.locator(`//td[@class='trailer-number']/div[normalize-space()='${trailerNumber}']/ancestor::tr/td[16]`).textContent();
    const trailerMakeColumn = await trailerOverviewSetup.page.locator(`//td[@class='trailer-number']/div[normalize-space()='${trailerNumber}']/ancestor::tr/td[15]`).textContent();
    const dealershipColumn = await trailerOverviewSetup.page.locator(`//td[@class='trailer-number']/div[normalize-space()='${trailerNumber}']/ancestor::tr/td[9]`).textContent();
    const vinNumberColumn = await trailerOverviewSetup.page.locator(`//td[@class='trailer-number']/div[normalize-space()='${trailerNumber}']/ancestor::tr/td[17]`).textContent();
    expect(trailerNameColumn).toContain(trailerNumber);
    expect(trailerTypeColumn).toContain('Dry van');
    expect(trailerYearColumn).toContain('2002');
    expect(trailerMakeColumn).toContain('HYUNDAI');
    expect(dealershipColumn).toContain('KEMOINPEX');
    expect(vinNumberColumn).toContain(randomNumberString);
    trailerOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteButton = trailerOverviewSetup.page.locator(
        `//td[@class='trailer-number']/div[normalize-space()='${trailerNumber}']/../..//button[contains(@class, 'mdi-delete')]`
    );
    await trailerOverviewSetup.clickElement(deleteButton);
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
});

test('Trailer number polje mora biti unique', async ({ trailerOverviewSetup, addTrailer }) => {
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
    const name = await trailerOverviewSetup.trailerNameColumn.first().textContent();
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addButton);
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
    await addTrailer.fillTrailerNumber(addTrailer.trailerNumber, (name ?? '').replace(/\s/g, ''));
    await addTrailer.selectTrailerType(addTrailer.trailertype, addTrailer.dryVanType);
    await addTrailer.selectTrailerYear(addTrailer.trailerYear, addTrailer.year2002);
    await addTrailer.selectPickUpDate(addTrailer.pickUpDate, addTrailer.currentDate);
    await addTrailer.selectDealerhip(addTrailer.dealership, addTrailer.kemonipexDealreship);
    await addTrailer.selectTrailerMake(addTrailer.trailerMake, addTrailer.trailerMakeOption);
    const randomNumberString = get17RandomNumbers().join('');
    await addTrailer.fillVinNumber(addTrailer.vinNumber, randomNumberString);
    await addTrailer.clickSaveButton();
    await expect(trailerOverviewSetup.page.getByText('This field must be unique')).toBeVisible();
});

test('Vin number polje mora biti unique', async ({ trailerOverviewSetup, addTrailer }) => {
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
    const vin = await trailerOverviewSetup.vinNumberColumn.first().textContent();
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addButton);
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
    const trailerNumber = get6RandomNumber().join('');
    await addTrailer.fillTrailerNumber(addTrailer.trailerNumber, trailerNumber);
    await addTrailer.selectTrailerType(addTrailer.trailertype, addTrailer.dryVanType);
    await addTrailer.selectTrailerYear(addTrailer.trailerYear, addTrailer.year2002);
    await addTrailer.selectPickUpDate(addTrailer.pickUpDate, addTrailer.currentDate);
    await addTrailer.selectDealerhip(addTrailer.dealership, addTrailer.kemonipexDealreship);
    await addTrailer.selectTrailerMake(addTrailer.trailerMake, addTrailer.trailerMakeOption);
    await addTrailer.fillVinNumber(addTrailer.vinNumber, (vin ?? '').replace(/\s/g, ''));
    await addTrailer.clickSaveButton();
    await expect(trailerOverviewSetup.page.getByText('This field must be unique')).toBeVisible();
});
