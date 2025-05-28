import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailersPage } from '../../page/trailer/trailer.page';
import { TrailerDocumentPage } from '../../page/trailer/trailerDocument.page';
import { TrailerInsertPermitBookPage } from '../../page/trailer/trailerInsertPermitBook.page';
import { InsertPermitBookPage } from '../../page/Content/uploadDocuments.page';
import { CompaniesPage } from '../../page/Content/companies.page';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    await page.goto(Constants.truckUrl);
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').fill(Constants.truckName);
    await trailer.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await trailer.clickElement(trailer.documentIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.trailerUrl);
    await page.waitForLoadState('networkidle');
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
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
    await trailer.clickElement(document.eyeIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.companiesUrl);
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailer.clickElement(trailer.documentIcon.first());
    await document.deleteAllItemsWithDeleteIcon();
});

test.beforeEach(async ({ page }) => {
    const upload = new TrailerInsertPermitBookPage(page);
    const trailer = new TrailersPage(page);
    const document2 = new TrailerDocumentPage(page);
    await page.goto(Constants.trailerUrl);
    await trailer.clickElement(trailer.documentIcon.first());
    await document2.deleteAllItemsWithDeleteIconForDrivers();
    await trailer.clickElement(trailer.uploadIcon.first());
    await page.waitForFunction(() => {
        const el = document.querySelector('.v-dialog.v-dialog--active');
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width === 500
    }, { timeout: 10000 });
    await upload.uploadDocument();
    await page.getByRole('textbox', { name: 'Document name' }).isEnabled({ timeout: 10000 });
    await upload.selectPastExpiringDate();
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    await page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await upload.clickElement(upload.savePermitButton);
    await page.reload();
    await page.waitForLoadState('networkidle');
});


test('Dokument moze da edituje status dokumenta u LessThan30', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectExpiringDateLessThan30Days();
    await page.waitForLoadState('networkidle');
    await upload.clickElement(upload.savePermitButton);
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await expect(document.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.LessThan30StatusColor);
});

test('Dokument moze da edituje status dokumenta u valid', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
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
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
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
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await document.uploadDocumentOver10MB();
    await expect(upload.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Korisnik moze da promjeni subtype', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await document.clickElement(document.pencilIcon);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.othersSubtype);
    await upload.clickElement(upload.savePermitButton);
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(document.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Korisnik moze da otovori dokument na eye ikonicu', async ({ page }) => {
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await document.clickElement(document.eyeIcon);
    await expect(document.titleInModal).toBeVisible();
    await expect(document.titleInModal).toContainText('Preview');
});

test('Korisnik moze da otovori QR code modal', async ({ page }) => {
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await document.clickElement(document.qrCode);
    await expect(document.titleInModal).toBeVisible();
    await expect(document.titleInModal).toContainText('QR Code');
});

test('Dokument moze da se prebaci na Truck', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
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
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').fill(Constants.truckName);
    await trailer.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await trailer.clickElement(trailer.documentIcon);
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn).toContainText(Constants.truckType);
    await expect(document.companyColumn).toContainText(Constants.truckName);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dokument moze da se prebaci na Company', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    const compnay = new CompaniesPage(page);
    await page.goto(Constants.companiesUrl);
    await compnay.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const firtsCompanyName = (await compnay.companyNameColumn.first().allInnerTexts()).toString();
    const firstComapnyOption = page.getByRole('option', { name: firtsCompanyName, exact: true });
    await page.goto(Constants.trailerUrl);
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailer.documentIcon.first().click();
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.companyType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.iftaSubtype);
    await upload.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await upload.enterTruckNumber(upload.documentReferrerMenu.last(), firtsCompanyName, firstComapnyOption);
    await upload.savePermitButton.click();
    await upload.loader.waitFor({ state: 'detached' });
    await page.goto(Constants.companiesUrl);
    await page.waitForLoadState('networkidle');
    await compnay.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await compnay.clickElement(compnay.documentIcon.first());
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn).toContainText(Constants.companyType);
    await expect(document.companyColumn).toContainText(Constants.testCompany);
    await expect(document.subTypeColumn).toContainText(Constants.iftaSubtype);
});

test('Korisnik moze da prebaci dokument na drugi trailer', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 10000 });
    await upload.enterSecondTruckNumber(upload.documentReferrerMenu.last(), Constants.secondTrailerName, upload.secondTrailerNumberFromMenu);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await upload.savePermitButton.click();
    await upload.loader.waitFor({ state: 'detached' });
    await page.mouse.click(10, 10);
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.locator('.v-text-field input').nth(6).fill(Constants.secondTrailerName);
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(2)', { hasText: Constants.secondTrailerName })
    });
    await page.waitForLoadState('networkidle');
    await targetRow.locator('.mdi-file-document-multiple').click();
    await expect(document.statusColumn.first()).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn.first()).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn.first()).toContainText(Constants.trailerType);
    await expect(document.companyColumn.first()).toContainText(Constants.secondTrailerName);
});

test('Korisnik moze da prebaci dokument vozaca', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.driverType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.othersSubtype);
    await page.waitForLoadState('networkidle');
    await upload.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await upload.enterTruckNumber(upload.documentReferrerMenu.last(), Constants.testEmail, upload.driverOption);
    await page.waitForLoadState('networkidle');
    await upload.savePermitButton.click();
    await upload.loader.waitFor({ state: 'detached' });
    await page.goto(Constants.permitBookUrl);
    await page.waitForLoadState('networkidle');
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field__slot').first().click();
    await page.locator('.v-text-field__slot').first().type(Constants.testUser);
    await page.waitForLoadState('networkidle');
    await upload.loader.waitFor({ state: 'hidden', timeout: 5000 });
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(3)', { hasText: Constants.testUser })
    });
    await targetRow.locator('.mdi-eye').click();
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(document.typeColumn).toContainText(Constants.driverType);
    await expect(document.companyColumn).toContainText(Constants.testEmail);
    await expect(document.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Document subtype polje je obavezno kada korisnik mijenja type', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.truckType);
    await upload.savePermitButton.click();
    await expect(page.locator('.v-input.v-input--has-state.theme--light')).toContainText('Value is required');
});

test('Document referrer polje je obavezno kada korisnik mijenja type', async ({ page }) => {
    const upload = new InsertPermitBookPage(page);
    const document = new TrailerDocumentPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.eyeIcon.first().waitFor({ state: 'visible' });
    await document.clickElement(document.pencilIcon);
    await document.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await upload.selectDocumentType(upload.documentTypeField, upload.truckType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    await upload.savePermitButton.click();
    await expect(page.locator('text=Value is required').first()).toBeVisible();
});
