import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { ManageAppUserPage } from '../../../page/userManagement/manageAppUsers/manageAppUserOverview.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.manageAppUsersUrl, { waitUntil: 'networkidle', timeout: 15000 });
});

test('Korisnik moze da pretrazuje usere po emailu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/app-users') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail)
    ]);
    await expect(app.card).toContainText(Constants.testEmail);
});

test('Korisnik moze da pretrazuje usere po imenu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/app-users') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.appTestUser)
    ]);
    const count = await app.cardTitle.count();
    for (let i = 0; i < count; i++) {
        const cardText = await app.cardTitle.nth(i).textContent();
        expect(cardText).toContain(Constants.appTestUser);
    }
});

test('Korisnik moze da pretrazuje usere po broju telefona', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/app-users') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        app.fillPhoneNumberInSearchField(app.phoneNumberSearchInputField, Constants.phoneNumberOfUserApp)
    ]);
    const count = await app.card.count();
    for (let i = 0; i < count; i++) {
        const cardText = await app.card.nth(i).textContent();
        expect(cardText).toContain(Constants.phoneNumberOfUserApp);
    }
});

test('Korisnik moze da pretrazuje usere po statusu', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/app-users') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        app.selectStatusFromMenu(app.statusDropdown, app.notVerifiedOption)
    ]);
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
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/app-users') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail)
    ]);
    if (await app.allowSelfDispatch.isVisible()) {
        await app.allowSelfDispatch.click();
    }
    await app.clickElement(app.forbidSelfDispatch);
    await expect(app.allowSelfDispatch).toBeVisible();
});

test('Korisnik moze da verifikuje vozaca', async ({ page }) => {
    const app = new ManageAppUserPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/app-users') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        app.fillNameOrEmailSearchField(app.nameOrEmailSearchInputField, Constants.testEmail)
    ]);
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