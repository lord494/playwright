import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { generateRandomString } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da edituje Contact', async ({ createdContact, contactPage, addContactPage }) => {
    const emailBefore = createdContact.email;
    contactPage.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await contactPage.pencilIcon.click();
    await addContactPage.nameField.fill('');
    await addContactPage.enterName(addContactPage.nameField, Constants.driverNameFraser);
    await addContactPage.phoneNumberField.fill('');
    await addContactPage.enterPhoneNumber(addContactPage.phoneNumberField, Constants.adminPhone);
    const email2 = generateRandomString(8) + '@example.com';
    await addContactPage.emailField.fill('');
    await addContactPage.enterEmail(addContactPage.emailField, email2);
    await addContactPage.companyField.fill('');
    await addContactPage.enterCompany(addContactPage.companyField, Constants.rocketCompany);
    await addContactPage.positionField.fill('');
    await addContactPage.enterPosition(addContactPage.positionField, Constants.readRole);
    await addContactPage.uncheck(addContactPage.isActiveCheckbox);
    const [response] = await Promise.all([
        contactPage.page.waitForResponse(res => res.url().includes('/api/contacts')),
        addContactPage.clickElement(addContactPage.saveButton)
    ]);
    expect([200, 304]).toContain(response.status());
    await expect(contactPage.nameColumn).toContainText(Constants.driverNameFraser);
    await expect(contactPage.phoneNumberColumn).toContainText(Constants.adminPhone);
    await expect(contactPage.emailColumn).toContainText(email2);
    await expect(contactPage.companyColumn).toContainText(Constants.rocketCompany);
    await expect(contactPage.positionColumn).toContainText(Constants.readRole);
    await expect(contactPage.isActiveColumn).toContainText('NO');
    await contactPage.deleteIcon.click();
    await expect(contactPage.snackMessage).toContainText(Constants.driverNameFraser + ' successfully deleted');
});

test('Korisnik moze da edituje Contact pomocu populate fields', async ({ createdContact, contactPage, addContactPage }) => {
    contactPage.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await contactPage.pencilIcon.click();
    await addContactPage.selectPopulatedField(addContactPage.populatedField, Constants.boskoQA, addContactPage.assistantOption);
    const [response] = await Promise.all([
        contactPage.page.waitForResponse(res =>
            res.url().includes('/api/contacts')
        ),
        await addContactPage.clickElement(addContactPage.saveButton)
    ]);
    expect([200, 304]).toContain(response.status());
    await expect(contactPage.nameColumn).toContainText(Constants.boskoQA);
    await expect(contactPage.emailColumn).toContainText(Constants.boskoQAEmail);
    await expect(contactPage.positionColumn).toContainText(Constants.boskoQAPosition);
});