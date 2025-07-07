import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { ContactsPage } from '../../page/contacts/contactsOverview.page';
import { AddContactsPage } from '../../page/contacts/addContact.page';
import { generateRandomString } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const contact = new ContactsPage(page);
    await page.goto(Constants.contactsUrl, { waitUntil: 'networkidle' });
    await contact.addContactButton.click();
});

test('Korisnik moze da doda Contact i da ga obrise', async ({ page }) => {
    const addContact = new AddContactsPage(page);
    const contact = new ContactsPage(page);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await addContact.enterName(addContact.nameField, Constants.driverName);
    await addContact.enterFloydExt(addContact.floydExtField, Constants.extField);
    await addContact.enterTrytimeExt(addContact.trytimeExtField, Constants.extSecond);
    await addContact.enterRocketExt(addContact.rocketExtField, Constants.extThird);
    await addContact.enterJordanExt(addContact.jordanExtField, Constants.extFourth);
    await addContact.enterPhoneNumber(addContact.phoneNumberField, Constants.phoneNumberOfUserApp);
    const email = generateRandomString(8) + '@example.com';
    await addContact.enterEmail(addContact.emailField, email);
    await addContact.enterCompany(addContact.companyField, Constants.testCompany);
    await addContact.enterPosition(addContact.positionField, Constants.newRole);
    await addContact.selectAssistant(addContact.assistantField, Constants.boskoQA, addContact.assistantOption);
    await addContact.isCheckedFC();
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/contacts')
        ),
        await addContact.clickElement(addContact.addButton)
    ]);
    expect([200, 304]).toContain(response.status());
    await contact.searchContact(contact.searchField, email);
    await expect(contact.nameColumn).toContainText(Constants.driverName);
    await expect(contact.floydExtColumn).toContainText(Constants.extField);
    await expect(contact.trytimeExtColumn).toContainText(Constants.extSecond);
    await expect(contact.rocketExtColumn).toContainText(Constants.extThird);
    await expect(contact.jordanExtColumn).toContainText(Constants.extFourth);
    await expect(contact.phoneNumberColumn).toContainText(Constants.phoneNumberOfUserApp);
    await expect(contact.emailColumn).toContainText(email);
    await expect(contact.companyColumn).toContainText(Constants.testCompany);
    await expect(contact.positionColumn).toContainText(Constants.newRole);
    await expect(contact.isActiveColumn).toContainText('YES');
    await contact.deleteIcon.click();
    await expect(contact.snackMessage).toContainText(Constants.driverName + ' successfully deleted')
});

test('Name je obavezno polje', async ({ page }) => {
    const addContact = new AddContactsPage(page);
    await addContact.enterPhoneNumber(addContact.phoneNumberField, Constants.phoneNumberOfUserApp);
    await addContact.enterEmail(addContact.emailField, Constants.testEmail);
    await addContact.addButton.click();
    await expect(addContact.errorMessage.first()).toContainText('The name field is required');
});

test('Phone number je obavezno polje', async ({ page }) => {
    const addContact = new AddContactsPage(page);
    await addContact.enterName(addContact.nameField, Constants.driverName);
    await addContact.enterEmail(addContact.emailField, Constants.testEmail);
    await addContact.addButton.click();
    await expect(addContact.errorMessage.first()).toContainText('The phone field is required');
});

test('Email je obavezno polje', async ({ page }) => {
    const addContact = new AddContactsPage(page);
    await addContact.enterName(addContact.nameField, Constants.driverName);
    await addContact.enterPhoneNumber(addContact.phoneNumberField, Constants.phoneNumberOfUserApp);
    await addContact.addButton.click();
    await expect(addContact.errorMessage.first()).toContainText('The email field is required');
});

test('Name, email, position polja se popune kada korisnik izabere opciju iz populate field', async ({ page }) => {
    const addContact = new AddContactsPage(page);
    await addContact.selectPopulatedField(addContact.populatedField, Constants.boskoQA, addContact.assistantOption);
    await expect(addContact.nameField).toHaveValue(Constants.boskoQA);
    await expect(addContact.emailField).toHaveValue(Constants.boskoQAEmail);
    await expect(addContact.positionField).toHaveValue(Constants.boskoQAPosition);
});
