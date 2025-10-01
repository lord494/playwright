import { expect, Page } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { CompaniesPage } from '../../../page/Content/companies.page';
import { DocumentPage } from '../../../page/Content/documentModal.page';
import { test } from '../../fixtures/fixtures';

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const company = new CompaniesPage(page);
    const document = new DocumentPage(page);
    await page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').fill(Constants.truckName);
    await company.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await company.clickElement(company.documentIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.trailerUrl, { waitUntil: 'networkidle' });
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').nth(6).fill(Constants.trailerTest);
    await page.waitForLoadState('networkidle');
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(2)', { hasText: Constants.trailerTest })
    });
    await targetRow.locator('.mdi-file-document-multiple').click();
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.permitBookUrl, { waitUntil: 'networkidle' });
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').first().fill(Constants.testUser);
    await document.eyeIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await company.clickElement(document.eyeIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.companiesUrl), { waitUntil: 'networkidle' };
    await company.clickElement(company.documentIcon.nth(1));
    await document.deleteAllItemsWithDeleteIcon();
});

test('Dokument moze da edituje status dokumenta u LessThan30', async ({ documentSetup, uploadDocument }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await uploadDocument.selectExpiringDateLessThan30Days();
    await uploadDocument.clickElement(uploadDocument.savePermitButton);
    await uploadDocument.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(documentSetup.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(documentSetup.statusColumn).toHaveCSS('background-color', Constants.LessThan30StatusColor);
});

test('Dokument moze da edituje status dokumenta u valid', async ({ documentSetup, uploadDocument }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await uploadDocument.selectExpiringDateMoreThan30Days();
    await uploadDocument.clickElement(uploadDocument.savePermitButton);
    await uploadDocument.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(documentSetup.statusColumn).toContainText(Constants.validStatus);
    await expect(documentSetup.statusColumn).toHaveCSS('background-color', Constants.validStatusColor);
});

test('Korisnik moze da doda novi dokument', async ({ documentSetup, uploadDocument }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await documentSetup.uploadNewDocument();
    const nameColumnInUpload = (await documentSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await uploadDocument.clickElement(uploadDocument.savePermitButton);
    await uploadDocument.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(documentSetup.nameColumn).toContainText(textCompanyName);
});

test('Korisnik ne moze da doda dokument veci od 10mb', async ({ documentSetup, uploadDocument }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await documentSetup.uploadDocumentOver10MB();
    await expect(uploadDocument.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Korisnik moze da promjeni subtype', async ({ documentSetup, uploadDocument }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await uploadDocument.selectSubtypeFromMenu(uploadDocument.documentSubtypeField, uploadDocument.iftaSubtype);
    await uploadDocument.clickElement(uploadDocument.savePermitButton);
    await uploadDocument.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(documentSetup.subTypeColumn).toContainText(Constants.iftaSubtype);
});

test('Korisnik moze da otovori dokument na eye ikonicu', async ({ documentSetup }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.eyeIcon);
    await expect(documentSetup.titleInModal).toBeVisible();
    await expect(documentSetup.titleInModal).toContainText('Preview');
});

test('Korisnik moze da otovori QR code modal', async ({ documentSetup }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.qrCode);
    await expect(documentSetup.titleInModal).toBeVisible();
    await expect(documentSetup.titleInModal).toContainText('QR Code');
});

test('Dokument moze da se prebaci na Truck', async ({ documentSetup, uploadDocument, truckPage }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await uploadDocument.selectDocumentType(uploadDocument.documentTypeField, uploadDocument.truckType);
    await uploadDocument.selectSubtypeFromMenu(uploadDocument.documentSubtypeField, uploadDocument.registrationSubtype);
    await uploadDocument.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await uploadDocument.enterTruckNumber(uploadDocument.documentReferrerMenu.last(), Constants.truckName, uploadDocument.truckNumberFromMenu);
    await page.waitForLoadState('networkidle');
    await uploadDocument.savePermitButton.click();
    await page.waitForLoadState('networkidle');
    await truckPage.page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await truckPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckPage.page.locator('.v-text-field input').fill(Constants.truckName);
    await truckPage.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await truckPage.clickElement(truckPage.documentIcon);
    await expect(documentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(documentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(documentSetup.typeColumn).toContainText(Constants.truckType);
    await expect(documentSetup.companyColumn).toContainText(Constants.truckName);
    await expect(documentSetup.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dokument moze da se prebaci na Trailer', async ({ documentSetup, uploadDocument, companiesPage, trailerPage }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await uploadDocument.selectDocumentType(uploadDocument.documentTypeField, uploadDocument.trailerType);
    await uploadDocument.selectSubtypeFromMenu(uploadDocument.documentSubtypeField, uploadDocument.registrationSubtype);
    await uploadDocument.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await uploadDocument.enterTruckNumber(uploadDocument.documentReferrerMenu.last(), Constants.trailerTest, uploadDocument.trailerNumberFromMenu);
    await page.waitForLoadState('networkidle');
    await uploadDocument.savePermitButton.click();
    await page.waitForLoadState('networkidle');
    await Promise.all([
        trailerPage.page.waitForResponse(
            response =>
                response.url().includes('/api/trailers') &&
                (response.status() === 200 || response.status() === 304),
            { timeout: 20_000 }
        ),
        trailerPage.page.goto(Constants.trailerUrl), { waitUntil: 'networkidle', timeout: 20000 }
    ]);
    await trailerPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerPage.page.locator('.v-text-field input').nth(6).fill(Constants.trailerTest);
    await trailerPage.page.locator('.v-progress-circular__overlay').waitFor({ state: 'hidden', timeout: 10000 });
    await trailerPage.page.waitForTimeout(3000);
    await trailerPage.clickElement(trailerPage.documentIcon.last());
    await expect(documentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(documentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(documentSetup.typeColumn).toContainText(Constants.trailerType);
    await expect(documentSetup.companyColumn).toContainText(Constants.trailerTest);
    await expect(documentSetup.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Korisnik moze da prebaci dokument na drugu firmu', async ({ documentSetup, uploadDocument, companiesPage }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.page.mouse.click(10, 10);
    const companyText = (await companiesPage.companyNameColumn.nth(1).textContent())?.trim() || '';
    await companiesPage.clickElement(companiesPage.documentIcon.first());
    await companiesPage.clickElement(documentSetup.pencilIcon.first());
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    const option = companiesPage.page.getByRole('option', { name: companyText, exact: true });
    await uploadDocument.enterTruckNumber(uploadDocument.documentReferrerMenu.last(), companyText, option);
    await uploadDocument.savePermitButton.click();
    await uploadDocument.loader.waitFor({ state: "hidden" });
    await companiesPage.page.locator('.v-data-table__empty-wrapper').waitFor({ state: 'visible', timeout: 10000 });
    await companiesPage.page.mouse.click(150, 140);
    await companiesPage.documentIcon.nth(1).click();
    await expect(documentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(documentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(documentSetup.typeColumn).toContainText(Constants.companyType);
    await expect(documentSetup.companyColumn).toContainText(companyText);
    await expect(documentSetup.subTypeColumn).toContainText(Constants.eldDocuments);
});

test('Korisnik moze da prebaci dokument vozaca', async ({ documentSetup, uploadDocument, permitBookPage }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await uploadDocument.selectDocumentType(uploadDocument.documentTypeField, uploadDocument.driverType);
    await uploadDocument.selectSubtypeFromMenu(uploadDocument.documentSubtypeField, uploadDocument.othersSubtype);
    await uploadDocument.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await uploadDocument.enterTruckNumber(uploadDocument.documentReferrerMenu.last(), Constants.testEmail, uploadDocument.driverOption);
    await uploadDocument.page.waitForLoadState('networkidle');
    await uploadDocument.savePermitButton.click();
    await uploadDocument.page.waitForLoadState('networkidle');
    await permitBookPage.page.goto(Constants.permitBookUrl), { waitUntil: 'networkidle' };
    await permitBookPage.page.locator('.v-text-field__slot').first().click();
    await permitBookPage.page.locator('.v-text-field__slot').first().type(Constants.testUser);
    await uploadDocument.loader.waitFor({ state: 'hidden', timeout: 5000 });
    const targetRow = permitBookPage.page.locator('tr', {
        has: permitBookPage.page.locator('td:nth-child(3)', { hasText: Constants.testUser })
    });
    await targetRow.locator('.mdi-eye').click();
    await expect(documentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(documentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(documentSetup.typeColumn).toContainText(Constants.driverType);
    await expect(documentSetup.companyColumn).toContainText(Constants.appTest + ' (' + Constants.testEmail + ')');
    await expect(documentSetup.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Document subtype polje je obavezno kada korisnik mijenja type', async ({ documentSetup, uploadDocument }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await uploadDocument.selectDocumentType(uploadDocument.documentTypeField, uploadDocument.trailerType);
    await uploadDocument.savePermitButton.click();
    await expect(uploadDocument.page.locator('.v-input.v-input--has-state.theme--light')).toContainText('Value is required');
});

test('Document referrer polje je obavezno kada korisnik mijenja type', async ({ documentSetup, uploadDocument }) => {
    await documentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await documentSetup.clickElement(documentSetup.pencilIcon);
    await documentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await uploadDocument.selectDocumentType(uploadDocument.documentTypeField, uploadDocument.trailerType);
    await uploadDocument.selectSubtypeFromMenu(uploadDocument.documentSubtypeField, uploadDocument.registrationSubtype);
    await uploadDocument.savePermitButton.click();
    await expect(uploadDocument.page.locator('text=Value is required').first()).toBeVisible();
});
