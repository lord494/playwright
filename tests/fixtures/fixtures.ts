import { test as base, Page, BrowserContext } from '@playwright/test';
import { ShopPage } from '../../page/shop/shopOvervirew.page';
import { Constants } from '../../helpers/constants';
import { EditAndWriteReview } from '../../page/shop/editAndWriteReview.page';
import { AddShopPage } from '../../page/shop/addShop.page';

type ShopDialogFixture = {
    shopPage: ShopPage;
    addShopPage: AddShopPage;
};

export const test = base.extend<{
    loggedPage: Page;
    shopPage: ShopPage;
    reviewPage: EditAndWriteReview;
    addShopPage: AddShopPage;
    shopWithDialog: ShopDialogFixture;

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

    shopWithDialog: async ({ loggedPage }, use: (pages: ShopDialogFixture) => Promise<void>) => {
        const shopPage = new ShopPage(loggedPage);
        const addShopPage = new AddShopPage(loggedPage);
        await loggedPage.goto(Constants.shopUrl, { waitUntil: 'networkidle' });
        await shopPage.addNewShopButton.click();
        await addShopPage.activeDialogbox.waitFor({ state: 'visible', timeout: 5000 });
        await use({ shopPage, addShopPage });
    }
});
