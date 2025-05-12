import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { FndUserPage } from '../../../page/userManagement/fndUsers/fndUser.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.fndUserUrl);
    const fndBoard = page.locator('tr', {
        has: page.locator('td:nth-child(3)', { hasText: 'Fnd User' })
    });
    await fndBoard.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da pretrazuje Usera po imenu', async ({ page }) => {
    const user = new FndUserPage(page);
    const name = (await user.userNameColumn.first().allInnerTexts()).toString();
    await user.searchUser(user.searchInputField, name);
    await expect(user.userNameColumn.first()).toContainText(name, { timeout: 10000 });
});

test('Korisnik moze da pretrazuje Usera po email-u', async ({ page }) => {
    const user = new FndUserPage(page);
    const email = (await user.emailColumn.first().allInnerTexts()).toString();
    await user.searchUser(user.searchInputField, email);
    await user.emailColumn.nth(2).waitFor({ state: 'hidden', timeout: 10000 });
    await expect(user.emailColumn.first()).toContainText(email);
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

test('Korisnik moze da obrise usera na sivu ikonicu', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.emailColumn.nth(1).waitFor({ state: 'visible', timeout: 5000 });
    const email = await user.emailColumn.first().allInnerTexts();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await user.clickElement(user.grayDeleteIcon.first());
    await page.waitForLoadState('networkidle');
    await expect(user.snackMessage).toContainText("User: " + email + " successfully deleted");
});

test('Korisnik moze da obrise usera skroz na crvenu ikonicu', async ({ page }) => {
    const user = new FndUserPage(page);
    await user.emailColumn.nth(1).waitFor({ state: 'visible', timeout: 5000 });
    const email = await user.emailColumn.first().allInnerTexts();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await user.clickElement(user.redDeleteIcon.first());
    await page.waitForLoadState('networkidle');
    await expect(user.snackMessage).toContainText("User: " + email + " successfully deleted");
});
