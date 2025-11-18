import { expect } from '@playwright/test';
import { generateRandomLetters } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda Company', async ({ companiesPreBookSetup }) => {
    const paginationText = await companiesPreBookSetup.pagination.innerText();
    const companyName = generateRandomLetters();
    const match = paginationText.match(/of\s+(\d+)/);
    const lastNumber = match ? parseInt(match[1]) : 0;
    await companiesPreBookSetup.clickElement(companiesPreBookSetup.addCompnayIcon);
    await companiesPreBookSetup.companyNameField.waitFor({ state: 'visible', timeout: 5000 });
    await companiesPreBookSetup.fillCompanyName(companiesPreBookSetup.companyNameField, companyName);
    await companiesPreBookSetup.check(companiesPreBookSetup.isActiveCheckbox);
    await companiesPreBookSetup.clickAddButton();
    await companiesPreBookSetup.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await companiesPreBookSetup.page.reload();
    await companiesPreBookSetup.page.waitForLoadState('networkidle');
    const updatedPaginationText = await companiesPreBookSetup.pagination.innerText();
    const updatedMatch = updatedPaginationText.match(/of\s+(\d+)/);
    const updatedLastNumber = updatedMatch ? parseInt(updatedMatch[1]) : 0;
    expect(updatedLastNumber).toBe(lastNumber + 1);
});

test('Company name je obavezno polje', async ({ companiesPreBookSetup }) => {
    await companiesPreBookSetup.clickElement(companiesPreBookSetup.addCompnayIcon);
    await companiesPreBookSetup.clickAddButton();
    await expect(companiesPreBookSetup.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(companiesPreBookSetup.errorMessage).toContainText('The name field is required');
});

test('Korisnik moze da edituje i da obrise Company', async ({ companiesPreBookSetup }) => {
    const companyName = generateRandomLetters();
    await companiesPreBookSetup.clickElement(companiesPreBookSetup.pencilIcon.last());
    await companiesPreBookSetup.companyNameField.waitFor({ state: 'visible', timeout: 5000 });
    await companiesPreBookSetup.companyNameField.clear();
    await companiesPreBookSetup.fillCompanyName(companiesPreBookSetup.companyNameField, companyName);
    await companiesPreBookSetup.uncheck(companiesPreBookSetup.isActiveCheckbox);
    await companiesPreBookSetup.clickSaveButton();
    await expect(companiesPreBookSetup.companyNameColumn.last()).toContainText(companyName);
    await expect(companiesPreBookSetup.isActiveColumn.last()).toContainText('NO');
    companiesPreBookSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await companiesPreBookSetup.clickElement(companiesPreBookSetup.grayDeleteIcon.last());
    await expect(companiesPreBookSetup.snackMessage).toContainText(companyName + " successfully deleted");
});

