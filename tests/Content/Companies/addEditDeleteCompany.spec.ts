import { expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { test } from '../../fixtures/fixtures';

test('Korisnik moze da doda Company', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.addCompany);
    await companiesPageSetup.fillCompanyName(companiesPageSetup.nameCompanyField, Constants.playwrightCompany);
    await companiesPageSetup.fillShortName(companiesPageSetup.shortNameField, Constants.shortName);
    await companiesPageSetup.clickAddButton();
    await companiesPageSetup.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(companiesPageSetup.shortNameColumn.last()).toContainText(Constants.shortName);
    await expect(companiesPageSetup.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    companiesPageSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await companiesPageSetup.clickElement(companiesPageSetup.grayDeleteIcon.last());
    await expect(companiesPageSetup.snackMessage).toContainText(Constants.playwrightCompany + " successfully deleted");
});

test('Company name polje je obavezno', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.addCompany);
    await companiesPageSetup.fillShortName(companiesPageSetup.shortNameField, Constants.shortName);
    await companiesPageSetup.clickAddButton();
    await expect(companiesPageSetup.errorMessage.first()).toContainText('The name field is required');
});

test('Company short name polje je obavezno', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.addCompany);
    await companiesPageSetup.fillCompanyName(companiesPageSetup.nameCompanyField, Constants.playwrightCompany);
    await companiesPageSetup.clickAddButton();
    await expect(companiesPageSetup.errorMessage.last()).toContainText('The short_name field is required');
});

test('Korisnik moze da obrise Company', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.addCompany);
    await companiesPageSetup.fillCompanyName(companiesPageSetup.nameCompanyField, Constants.playwrightCompany);
    await companiesPageSetup.fillShortName(companiesPageSetup.shortNameField, Constants.shortName);
    await companiesPageSetup.clickAddButton();
    await companiesPageSetup.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(companiesPageSetup.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    companiesPageSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await companiesPageSetup.clickElement(companiesPageSetup.grayDeleteIcon.last());
    await expect(companiesPageSetup.snackMessage).toContainText(Constants.playwrightCompany + " successfully deleted");
});

test('Korisnik moze da edituje Board', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.addCompany);
    await companiesPageSetup.fillCompanyName(companiesPageSetup.nameCompanyField, Constants.playwrightCompany);
    await companiesPageSetup.fillShortName(companiesPageSetup.shortNameField, Constants.shortName);
    await companiesPageSetup.clickAddButton();
    await companiesPageSetup.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(companiesPageSetup.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    await companiesPageSetup.clickElement(companiesPageSetup.pencilIcon.last());
    await companiesPageSetup.nameCompanyField.clear();
    await companiesPageSetup.fillCompanyName(companiesPageSetup.nameCompanyField, Constants.playwrightCompanyEdit);
    await companiesPageSetup.shortNameField.clear();
    await companiesPageSetup.fillShortName(companiesPageSetup.shortNameField, Constants.shortNameEdit);
    await companiesPageSetup.uncheck(companiesPageSetup.isActiveCheckbox.last());
    await companiesPageSetup.clickSaveButton();
    await expect(companiesPageSetup.companyNameColumn.last()).toContainText(Constants.playwrightCompany);
    await expect(companiesPageSetup.shortNameColumn.last()).toContainText(Constants.shortNameEdit);
    await expect(companiesPageSetup.isActiveColumn.last()).toContainText('NO');
    companiesPageSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await companiesPageSetup.clickElement(companiesPageSetup.grayDeleteIcon.last());
    await expect(companiesPageSetup.snackMessage).toContainText(" " + Constants.playwrightCompanyEdit + " successfully deleted");
});

test('Company name polje je obavezno u edit modalu', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.pencilIcon.first());
    await companiesPageSetup.nameCompanyField.clear();
    await companiesPageSetup.clickSaveButton();
    await expect(companiesPageSetup.errorMessage.first()).toContainText('The name field is required');
});

test('Short name polje je obavezno u edit modalu', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.pencilIcon.first());
    await companiesPageSetup.shortNameField.clear();
    await companiesPageSetup.clickSaveButton();
    await expect(companiesPageSetup.errorMessage.last()).toContainText('The short_name field is required');
});