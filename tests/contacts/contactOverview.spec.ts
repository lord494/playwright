import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { ContactsPage } from '../../page/contacts/contactsOverview.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.contactsUrl, { waitUntil: 'networkidle' });
});

test('Korisnik moze da pretrazuje Contacte po emailu', async ({ page }) => {
    const contact = new ContactsPage(page);
    await contact.searchContact(contact.searchField, Constants.testEmail);
    const concatEmail = await contact.emailColumn.all();
    for (let i = 0; i < concatEmail.length; i++) {
        const text = await contact.emailColumn.nth(i).innerText();
        expect(text.trim()).toContain(Constants.testEmail);
    }
});

test('Korisnik moze da pretrazuje Contacte po imenu', async ({ page }) => {
    const contact = new ContactsPage(page);
    await contact.searchContact(contact.searchField, Constants.driverName);
    const concatName = await contact.nameColumn.all();
    for (let i = 0; i < concatName.length; i++) {
        const text = await contact.nameColumn.nth(i).innerText();
        expect(text.trim()).toContain(Constants.driverName);
    }
});

test('Korisnik moze da otvori modal za dodavanje Contacata', async ({ page }) => {
    const contact = new ContactsPage(page);
    await contact.clickElement(contact.addContactButton);
    await expect(contact.dialogbox).toBeVisible();
});

test('Korisnik moze da otvori modal za editovanje Contacata', async ({ page }) => {
    const contact = new ContactsPage(page);
    await contact.clickElement(contact.pencilIcon.first());
    await expect(contact.dialogbox).toBeVisible();
});