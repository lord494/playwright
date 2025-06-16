import { test, expect, chromium, Page } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { ManageAppUserPage } from '../../../page/userManagement/manageAppUsers/manageAppUserOverview.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await page.goto(Constants.manageAppUsersUrl);
    await app.card.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da pretrazuje usere po emailu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail);
    await app.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await expect(app.card).toContainText(Constants.testEmail);
});

test('Korisnik moze da pretrazuje usere po imenu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.appTestUser);
    await page.waitForLoadState('networkidle');
    await app.card.nth(10).waitFor({ state: 'hidden', timeout: 3000 });
    const count = await app.cardTitle.count();
    for (let i = 0; i < count; i++) {
        const cardText = await app.cardTitle.nth(i).textContent();
        expect(cardText).toContain(Constants.appTestUser);
    }
});

test('Korisnik moze da pretrazuje usere po broju telefona', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillPhoneNumberInSearchField(app.phoneNumberSearchInputField, Constants.phoneNumberOfUserApp);
    await page.waitForLoadState('networkidle');
    await app.card.nth(10).waitFor({ state: 'hidden', timeout: 3000 });
    const count = await app.card.count();
    for (let i = 0; i < count; i++) {
        const cardText = await app.card.nth(i).textContent();
        expect(cardText).toContain(Constants.phoneNumberOfUserApp);
    }
});

test('Korisnik moze da pretrazuje usere po statusu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.selectStatusFromMenu(app.statusDropdown, app.notVerifiedOption);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const count = await app.card.count();
    for (let i = 0; i < count; i++) {
        const cardText = await app.card.nth(i).textContent();
        expect(cardText).toContain(Constants.notVerifiedStatus);
    }
});

test('Korisnik moze da pretrazuje dispatchere po emailu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.searchDispatcherInputField, Constants.playWrightUserEmail);
    const dispatcherName = await app.emailOnDispatcherCard.allInnerTexts();
    await expect(dispatcherName).toContain(Constants.playWrightUserEmail);
});

test('Korisnik moze da pretrazuje dispatchere po imenu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.searchDispatcherInputField, Constants.playWrightUser);
    const dispatcherName = await app.emailOnDispatcherCard.allInnerTexts();
    await expect(dispatcherName).toContain(Constants.playWrightUserEmail);
    const count = await app.nameOnDispatcherCard.count();
    for (let i = 0; i < count; i++) {
        const cardText = await app.nameOnDispatcherCard.nth(i).textContent();
        expect(cardText).toContain(Constants.playWrightUser);
    }
});

test('X ikonica se prikaze kada korisnik unese nesto u search polja i korisnik moze da klikne na taj X da izbrise unos', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail);
    await app.fillPhoneNumberInSearchField(app.searchDispatcherInputField, Constants.playWrightUserEmail);
    await app.selectStatusFromMenu(app.statusDropdown, app.notVerifiedOption);
    await app.fillPhoneNumberInSearchField(app.searchDispatcherInputField, Constants.playWrightUserEmail);
    await app.nameOrEmailSearchInputField.hover();
    await app.clickElement(app.xIcon.first());
    await app.searchDispatcherInputField.hover();
    await app.clickElement(app.xIcon.first());
    await app.clickElement(app.xIcon.first());
    await app.searchDispatcherInputField.hover();
    await app.clickElement(app.xIcon.last());
    await expect(app.nameOrEmailSearchInputField).toContainText('Name or email ...');
    await expect(app.phoneNumberSearchInputField).toContainText('Phone number');
    await expect(app.statusDropdown).toContainText('All');
    await expect(app.searchDispatcherInputField).toBeEmpty;
});

test('Korisnik moze da konektuje usera sa vozacem', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail);
    await page.waitForLoadState('networkidle');
    await app.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    await app.selectDriverFromMenu(app.driverMenu, 'test', app.driverTestOption);
    await app.clickElement(app.saveButton);
    await app.connectDriverModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(app.card).toContainText(Constants.driverTest);
    await app.selectDriverFromMenu(app.driverMenu, 'test', app.testUserOption);
    await app.clickElement(app.saveButton);
    await app.connectDriverModal.waitFor({ state: 'detached', timeout: 5000 });
});

test('Korisnik moze da dozvoli self dispatch vozacu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail);
    await page.waitForLoadState('networkidle');
    await app.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    if (await app.allowSelfDispatch.isVisible()) {
        await app.allowSelfDispatch.click();
    }
    await app.clickElement(app.forbidSelfDispatch);
    await expect(app.allowSelfDispatch).toBeVisible();
    //test123
});

test('Korisnik moze da verifikuje vozaca', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail)
    await app.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    if (await app.verifyIconIcon.isVisible()) {
        await app.verifyIconIcon.click();
        await app.snackMessage.waitFor({ state: 'visible', timeout: 5000 });
    }
    await app.clickElement(app.unverifyIcon);
    await expect(app.verifyIconIcon).toBeVisible();
});

//Testovi koje je napisao coplilot, treba ih proveriti

// test('Korisnik moze da unverify vozaca', async ({ page }) => {
//     const app = new ManageAppUserPage(page);
//     await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail)
//     await app.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
//     page.on('dialog', async (dialog) => {
//         await dialog.accept();
//     });
//     if (await app.unverifyIcon.isVisible()) {
//         await app.unverifyIcon.click();
//         await app.snackMessage.waitFor({ state: 'visible', timeout: 5000 });
//     }
//     await app.clickElement(app.verifyIconIcon);
//     await expect(app.unverifyIcon).toBeVisible();
// });
// test('Korisnik moze da unconnectuje vozaca', async ({ page }) => {
//     const app = new ManageAppUserPage(page);
//     await app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail)
//     await app.card.nth(5).waitFor({ state: 'hidden', timeout: 10000 });
//     page.on('dialog', async (dialog) => {
//         await dialog.accept();
//     });
//     if (await app.xIconOnDispatherField.isVisible()) {
//         await app.xIconOnDispatherField.click();
//         await app.snackMessage.waitFor({ state: 'visible', timeout: 5000 });
//     }
//     await expect(app.dispathersInCard).toBeEmpty;
// });
