import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { CompaniesPrebookPage } from '../../page/preBook/companiesPrebook.page';
import { generateRandomLetters } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.companiesPrebookUrl);
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da doda Company', async ({ page }) => {
    const company = new CompaniesPrebookPage(page);
    const paginationText = await company.pagination.innerText();
    const companyName = generateRandomLetters();
    const match = paginationText.match(/of\s+(\d+)/);
    const lastNumber = match ? parseInt(match[1]) : 0;
    await company.clickElement(company.addCompnayIcon);
    await company.companyNameField.waitFor({ state: 'visible', timeout: 5000 });
    await company.fillCompanyName(company.companyNameField, companyName);
    await company.check(company.isActiveCheckbox);
    await company.clickAddButton();
    await company.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    const updatedPaginationText = await company.pagination.innerText();
    const updatedMatch = updatedPaginationText.match(/of\s+(\d+)/);
    const updatedLastNumber = updatedMatch ? parseInt(updatedMatch[1]) : 0;
    expect(updatedLastNumber).toBe(lastNumber + 1);
});

test('Company name je obavezno polje', async ({ page }) => {
    const company = new CompaniesPrebookPage(page);
    await company.clickElement(company.addCompnayIcon);
    await company.clickAddButton();
    await expect(company.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(company.errorMessage).toContainText('The name field is required');
});

test('Korisnik moze da edituje i da obrise Company', async ({ page }) => {
    const company = new CompaniesPrebookPage(page);
    const companyName = generateRandomLetters();
    await company.clickElement(company.pencilIcon.last());
    await company.companyNameField.waitFor({ state: 'visible', timeout: 5000 });
    await company.companyNameField.clear();
    await company.fillCompanyName(company.companyNameField, companyName);
    await company.uncheck(company.isActiveCheckbox);
    await company.clickSaveButton();
    await expect(company.companyNameColumn.last()).toContainText(companyName);
    await expect(company.isActiveColumn.last()).toContainText('NO');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await company.clickElement(company.grayDeleteIcon.last());
    await expect(company.snackMessage).toContainText(companyName + " successfully deleted");
});

