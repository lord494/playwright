import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailersPage } from '../../page/trailer/trailer.page';
import { TrailerInsertPermitBookPage } from '../../page/trailer/trailerInsertPermitBook.page';
import { TrailerDocumentPage } from '../../page/trailer/trailerDocument.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    await page.goto(Constants.trailerUrl);
    await trailer.clickElement(trailer.documentIcon.first());
    await document.deleteAllItemsWithDeleteIcon();
});

test('Dodavanje dokumenta kojem je istekao datum vazenja', async ({ page }) => {
    const upload = new TrailerInsertPermitBookPage(page);
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    const firstTrailerName = await trailer.trailerNameColumn.first().allInnerTexts();
    await trailer.clickElement(trailer.uploadIcon.first());
    await upload.uploadDocument();
    await page.waitForLoadState('networkidle');
    const formattedDate = await upload.selectPastExpiringDate();
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    const nameColumnInUpload = (await page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await upload.clickElement(upload.savePermitButton);
    await page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await trailer.clickElement(trailer.documentIcon.first());
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedDate);
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.expiredStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(244, 67, 54)');
    await expect(document.typeColumn).toContainText(Constants.trailerType);
    await expect(document.companyColumn).toContainText(firstTrailerName);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje valid dokumenta koji istice za vise od 30 dana', async ({ page }) => {
    const upload = new TrailerInsertPermitBookPage(page);
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    const firtsCompanyName = await trailer.companyNameColumn.first().allInnerTexts();
    await trailer.clickElement(trailer.uploadIcon.first());
    await upload.uploadDocument();
    await page.waitForLoadState('networkidle');
    const formattedFutureDate = await upload.selectExpiringDateMoreThan30Days();
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    const nameColumnInUpload = (await page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await upload.clickElement(upload.savePermitButton);
    await page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await trailer.clickElement(trailer.documentIcon.first());
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate);
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.validStatus);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(76, 175, 80)');
    await expect(document.typeColumn).toContainText(Constants.trailerType);
    await expect(document.companyColumn).toContainText(firtsCompanyName);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta koji istice za manje od 30 dana', async ({ page }) => {
    const upload = new TrailerInsertPermitBookPage(page);
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    const firtsCompanyName = await trailer.companyNameColumn.first().allInnerTexts();
    await trailer.clickElement(trailer.uploadIcon.first());
    await upload.uploadDocument();
    await page.waitForLoadState('networkidle');
    const formattedFutureDate = await upload.selectExpiringDateLessThan30Days();
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    const nameColumnInUpload = (await page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await upload.clickElement(upload.savePermitButton);
    await page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await trailer.clickElement(trailer.documentIcon.first());
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(document.typeColumn).toContainText(Constants.trailerType);
    await expect(document.companyColumn).toContainText(firtsCompanyName);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Korisnik ne moze da uradi upload za fajl koji je veci od 10mb', async ({ page }) => {
    const upload = new TrailerInsertPermitBookPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.uploadIcon.first());
    await page.waitForFunction(() => {
        const el = document.querySelector('.v-dialog.v-dialog--active');
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width === 500
    }, { timeout: 10000 });
    await upload.uploadDocumentOver10MB();
    await expect(upload.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Expiring date je obavezno polje', async ({ page }) => {
    const upload = new TrailerInsertPermitBookPage(page);
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.uploadIcon.first());
    await upload.uploadDocument();
    await page.waitForLoadState('networkidle');
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    await upload.clickElement(upload.savePermitButton);
    await expect(upload.errorMessage.first()).toContainText('Value is required');
});
