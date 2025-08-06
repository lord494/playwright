import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { ShopPage } from '../../page/shop/shopOvervirew.page';
import { waitForShopLoads } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.shopUrl, { waitUntil: 'networkidle', timeout: 20_000 });
})

test('Korisnik moze da izabere Truck opciju iz Franchise iz menija', async ({ page }) => {
    const shop = new ShopPage(page);
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
    await waitForShopLoads(page, async () => {
        shop.selectFranchise(shop.franchiseMenu, shop.trailerFranchise)
    });
    await expect(shop.shopCardFranchisePart.first()).toContainText(Constants.trailerFranchise, { timeout: 15000 });
    const allCard = await shop.shopCardFranchisePart.allTextContents();
    for (const cardText of allCard) {
        expect(cardText).toContain(Constants.trailerFranchise);
    }
});

test('Korisnik moze da izabere Parking opciju iz Franchise iz menija', async ({ page }) => {
    const shop = new ShopPage(page);
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
    await waitForShopLoads(page, async () => {
        shop.enterPostalCode(shop.postalCodeField, Constants.newYorkPostalCode)
    });
    await waitForShopLoads(page, async () => {
        shop.selectCity(shop.cityMenu, Constants.newYorkCity, shop.newYorkOption)
    });
    const allCard = await shop.shopCardLocationPart.allTextContents();
    await expect(shop.shopCardLocationPart.first()).toContainText('NJ' + Constants.newYorkPostalCode, { timeout: 15000 });
    for (const cardText of allCard) {
        expect(cardText).toContain('NJ ' + Constants.newYorkPostalCode);
    }
});