import { test } from '../../fixtures/api.fixture';
import { expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { FndUserPage } from '../../../page/userManagement/fndUsers/fndUser.page';
import { generateRandomLetters } from '../../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.fndUserUrl);
    const fndBoard = page.locator('tr', {
        has: page.locator('td:nth-child(3)', { hasText: 'Fnd User' })
    });
    await fndBoard.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da pretrazuje Usera po imenu', async ({ page, userService }) => {
    // Search for a user this test owns — the first table row can be edited/deleted by another worker.
    const uniqueName = Constants.playWrightUser + ' ' + generateRandomLetters(8);
    await userService.createFndUser({ name: uniqueName });
    const user = new FndUserPage(page);
    await user.searchUser(user.searchInputField, uniqueName);
    await expect(user.userNameColumn).toHaveText([uniqueName], { timeout: 15000 });
});

test('Korisnik moze da pretrazuje Usera po email-u', async ({ page, userService }) => {
    const created = await userService.createFndUser();
    const user = new FndUserPage(page);
    await user.searchUser(user.searchInputField, created.email);
    await expect(user.emailColumn).toHaveText([created.email], { timeout: 15000 });
});

test('15 rows per page je prikazano po defaultu', async ({ page }) => {
    const user = new FndUserPage(page);
    await expect(user.rowsPerPageDropdownMenu).toContainText('15');
});

test('Izaberi 10 rows per page', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.selectRowsPerPage(user.rowsPerPageDropdownMenu, user.rows10PerPage);
    await expect(user.rowsPerPageDropdownMenu).toContainText('10');
});

test('Izaberi 25 rows per page', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.selectRowsPerPage(user.rowsPerPageDropdownMenu, user.rows25PerPage);
    await expect(user.rowsPerPageDropdownMenu).toContainText('25');
});


test('Kada korisnik klikne na account ikonicu otvore se ikonicu za invite i add usera', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.clickElement(user.accountIcon);
    await expect(user.addUserIcon).toBeVisible();
});

test('Korisnik moze da zatvori account meni klikom na "X" ikonicu', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.closeIcon);
    await expect(user.accountIcon).toBeVisible();
});


test('Korisnik moze da otvori add user modal', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.addUserIcon);
    await expect(user.addModal).toBeVisible();
});

test('Korisnik moze da otvori edit user modal', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.clickElement(user.pencilIcon.first());
    await expect(user.addModal).toBeVisible();
});

test('Korisnik moze da otvori devices modal', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.clickElement(user.keyIcon.first());
    await expect(user.addModal).toBeVisible();
});

test('Korisnik moze da obrise usera na sivu ikonicu', async ({ page, userService }) => {
    // Delete only a user this test created — never the first table row (shared between workers).
    const created = await userService.createFndUser();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const user = new FndUserPage(page);
    await user.searchUser(user.searchInputField, created.email);
    await expect(user.emailColumn).toHaveText([created.email], { timeout: 15000 });
    await user.clickElement(user.grayDeleteIcon.first());
    await expect(user.snackMessage).toContainText("User: " + created.email + " successfully deleted");
});

test('Korisnik moze da obrise usera skroz na crvenu ikonicu', async ({ page, userService }) => {
    const created = await userService.createFndUser();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const user = new FndUserPage(page);
    await user.searchUser(user.searchInputField, created.email);
    await expect(user.emailColumn).toHaveText([created.email], { timeout: 15000 });
    await user.clickElement(user.redDeleteIcon.first());
    await expect(user.snackMessage).toContainText("User: " + created.email + " successfully deleted");
});
