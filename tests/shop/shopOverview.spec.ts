import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe.configure({ timeout: 60000 });

test('Korisnik moze da izabere Truck opciju iz Franchise iz menija', async ({ shopPage }) => {
    await shopPage.selectFranchise(shopPage.truckFranchise);
    await shopPage.expectEveryFranchiseCardToContain(Constants.truckFranchise);
});

test('Korisnik moze da izabere Trailer opciju iz Franchise iz menija', async ({ shopPage }) => {
    await shopPage.selectFranchise(shopPage.trailerFranchise);
    await shopPage.expectEveryFranchiseCardToContain(Constants.trailerFranchise);
});

test('Korisnik moze da izabere Parking opciju iz Franchise iz menija', async ({ shopPage }) => {
    await shopPage.selectFranchise(shopPage.parkingFranchise);
    await shopPage.expectEveryFranchiseCardToContain(Constants.parkingFranchise);
});

test('Korisnik moze da pretrazuje shopove po postalo codu - Chicago postal code', async ({ shopPage }) => {
    await shopPage.enterPostalCode(Constants.chicagoPostalCode);
    await shopPage.expectEveryLocationCardToContain(Constants.chicagoPostalCode);
});

test('Korisnik moze da pretrazuje shopove po postalo codu - New York postal code', async ({ shopPage }) => {
    await shopPage.enterPostalCode(Constants.newYorkPostalCode);
    await shopPage.expectEveryLocationCardToContain(Constants.newYorkPostalCode);
});

test('Korisnik moze da pretrazuje shopove po gradu - Miami', async ({ shopPage }) => {
    await shopPage.selectCity(Constants.miamiOriginCity, shopPage.miamiOption);
    await shopPage.enterPostalCode(Constants.miamiPostalCode);
    await shopPage.expectEveryLocationCardToContain(Constants.miamiOriginCity);
});

test('Korisnik moze da pretrazuje shopove po gradu - New York', async ({ shopPage }) => {
    await shopPage.enterPostalCode(Constants.newYorkPostalCode);
    await shopPage.selectCity(Constants.newYorkCity, shopPage.newYorkOption);
    // NY postal 07032 is a Kearny, NJ area, so the cards render "NJ 07032".
    await shopPage.expectEveryLocationCardToContain('NJ ' + Constants.newYorkPostalCode);
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - truck type', async ({ shopPage }) => {
    await shopPage.typeMenu.click();
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.truckType);
    });
    await expect(shopPage.cards.first().locator('.mdi-truck')).toBeVisible({ timeout: 10000 })
    const count = await shopPage.cards.count();
    for (let i = 0; i < count; i++) {
        await expect(shopPage.cards.nth(i).locator('.mdi-truck')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - mobile shop type', async ({ shopPage }) => {
    await shopPage.typeMenu.click();
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.mobileShopType);
    });

    await expect(shopPage.cards.first().locator('.mdi-account-wrench')).toBeVisible({ timeout: 10000 });
    const count = await shopPage.cards.count();
    for (let i = 0; i < count; i++) {
        await expect(shopPage.cards.nth(i).locator('.mdi-account-wrench')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - towing type', async ({ shopPage }) => {
    await shopPage.typeMenu.click();
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.towingType);
    });
    await expect(shopPage.cards.first().locator('.mdi-tow-truck')).toBeVisible({ timeout: 10000 });
    const count = await shopPage.cards.count();
    for (let i = 0; i < count; i++) {
        await expect(shopPage.card.nth(i).locator('.mdi-tow-truck')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - secured parking', async ({ shopPage }) => {
    await shopPage.typeMenu.click();
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.securedParkingType);
    });
    await expect(shopPage.cards.first().locator('.mdi-parking')).toBeVisible({ timeout: 10000 });
    const count = await shopPage.cards.count();
    for (let i = 0; i < count; i++) {
        await expect(shopPage.cards.nth(i).locator('.mdi-parking')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po vise tipova', async ({ shopPage }) => {
    await shopPage.typeMenu.click();
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.truckType);
    });
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.mobileShopType);
    });
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.towingType);
    });
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.securedParkingType);
    });
    await expect(shopPage.cards.first().locator('.mdi-parking')).toBeVisible({ timeout: 10000 });
    const count = await shopPage.cards.count();
    for (let i = 0; i < count; i++) {
        const card = shopPage.cards.nth(i);
        await expect(card.locator('.mdi-tow-truck')).toBeVisible({ timeout: 5000 });
        await expect(card.locator('.mdi-truck')).toBeVisible({ timeout: 5000 });
        await expect(card.locator('.mdi-account-wrench')).toBeVisible({ timeout: 5000 });
        await expect(card.locator('.mdi-parking')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da ponisti unose u search polja kada klikne na crveni X button', async ({ shopPage }) => {
    await shopPage.selectFranchise(shopPage.truckFranchise);
    await shopPage.enterPostalCode(Constants.newYorkPostalCode);
    await shopPage.selectCity(Constants.newYorkCity, shopPage.newYorkOption);
    await shopPage.typeMenu.click();
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.towingType);
    });

    await shopPage.resetFilters();

    await shopPage.expectFiltersCleared();
});

test('Korisnik moze da pretrazuje shopove po statusu - Platinum', async ({ shopPage }) => {
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.platinumCheckbox)
    });
    const count = await shopPage.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shopPage.shopBadge.nth(i);
        await expect(card).toContainText(Constants.platinumStatus, { timeout: 10000 });
    }
});

test('Korisnik moze da pretrazuje shopove po statusu - Partner', async ({ shopPage }) => {
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.partnerCheckbox)
    });
    const count = await shopPage.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shopPage.shopBadge.nth(i);
        await expect(card).toContainText(Constants.partnerStatus, { timeout: 10000 });
    }
});

test('Korisnik moze da pretrazuje shopove po statusu - Gold', async ({ shopPage }) => {
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.goldCheckBox)
    });
    const count = await shopPage.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shopPage.shopBadge.nth(i);
        await expect(card).toContainText(Constants.goldStatus, { timeout: 10000 });
    }
});

test('Korisnik moze da pretrazuje shopove po statusu - Silver', async ({ shopPage }) => {
    await shopPage.waitForShopLoads(async () => {
        await shopPage.check(shopPage.silverCheckbox)
    });
    const count = await shopPage.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shopPage.shopBadge.nth(i);
        await expect(card).toContainText(Constants.silverStatus, { timeout: 10000 });
    }
});

test('Kada nije nadjen nijedan rezultat prikaze se snack message', async ({ shopPage }) => {
    await shopPage.enterPostalCode(Constants.secondPhone);
    await expect(shopPage.snackMessage).toContainText('No shops match the applied filters.', { timeout: 5000 });
});

test('Korisnik moze da otvori shop kada klikne na karticu', async ({ shopPage }) => {
    await shopPage.waitForShopLoads(async () => {
        await shopPage.card.first().click();
    });
    await expect(shopPage.leftArrowIcon).toBeVisible({ timeout: 10000 });
});

