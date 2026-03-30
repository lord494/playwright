import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da pretrazuje Contacte po emailu', async ({ contactPage }) => {
    const beforeSearch = await contactPage.emailColumn.allTextContents();
    const responsePromise = contactPage.page.waitForResponse(response => {
        const url = new URL(response.url());
        return url.pathname === '/api/contacts' && url.searchParams.get('search') === Constants.testEmail && response.status() === 200;
    });
    await contactPage.searchContact(contactPage.searchField, Constants.testEmail);
    await responsePromise;
    const afterSearch = await contactPage.emailColumn.allTextContents();
    expect(afterSearch).not.toEqual(beforeSearch);
    expect(afterSearch.every(email => email.toLowerCase().includes(Constants.testEmail.toLowerCase()))).toBeTruthy();
});

test('Korisnik moze da pretrazuje Contacte po imenu', async ({ contactPage }) => {
    const beforeSearch = await contactPage.nameColumn.allTextContents();
    const responsePromise = contactPage.page.waitForResponse(response => {
        const url = new URL(response.url());
        return url.pathname === '/api/contacts' && url.searchParams.get('search') === Constants.driverName && response.status() === 200;
    });
    await contactPage.searchContact(contactPage.searchField, Constants.driverName);
    await responsePromise;
    const afterSearch = await contactPage.nameColumn.allTextContents();
    expect(afterSearch).not.toEqual(beforeSearch);
    expect(afterSearch.every(name => name.toLowerCase().includes(Constants.driverName.toLowerCase()))).toBeTruthy();
});

test('Korisnik moze da otvori modal za dodavanje Contacata', async ({ contactPage }) => {
    await contactPage.clickElement(contactPage.addContactButton);
    await expect(contactPage.dialogbox).toBeVisible();
});

test('Korisnik moze da otvori modal za editovanje Contacata', async ({ contactPage }) => {
    await contactPage.clickElement(contactPage.pencilIcon.first());
    await expect(contactPage.dialogbox).toBeVisible();
});
