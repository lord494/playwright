import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { CompaniesPage } from '../../../page/Content/companies.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.goto(Constants.companiesUrl);
    await companies.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da doda Company', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.waitForLoadState('networkidle');
    await companies.clickElement(companies.addCompany);
    await companies.fillCompanyName(companies.nameCompanyField, Constants.playwrightCompany);
    await companies.fillShortName(companies.shortNameField, Constants.shortName);
    await companies.clickAddButton();
    await companies.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(companies.shortNameColumn.last()).toContainText(Constants.shortName);
    await expect(companies.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await companies.clickElement(companies.grayDeleteIcon.last());
    await expect(companies.snackMessage).toContainText(Constants.playwrightCompany + " successfully deleted");
});

test('Company name polje je obavezno', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.waitForLoadState('networkidle');
    await companies.clickElement(companies.addCompany);
    await companies.fillShortName(companies.shortNameField, Constants.shortName);
    await companies.clickAddButton();
    await expect(companies.errorMessage.first()).toContainText('The name field is required');
});

test('Company short name polje je obavezno', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.waitForLoadState('networkidle');
    await companies.clickElement(companies.addCompany);
    await companies.fillCompanyName(companies.nameCompanyField, Constants.playwrightCompany);
    await companies.clickAddButton();
    await expect(companies.errorMessage.last()).toContainText('The short_name field is required');
});

test('Korisnik moze da obrise Company', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.waitForLoadState('networkidle');
    await companies.clickElement(companies.addCompany);
    await companies.fillCompanyName(companies.nameCompanyField, Constants.playwrightCompany);
    await companies.fillShortName(companies.shortNameField, Constants.shortName);
    await companies.clickAddButton();
    await companies.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(companies.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await companies.clickElement(companies.grayDeleteIcon.last());
    await expect(companies.snackMessage).toContainText(Constants.playwrightCompany + " successfully deleted");
});

test('Korisnik moze da edituje Board', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.waitForLoadState('networkidle');
    await companies.clickElement(companies.addCompany);
    await companies.fillCompanyName(companies.nameCompanyField, Constants.playwrightCompany);
    await companies.fillShortName(companies.shortNameField, Constants.shortName);
    await companies.clickAddButton();
    await companies.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(companies.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    await companies.clickElement(companies.pencilIcon.last());
    await companies.nameCompanyField.clear();
    await companies.fillCompanyName(companies.nameCompanyField, Constants.playwrightCompanyEdit);
    await companies.shortNameField.clear();
    await companies.fillShortName(companies.shortNameField, Constants.shortNameEdit);
    await companies.uncheck(companies.isActiveCheckbox.last());
    await companies.clickSaveButton();
    await expect(companies.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    await expect(companies.shortNameColumn.last()).toContainText(Constants.shortNameEdit);
    await expect(companies.isActiveColumn.last()).toContainText('NO');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await companies.clickElement(companies.grayDeleteIcon.last());
    await expect(companies.snackMessage).toContainText(" " + Constants.playwrightCompanyEdit + " successfully deleted");
});

test('Company name polje je obavezno u edit modalu', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.waitForLoadState('networkidle');
    await companies.clickElement(companies.pencilIcon.first());
    await companies.nameCompanyField.clear();
    await companies.clickSaveButton();
    await expect(companies.errorMessage.first()).toContainText('The name field is required');
});

test('Short name polje je obavezno u edit modalu', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await page.waitForLoadState('networkidle');
    await companies.clickElement(companies.pencilIcon.first());
    await companies.shortNameField.clear();
    await companies.clickSaveButton();
    await expect(companies.errorMessage.last()).toContainText('The short_name field is required');
});