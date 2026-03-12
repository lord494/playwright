import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { generateRandomString } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda Contact i da ga obrise', async ({ addContactPage, contactPage }) => {
    addContactPage.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await addContactPage.addContactButton.click();
    await addContactPage.enterName(addContactPage.nameField, Constants.driverName);
    await addContactPage.enterFloydExt(addContactPage.floydExtField, Constants.extField);
    await addContactPage.enterTrytimeExt(addContactPage.trytimeExtField, Constants.extSecond);
    await addContactPage.enterRocketExt(addContactPage.rocketExtField, Constants.extThird);
    await addContactPage.enterJordanExt(addContactPage.jordanExtField, Constants.extFourth);
    await addContactPage.enterPhoneNumber(addContactPage.phoneNumberField, Constants.phoneNumberOfUserApp);
    const email = generateRandomString(8) + '@example.com';
    await addContactPage.enterEmail(addContactPage.emailField, email);
    await addContactPage.enterCompany(addContactPage.companyField, Constants.testCompany);
    await addContactPage.enterPosition(addContactPage.positionField, Constants.newRole);
    await addContactPage.selectAssistant(addContactPage.assistantField, Constants.boskoQA, addContactPage.assistantOption);
    await addContactPage.isCheckedFC();
    const [response] = await Promise.all([
        addContactPage.page.waitForResponse(res =>
            res.url().includes('/api/contacts')
        ),
        await addContactPage.clickElement(addContactPage.addButton)
    ]);
    expect([200, 304]).toContain(response.status());
    await contactPage.searchContact(contactPage.searchField, email);
    await expect(contactPage.nameColumn).toContainText(Constants.driverName);
    await expect(contactPage.floydExtColumn).toContainText(Constants.extField);
    await expect(contactPage.trytimeExtColumn).toContainText(Constants.extSecond);
    await expect(contactPage.rocketExtColumn).toContainText(Constants.extThird);
    await expect(contactPage.jordanExtColumn).toContainText(Constants.extFourth);
    await expect(contactPage.phoneNumberColumn).toContainText(Constants.phoneNumberOfUserApp);
    await expect(contactPage.emailColumn).toContainText(email);
    await expect(contactPage.companyColumn).toContainText(Constants.testCompany);
    await expect(contactPage.positionColumn).toContainText(Constants.newRole);
    await expect(contactPage.isActiveColumn).toContainText('YES');
    await contactPage.deleteIcon.click();
    await expect(contactPage.snackMessage).toContainText(Constants.driverName + ' successfully deleted')
});

test('Name je obavezno polje', async ({ addContactPage, contactPage }) => {
    await addContactPage.addContactButton.click();
    await addContactPage.enterPhoneNumber(addContactPage.phoneNumberField, Constants.phoneNumberOfUserApp);
    await addContactPage.enterEmail(addContactPage.emailField, Constants.testEmail);
    await addContactPage.addButton.click();
    await expect(addContactPage.errorMessage.first()).toContainText('The name field is required');
});

test('Phone number je obavezno polje', async ({ addContactPage, contactPage }) => {
    await addContactPage.addContactButton.click();
    await addContactPage.enterName(addContactPage.nameField, Constants.driverName);
    await addContactPage.enterEmail(addContactPage.emailField, Constants.testEmail);
    await addContactPage.addButton.click();
    await expect(addContactPage.errorMessage.first()).toContainText('The phone field is required');
});

test('Email je obavezno polje', async ({ addContactPage, contactPage }) => {
    await addContactPage.addContactButton.click();
    await addContactPage.enterName(addContactPage.nameField, Constants.driverName);
    await addContactPage.enterPhoneNumber(addContactPage.phoneNumberField, Constants.phoneNumberOfUserApp);
    await addContactPage.addButton.click();
    await expect(addContactPage.errorMessage.first()).toContainText('The email field is required');
});

test('Name, email, position polja se popune kada korisnik izabere opciju iz populate field', async ({ addContactPage, contactPage }) => {
    await addContactPage.addContactButton.click();
    await addContactPage.selectPopulatedField(addContactPage.populatedField, Constants.boskoQA, addContactPage.assistantOption);
    await expect(addContactPage.nameField).toHaveValue(Constants.boskoQA);
    await expect(addContactPage.emailField).toHaveValue(Constants.boskoQAEmail);
    await expect(addContactPage.positionField).toHaveValue(Constants.boskoQAPosition);
});
