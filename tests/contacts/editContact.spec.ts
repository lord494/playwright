import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { ContactsPage } from '../../page/contacts/contactsOverview.page';
import { AddContactsPage } from '../../page/contacts/addContact.page';
import { generateRandomString } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const contact = new ContactsPage(page);
    const addContact = new AddContactsPage(page);
    await page.goto(Constants.contactsUrl, { waitUntil: 'networkidle' });
    await contact.addContactButton.click();
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
});

test('Korisnik moze da edituje Contact', async ({ page }) => {
    const contact = new ContactsPage(page);
    const addContact = new AddContactsPage(page);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await contact.pencilIcon.click();
    await addContact.nameField.fill('');
    await addContact.enterName(addContact.nameField, Constants.driverNameFraser);
    await addContact.phoneNumberField.fill('');
    await addContact.enterPhoneNumber(addContact.phoneNumberField, Constants.adminPhone);
    const email2 = generateRandomString(8) + '@example.com';
    await addContact.emailField.fill('');
    await addContact.enterEmail(addContact.emailField, email2);
    await addContact.companyField.fill('');
    await addContact.enterCompany(addContact.companyField, Constants.rocketCompany);
    await addContact.positionField.fill('');
    await addContact.enterPosition(addContact.positionField, Constants.readRole);
    await addContact.uncheck(addContact.isActiveCheckbox);
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/contacts')
        ),
        await addContact.clickElement(addContact.saveButton)
    ]);
    expect([200, 304]).toContain(response.status());
    await expect(contact.nameColumn).toContainText(Constants.driverNameFraser);
    await expect(contact.phoneNumberColumn).toContainText(Constants.adminPhone);
    await expect(contact.emailColumn).toContainText(email2);
    await expect(contact.companyColumn).toContainText(Constants.rocketCompany);
    await expect(contact.positionColumn).toContainText(Constants.readRole);
    await expect(contact.isActiveColumn).toContainText("NO");
    await contact.deleteIcon.click();
    await expect(contact.snackMessage).toContainText(Constants.driverNameFraser + ' successfully deleted');
});

test('Korisnik moze da edituje Contact pomocu populate fields', async ({ page }) => {
    const contact = new ContactsPage(page);
    const addContact = new AddContactsPage(page);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await contact.pencilIcon.click();
    await addContact.selectPopulatedField(addContact.populatedField, Constants.boskoQA, addContact.assistantOption);
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/contacts')
        ),
        await addContact.clickElement(addContact.saveButton)
    ]);
    expect([200, 304]).toContain(response.status());
    await expect(contact.nameColumn).toContainText(Constants.boskoQA);
    await expect(contact.emailColumn).toContainText(Constants.boskoQAEmail);
    await expect(contact.positionColumn).toContainText(Constants.boskoQAPosition);
});