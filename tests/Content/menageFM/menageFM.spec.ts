import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { MenageFM } from '../../../page/Content/manageFM.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.menageFMUrl, { waitUntil: 'networkidle', timeout: 20000 });
});

test.describe('Drag and drop kamiona bez fm-a', () => {
    // Both tests drag Constants.truckNumberFM into the first card. Make sure it starts unassigned and
    // is unassigned again afterwards — a run that failed half-way used to leave it in a card, so it
    // no longer appeared under "drivers without FM" and every following run failed.
    test.beforeEach(async ({ page }) => {
        const fm = new MenageFM(page);
        await fm.card.first().waitFor({ state: 'visible', timeout: 10000 });
        await fm.removeTruckFromFm(Constants.truckNumberFM);
    });

    test.afterEach(async ({ page }) => {
        await new MenageFM(page).removeTruckFromFm(Constants.truckNumberFM);
    });

    test('Korisnik moze da uradi drag and drop kamiona koji nema fm u neku karticu', async ({ page }) => {
        const fm = new MenageFM(page);
        await fm.searchDriversWithoutFm(Constants.truckNumberFM);
        await expect(fm.unassignedChip(Constants.truckNumberFM)).toBeVisible();
        await fm.dragTruckToFirstCard(Constants.truckNumberFM);
        await expect(fm.card.first()).toContainText(Constants.truckNumberFM);
        await fm.removeTruckFromFm(Constants.truckNumberFM);
        await expect(fm.assignedChip(Constants.truckNumberFM)).toHaveCount(0);
    });

    test('Broj u counteru se povecava i smanjuje nakon dodavanja i brisanja', async ({ page }) => {
        const fm = new MenageFM(page);
        await fm.searchDriversWithoutFm(Constants.truckNumberFM);
        await expect(fm.unassignedChip(Constants.truckNumberFM)).toBeVisible();
        const beforeAdd = Number((await fm.counter.first().textContent())?.trim());
        await fm.dragTruckToFirstCard(Constants.truckNumberFM);
        await expect(fm.card.first()).toContainText(Constants.truckNumberFM);
        await expect(fm.counter.first()).toHaveText(String(beforeAdd + 1));
        await fm.removeTruckFromFm(Constants.truckNumberFM);
        await expect(fm.counter.first()).toHaveText(String(beforeAdd));
    });
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
    await fm.searchDriversWithoutFm(truckNumber);
    // Every remaining chip must match the search (the list re-renders after the response — poll).
    await expect.poll(async () => {
        const chips = await fm.driverNumberAndDriversWithoutFM.allTextContents();
        return chips.length > 0 && chips.every(chip => chip.includes(truckNumber));
    }, { timeout: 10000 }).toBe(true);
});

test('Korisnik moze da pretrazuje kamione koji nemaju fm', async ({ page }) => {
    const fm = new MenageFM(page);
    const truckNumber = await fm.getTruckNumberWithoutFM();
    await fm.searchDriversWithoutFm(truckNumber);
    // Every remaining chip must match the search (the list re-renders after the response — poll).
    await expect.poll(async () => {
        const chips = await fm.driverNumberAndDriversWithoutFM.allTextContents();
        return chips.length > 0 && chips.every(chip => chip.includes(truckNumber));
    }, { timeout: 10000 }).toBe(true);
});
