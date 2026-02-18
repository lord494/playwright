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
    await expect(trailerOverviewSetup.trailerNameColumn.first()).toContainText(trailerNumber);
    await expect(trailerOverviewSetup.trailerTypeColumn.first()).toContainText('Dry van');
    await expect(trailerOverviewSetup.trailerYearColumn.first()).toContainText('2002');
    await expect(trailerOverviewSetup.trailerMakeColumn.first()).toContainText('HYUNDAI');
    await expect(trailerOverviewSetup.dealershipColumn.first()).toContainText('KEMOINPEX');
    await expect(trailerOverviewSetup.vinNumberColumn.first()).toContainText(randomNumberString);
    trailerOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.deleteIcon.first());
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
