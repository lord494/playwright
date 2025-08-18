import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { ShopPage } from '../../page/shop/shopOvervirew.page';
import { waitForShopLoads } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });
// POSTOJI PROBLEM DA NA GITU PADAJU TESTOVI IZ NEKOG RAZLOGA A OVDE PROLAZE NORMALNO
test.beforeEach(async ({ page }) => {
    await page.goto(Constants.shopUrl, { waitUntil: 'networkidle', timeout: 20_000 });
});

test('Korisnik moze da izabere Truck opciju iz Franchise iz menija', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.selectFranchise(shop.franchiseMenu, shop.truckFranchise)
    });
    const allCard = await shop.shopCardFranchisePart.allTextContents();
    for (const cardText of allCard) {
        expect(cardText).toContain(Constants.truckFranchise);
    }
});

test('Korisnik moze da izabere Trailer opciju iz Franchise iz menija', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.selectFranchise(shop.franchiseMenu, shop.trailerFranchise)
    });
    const allCard = await shop.shopCardFranchisePart.allTextContents();
    for (const cardText of allCard) {
        expect(cardText).toContain(Constants.trailerFranchise);
    }
});

test('Korisnik moze da izabere Parking opciju iz Franchise iz menija', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.selectFranchise(shop.franchiseMenu, shop.parkingFranchise)
    });
    const allCard = await shop.shopCardFranchisePart.allTextContents();
    for (const cardText of allCard) {
        expect(cardText).toContain(Constants.parkingFranchise);
    }
});

test('Korisnik moze da pretrazuje shopove po postalo codu - Chicago postal code', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.enterPostalCode(shop.postalCodeField, Constants.chicagoPostalCode)
    });
    const allCard = await shop.shopCardLocationPart.allTextContents();
    for (const cardText of allCard) {
        expect(cardText).toContain(Constants.chicagoPostalCode);
    }
});

test('Korisnik moze da pretrazuje shopove po postalo codu - New York postal code', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.enterPostalCode(shop.postalCodeField, Constants.newYorkPostalCode)
    });
    const allCard = await shop.shopCardLocationPart.allTextContents();
    for (const cardText of allCard) {
        expect(cardText).toContain(Constants.newYorkPostalCode);
    }
});

test('Korisnik moze da pretrazuje shopove po gradu - Miami', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.selectCity(shop.cityMenu, Constants.miamiOriginCity, shop.miamiOption)
    });
    await waitForShopLoads(page, async () => {
        shop.enterPostalCode(shop.postalCodeField, Constants.miamiPostalCode)
    });
    const allCard = await shop.shopCardLocationPart.allTextContents();
    for (const cardText of allCard) {
        expect(cardText).toContain(Constants.miamiOriginCity);
    }
});

test('Korisnik moze da pretrazuje shopove po gradu - New York', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.enterPostalCode(shop.postalCodeField, Constants.newYorkPostalCode)
    });
    await waitForShopLoads(page, async () => {
        shop.selectCity(shop.cityMenu, Constants.newYorkCity, shop.newYorkOption)
    });
    const allCard = await shop.shopCardLocationPart.allTextContents();
    await expect(shop.shopCardLocationPart.first()).toContainText('NJ ' + Constants.newYorkPostalCode, { timeout: 15000 });
    for (const cardText of allCard) {
        expect(cardText).toContain('NJ ' + Constants.newYorkPostalCode);
    }
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - truck type', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await shop.typeMenu.click();
    await waitForShopLoads(page, async () => {
        await shop.check(shop.truckType);
    });
    const cards = page.locator('.shop-card-data');
    await expect(cards.first().locator('.mdi-truck')).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card.locator('.mdi-truck')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - mobile shop type', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await shop.typeMenu.click();
    await waitForShopLoads(page, async () => {
        await shop.check(shop.mobileShopType);
    });
    const cards = page.locator('.shop-card-data');
    await expect(cards.first().locator('.mdi-account-wrench')).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card.locator('.mdi-account-wrench')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - towing type', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await shop.typeMenu.click();
    await waitForShopLoads(page, async () => {
        await shop.check(shop.towingType);
    });
    const cards = page.locator('.shop-card-data');
    await expect(cards.first().locator('.mdi-tow-truck')).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card.locator('.mdi-tow-truck')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po tipu shopa - secured parking', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await shop.typeMenu.click();
    await waitForShopLoads(page, async () => {
        await shop.check(shop.securedParkingType);
    });
    const cards = page.locator('.shop-card-data');
    await expect(cards.first().locator('.mdi-parking')).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card.locator('.mdi-parking')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da pretrazuje shopove po vise tipova', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await shop.typeMenu.click();
    await waitForShopLoads(page, async () => {
        await shop.check(shop.truckType);
    });
    await waitForShopLoads(page, async () => {
        await shop.check(shop.mobileShopType);
    });
    await waitForShopLoads(page, async () => {
        await shop.check(shop.towingType);
    });
    await waitForShopLoads(page, async () => {
        await shop.check(shop.securedParkingType);
    });
    const cards = page.locator('.shop-card-data');
    await expect(cards.first().locator('.mdi-parking')).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card.locator('.mdi-tow-truck')).toBeVisible({ timeout: 5000 });
        await expect(card.locator('.mdi-truck')).toBeVisible({ timeout: 5000 });
        await expect(card.locator('.mdi-account-wrench')).toBeVisible({ timeout: 5000 });
        await expect(card.locator('.mdi-parking')).toBeVisible({ timeout: 5000 });
    }
});

