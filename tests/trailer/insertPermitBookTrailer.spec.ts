import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

// Each test targets a WORKER-SPECIFIC trailer (Constants.workerTrailers[workerIndex]) and
// drives its row by NUMBER (via getRowByTrailerNumber), never by reading back the first row.
// Reading `trailerNameColumn.first()` after a filter was racy — another worker's created
// trailer (whose random VIN matched the search) could surface as the first row.
//
// The upload → date-picker → save → reopen → assert flow is genuinely long; under 4-worker
// CPU load it can exceed the default 30s, so these tests get a larger budget (the sibling
// trailerDocument.spec uses 180s for the same reason).

test('Dodavanje dokumenta kojem je istekao datum vazenja', async ({ insertPermitTrailerSetup, trailerOverview, trailerDocument }, testInfo) => {
    test.setTimeout(120000);
    const trailerNumber = Constants.workerTrailers[testInfo.workerIndex % Constants.workerTrailers.length];
    await trailerOverview.searchByTrailerNumber(trailerNumber);
    const documentIcon = trailerOverview.documentIconForRow(trailerNumber);
    const uploadIcon = trailerOverview.uploadIconForRow(trailerNumber);
    await documentIcon.click();
    await trailerDocument.deleteAllItemsWithDeleteIcon();
    await uploadIcon.click();
    await insertPermitTrailerSetup.uploadDocument();
    await trailerOverview.page.waitForLoadState('networkidle');
    const formattedDate = await insertPermitTrailerSetup.selectPastExpiringDate();
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTrailerSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTrailerSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await trailerOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached', timeout: 10000 });
    await documentIcon.click();
    await trailerOverview.page.waitForResponse(resp =>
        resp.url().includes('/api/permit-books') &&
        resp.status() === 200
    );
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedDate);
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.expiredStatus);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(244, 67, 54)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.trailerType);
    await expect(trailerDocument.companyColumn).toContainText(trailerNumber);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje valid dokumenta koji istice za vise od 30 dana', async ({ insertPermitTrailerSetup, trailerOverview, trailerDocument }, testInfo) => {
    test.setTimeout(120000);
    const trailerNumber = Constants.workerTrailers[testInfo.workerIndex % Constants.workerTrailers.length];
    await trailerOverview.searchByTrailerNumber(trailerNumber);
    const documentIcon = trailerOverview.documentIconForRow(trailerNumber);
    const uploadIcon = trailerOverview.uploadIconForRow(trailerNumber);
    await documentIcon.click();
    await trailerDocument.deleteAllItemsWithDeleteIcon();
    await uploadIcon.click();
    await insertPermitTrailerSetup.uploadDocument();
    await insertPermitTrailerSetup.page.waitForLoadState('networkidle', { timeout: 20000 });
    const formattedFutureDate = await insertPermitTrailerSetup.selectExpiringDateMoreThan30Days();
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTrailerSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTrailerSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await trailerOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached', timeout: 10000 });
    await documentIcon.click();
    await trailerOverview.page.waitForResponse(resp =>
        resp.url().includes('/api/permit-books') &&
        resp.status() === 200
    );
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate);
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.validStatus);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(76, 175, 80)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.trailerType);
    await expect(trailerDocument.companyColumn).toContainText(trailerNumber);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta koji istice za manje od 30 dana', async ({ insertPermitTrailerSetup, trailerOverview, trailerDocument }, testInfo) => {
    test.setTimeout(120000);
    const trailerNumber = Constants.workerTrailers[testInfo.workerIndex % Constants.workerTrailers.length];
    await trailerOverview.searchByTrailerNumber(trailerNumber);
    const documentIcon = trailerOverview.documentIconForRow(trailerNumber);
    const uploadIcon = trailerOverview.uploadIconForRow(trailerNumber);
    await documentIcon.click();
    await trailerDocument.deleteAllItemsWithDeleteIcon();
    await uploadIcon.click();
    await insertPermitTrailerSetup.uploadDocument();
    await insertPermitTrailerSetup.page.waitForLoadState('networkidle');
    const formattedFutureDate = await insertPermitTrailerSetup.selectExpiringDateLessThan30Days();
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTrailerSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTrailerSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await trailerOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await documentIcon.click();
    await trailerOverview.page.waitForResponse(resp =>
        resp.url().includes('/api/permit-books') &&
        resp.status() === 200
    );
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.trailerType);
    await expect(trailerDocument.companyColumn).toContainText(trailerNumber);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Korisnik ne moze da uradi upload za fajl koji je veci od 10mb', async ({ insertPermitTrailerSetup, trailerOverview }, testInfo) => {
    const trailerNumber = Constants.workerTrailers[testInfo.workerIndex % Constants.workerTrailers.length];
    await trailerOverview.searchByTrailerNumber(trailerNumber);
    await trailerOverview.uploadIconForRow(trailerNumber).click();
    await trailerOverview.page.waitForFunction(() => {
        const el = document.querySelector('.v-dialog.v-dialog--active');
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width === 500
    }, { timeout: 10000 });
    await insertPermitTrailerSetup.uploadDocumentOver10MB();
    await expect(insertPermitTrailerSetup.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Expiring date je obavezno polje', async ({ insertPermitTrailerSetup, trailerOverview }, testInfo) => {
    const trailerNumber = Constants.workerTrailers[testInfo.workerIndex % Constants.workerTrailers.length];
    await trailerOverview.searchByTrailerNumber(trailerNumber);
    await trailerOverview.uploadIconForRow(trailerNumber).click();
    await insertPermitTrailerSetup.uploadDocument();
    await insertPermitTrailerSetup.page.waitForLoadState('networkidle');
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await expect(insertPermitTrailerSetup.errorMessage.first()).toContainText('Value is required');
});
