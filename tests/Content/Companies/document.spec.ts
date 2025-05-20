import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { CompaniesPage } from '../../../page/Content/companies.page';
import { InsertPermitBookPage } from '../../../page/Content/uploadDocuments.page';
import { DocumentPage } from '../../../page/Content/documentModal.page';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const company = new CompaniesPage(page);
    const document = new DocumentPage(page);
    await page.goto(Constants.truckUrl);
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').fill(Constants.truckName);
    await company.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await company.clickElement(company.documentIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.trailerUrl);
    await page.waitForLoadState('networkidle');
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').nth(6).fill(Constants.trailerTest);
    await page.waitForLoadState('networkidle');
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(2)', { hasText: Constants.trailerTest })
    });
    await targetRow.locator('.mdi-file-document-multiple').click();
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.permitBookUrl);
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').first().fill(Constants.testUser);
    await document.eyeIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await company.clickElement(document.eyeIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.companiesUrl);
    await company.clickElement(company.documentIcon.nth(1));
    await document.deleteAllItemsWithDeleteIcon();
});

test.beforeEach(async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const company = new CompaniesPage(page);
    const document = new DocumentPage(page);
    await page.goto(Constants.companiesUrl);
    await company.clickElement(company.documentIcon.first());
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await company.clickElement(company.uploadIcon.first());
    await upload.uploadDocument();
    await upload.selectPastExpiringDate();
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.eldDocumentsSubtype);
    await page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await upload.clickElement(upload.savePermitButton);
    await page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await company.clickElement(company.documentIcon.first());
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
});


test('Dokument moze da edituje status dokumenta u LessThan30', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectExpiringDateLessThan30Days();
    await upload.clickElement(upload.savePermitButton);
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(document.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.LessThan30StatusColor);
});

test('Dokument moze da edituje status dokumenta u valid', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectExpiringDateMoreThan30Days();
    await upload.clickElement(upload.savePermitButton);
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(document.statusColumn).toContainText(Constants.validStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.validStatusColor);
});

test('Korisnik moze da doda novi dokument', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await document.uploadNewDocument();
    const nameColumnInUpload = (await page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await upload.clickElement(upload.savePermitButton);
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(document.nameColumn).toContainText(textCompanyName);
});

test('Korisnik ne moze da doda dokument veci od 10mb', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await document.uploadDocumentOver10MB();
    await expect(upload.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Korisnik moze da promjeni subtype', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.iftaSubtype);
    await upload.clickElement(upload.savePermitButton);
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(document.subTypeColumn).toContainText(Constants.iftaSubtype);
});

test('Korisnik moze da otovori dokument na eye ikonicu', async ({ page }) => {
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.eyeIcon);
    await expect(document.titleInModal).toBeVisible();
    await expect(document.titleInModal).toContainText('Preview');
});

test('Korisnik moze da otovori QR code modal', async ({ page }) => {
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.qrCode);
    await expect(document.titleInModal).toBeVisible();
    await expect(document.titleInModal).toContainText('QR Code');
});

test('Dokument moze da se prebaci na Truck', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    const company = new CompaniesPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.truckType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    await upload.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await upload.enterTruckNumber(upload.documentReferrerMenu.last(), Constants.truckName, upload.truckNumberFromMenu);
    await page.waitForLoadState('networkidle');
    await upload.savePermitButton.click();
    await page.waitForLoadState('networkidle');
    await page.goto(Constants.truckUrl);
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').fill(Constants.truckName);
    await company.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await company.clickElement(company.documentIcon);
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn).toContainText(Constants.truckType);
    await expect(document.companyColumn).toContainText(Constants.truckName);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dokument moze da se prebaci na Trailer', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    const company = new CompaniesPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.trailerType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    await upload.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await upload.enterTruckNumber(upload.documentReferrerMenu.last(), Constants.trailerTest, upload.trailerNumberFromMenu);
    await page.waitForLoadState('networkidle');
    await upload.savePermitButton.click();
    await page.waitForLoadState('networkidle');
    await page.goto(Constants.trailerUrl);
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').nth(6).fill(Constants.trailerTest);
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(2)', { hasText: '118185' })
    });
    await targetRow.locator('.mdi-file-document-multiple').click();
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn).toContainText(Constants.trailerType);
    await expect(document.companyColumn).toContainText(Constants.trailerTest);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Korisnik moze da prebaci dokument na drugu firmu', async ({ page }) => {
    const company = new CompaniesPage(page);
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.page.mouse.click(10, 10);
    const companyText = (await company.companyNameColumn.nth(1).textContent())?.trim() || '';
    await company.clickElement(company.documentIcon.first());
    await company.clickElement(document.pencilIcon.first());
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    const option = page.getByRole('option', { name: companyText, exact: true });
    await upload.enterTruckNumber(upload.documentReferrerMenu.last(), companyText, option);
    await upload.savePermitButton.click();
    await upload.loader.waitFor({ state: "hidden" });
    await page.locator('.v-data-table__empty-wrapper').waitFor({ state: 'visible', timeout: 10000 });
    await page.mouse.click(150, 140);
    await company.documentIcon.nth(1).click();
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn).toContainText(Constants.companyType);
    await expect(document.companyColumn).toContainText(companyText);
    await expect(document.subTypeColumn).toContainText(Constants.eldDocuments);
});

test('Korisnik moze da prebaci dokument vozaca', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    const company = new CompaniesPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.driverType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.othersSubtype);
    await upload.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await upload.enterTruckNumber(upload.documentReferrerMenu.last(), Constants.trailerTest, upload.driverOption);
    await page.waitForLoadState('networkidle');
    await upload.savePermitButton.click();
    await page.waitForLoadState('networkidle');
    await page.goto(Constants.permitBookUrl);
    await page.locator('.v-text-field__slot').first().click();
    await page.locator('.v-text-field__slot').first().type(Constants.testUser);
    await upload.loader.waitFor({ state: 'hidden', timeout: 5000 });
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(3)', { hasText: Constants.testUser })
    });
    await targetRow.locator('.mdi-eye').click();
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn).toContainText(Constants.driverType);
    await expect(document.companyColumn).toContainText(Constants.trailerTest);
    await expect(document.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Document subtype polje je obavezno kada korisnik mijenja type', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.trailerType);
    await upload.savePermitButton.click();
    await expect(page.locator('.v-input.v-input--has-state.theme--light')).toContainText('Value is required');
});

test('Document referrer polje je obavezno kada korisnik mijenja type', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new DocumentPage(page);
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.trailerType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    await upload.savePermitButton.click();
    await expect(page.locator('text=Value is required').first()).toBeVisible();
});