test('Korisnik moze da ponisti unose u search polja kada klikne na crveni X button', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.selectFranchise(shop.franchiseMenu, shop.truckFranchise)
    });
    await Promise.race([
        shop.card.first().waitFor({ state: 'visible', timeout: 10000 }),
        page.getByText('No shops match.').waitFor({ state: 'visible', timeout: 10000 })
    ]);
    await waitForShopLoads(page, async () => {
        shop.enterPostalCode(shop.postalCodeField, Constants.newYorkPostalCode)
    });
    await Promise.race([
        shop.card.first().waitFor({ state: 'visible', timeout: 10000 }),
        page.getByText('No shops match.').waitFor({ state: 'visible', timeout: 10000 })
    ]);

    await waitForShopLoads(page, async () => {
        shop.selectCity(shop.cityMenu, Constants.newYorkCity, shop.newYorkOption)
    });
    await Promise.race([
        shop.card.first().waitFor({ state: 'visible', timeout: 10000 }),
        page.getByText('No shops match.').waitFor({ state: 'visible', timeout: 10000 })
    ]);
    await shop.typeMenu.click();
    await waitForShopLoads(page, async () => {
        await shop.check(shop.towingType);
    });
    await Promise.race([
        shop.card.first().waitFor({ state: 'visible', timeout: 10000 }),
        page.getByText('No shops match.').waitFor({ state: 'visible', timeout: 10000 })
    ]);

    await shop.postalCodeField.click();
    await waitForShopLoads(page, async () => {
        await shop.xButton.click();
    });
    await expect(shop.franchisePlaceholder).toBeVisible({ timeout: 10000 });
    await expect(shop.postalCodePlaceholder).toBeVisible({ timeout: 5000 });
    await expect(shop.cityPlaceholder).toBeVisible({ timeout: 5000 });
    await expect(shop.typePlaceholder).toBeVisible({ timeout: 5000 });
});

test('Korisnik moze da pretrazuje shopove po statusu - Platinum', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.check(shop.platinumCheckbox)
    });
    const count = await shop.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shop.shopBadge.nth(i);
        await expect(card).toContainText(Constants.platinumStatus, { timeout: 10000 });
    }
});

test('Korisnik moze da pretrazuje shopove po statusu - Partner', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.check(shop.partnerCheckbox)
    });
    const count = await shop.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shop.shopBadge.nth(i);
        await expect(card).toContainText(Constants.partnerStatus, { timeout: 10000 });
    }
});

test('Korisnik moze da pretrazuje shopove po statusu - Gold', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.check(shop.goldCheckBox)
    });
    const count = await shop.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shop.shopBadge.nth(i);
        await expect(card).toContainText(Constants.goldStatus, { timeout: 10000 });
    }
});

test('Korisnik moze da pretrazuje shopove po statusu - Silver', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.check(shop.silverCheckbox)
    });
    const count = await shop.shopBadge.count();
    for (let i = 0; i < count; i++) {
        const card = shop.shopBadge.nth(i);
        await expect(card).toContainText(Constants.silverStatus, { timeout: 10000 });
    }
});

test('Kada nije nadjen nijedan rezultat prikaze se snack message', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.enterPostalCode(shop.postalCodeField, Constants.secondPhone);
    });
    await expect(shop.snackMessage).toContainText('No shops match the applied filters.', { timeout: 5000 });
});

test('Korisnik moze da otvori shop kada klikne na karticu', async ({ page }) => {
    const shop = new ShopPage(page);
    await page.locator('.v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 20000 });
    await waitForShopLoads(page, async () => {
        shop.card.first().click();
    });
    await expect(shop.leftArrowIcon).toBeVisible({ timeout: 10000 });
});