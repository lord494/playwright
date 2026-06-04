import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

// Truck permit-book UPLOAD tests — the truck analog of tests/trailer/insertPermitBookTrailer.spec.ts.
// Each test targets a WORKER-SPECIFIC truck (Constants.workerTrucks[workerIndex]) and drives its
// row by NUMBER (searchByTruckNumber + documentIconForRow / uploadIconForRow), never the shared
// .first()/.nth() rows the previous version used — those collide when several workers upload to
// the same truck at once. All page.waitForTimeout()/networkidle-as-sync calls were replaced with
// deterministic waits (response waits, dialog detach, date-picker element waits).
//
// The upload → date-picker → save → reopen → assert flow is genuinely long; under 4-worker CPU
// load it can exceed the default 30s, so these tests get a larger budget (the sibling
// truckDocument.spec uses 180s for the same reason).

test('Dodavanje dokumenta kojem je istekao datum vazenja', async ({ insertPermitTruckSetup, truckOverview, truckDocument }, testInfo) => {
    test.setTimeout(120000);
    const truckNumber = Constants.workerTrucks[testInfo.workerIndex % Constants.workerTrucks.length];
    await truckOverview.searchByTruckNumber(truckNumber);
    const documentIcon = truckOverview.documentIconForRow(truckNumber);
    const uploadIcon = truckOverview.uploadIconForRow(truckNumber);
    await documentIcon.click();
    await truckDocument.deleteAllItemsWithDeleteIcon();
    await uploadIcon.click();
    await insertPermitTruckSetup.uploadDocument();
    await truckOverview.page.waitForLoadState('networkidle');
    const formattedDate = await insertPermitTruckSetup.selectPastExpiringDate();
    await insertPermitTruckSetup.selectSubtypeFromMenu(insertPermitTruckSetup.documentSubtypeField, insertPermitTruckSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTruckSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTruckSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTruckSetup.clickElement(insertPermitTruckSetup.savePermitButton);
    await truckOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached', timeout: 10000 });
    await documentIcon.click();
    await truckOverview.page.waitForResponse(resp =>
        resp.url().includes('/api/permit-books') &&
        (resp.status() === 200 || resp.status() === 304),
        { timeout: 20000 }
    );
    const actualDates = await truckDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedDate);
    await expect(truckDocument.nameColumn).toContainText(textCompanyName);
    await expect(truckDocument.statusColumn).toContainText(Constants.expiredStatus);
    await expect(truckDocument.statusColumn).toHaveCSS('background-color', Constants.expiredStatusColor);
    await expect(truckDocument.typeColumn).toContainText(Constants.truckType);
    await expect(truckDocument.companyColumn).toContainText(truckNumber);
    await expect(truckDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje valid dokumenta koji istice za vise od 30 dana', async ({ insertPermitTruckSetup, truckOverview, truckDocument }, testInfo) => {
    test.setTimeout(120000);
    const truckNumber = Constants.workerTrucks[testInfo.workerIndex % Constants.workerTrucks.length];
    await truckOverview.searchByTruckNumber(truckNumber);
    const documentIcon = truckOverview.documentIconForRow(truckNumber);
    const uploadIcon = truckOverview.uploadIconForRow(truckNumber);
    await documentIcon.click();
    await truckDocument.deleteAllItemsWithDeleteIcon();
    await uploadIcon.click();
    await insertPermitTruckSetup.uploadDocument();
    await insertPermitTruckSetup.page.waitForLoadState('networkidle', { timeout: 20000 });
    const formattedFutureDate = await insertPermitTruckSetup.selectExpiringDateMoreThan30Days();
    await insertPermitTruckSetup.selectSubtypeFromMenu(insertPermitTruckSetup.documentSubtypeField, insertPermitTruckSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTruckSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTruckSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTruckSetup.clickElement(insertPermitTruckSetup.savePermitButton);
    await truckOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached', timeout: 10000 });
    await documentIcon.click();
    await truckOverview.page.waitForResponse(resp =>
        resp.url().includes('/api/permit-books') &&
        (resp.status() === 200 || resp.status() === 304),
        { timeout: 20000 }
    );
    const actualDates = await truckDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate);
    await expect(truckDocument.nameColumn).toContainText(textCompanyName);
    await expect(truckDocument.statusColumn).toContainText(Constants.validStatus);
    await expect(truckDocument.statusColumn).toHaveCSS('background-color', Constants.validStatusColor);
    await expect(truckDocument.typeColumn).toContainText(Constants.truckType);
    await expect(truckDocument.companyColumn).toContainText(truckNumber);
    await expect(truckDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta koji istice za manje od 30 dana', async ({ insertPermitTruckSetup, truckOverview, truckDocument }, testInfo) => {
    test.setTimeout(120000);
    const truckNumber = Constants.workerTrucks[testInfo.workerIndex % Constants.workerTrucks.length];
    await truckOverview.searchByTruckNumber(truckNumber);
    const documentIcon = truckOverview.documentIconForRow(truckNumber);
    const uploadIcon = truckOverview.uploadIconForRow(truckNumber);
    await documentIcon.click();
    await truckDocument.deleteAllItemsWithDeleteIcon();
    await uploadIcon.click();
    await insertPermitTruckSetup.uploadDocument();
    await insertPermitTruckSetup.page.waitForLoadState('networkidle');
    const formattedFutureDate = await insertPermitTruckSetup.selectExpiringDateLessThan30Days();
    await insertPermitTruckSetup.selectSubtypeFromMenu(insertPermitTruckSetup.documentSubtypeField, insertPermitTruckSetup.registrationSubtype);
    const nameColumnInUpload = (await insertPermitTruckSetup.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermitTruckSetup.page.locator('.v-select-list.v-sheet').waitFor({ state: 'hidden', timeout: 5000 });
    await insertPermitTruckSetup.clickElement(insertPermitTruckSetup.savePermitButton);
    await truckOverview.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await documentIcon.click();
    await truckOverview.page.waitForResponse(resp =>
        resp.url().includes('/api/permit-books') &&
        (resp.status() === 200 || resp.status() === 304),
        { timeout: 20000 }
    );
    const actualDates = await truckDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(truckDocument.nameColumn).toContainText(textCompanyName);
    await expect(truckDocument.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(truckDocument.statusColumn).toHaveCSS('background-color', Constants.LessThan30StatusColor);
    await expect(truckDocument.typeColumn).toContainText(Constants.truckType);
    await expect(truckDocument.companyColumn).toContainText(truckNumber);
    await expect(truckDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Korisnik ne moze da uradi upload za fajl koji je veci od 10mb', async ({ insertPermitTruckSetup, truckOverview }, testInfo) => {
    const truckNumber = Constants.workerTrucks[testInfo.workerIndex % Constants.workerTrucks.length];
    await truckOverview.searchByTruckNumber(truckNumber);
    await truckOverview.uploadIconForRow(truckNumber).click();
    await insertPermitTruckSetup.savePermitButton.waitFor({ state: 'visible', timeout: 10000 });
    await insertPermitTruckSetup.uploadDocumentOver10MB();
    await expect(insertPermitTruckSetup.errorMessage.first()).toContainText('File is required and size should be less than 10 MB!');
});

test('Expiring date je obavezno polje', async ({ insertPermitTruckSetup, truckOverview }, testInfo) => {
    const truckNumber = Constants.workerTrucks[testInfo.workerIndex % Constants.workerTrucks.length];
    await truckOverview.searchByTruckNumber(truckNumber);
    await truckOverview.uploadIconForRow(truckNumber).click();
    await insertPermitTruckSetup.uploadDocument();
    await insertPermitTruckSetup.page.waitForLoadState('networkidle');
    await insertPermitTruckSetup.selectSubtypeFromMenu(insertPermitTruckSetup.documentSubtypeField, insertPermitTruckSetup.registrationSubtype);
    await insertPermitTruckSetup.clickElement(insertPermitTruckSetup.savePermitButton);
    await expect(insertPermitTruckSetup.errorMessage.first()).toContainText('Value is required');
});
