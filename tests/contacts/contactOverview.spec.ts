import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da pretrazuje Contacte po emailu', async ({ contactPage }) => {
    await contactPage.searchContact(contactPage.searchField, Constants.testEmail);
    const concatEmail = await contactPage.emailColumn.all();
    for (let i = 0; i < concatEmail.length; i++) {
        const text = await contactPage.emailColumn.nth(i).innerText();
        expect(text.trim()).toContain(Constants.testEmail);
    }
});
test('Korisnik moze da pretrazuje Contacte po imenu', async ({ contactPage }) => {
    await contactPage.searchContact(contactPage.searchField, Constants.driverName);
    const concatName = await contactPage.nameColumn.all();
    for (let i = 0; i < concatName.length; i++) {
        const text = await contactPage.nameColumn.nth(i).innerText();
        expect(text.trim()).toContain(Constants.driverName);
    }
});

test('Korisnik moze da otvori modal za dodavanje Contacata', async ({ contactPage }) => {
    await contactPage.clickElement(contactPage.addContactButton);
    await expect(contactPage.dialogbox).toBeVisible();
});

test('Korisnik moze da otvori modal za editovanje Contacata', async ({ contactPage }) => {
    await contactPage.clickElement(contactPage.pencilIcon.first());
    await expect(contactPage.dialogbox).toBeVisible();
});
