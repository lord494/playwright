import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { MenageFM } from '../../../page/Content/manageFM.page';
import { waitForDriver } from '../../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.menageFMUrl, { waitUntil: 'networkidle', timeout: 20000 });
});

test('Korisnik moze da uradi drag and drop kamiona koji nema fm u neku karticu', async ({ page }) => {
    const fm = new MenageFM(page);
    await fm.card.first().waitFor({ state: 'visible', timeout: 5000 });
    await fm.card.first().hover();
    await waitForDriver(page, async () => {
        fm.searchTruckNumberAndFM(fm.searchDrivers, Constants.truckNumberFM)
    });
    await fm.driverNumberAndDriversWithoutFM.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await waitForDriver(page, async () => {
        fm.dragAndDrop()
    });
    await expect(fm.card.first()).toContainText(Constants.truckNumberFM);
    const numbers = await fm.driverNumberAndDriver.allTextContents();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });

    for (let i = 0; i < numbers.length; i++) {
        const trimmed = numbers[i].trim();
        const match = trimmed.match(/^(\d+)\s*-/);
        if (match && match[1] === '6461') {
            const deleteButton = page.locator(`.mdi.mdi-close-circle`).nth(i);
            await waitForDriver(page, async () => {
                deleteButton.click()
            });
            break;
        }
    }
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da pretrazuje kamione koji imaju fm', async ({ page }) => {
    const fm = new MenageFM(page);
    const truckNumber = await fm.getDriverNumber();
    await fm.searchTruckNumberAndFM(fm.searchFMorTruckNumberField, truckNumber);
    await fm.clickElement(fm.searchButton);
    await fm.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await expect(fm.card).toContainText(truckNumber);
});

test('Korisnik moze da pretrazuje fleet manager-e', async ({ page }) => {
    const fm = new MenageFM(page);
    const fleetManager = (await fm.fmNameTitle.first().allInnerTexts()).toString();
    await fm.searchTruckNumberAndFM(fm.searchFMorTruckNumberField, fleetManager);
    await fm.clickElement(fm.searchButton);
    await fm.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await expect(fm.card.first()).toContainText(new RegExp(fleetManager, 'i'));
});

test('Labela da nema odgovarajucih rezultata je prikazana kada korisnik unese kamion bez fm-a', async ({ page }) => {
    const fm = new MenageFM(page);
    const truckNumber = await fm.getTruckNumberWithoutFM();
    await fm.searchTruckNumberAndFM(fm.searchFMorTruckNumberField, truckNumber);
    await fm.clickElement(fm.searchButton);
    await fm.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await expect(fm.message).toContainText(Constants.messageFM);
});

test('Inactive Drivers su prikazu kada korisnik cekira Show Inactive radio button', async ({ page }) => {
    const fm = new MenageFM(page);
    await fm.card.first().waitFor({ state: 'visible', timeout: 5000 });
    await fm.check(fm.showInactiveRadiobutton);
    await fm.inactiveDrivers.first().waitFor({ state: 'visible', timeout: 5000 });
    await expect(fm.inactiveDrivers.first()).toBeVisible();
});

test('Korisnik moze da pretrazuje vozace koji nemaju fm', async ({ page }) => {
    const fm = new MenageFM(page);
    const truckNumber = await fm.getTruckNumberWithoutFM();
    await waitForDriver(page, async () => {
        fm.searchTruckNumberAndFM(fm.searchDrivers, truckNumber)
    });
    await fm.driverNumberAndDriversWithoutFM.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await expect(fm.driverNumberAndDriversWithoutFM).toContainText(truckNumber);
});

test('Broj u counteru se povecava i smanjuje nakon dodavanja i brisanja', async ({ page }) => {
    const fm = new MenageFM(page);
    await fm.card.first().waitFor({ state: 'visible', timeout: 5000 });
    await waitForDriver(page, async () => {
        fm.searchTruckNumberAndFM(fm.searchDrivers, Constants.truckNumberFM)
    });
    await fm.driverNumberAndDriversWithoutFM.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    const beforeAddTrukc = await fm.counter.first().textContent();
    const beforeAddTruckNumber = Number(beforeAddTrukc?.trim());
    await waitForDriver(page, async () => {
        fm.dragAndDrop()
    });
    await expect(fm.card.first()).toContainText(Constants.truckNumberFM);
    const afterAddTruck = await fm.counter.first().textContent();
    const afterAddTruckNumber = Number(afterAddTruck?.trim());
    await expect(afterAddTruckNumber).toBe(beforeAddTruckNumber + 1);
    const numbers = await fm.driverNumberAndDriver.allTextContents();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    for (let i = 0; i < numbers.length; i++) {
        const trimmed = numbers[i].trim();
        const match = trimmed.match(/^(\d+)\s*-/);
        if (match && match[1] === '6461') {
            const deleteButton = page.locator(`.mdi.mdi-close-circle`).nth(i);
            await deleteButton.click();
            await expect(fm.card.first().locator('text=6461')).toHaveCount(0, { timeout: 5000 });
            break;
        }
    }
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da pretrazuje kamione koji nemaju fm', async ({ page }) => {
    const fm = new MenageFM(page);
    const truckNumber = await fm.getTruckNumberWithoutFM();
    await waitForDriver(page, async () => {
        fm.searchTruckNumberAndFM(fm.searchDrivers, truckNumber)
    });
    await fm.driverNumberAndDriversWithoutFM.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await expect(fm.driverNumberAndDriversWithoutFM).toContainText(truckNumber);
});