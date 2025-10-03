import { expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Dodavanje dokumenta za trailer', async ({ cleanupSetup, insertPermit, trailerPage, trailerDocument }) => {
    await insertPermit.addNewPermitButton.click();
    await insertPermit.insertDocumentField.waitFor({ state: 'visible', timeout: 10000 });
    await insertPermit.uploadDocument();
    await insertPermit.page.waitForLoadState('networkidle');
    const formattedFutureDate = await insertPermit.selectExpiringDateLessThan30Days();
    await insertPermit.selectDocumentType(insertPermit.documentTypeField, insertPermit.trailerType);
    await insertPermit.selectSubtypeFromMenu(insertPermit.documentSubtypeField, insertPermit.registrationSubtype);
    const [response2] = await Promise.all([
        insertPermit.page.waitForResponse(resp =>
            resp.url().includes('api/trailers') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        insertPermit.enterTrailerNumber(insertPermit.documentReferrerMenu.last(), Constants.trailerTest, insertPermit.trailerNumberFromMenu)
    ]);
    await insertPermit.page.waitForLoadState('networkidle');
    const nameColumnInUpload = (await insertPermit.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermit.clickElement(insertPermit.savePermitButton);
    await insertPermit.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await trailerPage.page.goto(Constants.trailerUrl, { waitUntil: 'networkidle', timeout: 25000 });
    await trailerPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const [response] = await Promise.all([
        trailerPage.page.waitForResponse(resp =>
            resp.url().includes('api/trailers') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        trailerPage.enterTrailerName(trailerPage.trailerNumberFilter, Constants.trailerTest)
    ]);
    await trailerPage.clickElement(trailerPage.documentIcon.first());
    await insertPermit.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.trailerType);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta za truck', async ({ insertPermit, truckPage, trailerDocument }) => {
    await insertPermit.addNewPermitButton.click();
    await insertPermit.insertDocumentField.waitFor({ state: 'visible', timeout: 10000 });
    await insertPermit.uploadDocument();
    await insertPermit.page.waitForLoadState('networkidle');
    const formattedFutureDate = await insertPermit.selectExpiringDateLessThan30Days();
    await insertPermit.selectDocumentType(insertPermit.documentTypeField, insertPermit.truckType);
    await insertPermit.selectSubtypeFromMenu(insertPermit.documentSubtypeField, insertPermit.registrationSubtype);
    const [response2] = await Promise.all([
        insertPermit.page.waitForResponse(resp =>
            resp.url().includes('api/trucks') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        insertPermit.enterTrailerNumber(insertPermit.documentReferrerMenu.last(), Constants.truckName, insertPermit.truckNumberFromMenu)
    ]);
    await insertPermit.page.waitForLoadState('networkidle');
    const nameColumnInUpload = (await insertPermit.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermit.clickElement(insertPermit.savePermitButton);
    await insertPermit.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await truckPage.page.goto(Constants.truckUrl, { waitUntil: 'networkidle', timeout: 25000 });
    await truckPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const [response] = await Promise.all([
        truckPage.page.waitForResponse(resp =>
            resp.url().includes('api/trucks') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        truckPage.enterTruckName(truckPage.searchInput, Constants.truckName)
    ]);
    await truckPage.clickElement(truckPage.documentIcon.first());
    await insertPermit.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.truckType);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta za company', async ({ insertPermit, companiesPage, trailerDocument }) => {
    await companiesPage.page.goto(Constants.companiesUrl, { waitUntil: 'networkidle' });
    await companiesPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const firtsCompanyName = (await companiesPage.companyNameColumn.first().allInnerTexts()).toString();
    const firstComapnyOption = companiesPage.page.getByRole('option', { name: firtsCompanyName, exact: true });
    await insertPermit.page.goto(Constants.permitBookUrl, { waitUntil: 'networkidle', timeout: 20000 });
    await insertPermit.addNewPermitButton.waitFor({ state: 'visible', timeout: 10000 });
    await insertPermit.addNewPermitButton.click();
    await insertPermit.insertDocumentField.waitFor({ state: 'visible', timeout: 10000 });
    await insertPermit.uploadDocument();
    await insertPermit.page.waitForLoadState('networkidle');
    const formattedFutureDate = await insertPermit.selectExpiringDateLessThan30Days();
    await insertPermit.selectDocumentType(insertPermit.documentTypeField, insertPermit.companyType);
    await insertPermit.selectSubtypeFromMenu(insertPermit.documentSubtypeField, insertPermit.eldDocumentsSubtype);
    const [response2] = await Promise.all([
        insertPermit.page.waitForResponse(resp =>
            resp.url().includes('api/companies') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        insertPermit.enterTrailerNumber(insertPermit.documentReferrerMenu.last(), firtsCompanyName, firstComapnyOption)
    ]);
    await insertPermit.page.waitForLoadState('networkidle');
    const nameColumnInUpload = (await insertPermit.page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await insertPermit.clickElement(insertPermit.savePermitButton);
    await insertPermit.page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await companiesPage.page.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 25000 });
    await companiesPage.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await companiesPage.clickElement(companiesPage.documentIcon.first());
    await insertPermit.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await trailerDocument.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(trailerDocument.nameColumn).toContainText(textCompanyName);
    await expect(trailerDocument.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(trailerDocument.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(trailerDocument.typeColumn).toContainText(Constants.companyType);
    await expect(trailerDocument.subTypeColumn).toContainText(Constants.eldDocuments);
});

