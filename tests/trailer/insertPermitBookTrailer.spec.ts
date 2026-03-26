import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Dodavanje dokumenta kojem je istekao datum vazenja', async ({ insertPermitTrailerSetup, trailerOverview, trailerDocument }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await trailerDocument.deleteAllItemsWithDeleteIcon();
    const firstTrailerName = await trailerOverview.trailerNameColumn.first().allInnerTexts();
    await trailerOverview.clickElement(trailerOverview.uploadIcon.first());
    await insertPermitTrailerSetup.uploadDocument();
    await trailerOverview.page.waitForLoadState('networkidle');
    const formattedDate = await insertPermitTrailerSetup.selectPastExpiringDate();
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTrailerSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTrailerSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await trailerOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached', timeout: 10000 });
    await trailerOverview.enterTrailerName(trailerOverview.trailerNumberFilter, firstTrailerName.toString());
    await trailerOverview.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304, { timeout: 10000 });

    const rows = trailerOverview.page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
        const row = rows.nth(i);

        const trailerNumber = await row.locator('td:nth-child(2)').textContent();

        if (trailerNumber?.trim() === firstTrailerName.toString().trim()) {
            await row.locator('.mdi-file-document-multiple').click();
            break;
        }
    }

    //await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await insertPermitTrailerSetup.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedDate);
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.expiredStatus);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(244, 67, 54)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.trailerType);
    await expect(trailerDocument.companyColumn).toContainText(firstTrailerName);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje valid dokumenta koji istice za vise od 30 dana', async ({ insertPermitTrailerSetup, trailerOverview, trailerDocument }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.nth(3));
    await trailerDocument.deleteAllItemsWithDeleteIcon();
    const firstTrailerName = await trailerOverview.trailerNameColumn.nth(3).allInnerTexts();
    await trailerOverview.clickElement(trailerOverview.uploadIcon.nth(3));
    await insertPermitTrailerSetup.uploadDocument();
    await insertPermitTrailerSetup.page.waitForLoadState('networkidle', { timeout: 20000 });
    const formattedFutureDate = await insertPermitTrailerSetup.selectExpiringDateMoreThan30Days();
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTrailerSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTrailerSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await trailerOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached', timeout: 10000 });
    await trailerOverview.enterTrailerName(trailerOverview.trailerNumberFilter, firstTrailerName.toString());
    await trailerOverview.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304, { timeout: 10000 });

    const rows = trailerOverview.page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
        const row = rows.nth(i);

        const trailerNumber = await row.locator('td:nth-child(2)').textContent();

        if (trailerNumber?.trim() === firstTrailerName.toString().trim()) {
            await row.locator('.mdi-file-document-multiple').click();
            break;
        }
    }

    //await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await insertPermitTrailerSetup.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate);
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.validStatus);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(76, 175, 80)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.trailerType);
    await expect(trailerDocument.companyColumn).toContainText(firstTrailerName);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta koji istice za manje od 30 dana', async ({ insertPermitTrailerSetup, trailerOverview, trailerDocument }) => {
    await trailerOverview.clickElement(trailerOverview.documentIcon.nth(5));
    await trailerDocument.deleteAllItemsWithDeleteIcon();
    const firstTrailerName = await trailerOverview.trailerNameColumn.nth(5).allInnerTexts();
    await trailerOverview.clickElement(trailerOverview.uploadIcon.nth(5));
    await insertPermitTrailerSetup.uploadDocument();
    await insertPermitTrailerSetup.page.waitForLoadState('networkidle');
    const formattedFutureDate = await insertPermitTrailerSetup.selectExpiringDateLessThan30Days();
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTrailerSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTrailerSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await trailerOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await trailerOverview.enterTrailerName(trailerOverview.trailerNumberFilter, firstTrailerName.toString());
    await trailerOverview.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304, { timeout: 10000 });
    const rows = trailerOverview.page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
        const row = rows.nth(i);

        const trailerNumber = await row.locator('td:nth-child(2)').textContent();

        if (trailerNumber?.trim() === firstTrailerName.toString().trim()) {
            await row.locator('.mdi-file-document-multiple').click();
            break;
        }
    }

    //await trailerOverview.clickElement(trailerOverview.documentIcon.first());
    await insertPermitTrailerSetup.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.trailerType);
    await expect(trailerDocument.companyColumn).toContainText(firstTrailerName);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Korisnik ne moze da uradi upload za fajl koji je veci od 10mb', async ({ insertPermitTrailerSetup, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.uploadIcon.first());
    await trailerOverview.page.waitForFunction(() => {
        const el = document.querySelector('.v-dialog.v-dialog--active');
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width === 500
    }, { timeout: 10000 });
    await insertPermitTrailerSetup.uploadDocumentOver10MB();
    await expect(insertPermitTrailerSetup.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Expiring date je obavezno polje', async ({ insertPermitTrailerSetup, trailerOverview }) => {
    await trailerOverview.clickElement(trailerOverview.uploadIcon.first());
    await insertPermitTrailerSetup.uploadDocument();
    await insertPermitTrailerSetup.page.waitForLoadState('networkidle');
    await insertPermitTrailerSetup.selectSubtypeFromMenu(insertPermitTrailerSetup.documentSubtypeField, insertPermitTrailerSetup.registrationSubtype);
    await insertPermitTrailerSetup.clickElement(insertPermitTrailerSetup.savePermitButton);
    await expect(insertPermitTrailerSetup.errorMessage.first()).toContainText('Value is required');
});
