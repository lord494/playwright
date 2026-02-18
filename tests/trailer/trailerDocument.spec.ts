import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test.setTimeout(180000);

test('Dokument moze da edituje status dokumenta u LessThan30', async ({ cleanUpSetupTrailerDocument, trailerDocumentSetup, trailerInsertPermitOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await trailerInsertPermitOverview.selectExpiringDateLessThan30Days();
    await trailerInsertPermitOverview.page.waitForLoadState('networkidle');
    await trailerInsertPermitOverview.clickElement(trailerInsertPermitOverview.savePermitButton);
    await trailerInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await trailerDocumentSetup.page.waitForLoadState('networkidle');
    await expect(trailerDocumentSetup.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(trailerDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.LessThan30StatusColor);
});

test('Dokument moze da edituje status dokumenta u valid', async ({ trailerDocumentSetup, trailerInsertPermitOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await trailerInsertPermitOverview.selectExpiringDateMoreThan30Days();
    await trailerInsertPermitOverview.clickElement(trailerInsertPermitOverview.savePermitButton);
    await trailerInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(trailerDocumentSetup.statusColumn).toContainText(Constants.validStatus);
    await expect(trailerDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.validStatusColor);
});

test('Korisnik moze da doda novi dokument', async ({ trailerDocumentSetup, trailerInsertPermitOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await trailerDocumentSetup.uploadNewDocument();
    const nameColumnInUpload = (await trailerInsertPermitOverview.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await trailerInsertPermitOverview.clickElement(trailerInsertPermitOverview.savePermitButton);
    await trailerInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(trailerDocumentSetup.nameColumn).toContainText(textCompanyName);
});

test('Korisnik ne moze da doda dokument veci od 10mb', async ({ trailerDocumentSetup, trailerInsertPermitOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await trailerDocumentSetup.uploadDocumentOver10MB();
    await expect(trailerInsertPermitOverview.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Korisnik moze da promjeni subtype', async ({ trailerDocumentSetup, trailerInsertPermitOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerInsertPermitOverview.selectSubtypeFromMenu(trailerInsertPermitOverview.documentSubtypeField, trailerInsertPermitOverview.othersSubtype);
    await trailerInsertPermitOverview.clickElement(trailerInsertPermitOverview.savePermitButton);
    await trailerInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(trailerDocumentSetup.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Korisnik moze da otovori dokument na eye ikonicu', async ({ trailerDocumentSetup, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.eyeIcon);
    await expect(trailerDocumentSetup.titleInModal).toBeVisible();
    await expect(trailerDocumentSetup.titleInModal).toContainText('Preview');
});

test('Korisnik moze da otovori QR code modal', async ({ trailerDocumentSetup, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.qrCode);
    await expect(trailerDocumentSetup.titleInModal).toBeVisible();
    await expect(trailerDocumentSetup.titleInModal).toContainText('QR Code');
});

test('Korisnik moze da prebaci dokument vozaca', async ({ trailerDocumentSetup, trailerInsertPermitOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await trailerInsertPermitOverview.selectDocumentType(trailerInsertPermitOverview.documentTypeField, trailerInsertPermitOverview.driverType);
    await trailerInsertPermitOverview.selectSubtypeFromMenu(trailerInsertPermitOverview.documentSubtypeField, trailerInsertPermitOverview.othersSubtype);
    await trailerInsertPermitOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await trailerInsertPermitOverview.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await trailerInsertPermitOverview.enterTruckNumber(trailerInsertPermitOverview.documentReferrerMenu.last(), Constants.testEmail, trailerInsertPermitOverview.driverOption);
    await trailerInsertPermitOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await trailerInsertPermitOverview.savePermitButton.click();
    await trailerInsertPermitOverview.loader.waitFor({ state: 'detached', timeout: 10000 });
    await trailerInsertPermitOverview.page.goto(Constants.permitBookUrl, { waitUntil: 'networkidle' });
    await trailerInsertPermitOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerInsertPermitOverview.page.locator('.v-text-field__slot').first().click();
    await trailerInsertPermitOverview.page.locator('.v-text-field__slot').first().type(Constants.testUser);
    await trailerInsertPermitOverview.page.waitForLoadState('networkidle');
    await trailerInsertPermitOverview.loader.waitFor({ state: 'hidden', timeout: 5000 });
    const targetRow = trailerInsertPermitOverview.page.locator('tr', {
        has: trailerInsertPermitOverview.page.locator('td:nth-child(3)', { hasText: Constants.testUser })
    });
    await targetRow.locator('.mdi-eye').click();
    await expect(trailerDocumentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(trailerDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(trailerDocumentSetup.typeColumn).toContainText(Constants.driverType);
    await expect(trailerDocumentSetup.companyColumn).toContainText(Constants.testEmail);
    await expect(trailerDocumentSetup.subTypeColumn).toContainText(Constants.otherSubtype);
});

test('Dokument moze da se prebaci na Truck', async ({ trailerDocumentSetup, insertPermitBookOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.truckType);
    await insertPermitBookOverview.selectSubtypeFromMenu(insertPermitBookOverview.documentSubtypeField, insertPermitBookOverview.registrationSubtype);
    await insertPermitBookOverview.doc.last().waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.enterTruckNumber(insertPermitBookOverview.documentReferrerMenu.last(), Constants.truckName, insertPermitBookOverview.truckNumberFromMenu);
    await insertPermitBookOverview.page.waitForLoadState('networkidle');
    await insertPermitBookOverview.savePermitButton.click();
    await insertPermitBookOverview.page.waitForLoadState('networkidle');
    await insertPermitBookOverview.page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await trailerOverview.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverview.page.locator('.v-text-field input').fill(Constants.truckName);
    await trailerOverview.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await trailerOverview.clickElement(trailerOverview.documentIcon);
    await expect(trailerDocumentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(trailerDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(trailerDocumentSetup.typeColumn).toContainText(Constants.truckType);
    await expect(trailerDocumentSetup.companyColumn).toContainText(Constants.truckName);
    await expect(trailerDocumentSetup.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dokument moze da se prebaci na Company', async ({ trailerDocumentSetup, insertPermitBookOverview, trailerOverview, companiesPage }) => {
    await companiesPage.page.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await companiesPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const firtsCompanyName = (await companiesPage.companyNameColumn.first().allInnerTexts()).toString();
    const firstComapnyOption = companiesPage.page.getByRole('option', { name: firtsCompanyName, exact: true });
    await trailerOverview.page.goto(Constants.trailerUrl, { waitUntil: 'networkidle' });
    await trailerOverview.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverview.documentIcon.first().click();
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
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
    await expect(trailerDocumentSetup.statusColumn).toContainText(Constants.expiredStatus);
    await expect(trailerDocumentSetup.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(trailerDocumentSetup.typeColumn).toContainText(Constants.companyType);
    await expect(trailerDocumentSetup.companyColumn).toContainText(Constants.testCompany);
    await expect(trailerDocumentSetup.subTypeColumn).toContainText(Constants.iftaSubtype);
});

test('Korisnik moze da prebaci dokument na drugi trailer', async ({ trailerDocumentSetup, insertPermitBookOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitBookOverview.enterSecondTruckNumber(insertPermitBookOverview.documentReferrerMenu.last(), Constants.secondTrailerName, insertPermitBookOverview.secondTrailerNumberFromMenu);
    await insertPermitBookOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await insertPermitBookOverview.page.waitForTimeout(1000);
    await insertPermitBookOverview.savePermitButton.click();
    await insertPermitBookOverview.loader.waitFor({ state: 'detached', timeout: 10000 });
    await trailerOverview.page.mouse.click(10, 10);
    await trailerOverview.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverview.page.waitForLoadState('networkidle', { timeout: 10000 });
    await trailerOverview.page.locator('.v-text-field input').nth(6).fill(Constants.secondTrailerName);
    const targetRow = trailerOverview.page.locator('tr', {
        has: trailerOverview.page.locator('td:nth-child(2)', { hasText: Constants.secondTrailerName })
    });
    await trailerOverview.page.waitForLoadState('networkidle');
    await targetRow.locator('.mdi-file-document-multiple').click();
    await expect(trailerDocumentSetup.statusColumn.first()).toContainText(Constants.expiredStatus);
    await expect(trailerDocumentSetup.statusColumn.first()).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(trailerDocumentSetup.typeColumn.first()).toContainText(Constants.trailerType);
    await expect(trailerDocumentSetup.companyColumn.first()).toContainText(Constants.secondTrailerName);
});

test('Document subtype polje je obavezno kada korisnik mijenja type', async ({ trailerDocumentSetup, insertPermitBookOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.truckType);
    await insertPermitBookOverview.savePermitButton.click();
    await expect(trailerDocumentSetup.page.locator('.v-input.v-input--has-state.theme--light')).toContainText('Value is required');
});

test('Document referrer polje je obavezno kada korisnik mijenja type', async ({ trailerDocumentSetup, insertPermitBookOverview, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocumentSetup.eyeIcon.first().waitFor({ state: 'visible' });
    await trailerDocumentSetup.clickElement(trailerDocumentSetup.pencilIcon);
    await trailerDocumentSetup.changeFileButton.waitFor({ state: 'visible', timeout: 5000 });
    await insertPermitBookOverview.selectDocumentType(insertPermitBookOverview.documentTypeField, insertPermitBookOverview.truckType);
    await insertPermitBookOverview.selectSubtypeFromMenu(insertPermitBookOverview.documentSubtypeField, insertPermitBookOverview.registrationSubtype);
    await insertPermitBookOverview.savePermitButton.click();
    await expect(trailerDocumentSetup.page.locator('text=Value is required').first()).toBeVisible();
});
