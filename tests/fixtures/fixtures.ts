import { test as base, Page, BrowserContext } from '@playwright/test';
import { ShopPage } from '../../page/shop/shopOvervirew.page';
import { Constants } from '../../helpers/constants';
import { EditAndWriteReview } from '../../page/shop/editAndWriteReview.page';
import { AddShopPage } from '../../page/shop/addShop.page';

export const test = base.extend<{
    loggedPage: Page;
    shopPage: ShopPage;
    reviewPage: EditAndWriteReview;
    addShopPage: AddShopPage;

}>({
    loggedPage: async ({ browser }, use) => {
        const context: BrowserContext = await browser.newContext({ storageState: 'auth.json' });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },

    shopPage: async ({ loggedPage }, use) => {
        const shop = new ShopPage(loggedPage);
        await loggedPage.goto(Constants.shopUrl, { waitUntil: 'networkidle' });
        await use(shop);
    },

    reviewPage: async ({ loggedPage }, use) => {
        const review = new EditAndWriteReview(loggedPage);
        await loggedPage.goto(Constants.shopUrl, { waitUntil: 'networkidle', timeout: 20_000 });
        await review.shopCard.first().click();
        await review.editShopButton.waitFor({ state: 'visible', timeout: 10000 });
        await use(review);
    },

    addShopPage: async ({ loggedPage }, use) => {
        const addShop = new AddShopPage(loggedPage);
        await loggedPage.goto(Constants.shopUrl, { waitUntil: 'networkidle', timeout: 20_000 });
        await addShop.addNewShopButton.click();
        await addShop.franchiseMenu.waitFor({ state: 'visible', timeout: 10000 });
        await use(addShop);
    }
});