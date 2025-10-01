import { expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { test } from '../../fixtures/fixtures';

test('Dodavanje dokumenta kojem je istekao datum vazenja', async ({ uploadDocumentPage, document, companiesPage }) => {
    const firtsCompanyName = await companiesPage.companyNameColumn.first().allInnerTexts();
    await companiesPage.clickElement(companiesPage.uploadIcon.first());
    await uploadDocumentPage.uploadDocument();
    const formattedDate = await uploadDocumentPage.selectPastExpiringDate();
    await uploadDocumentPage.selectSubtypeFromMenu(uploadDocumentPage.documentSubtypeField, uploadDocumentPage.eldDocumentsSubtype);
    const nameColumnInUpload = (await uploadDocumentPage.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await companiesPage.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await uploadDocumentPage.clickElement(uploadDocumentPage.savePermitButton);
    await uploadDocumentPage.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await companiesPage.clickElement(companiesPage.documentIcon.first());
    await uploadDocumentPage.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedDate);
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(244, 67, 54)');
    await expect(document.typeColumn).toContainText(Constants.companyType);
    await expect(document.companyColumn).toContainText(firtsCompanyName);
    await expect(document.subTypeColumn).toContainText(Constants.eldDocuments);
});

test('Dodavanje valid dokumenta koji istice za vise od 30 dana', async ({ document, uploadDocumentPage, companiesPage }) => {
    const firtsCompanyName = await companiesPage.companyNameColumn.first().allInnerTexts();
    await companiesPage.clickElement(companiesPage.uploadIcon.first());
    await uploadDocumentPage.uploadDocument();
    const formattedFutureDate = await uploadDocumentPage.selectExpiringDateMoreThan30Days(); // 👈 koristiš novu metodu
    await uploadDocumentPage.selectSubtypeFromMenu(uploadDocumentPage.documentSubtypeField, uploadDocumentPage.eldDocumentsSubtype);
    const nameColumnInUpload = (await uploadDocumentPage.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await uploadDocumentPage.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await uploadDocumentPage.clickElement(uploadDocumentPage.savePermitButton);
    await uploadDocumentPage.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await companiesPage.clickElement(companiesPage.documentIcon.first());
    await uploadDocumentPage.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate);
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.validStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(76, 175, 80)');
    await expect(document.typeColumn).toContainText(Constants.companyType);
    await expect(document.companyColumn).toContainText(firtsCompanyName);
    await expect(document.subTypeColumn).toContainText(Constants.eldDocuments);
});

test('Dodavanje dokumenta koji istice za manje od 30 dana', async ({ document, uploadDocumentPage, companiesPage }) => {
    const firtsCompanyName = await companiesPage.companyNameColumn.first().allInnerTexts();
    await companiesPage.clickElement(companiesPage.uploadIcon.first());
    await uploadDocumentPage.uploadDocument();
    const formattedFutureDate = await uploadDocumentPage.selectExpiringDateLessThan30Days(); // 👈 koristiš novu metod
    await uploadDocumentPage.selectSubtypeFromMenu(uploadDocumentPage.documentSubtypeField, uploadDocumentPage.eldDocumentsSubtype);
    const nameColumnInUpload = (await uploadDocumentPage.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await uploadDocumentPage.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await uploadDocumentPage.clickElement(uploadDocumentPage.savePermitButton);
    await uploadDocumentPage.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await companiesPage.clickElement(companiesPage.documentIcon.first());
    await uploadDocumentPage.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(document.typeColumn).toContainText(Constants.companyType);
    await expect(document.companyColumn).toContainText(firtsCompanyName);
    await expect(document.subTypeColumn).toContainText(Constants.eldDocuments);
});

test('Insert Document je obavezno polje', async ({ uploadDocumentPage, companiesPage }) => {
    await companiesPage.clickElement(companiesPage.uploadIcon.first());
    await uploadDocumentPage.uploadDocumentOver10MB();
    await expect(uploadDocumentPage.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Document subtype je obavezno polje', async ({ uploadDocumentPage, companiesPage, addLoadModal }) => {
    await companiesPage.clickElement(companiesPage.uploadIcon.first());
    await uploadDocumentPage.uploadDocument();
    await uploadDocumentPage.expiringDateField.click();
    const dateText = await uploadDocumentPage.currentDate.textContent();
    const selectedDay = parseInt(dateText?.trim() || '0', 10);
    const pastDay = selectedDay > 1 ? selectedDay - 1 : 1;
    const pastDateButton = uploadDocumentPage.page.locator(`.v-picker.v-card.v-picker--date .v-btn__content:has-text("${pastDay}")`);
    await pastDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await pastDateButton.first().click();
    await addLoadModal.okButtonInDatePicker.click();
    await uploadDocumentPage.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await uploadDocumentPage.clickElement(uploadDocumentPage.savePermitButton);
    await expect(uploadDocumentPage.errorMessage.first()).toContainText('Value is required');
});

test('Expiring date je obavezno polje', async ({ uploadDocumentPage, companiesPage }) => {
    await companiesPage.clickElement(companiesPage.uploadIcon.first());
    await uploadDocumentPage.uploadDocument();
    await uploadDocumentPage.selectSubtypeFromMenu(uploadDocumentPage.documentSubtypeField, uploadDocumentPage.eldDocumentsSubtype);
    await uploadDocumentPage.clickElement(uploadDocumentPage.savePermitButton);
    await expect(uploadDocumentPage.errorMessage.first()).toContainText('Value is required');
});

test('Korisnik ne moze da doda dokument veci od 10mb', async ({ uploadDocumentPage, companiesPage }) => {
    await companiesPage.clickElement(companiesPage.uploadIcon.first());
    await uploadDocumentPage.uploadDocumentOver10MB();
    await expect(uploadDocumentPage.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

