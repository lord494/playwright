import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

// Truck document-operations tests — the truck analog of tests/trailer/trailerDocument.spec.ts.
// `truckDocumentSetup` uploads ONE expired Registration document to the first /trucks/all row,
// so every test starts from a known single-document state. Opening the modal waits on the real
// /api/permit-books response (openFirstTruckDocuments) instead of racing a fixed timeout, which
// is what keeps the flow stable under parallel load. The upload → date-picker → save → reopen →
// assert flow is genuinely long, so these tests get a larger time budget (the sibling
// trailerDocument.spec uses 180s for the same reason).
test.setTimeout(180000);

test('Dokument moze da edituje status dokumenta u LessThan30', async ({ cleanUpSetupTruckDocument, truckDocumentSetup, truckInsertPermitOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await truckInsertPermitOverview.selectExpiringDateLessThan30Days();
    await truckInsertPermitOverview.page.waitForLoadState('networkidle');
    await truckInsertPermitOverview.clickElement(truckInsertPermitOverview.savePermitButton);
    await truckInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await truckDocumentSetup.page.waitForLoadState('networkidle');
    await expect(truckDocumentSetup.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(truckDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.LessThan30StatusColor);
});

test('Dokument moze da edituje status dokumenta u valid', async ({ truckDocumentSetup, truckInsertPermitOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await truckInsertPermitOverview.selectExpiringDateMoreThan30Days();
    await truckInsertPermitOverview.clickElement(truckInsertPermitOverview.savePermitButton);
    await truckInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(truckDocumentSetup.statusColumn).toContainText(Constants.validStatus);
    await expect(truckDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.validStatusColor);
});

test('Korisnik moze da doda novi dokument', async ({ truckDocumentSetup, truckInsertPermitOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await truckDocumentSetup.uploadNewDocument();
    const nameColumnInUpload = (await truckInsertPermitOverview.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await truckInsertPermitOverview.clickElement(truckInsertPermitOverview.savePermitButton);
    await truckInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(truckDocumentSetup.nameColumn).toContainText(textCompanyName);
});

test('Korisnik ne moze da doda dokument veci od 10mb', async ({ truckDocumentSetup, truckInsertPermitOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await truckDocumentSetup.uploadDocumentOver10MB();
    await expect(truckInsertPermitOverview.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Korisnik moze da promjeni subtype', async ({ truckDocumentSetup, truckInsertPermitOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckInsertPermitOverview.selectSubtypeFromMenu(truckInsertPermitOverview.documentSubtypeField, truckInsertPermitOverview.othersSubtype);
    await truckInsertPermitOverview.clickElement(truckInsertPermitOverview.savePermitButton);
    await truckInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(truckDocumentSetup.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Korisnik moze da otovori dokument na eye ikonicu', async ({ truckDocumentSetup }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.eyeIcon);
    await expect(truckDocumentSetup.titleInModal).toBeVisible();
    await expect(truckDocumentSetup.titleInModal).toContainText('Preview');
});

test('Korisnik moze da otovori QR code modal', async ({ truckDocumentSetup }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.qrCode);
    await expect(truckDocumentSetup.titleInModal).toBeVisible();
    await expect(truckDocumentSetup.titleInModal).toContainText('QR Code');
});

test('Korisnik moze da prebaci dokument vozaca', async ({ truckDocumentSetup, insertPermitBookOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.driverType);
    await insertPermitBookOverview.selectSubtypeFromMenu(insertPermitBookOverview.documentSubtypeField, insertPermitBookOverview.othersSubtype);
    await insertPermitBookOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await insertPermitBookOverview.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.enterTruckNumber(insertPermitBookOverview.documentReferrerMenu.last(), Constants.testEmail, insertPermitBookOverview.driverOption);
    await insertPermitBookOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await insertPermitBookOverview.savePermitButton.click();
    await insertPermitBookOverview.loader.waitFor({ state: 'detached', timeout: 10000 });
    await insertPermitBookOverview.page.goto(Constants.permitBookUrl, { waitUntil: 'networkidle' });
    await insertPermitBookOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.page.locator('.v-text-field__slot').first().click();
    await insertPermitBookOverview.page.locator('.v-text-field__slot').first().type(Constants.testUser);
    await insertPermitBookOverview.page.waitForLoadState('networkidle');
    await insertPermitBookOverview.loader.waitFor({ state: 'hidden', timeout: 5000 });
    const targetRow = insertPermitBookOverview.page.locator('tr', {
        has: insertPermitBookOverview.page.locator('td:nth-child(3)', { hasText: Constants.testUser })
    });
    await targetRow.locator('.mdi-eye').click();
    await expect(truckDocumentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(truckDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(truckDocumentSetup.typeColumn).toContainText(Constants.driverType);
    await expect(truckDocumentSetup.companyColumn).toContainText(Constants.testEmail);
    await expect(truckDocumentSetup.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Dokument moze da se prebaci na Trailer', async ({ truckDocumentSetup, insertPermitBookOverview, truckOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.trailerType);
    await insertPermitBookOverview.selectSubtypeFromMenu(insertPermitBookOverview.documentSubtypeField, insertPermitBookOverview.registrationSubtype);
    await insertPermitBookOverview.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.enterTruckNumber(insertPermitBookOverview.documentReferrerMenu.last(), Constants.trailerTest, insertPermitBookOverview.trailerNumberFromMenu);
    await insertPermitBookOverview.page.waitForLoadState('networkidle');
    // Wait for the move to persist before navigating away — otherwise the goto cancels the
    // in-flight save and the document never lands on the trailer.
    await Promise.all([
        insertPermitBookOverview.page.waitForResponse(
            r => r.url().includes('/api/permit-books') && (r.status() === 200 || r.status() === 201),
            { timeout: 15000 }
        ).catch(() => { }),
        insertPermitBookOverview.savePermitButton.click(),
    ]);
    await insertPermitBookOverview.page.waitForLoadState('networkidle');
    await insertPermitBookOverview.page.goto(Constants.trailerUrl, { waitUntil: 'networkidle' });
    await truckOverview.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckOverview.page.locator('.v-text-field input').nth(6).fill(Constants.trailerTest);
    const targetRow = truckOverview.page.locator('tr', {
        has: truckOverview.page.locator('td:nth-child(2)', { hasText: Constants.trailerTest })
    });
    await truckOverview.page.waitForLoadState('networkidle');
    await targetRow.locator('.mdi-file-document-multiple').click();
    await expect(truckDocumentSetup.statusColumn.first()).toContainText(Constants.expiredStatus);
    await expect(truckDocumentSetup.statusColumn.first()).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(truckDocumentSetup.typeColumn.first()).toContainText(Constants.trailerType);
    await expect(truckDocumentSetup.companyColumn.first()).toContainText(Constants.trailerTest);
    await expect(truckDocumentSetup.subTypeColumn.first()).toContainText(Constants.registrationSubtype);
});

test('Dokument moze da se prebaci na Company', async ({ truckDocumentSetup, insertPermitBookOverview, truckOverview, companiesPage }) => {
    await companiesPage.page.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await companiesPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const firtsCompanyName = (await companiesPage.companyNameColumn.first().allInnerTexts()).toString();
    const firstComapnyOption = companiesPage.page.getByRole('option', { name: firtsCompanyName, exact: true });
    await truckOverview.page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await truckOverview.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckOverview.documentIcon.first().click();
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.companyType);
    await insertPermitBookOverview.selectSubtypeFromMenu(insertPermitBookOverview.documentSubtypeField, insertPermitBookOverview.iftaSubtype);
    await insertPermitBookOverview.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.enterTruckNumber(insertPermitBookOverview.documentReferrerMenu.last(), firtsCompanyName, firstComapnyOption);
    await insertPermitBookOverview.savePermitButton.click();
    await insertPermitBookOverview.loader.waitFor({ state: 'detached', timeout: 10000 });
    await companiesPage.page.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await companiesPage.page.waitForLoadState('networkidle');
    await companiesPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await companiesPage.clickElement(companiesPage.documentIcon.first());
    await expect(truckDocumentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(truckDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(truckDocumentSetup.typeColumn).toContainText(Constants.companyType);
    await expect(truckDocumentSetup.companyColumn).toContainText(Constants.testCompany);
    await expect(truckDocumentSetup.subTypeColumn).toContainText(Constants.iftaSubtype);
});

test('Korisnik moze da prebaci dokument na drugi truck', async ({ truckDocumentSetup, insertPermitBookOverview, truckOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.truckType);
    await insertPermitBookOverview.selectSubtypeFromMenu(insertPermitBookOverview.documentSubtypeField, insertPermitBookOverview.registrationSubtype);
    await insertPermitBookOverview.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.enterTruckNumber(insertPermitBookOverview.documentReferrerMenu.last(), Constants.secondTruckName, insertPermitBookOverview.secondTruckNumberFromMenu);
    await insertPermitBookOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await Promise.all([
        insertPermitBookOverview.page.waitForResponse(
            r => r.url().includes('/api/permit-books') && (r.status() === 200 || r.status() === 201),
            { timeout: 15000 }
        ).catch(() => { }),
        insertPermitBookOverview.savePermitButton.click(),
    ]);
    await insertPermitBookOverview.loader.waitFor({ state: 'detached', timeout: 10000 });
    await truckOverview.page.mouse.click(10, 10);
    await truckOverview.page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await truckOverview.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await truckOverview.searchByTruckNumber(Constants.secondTruckName);
    await truckOverview.documentIconForRow(Constants.secondTruckName).click();
    await expect(truckDocumentSetup.statusColumn.first()).toContainText(Constants.expiredStatus);
    await expect(truckDocumentSetup.statusColumn.first()).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(truckDocumentSetup.typeColumn.first()).toContainText(Constants.truckType);
    await expect(truckDocumentSetup.companyColumn.first()).toContainText(Constants.secondTruckName);
    await expect(truckDocumentSetup.subTypeColumn.first()).toContainText(Constants.registrationSubtype);
});

test('Document subtype polje je obavezno kada korisnik mijenja type', async ({ truckDocumentSetup, insertPermitBookOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.trailerType);
    await insertPermitBookOverview.savePermitButton.click();
    await expect(truckDocumentSetup.page.locator('.v-input.v-input--has-state.theme--light')).toContainText('Value is required');
});

test('Document referrer polje je obavezno kada korisnik mijenja type', async ({ truckDocumentSetup, insertPermitBookOverview }) => {
    await truckDocumentSetup.openFirstTruckDocuments();
    await truckDocumentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await truckDocumentSetup.clickElement(truckDocumentSetup.pencilIcon);
    await truckDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.trailerType);
    await insertPermitBookOverview.selectSubtypeFromMenu(insertPermitBookOverview.documentSubtypeField, insertPermitBookOverview.registrationSubtype);
    await insertPermitBookOverview.savePermitButton.click();
    await expect(truckDocumentSetup.page.locator('text=Value is required').first()).toBeVisible();
});
