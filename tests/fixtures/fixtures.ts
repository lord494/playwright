import { test as base, Page, BrowserContext, expect } from '@playwright/test';
import { ShopPage } from '../../page/shop/shopOvervirew.page';
import { Constants } from '../../helpers/constants';
import { EditAndWriteReview } from '../../page/shop/editAndWriteReview.page';
import { AddShopPage } from '../../page/shop/addShop.page';
import { ContactsPage } from '../../page/contacts/contactsOverview.page';
import { AddContactsPage } from '../../page/contacts/addContact.page';
import { generateRandomString, get6RandomNumber, waitForPrebookLoads } from '../../helpers/dateUtilis';
import { BoardsPage } from '../../page/Content/boards.page';
import { CompaniesPage } from '../../page/Content/companies.page';
import { DocumentPage } from '../../page/Content/documentModal.page';
import { InsertPermitBookPage } from '../../page/Content/uploadDocuments.page';
import { AddAndEditLoadModal } from '../../page/dispatchDashboard/addAndEditLoad.page';
import { TruckPage } from '../../page/truck/truck.page';
import { TrailersPage } from '../../page/trailer/trailer.page';
import { PermitBookPage } from '../../page/permitBook/permitBookOvervire.page';
import { DealershipPage } from '../../page/dealership/dealership.page';
import { AddDealership } from '../../page/dealership/addDealership.page';
import { DispatchDashboardOverview } from '../../page/dispatchDashboard/dispatchDashboardOverview.page';
import { EditDriver } from '../../page/dispatchDashboard/editDriver.page';
import { DispatchInfoPage } from '../../page/dispatchInfo/dispatcInfo.page';
import { DriverOverviewPage } from '../../page/drivers/drriversOverview.page';
import { DotInspectionsPage } from '../../page/eld/dotInspections.page';
import { EldTypesPage } from '../../page/eld/eldTypes.page';
import { EldShiftsPage } from '../../page/eld/shifts.page';
import { EldDashboardPage } from '../../page/eldDashboard/eldDashboard.page';
import { InactiveDriverPage } from '../../page/inactiveDrivers/inactiveDriversOverview.page';
import { EditInactiveDriver } from '../../page/inactiveDrivers/editInactiveDriver.page';
import { TrailerDocumentPage } from '../../page/trailer/trailerDocument.page';
import { InsertPage } from '../../page/insertPermitBook/insertPermitBook.page';
import { MessagePage } from '../../page/messages/messages.page';
import { AddMessagePage } from '../../page/messages/addMessage.page';
import { OwnersPage } from '../../page/owner/ownerOverview.page';
import { AddOwner } from '../../page/owner/addOwner.page';
import { PostLoadsPage } from '../../page/preBook/postLoads.page';
import { AddEditPostLoadPage } from '../../page/preBook/addEditPostLoad.page';
import { CompaniesPrebookPage } from '../../page/preBook/companiesPrebook.page';
import { PostTrucksPage } from '../../page/preBook/postTrucks.page';
import { RecrutimentPage } from '../../page/recruitment/recruitmentOverview.page';
import { AddNewEmployeePage } from '../../page/recruitment/addNewEmployee.page';
import { InviteAddEditModalPage } from '../../page/userManagement/users/inviteAddEditUser.page';
import { UsersPage } from '../../page/userManagement/users/users.page';

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
    delaershipPageSetup: DealershipPage;
    addDealership: AddDealership;
    dispatchDashboardSetup: DispatchDashboardOverview;
    dispatcDashboard: DispatchDashboardOverview;
    editDriverDIspatchDashboardSetup: DispatchDashboardOverview;
    editDrive: EditDriver;
    addLoadSetup: AddAndEditLoadModal;
    editLoadSetup: AddAndEditLoadModal;
    dispatchInfo: DispatchInfoPage;
    driverOverviewSetup: DriverOverviewPage;
    driverOverview: DriverOverviewPage;
    addDriverSetup: EditDriver;
    editDriverSetup: EditDriver;
    dotInspection: DotInspectionsPage;
    eldTypes: EldTypesPage;
    eldShiftsPage: EldShiftsPage;
    eldDashboard: EldDashboardPage;
    inactiveDriverSetup: InactiveDriverPage;
    inactiveDriver: InactiveDriverPage;
    addInactiveDriverSetup: EditDriver;
    editInactiveDriverSetup: EditInactiveDriver;
    insertPermit: InsertPage;
    trailerDocument: TrailerDocumentPage;
    cleanupSetup: Page;
    messagesPage: MessagePage;
    addMessage: AddMessagePage;
    ownerStup: OwnersPage;
    addOwner: AddOwner;
    postLoad: PostLoadsPage;
    addPostLoadSetup: AddEditPostLoadPage;
    cleanupSetupPostLoad: Page;
    addPostLoad: AddEditPostLoadPage;
    postLoadSetup: PostLoadsPage;
    editPostLoadSetup: AddEditPostLoadPage;
    companiesPreBookSetup: CompaniesPrebookPage;
    cleanupSetupAddPostTruck: PostTrucksPage;
    addPostTruckSetup: PostTrucksPage;
    recruitmentOverviewSetup: RecrutimentPage;
    addNewEmployee: AddNewEmployeePage;
    inviteAddEditModal: InviteAddEditModalPage;
    user: UsersPage;
    addEmployeeSetup: AddNewEmployeePage;
    recruitmentOverview: RecrutimentPage;

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

    delaershipPageSetup: async ({ loggedPage }, use) => {
        const delaership = new DealershipPage(loggedPage);
        await loggedPage.goto(Constants.dealersshipUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await delaership.addDealership.click();
        await use(delaership);
    },

    addDealership: async ({ loggedPage }, use) => {
        const addDealership = new AddDealership(loggedPage);
        await use(addDealership);
    },

    dispatchDashboardSetup: async ({ loggedPage }, use) => {
        const dispatch = new DispatchDashboardOverview(loggedPage);
        await loggedPage.goto(Constants.dashboardUrl, { waitUntil: 'networkidle', timeout: 15000 });
        await use(dispatch);
    },

    dispatcDashboard: async ({ loggedPage }, use) => {
        const dispatchDashboard = new DispatchDashboardOverview(loggedPage);
        await use(dispatchDashboard);
    },

    addLoadSetup: async ({ loggedPage, dispatcDashboard }, use) => {
        const addLoad = new AddAndEditLoadModal(loggedPage);
        await loggedPage.goto(Constants.dashboardUrl, { waitUntil: 'networkidle', timeout: 15000 });
        await loggedPage.waitForLoadState('networkidle');
        await dispatcDashboard.loadColumn.first().waitFor({ state: 'visible', timeout: 10000 });
        await dispatcDashboard.fillInputField(dispatcDashboard.nameSearchInput, Constants.driverName);
        const nameText = dispatcDashboard.driverNameColumn.filter({ hasText: Constants.driverName });
        await nameText.waitFor({ state: 'visible', timeout: 5000 });
        const text = await dispatcDashboard.loadColumn.first().textContent();
        dispatcDashboard.page.on('dialog', async (dialog: { accept: () => any; }) => {
            await dialog.accept();
        });
        if (text && text.trim() !== '') {
            await dispatcDashboard.loadColumn.first().click({ button: "right" });
            await addLoad.deleteLoadButton.click();
            await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
            await expect(dispatcDashboard.loadColumn.first()).toHaveText('');
        }
        await dispatcDashboard.loadColumn.first().click({ button: "right" });
        await use(addLoad);
    },

    editLoadSetup: async ({ loggedPage, dispatcDashboard }, use) => {
        const editLoad = new AddAndEditLoadModal(loggedPage);
        await loggedPage.goto(Constants.dashboardUrl, { waitUntil: 'networkidle', timeout: 15000 });
        const [response] = await Promise.all([
            dispatcDashboard.page.waitForResponse(resp =>
                resp.url().includes('/api/drivers/dashboard') &&
                (resp.status() === 200 || resp.status() === 304)
            ),
            await dispatcDashboard.fillInputField(dispatcDashboard.nameSearchInput, Constants.driverName)
        ]);
        const text = await dispatcDashboard.loadColumn.first().textContent();
        dispatcDashboard.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        if (!text || text.trim() === '') {
            await dispatcDashboard.loadColumn.first().click({ button: "right" });
            await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
            await editLoad.page.waitForLoadState("networkidle");
            await editLoad.saveButton.click();
            await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
            await expect(dispatcDashboard.loadColumn.first()).toContainText(Constants.deliveryCity);
        };
        await dispatcDashboard.loadColumn.first().click({ button: 'right' });
        await use(editLoad);
    },

    editDriverDIspatchDashboardSetup: async ({ loggedPage }, use) => {
        const editDriver = new DispatchDashboardOverview(loggedPage);
        await loggedPage.goto(Constants.dashboardUrl, { waitUntil: 'networkidle', timeout: 15000 });
        await editDriver.driveNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
        const [response] = await Promise.all([
            editDriver.page.waitForResponse(resp =>
                resp.url().includes('/api/drivers/dashboard') &&
                (resp.status() === 200 || resp.status() === 304)
            ),
            editDriver.fillInputField(editDriver.nameSearchInput, Constants.driverName)
        ]);
        await editDriver.driveNameColumn.first().click({ button: "right" });
        await use(editDriver);
    },

    editDrive: async ({ loggedPage }, use) => {
        const editDriver = new EditDriver(loggedPage);
        await use(editDriver);
    },

    dispatchInfo: async ({ loggedPage }, use) => {
        const dispatchInfo = new DispatchInfoPage(loggedPage);
        await loggedPage.goto(Constants.dispatchInfoUrl, { waitUntil: 'networkidle', timeout: 15000 });
        await use(dispatchInfo);
    },

    driverOverviewSetup: async ({ loggedPage }, use) => {
        const driver = new DriverOverviewPage(loggedPage);
        await loggedPage.goto(Constants.driverUrl, { waitUntil: 'networkidle', timeout: 15000 });
        await use(driver);
    },

    driverOverview: async ({ loggedPage }, use) => {
        const driverOverview = new DriverOverviewPage(loggedPage);
        await use(driverOverview);
    },

    addDriverSetup: async ({ loggedPage, driverOverview }, use) => {
        const addDriver = new EditDriver(loggedPage);
        await loggedPage.goto(Constants.driverUrl, { waitUntil: 'networkidle', timeout: 20000 })
        await driverOverview.driverNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
        await driverOverview.addDriverButton.click();
        await use(addDriver);
    },

    editDriverSetup: async ({ loggedPage, driverOverview }, use) => {
        const editDriver = new EditDriver(loggedPage);
        await loggedPage.goto(Constants.driverUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await driverOverview.driverNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
        const [response] = await Promise.all([
            driverOverview.page.waitForResponse(res =>
                res.url().includes('/api/drivers')
            ),
            await driverOverview.enterDriverNameInSearchField(driverOverview.searchInputField, Constants.markLabatDriver)
        ]);
        const driverName = driverOverview.page.locator('tr', {
            has: driverOverview.page.locator('td:nth-child(1)', { hasText: 'Mark Labat' })
        });
        await driverName.first().waitFor({ state: 'visible', timeout: 10000 });
        await driverOverview.pencilIcon.first().click();
        await use(editDriver);
    },

    dotInspection: async ({ loggedPage }, use) => {
        const dotInspection = new DotInspectionsPage(loggedPage);
        await loggedPage.goto(Constants.dotInspectionUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(dotInspection);
    },

    eldTypes: async ({ loggedPage }, use) => {
        const eldTypes = new EldTypesPage(loggedPage);
        await loggedPage.goto(Constants.eldTypesUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await eldTypes.typeColumn.first().waitFor({ state: 'visible', timeout: 10000 });
        await use(eldTypes);
    },

    eldShiftsPage: async ({ loggedPage }, use) => {
        const eldShift = new EldShiftsPage(loggedPage);
        await loggedPage.goto(Constants.eldShifts, { waitUntil: 'networkidle', timeout: 20000 });
        await eldShift.removeUserFromShift(Constants.eldPlaywright);
        await use(eldShift);
    },

    eldDashboard: async ({ loggedPage }, use) => {
        const eldDashboard = new EldDashboardPage(loggedPage);
        await loggedPage.goto(Constants.eldDashboardUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(eldDashboard);
    },

    inactiveDriverSetup: async ({ loggedPage }, use) => {
        const inactiveDriver = new InactiveDriverPage(loggedPage);
        await loggedPage.goto(Constants.inactiveDriveUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(inactiveDriver);
    },

    inactiveDriver: async ({ loggedPage }, use) => {
        const inactiveDriver = new InactiveDriverPage(loggedPage);
        await use(inactiveDriver);
    },

    addInactiveDriverSetup: async ({ loggedPage, driverOverview }, use) => {
        const addInactiveDriver = new EditDriver(loggedPage);
        await loggedPage.goto(Constants.inactiveDriveUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await driverOverview.driverNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
        await driverOverview.addDriverButton.click();
        await use(addInactiveDriver);
    },

    editInactiveDriverSetup: async ({ loggedPage, driverOverview }, use) => {
        const editInactiveDriverSetup = new EditInactiveDriver(loggedPage);
        await loggedPage.goto(Constants.inactiveDriveUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await driverOverview.driverNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
        const [response] = await Promise.all([
            loggedPage.waitForResponse(res =>
                res.url().includes('/api/drivers')
            ),
            await driverOverview.enterDriverNameInSearchField(driverOverview.searchInputField, Constants.johnsonDriver)
        ]);
        await driverOverview.pencilIcon.first().click();
        await use(editInactiveDriverSetup);
    },

    insertPermit: async ({ loggedPage, driverOverview }, use) => {
        const insertPermit = new InsertPage(loggedPage);
        await loggedPage.goto(Constants.permitBookUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(insertPermit);
    },

    trailerDocument: async ({ loggedPage }, use) => {
        const trailerDocument = new TrailerDocumentPage(loggedPage);
        await use(trailerDocument);
    },

    cleanupSetup: async ({ loggedPage, trailerPage, trailerDocument }, use) => {
        await loggedPage.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
        await trailerPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
        await loggedPage.locator('.v-text-field input').fill(Constants.truckName);
        await trailerPage.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
        await trailerPage.clickElement(trailerPage.documentIcon);
        await loggedPage.waitForLoadState('networkidle');
        await trailerDocument.deleteAllItemsWithDeleteIconForDrivers();
        await loggedPage.goto(Constants.trailerUrl, { waitUntil: 'networkidle' });
        await trailerPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
        await loggedPage.locator('.v-text-field input').nth(6).fill(Constants.trailerTest);
        const targetRow = loggedPage.locator('tr', {
            has: loggedPage.locator('td:nth-child(2)', { hasText: Constants.trailerTest }),
        });
        await targetRow.locator('.mdi-file-document-multiple').click();
        await loggedPage.waitForLoadState('networkidle');
        await trailerDocument.deleteAllItemsWithDeleteIconForDrivers();
        await loggedPage.goto(Constants.permitBookUrl, { waitUntil: 'networkidle' });
        await trailerDocument.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
        await loggedPage.locator('.v-text-field input').first().fill(Constants.testUser);
        await trailerDocument.eyeIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
        await trailerPage.clickElement(trailerDocument.eyeIcon);
        await loggedPage.waitForLoadState('networkidle');
        await trailerDocument.deleteAllItemsWithDeleteIconForDrivers();
        await loggedPage.goto(Constants.companiesUrl, { waitUntil: 'networkidle' });
        await trailerPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
        await trailerPage.clickElement(trailerPage.documentIcon.first());
        await trailerDocument.deleteAllItemsWithDeleteIcon();
        await use(loggedPage);
    },

    messagesPage: async ({ loggedPage }, use) => {
        const message = new MessagePage(loggedPage);
        await loggedPage.goto(Constants.messageUrl, { waitUntil: 'networkidle' });
        await message.addMessageButton.click();
        await use(message);
    },

    addMessage: async ({ loggedPage }, use) => {
        const addMessage = new AddMessagePage(loggedPage);
        await use(addMessage);
    },

    ownerStup: async ({ loggedPage }, use) => {
        const owner = new OwnersPage(loggedPage);
        await loggedPage.goto(Constants.ownerUrl, { waitUntil: 'networkidle' });
        await owner.addOwnerButton.click();
        await use(owner);
    },

    addOwner: async ({ loggedPage }, use) => {
        const addOwner = new AddOwner(loggedPage);
        await use(addOwner);
    },

    postLoad: async ({ loggedPage }, use) => {
        const postLoad = new PostLoadsPage(loggedPage);
        await use(postLoad);
    },

    addPostLoadSetup: async ({ loggedPage }, use) => {
        const addPostLoad = new AddEditPostLoadPage(loggedPage);
        await loggedPage.goto(Constants.postLoadPrebookUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(addPostLoad);
    },

    addPostLoad: async ({ loggedPage }, use) => {
        const addPostLoad = new AddEditPostLoadPage(loggedPage);
        await use(addPostLoad);
    },

    cleanupSetupPostLoad: async ({ loggedPage, addPostLoad, postLoad }, use) => {
        const loadId = generateRandomString();
        await loggedPage.goto(Constants.postLoadPrebookUrl);
        await loggedPage.waitForLoadState('networkidle');
        await postLoad.newLoadButton.click();
        await addPostLoad.saveButton.last().waitFor({ state: 'visible', timeout: 5000 });
        await addPostLoad.enterLoadId(addPostLoad.loadId, loadId);
        await addPostLoad.selectOrigin(addPostLoad.originMenu, Constants.miamiOriginCity, addPostLoad.miamiOption);
        await addPostLoad.selecDestination(addPostLoad.destinatinMenu, Constants.newYorkCity, addPostLoad.newYorkOption);
        await addPostLoad.selectTodayDate(addPostLoad.pickupDateField, loggedPage.getByRole('button', { name: '20', exact: true }).locator('div').first());
        await addPostLoad.page.locator('.v-picker__body').waitFor({ state: 'hidden', timeout: 5000 });
        await addPostLoad.selectTodayDate(addPostLoad.deliveryDateField, loggedPage.getByRole('button', { name: '22', exact: true }).locator('div').last());
        await addPostLoad.selectTime(addPostLoad.pickupTimeField, addPostLoad.hours, addPostLoad.minutes);
        await addPostLoad.selectTime(addPostLoad.toPickupTimeField, addPostLoad.secondHours, addPostLoad.secondMinutes);
        await addPostLoad.selectTime(addPostLoad.deliveryTimeField, addPostLoad.secondHours, addPostLoad.secondMinutes);
        await addPostLoad.selectTime(addPostLoad.toDilevryTimeField, addPostLoad.hours, addPostLoad.minutes);
        await addPostLoad.selectCompany(addPostLoad.companyField, addPostLoad.editTestCompanyOption);
        await addPostLoad.enterBrokerName(addPostLoad.brokerNameField, Constants.appTestUser);
        await addPostLoad.enterBrokerEmail(addPostLoad.brokerEmailField, Constants.fndPlaywrightEmail);
        await addPostLoad.enterBrokerPhone(addPostLoad.brokerPhoneField, Constants.secondPhone);
        await addPostLoad.selectTrailerType(addPostLoad.trailerTypeMenu, addPostLoad.trailerTypeOption);
        await addPostLoad.enterWeight(addPostLoad.weightField, Constants.weight);
        await addPostLoad.enterRate(addPostLoad.rateField, Constants.amount);
        await addPostLoad.enterSyggestedRate(addPostLoad.suggestedRateField, Constants.suggestedRate);
        await addPostLoad.check(addPostLoad.dedicaterCheckbox);
        await addPostLoad.enterNote(addPostLoad.noteField, Constants.noteSecond);
        await waitForPrebookLoads(loggedPage, async () => {
            await addPostLoad.saveButton.last().click();
        });
        await addPostLoad.addEditDialogbox.waitFor({ state: 'detached', timeout: 5000 });
        await loggedPage.waitForLoadState('networkidle');
        await use(loggedPage)
    },

    postLoadSetup: async ({ loggedPage }, use) => {
        const postLoad = new PostLoadsPage(loggedPage);
        await loggedPage.goto(Constants.postLoadPrebookUrl);
        await loggedPage.waitForLoadState('networkidle');
        await waitForPrebookLoads(loggedPage, async () => {
            postLoad.xButtonInField.nth(1).click()
        });
        await waitForPrebookLoads(loggedPage, async () => {
            loggedPage.locator('.v-input__control').nth(7).locator('input').fill('0')
        });
        await waitForPrebookLoads(loggedPage, async () => {
            postLoad.xButtonInField.nth(2).click()
        });
        await waitForPrebookLoads(loggedPage, async () => {
            loggedPage.locator('.v-input__control').nth(8).locator('input').fill('0')
        });
        await loggedPage.waitForLoadState('networkidle');
        await use(postLoad);
    },

    editPostLoadSetup: async ({ loggedPage, postLoad }, use) => {
        const editPostLoad = new AddEditPostLoadPage(loggedPage);
        const loadId = generateRandomString();
        await loggedPage.goto(Constants.postLoadPrebookUrl);
        await loggedPage.waitForLoadState('networkidle');
        await postLoad.newLoadButton.click();
        await editPostLoad.saveButton.waitFor({ state: 'visible', timeout: 5000 });
        await editPostLoad.enterLoadId(editPostLoad.loadId, loadId);
        await editPostLoad.selectOrigin(editPostLoad.originMenu, Constants.deliveryCity, editPostLoad.originOption);
        await editPostLoad.selecDestination(editPostLoad.destinatinMenu, Constants.seconDeliveryCity, editPostLoad.destinationOption);
        await editPostLoad.selectTodayDate(editPostLoad.pickupDateField, editPostLoad.todayDate);
        await editPostLoad.selectTodayDate(editPostLoad.deliveryDateField, editPostLoad.todayDate.last());
        await editPostLoad.selectCompany(editPostLoad.companyField, editPostLoad.companyOption);
        await editPostLoad.enterBrokerName(editPostLoad.brokerNameField, Constants.playWrightUser);
        await editPostLoad.enterBrokerEmail(editPostLoad.brokerEmailField, Constants.testEmail);
        await editPostLoad.enterBrokerPhone(editPostLoad.brokerPhoneField, Constants.phoneNumberOfUserApp);
        await editPostLoad.enterWeight(editPostLoad.weightField, Constants.weight);
        await editPostLoad.enterRate(editPostLoad.rateField, Constants.amount);
        await editPostLoad.enterSyggestedRate(editPostLoad.suggestedRateField, Constants.suggestedRate);
        await editPostLoad.check(editPostLoad.dedicaterCheckbox);
        await editPostLoad.enterNote(editPostLoad.noteField, Constants.noteFirst);
        await editPostLoad.saveButton.click();
        await editPostLoad.addEditDialogbox.waitFor({ state: 'detached', timeout: 5000 });
        await loggedPage.waitForLoadState('networkidle');
        await postLoad.loadIdSearchInputField.click();
        await loggedPage.waitForTimeout(100);
        for (const char of loadId) {
            await postLoad.loadIdSearchInputField.type(char);
            await loggedPage.waitForTimeout(300);
            await postLoad.loadIdSearchInputField.click();
        }
        const truckCell = loggedPage.locator(`tr:nth-child(1) td:nth-child(1):has-text("${loadId}")`);
        await truckCell.waitFor({ state: 'visible', timeout: 10000 });
        await expect(postLoad.loadIdColumn.first()).toContainText(loadId);
        await use(editPostLoad);
    },

    companiesPreBookSetup: async ({ loggedPage }, use) => {
        const companiesPrebook = new CompaniesPrebookPage(loggedPage);
        await loggedPage.goto(Constants.companiesPrebookUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(companiesPrebook);
    },

    addPostTruckSetup: async ({ loggedPage }, use) => {
        const addPostTruck = new PostTrucksPage(loggedPage);
        await loggedPage.goto(Constants.postTruckPrebookUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(addPostTruck);
    },

    cleanupSetupAddPostTruck: async ({ loggedPage, addPostTruckSetup }, use) => {
        await addPostTruckSetup.addCompnayIcon.waitFor({ state: 'visible', timeout: 10000 });
        await addPostTruckSetup.addCompnayIcon.click();
        await addPostTruckSetup.selectAvail(addPostTruckSetup.availField, addPostTruckSetup.todayDateInDatepicker);
        await addPostTruckSetup.selectOrigin(addPostTruckSetup.originField, Constants.deliveryCity, addPostTruckSetup.originOption);
        await addPostTruckSetup.selecDestination(addPostTruckSetup.destinatinField, Constants.seconDeliveryCity, addPostTruckSetup.destinationOption);
        await addPostTruckSetup.selectTrailerType(addPostTruckSetup.trailerTypeField, addPostTruckSetup.trailerTypeOption);
        await addPostTruckSetup.fillNote(addPostTruckSetup.noteField, Constants.noteFirst);
        await addPostTruckSetup.saveButton.click();
        await addPostTruckSetup.dialogbox.waitFor({ state: 'detached', timeout: 5000 });
        await loggedPage.waitForLoadState('networkidle');
        await loggedPage.goto(Constants.postTruckPrebookUrl, { waitUntil: 'networkidle', timeout: 10000 });
        await expect(addPostTruckSetup.originColumn.first()).toContainText(Constants.deliveryCity);
        await expect(addPostTruckSetup.destinationColumn.first()).toContainText(Constants.seconDeliveryCity);
        await expect(addPostTruckSetup.trailerTypeColumn.first()).toContainText('R');
        await expect(addPostTruckSetup.noteColumn.first()).toContainText(Constants.noteFirst);
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        await expect(addPostTruckSetup.availColumn.first()).toContainText(formattedDate);
        await use(addPostTruckSetup)
    },

    recruitmentOverviewSetup: async ({ loggedPage }, use) => {
        const recruitmentOverview = new RecrutimentPage(loggedPage);
        await loggedPage.goto(Constants.recruitmentUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await use(recruitmentOverview);
    },

    addNewEmployee: async ({ loggedPage }, use) => {
        const addNewEmployee = new AddNewEmployeePage(loggedPage);
        await use(addNewEmployee);
    },

    inviteAddEditModal: async ({ loggedPage }, use) => {
        const inviteAddEditModal = new InviteAddEditModalPage(loggedPage);
        await use(inviteAddEditModal);
    },

    user: async ({ loggedPage }, use) => {
        const user = new UsersPage(loggedPage);
        await use(user);
    },

    addEmployeeSetup: async ({ loggedPage }, use) => {
        const addEmployeeSetup = new AddNewEmployeePage(loggedPage);
        await loggedPage.goto(Constants.recruitmentUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await addEmployeeSetup.addNewEmployeeButton.click();
        await use(addEmployeeSetup);
    },

    recruitmentOverview: async ({ loggedPage }, use) => {
        const recruitmentOverview = new RecrutimentPage(loggedPage);
        await use(recruitmentOverview);
    },

});