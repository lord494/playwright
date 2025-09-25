import { test as base, Page, BrowserContext, expect } from '@playwright/test';
import { ShopPage } from '../../page/shop/shopOvervirew.page';
import { Constants } from '../../helpers/constants';
import { EditAndWriteReview } from '../../page/shop/editAndWriteReview.page';
import { AddShopPage } from '../../page/shop/addShop.page';
import { ContactsPage } from '../../page/contacts/contactsOverview.page';
import { AddContactsPage } from '../../page/contacts/addContact.page';
import { generateRandomString } from '../../helpers/dateUtilis';

export const test = base.extend<{
    loggedPage: Page;
    shopPage: ShopPage;
    reviewPage: EditAndWriteReview;
    addShopPage: AddShopPage;
    contactPage: ContactsPage;
    addContactPage: AddContactsPage;
    createdContact: { email: string };

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
    },

    contactPage: async ({ loggedPage }, use) => {
        const contact = new ContactsPage(loggedPage);
        await loggedPage.goto(Constants.contactsUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(contact);
    },

    addContactPage: async ({ loggedPage }, use) => {
        const addContact = new AddContactsPage(loggedPage);
        await use(addContact);
    },
    createdContact: async ({ contactPage, addContactPage }, use) => {
        const email = generateRandomString(8) + '@example.com';
        await contactPage.addContactButton.click();
        await addContactPage.enterName(addContactPage.nameField, Constants.driverName);
        await addContactPage.enterFloydExt(addContactPage.floydExtField, Constants.extField);
        await addContactPage.enterTrytimeExt(addContactPage.trytimeExtField, Constants.extSecond);
        await addContactPage.enterRocketExt(addContactPage.rocketExtField, Constants.extThird);
        await addContactPage.enterJordanExt(addContactPage.jordanExtField, Constants.extFourth);
        await addContactPage.enterPhoneNumber(addContactPage.phoneNumberField, Constants.phoneNumberOfUserApp);
        await addContactPage.enterEmail(addContactPage.emailField, email);
        await addContactPage.enterCompany(addContactPage.companyField, Constants.testCompany);
        await addContactPage.enterPosition(addContactPage.positionField, Constants.newRole);
        await addContactPage.selectAssistant(addContactPage.assistantField, Constants.boskoQA, addContactPage.assistantOption);
        await addContactPage.isCheckedFC();
        const [response] = await Promise.all([
            contactPage.page.waitForResponse(res => res.url().includes('/api/contacts')),
            addContactPage.clickElement(addContactPage.addButton),
        ]);
        expect([200, 304]).toContain(response.status());
        await contactPage.searchContact(contactPage.searchField, email);
        await use({ email });
    },
});