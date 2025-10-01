import { test as base, Page, BrowserContext, expect } from '@playwright/test';
import { ShopPage } from '../../page/shop/shopOvervirew.page';
import { Constants } from '../../helpers/constants';
import { EditAndWriteReview } from '../../page/shop/editAndWriteReview.page';
import { AddShopPage } from '../../page/shop/addShop.page';
import { ContactsPage } from '../../page/contacts/contactsOverview.page';
import { AddContactsPage } from '../../page/contacts/addContact.page';
import { generateRandomString } from '../../helpers/dateUtilis';
import { BoardsPage } from '../../page/Content/boards.page';
import { CompaniesPage } from '../../page/Content/companies.page';
import { DocumentPage } from '../../page/Content/documentModal.page';
import { InsertPermitBookPage } from '../../page/Content/uploadDocuments.page';
import { AddAndEditLoadModal } from '../../page/dispatchDashboard/addAndEditLoad.page';
import { TruckPage } from '../../page/truck/truck.page';
import { TrailersPage } from '../../page/trailer/trailer.page';
import { DriverOverviewPage } from '../../page/drivers/drriversOverview.page';
import { PermitBookPage } from '../../page/permitBook/permitBookOvervire.page';

export const test = base.extend<{
    loggedPage: Page;
    shopPage: ShopPage;
    reviewPage: EditAndWriteReview;
    addShopPage: AddShopPage;
    contactPage: ContactsPage;
    addContactPage: AddContactsPage;
    createdContact: { email: string };
    boardPage: BoardsPage;
    companiesPage: CompaniesPage;
    document: DocumentPage;
    uploadDocumentPage: InsertPermitBookPage;
    addLoadModal: AddAndEditLoadModal;
    companiesPageSetup: CompaniesPage;
    documentSetup: DocumentPage;
    uploadDocument: InsertPermitBookPage;
    truckPage: TruckPage;
    trailerPage: TrailersPage;
    permitBookPage: PermitBookPage;
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

    boardPage: async ({ loggedPage }, use) => {
        const board = new BoardsPage(loggedPage);
        await loggedPage.goto(Constants.boardsUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(board);
    },

    companiesPageSetup: async ({ loggedPage }, use) => {
        const companySetup = new CompaniesPage(loggedPage);
        await loggedPage.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(companySetup);
    },

    companiesPage: async ({ loggedPage }, use) => {
        const company = new CompaniesPage(loggedPage);
        await use(company);
    },

    document: async ({ loggedPage }, use) => {
        const document = new DocumentPage(loggedPage);
        await use(document);
    },

    documentSetup: async ({ loggedPage, companiesPage, uploadDocument }, use) => {
        const documentSetup = new DocumentPage(loggedPage);
        await loggedPage.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await companiesPage.clickElement(companiesPage.documentIcon.first());
        await documentSetup.deleteAllItemsWithDeleteIconForDrivers();
        await companiesPage.clickElement(companiesPage.uploadIcon.first());
        await uploadDocument.uploadDocument();
        await uploadDocument.selectPastExpiringDate();
        await uploadDocument.selectSubtypeFromMenu(uploadDocument.documentSubtypeField, uploadDocument.eldDocumentsSubtype);
        await loggedPage.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
        await uploadDocument.clickElement(uploadDocument.savePermitButton);
        await loggedPage.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
        await companiesPage.clickElement(companiesPage.documentIcon.first());
        await uploadDocument.loader.waitFor({ state: 'hidden', timeout: 10000 });
        await use(documentSetup);
    },

    uploadDocumentPage: async ({ loggedPage, document, companiesPage }, use) => {
        const upload = new InsertPermitBookPage(loggedPage);
        await loggedPage.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await companiesPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
        await companiesPage.clickElement(companiesPage.documentIcon.first());
        await document.deleteAllItemsWithDeleteIcon();
        await use(upload);
    },

    uploadDocument: async ({ loggedPage }, use) => {
        const uploadDocument = new InsertPermitBookPage(loggedPage);
        await use(uploadDocument);
    },

    addLoadModal: async ({ loggedPage }, use) => {
        const addLoad = new AddAndEditLoadModal(loggedPage);
        await use(addLoad);
    },

    truckPage: async ({ loggedPage }, use) => {
        const truck = new TruckPage(loggedPage);
        await use(truck);
    },

    trailerPage: async ({ loggedPage }, use) => {
        const trailer = new TrailersPage(loggedPage);
        await use(trailer);
    },

    permitBookPage: async ({ loggedPage }, use) => {
        const permitBook = new PermitBookPage(loggedPage);
        await use(permitBook);
    },

});