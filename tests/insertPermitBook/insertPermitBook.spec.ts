import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailersPage } from '../../page/trailer/trailer.page';
import { TrailerDocumentPage } from '../../page/trailer/trailerDocument.page';
import { CompaniesPage } from '../../page/Content/companies.page';
import { InsertPage } from '../../page/insertPermitBook/insertPermitBook.page';
import { TruckPage } from '../../page/truck/truck.page';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    await page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').fill(Constants.truckName);
    await trailer.documentIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await trailer.clickElement(trailer.documentIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.trailerUrl, { waitUntil: 'networkidle' });
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
    await page.goto(Constants.permitBookUrl, { waitUntil: 'networkidle' });
    await document.eyeIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.v-text-field input').first().fill(Constants.testUser);
    await document.eyeIcon.nth(9).waitFor({ state: 'hidden', timeout: 10000 });
    await trailer.clickElement(document.eyeIcon);
    await page.waitForLoadState('networkidle');
    await document.deleteAllItemsWithDeleteIconForDrivers();
    await page.goto(Constants.companiesUrl, { waitUntil: 'networkidle' });
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailer.clickElement(trailer.documentIcon.first());
    await document.deleteAllItemsWithDeleteIcon();
});

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.permitBookUrl, { waitUntil: 'networkidle', timeout: 20000 });
});

test('Dodavanje dokumenta za trailer', async ({ page }) => {
    const upload = new InsertPage(page);
    const trailer = new TrailersPage(page);
    const document = new TrailerDocumentPage(page);
    await upload.addNewPermitButton.click();
    await upload.insertDocumentField.waitFor({ state: 'visible', timeout: 10000 });
    await upload.uploadDocument();
    await page.waitForLoadState('networkidle');
    const formattedFutureDate = await upload.selectExpiringDateLessThan30Days();
    await upload.selectDocumentType(upload.documentTypeField, upload.trailerType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    const [response2] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('api/trailers') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        upload.enterTrailerNumber(upload.documentReferrerMenu.last(), Constants.trailerTest, upload.trailerNumberFromMenu)
    ]);
    await page.waitForLoadState('networkidle');
    const nameColumnInUpload = (await page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await upload.clickElement(upload.savePermitButton);
    await page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await page.goto(Constants.trailerUrl, { waitUntil: 'networkidle', timeout: 25000 });
    await trailer.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('api/trailers') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        trailer.enterTrailerName(trailer.trailerNumberFilter, Constants.trailerTest)
    ]);
    await trailer.clickElement(trailer.documentIcon.first());
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(document.typeColumn).toContainText(Constants.trailerType);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta za truck', async ({ page }) => {
    const upload = new InsertPage(page);
    const truck = new TruckPage(page);
    const document = new TrailerDocumentPage(page);
    await upload.addNewPermitButton.click();
    await upload.insertDocumentField.waitFor({ state: 'visible', timeout: 10000 });
    await upload.uploadDocument();
    await page.waitForLoadState('networkidle');
    const formattedFutureDate = await upload.selectExpiringDateLessThan30Days();
    await upload.selectDocumentType(upload.documentTypeField, upload.truckType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.registrationSubtype);
    const [response2] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('api/trucks') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        upload.enterTrailerNumber(upload.documentReferrerMenu.last(), Constants.truckName, upload.truckNumberFromMenu)
    ]);
    await page.waitForLoadState('networkidle');
    const nameColumnInUpload = (await page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await upload.clickElement(upload.savePermitButton);
    await page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await page.goto(Constants.truckUrl, { waitUntil: 'networkidle', timeout: 25000 });
    await truck.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('api/trucks') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        truck.enterTruckName(truck.searchInput, Constants.truckName)
    ]);
    await truck.clickElement(truck.documentIcon.first());
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(document.typeColumn).toContainText(Constants.truckType);
    await expect(document.subTypeColumn).toContainText(Constants.registrationSubtype);
});

test('Dodavanje dokumenta za company', async ({ page }) => {
    const upload = new InsertPage(page);
    const company = new CompaniesPage(page);
    const document = new TrailerDocumentPage(page);
    await page.goto(Constants.companiesUrl, { waitUntil: 'networkidle' });
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    const firtsCompanyName = (await company.companyNameColumn.first().allInnerTexts()).toString();
    const firstComapnyOption = page.getByRole('option', { name: firtsCompanyName, exact: true });
    await page.goto(Constants.permitBookUrl, { waitUntil: 'networkidle', timeout: 20000 });
    await upload.addNewPermitButton.waitFor({ state: 'visible', timeout: 10000 });
    await upload.addNewPermitButton.click();
    await upload.insertDocumentField.waitFor({ state: 'visible', timeout: 10000 });
    await upload.uploadDocument();
    await page.waitForLoadState('networkidle');
    const formattedFutureDate = await upload.selectExpiringDateLessThan30Days();
    await upload.selectDocumentType(upload.documentTypeField, upload.companyType);
    await upload.selectSubtypeFromMenu(upload.documentSubtypeField, upload.eldDocumentsSubtype);
    const [response2] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('api/companies') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        upload.enterTrailerNumber(upload.documentReferrerMenu.last(), firtsCompanyName, firstComapnyOption)
    ]);
    await page.waitForLoadState('networkidle');
    const nameColumnInUpload = (await page.locator('.v-file-input__text').allInnerTexts())[0];
    const textCompanyName = nameColumnInUpload.split(' ')[0];
    await upload.clickElement(upload.savePermitButton);
    await page.locator('.v-dialog.v-dialog--active').waitFor({ state: 'detached' });
    await page.goto(Constants.companiesUrl, { waitUntil: 'networkidle', timeout: 25000 });
    await company.documentIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    await company.clickElement(company.documentIcon.first());
    await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
    const actualDates = await document.dateExpiringColumn.allInnerTexts();
    await expect(actualDates).toContain(formattedFutureDate.toString());
    await expect(document.nameColumn).toContainText(textCompanyName);
    await expect(document.statusColumn).toContainText(Constants.lessThan30Status);
    await expect(document.statusColumn).toHaveCSS('background-color', 'rgb(255, 235, 59)');
    await expect(document.typeColumn).toContainText(Constants.companyType);
    await expect(document.subTypeColumn).toContainText(Constants.eldDocuments);
});

