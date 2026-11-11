import { test } from '../../fixtures/api.fixture';
import { expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { UsersPage } from '../../../page/userManagement/users/users.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const user = new UsersPage(page);
    await page.goto(Constants.userUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await user.emailColumn.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da pretrazuje Usera po imenu', async ({ page }) => {
    const user = new UsersPage(page);
    await user.boardColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await user.searchUser(user.searchInputField, Constants.playWrightUser);
    const userNameCell = page.locator(`td:nth-child(1):has-text("${Constants.playWrightUser}")`);
    await expect(userNameCell.first()).toBeVisible({ timeout: 10000 });
    const rowCount = await user.userNameColumn.count();
    for (let i = 0; i < rowCount; i++) {
        const rowText = await user.userNameColumn.nth(i).innerText();
        expect(rowText).toContain(Constants.playWrightUser);
    }
});

test('Korisnik moze da pretrazuje Usera po email-u', async ({ page }) => {
    const user = new UsersPage(page);
    await user.searchUser(user.searchInputField, Constants.playWrightUserEmail);
    const emailCell = page.locator(`td:nth-child(4):has-text("${Constants.playWrightUserEmail}")`);
    await expect(emailCell.first()).toBeVisible({ timeout: 10000 });
    await user.emailColumn.nth(3).waitFor({ state: 'hidden', timeout: 5000 });
    await expect(user.emailColumn).toContainText(Constants.playWrightUserEmail);
});

test('15 rows per page je prikazano po defaultu', async ({ page }) => {
    const user = new UsersPage(page);
    await expect(user.rowsPerPageDropdownMenu).toContainText('15');
});

test('Izaberi 10 rows per page', async ({ page }) => {
    const user = new UsersPage(page);
    await user.selectRowsPerPage(user.rowsPerPageDropdownMenu, user.rows10PerPage);
    await expect(user.rowsPerPageDropdownMenu).toContainText('10');
});

test('Izaberi 25 rows per page', async ({ page }) => {
    const user = new UsersPage(page);
    await user.selectRowsPerPage(user.rowsPerPageDropdownMenu, user.rows25PerPage);
    await expect(user.rowsPerPageDropdownMenu).toContainText('25');
});

test('Korisnik moze da predje na sledecu stranicu', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto(Constants.userUrl);
    const user = new UsersPage(page);
    await page.waitForLoadState('networkidle');
    await expect(user.paginationLocator).toHaveText(/^\d+-\d+ of \d+$/);
    let paginationText = await user.getPaginationText();
    const initialMatch = paginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    const [, start, end, total] = initialMatch?.map(Number) ?? [0, 0, 0, 0];
    await user.clickElement(user.rightArrow);
    // Pagination text re-renders after the response — wait for it instead of reading the old value.
    await expect(user.paginationLocator).not.toHaveText(paginationText, { timeout: 10000 });
    const newPaginationText = await user.getPaginationText();
    const newMatch = newPaginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    expect(newMatch).toBeTruthy();
    const [, newStart, newEnd, totalUsers] = newMatch?.map(Number) ?? [0, 0, 0, 0];
    // Total is not compared strictly: other workers create/delete users in parallel.
    expect(totalUsers).toBeGreaterThan(end);
    expect(newStart).toBe(end + 1);
    expect(newEnd).toBe(Math.min(end + 15, totalUsers));
});

test('Korisnik moze da se vrati na prethodnu stranicu', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto(Constants.userUrl);
    const user = new UsersPage(page);
    await expect(user.paginationLocator).toHaveText(/^1-\d+ of \d+$/, { timeout: 10000 });
    await user.clickElement(user.rightArrow);
    await expect(user.paginationLocator).not.toHaveText(/^1-\d+ of \d+$/, { timeout: 10000 });
    let paginationText = await user.getPaginationText();
    const initialMatch = paginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    const [, start, end, total] = initialMatch?.map(Number) ?? [0, 0, 0, 0];
    await user.clickElement(user.leftArrow);
    await expect(user.paginationLocator).not.toHaveText(paginationText, { timeout: 10000 });
    const newPaginationText = await user.getPaginationText();
    const newMatch = newPaginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    expect(newMatch).toBeTruthy();
    const [, newStart, newEnd, totalUsers] = newMatch?.map(Number) ?? [0, 0, 0, 0];
    // Total is not compared strictly: other workers create/delete users in parallel.
    expect(totalUsers).toBeGreaterThan(0);
    expect(newStart).toBe(start - 15);
    expect(newEnd).toBe(start - 1);
});

test('Kada korisnik klikne na account ikonicu otvore se ikonicu za invite i add usera', async ({ page }) => {
    const user = new UsersPage(page);
    await user.clickElement(user.accountIcon);
    await expect(user.inviteUserIcon).toBeVisible();
    await expect(user.addUserIcon).toBeVisible();
});

test('Korisnik moze da zatvori account meni klikom na "X" ikonicu', async ({ page }) => {
    const user = new UsersPage(page);
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.closeIcon);
    await expect(user.accountIcon).toBeVisible();
});

test('Korisnik moze da otvori invite user modal', async ({ page }) => {
    const user = new UsersPage(page);
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.inviteUserIcon);
    await expect(user.inviteAddUserModal).toBeVisible();
});

test('Korisnik moze da otvori add user modal', async ({ page }) => {
    const user = new UsersPage(page);
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.addUserIcon);
    await expect(user.inviteAddUserModal).toBeVisible();
});

test('Korisnik moze da otvori edit user modal', async ({ page }) => {
    const user = new UsersPage(page);
    await user.clickElement(user.pencilIcon.first());
    await expect(user.inviteAddUserModal).toBeVisible();
});

test('Korisnik moze da otvori devices modal', async ({ page }) => {
    const user = new UsersPage(page);
    await user.clickElement(user.keyIcon.first());
    await expect(user.inviteAddUserModal).toBeVisible();
});

test('Korisnik moze da obrise usera na sivu ikonicu', async ({ page, userService }) => {
    // Delete only a user this test created — never the first table row (shared between workers).
    const created = await userService.createFndUser();
    const user = new UsersPage(page);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await user.searchUser(user.searchInputField, created.email);
    await expect(user.emailColumn).toHaveText([created.email], { timeout: 15000 });
    await user.clickElement(user.grayDeleteIcon.first());
    await expect(user.snackMessage).toContainText("User: " + created.email + " successfully deleted");
});

test('Korisnik moze da obrise usera skroz na crvenu ikonicu', async ({ page, userService }) => {
    const created = await userService.createFndUser();
    const user = new UsersPage(page);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await user.searchUser(user.searchInputField, created.email);
    await expect(user.emailColumn).toHaveText([created.email], { timeout: 15000 });
    await user.clickElement(user.redDeleteIcon.first());
    await expect(user.snackMessage).toContainText("User: " + created.email + " successfully deleted");
});
