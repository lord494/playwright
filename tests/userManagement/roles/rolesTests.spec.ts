import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { RolesPage } from '../../../page/userManagement/roles/rolesOverview.page';
import { get6RandomNumber } from '../../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.rolesUrl, { waitUntil: 'networkidle', timeout: 15000 });
});

test('30 rows per page je prikazano po defaultu', async ({ page }) => {
    const roles = new RolesPage(page);
    await expect(roles.rowsPerPageDropdownMenu).toContainText('30');
});

test('Izaberi 50 rows per page', async ({ page }) => {
    const roles = new RolesPage(page);
    await roles.selectRowsPerPage(roles.rowsPerPageDropdownMenu, roles.rows50PerPage);
    await expect(roles.rowsPerPageDropdownMenu).toContainText('50');
});

test('Korisnik moze da predje na sledecu stranicu', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto(Constants.rolesUrl, { waitUntil: 'networkidle', timeout: 15000 });
    const roles = new RolesPage(page);
    await page.waitForLoadState('networkidle');
    let paginationText = await roles.getPaginationText();
    const initialMatch = paginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    const [, start, end, total] = initialMatch?.map(Number) ?? [0, 0, 0, 0];
    await roles.clickElement(roles.rightArrow);
    const newPaginationText = await roles.getPaginationText();
    const newMatch = newPaginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    expect(newMatch).toBeTruthy();
    const [, newStart, newEnd, totalUsers] = newMatch?.map(Number) ?? [0, 0, 0, 0];
    expect(totalUsers).toBe(total);
    expect(newStart).toBe(end + 1);
    expect(newEnd).toBe(end + 30);
});

test('Korisnik moze da se vrati na prethodnu stranicu', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto(Constants.rolesUrl, { waitUntil: 'networkidle', timeout: 15000 });
    const roles = new RolesPage(page);
    await roles.clickElement(roles.rightArrow);
    await page.waitForLoadState('networkidle');
    let paginationText = await roles.getPaginationText();
    const initialMatch = paginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    const [, start, end, total] = initialMatch?.map(Number) ?? [0, 0, 0, 0];
    await roles.clickElement(roles.leftArrow);
    const newPaginationText = await roles.getPaginationText();
    const newMatch = newPaginationText.match(/^(\d+)-(\d+) of (\d+)$/);
    expect(newMatch).toBeTruthy();
    const [, newStart, newEnd, totalUsers] = newMatch?.map(Number) ?? [0, 0, 0, 0];
    expect(totalUsers).toBe(total);
    expect(newEnd).toBe(start - 1);
    expect(newEnd).toBe(end - 30);
});

test('Korisnik moze da otvori edit user modal', async ({ page }) => {
    const roles = new RolesPage(page);
    await roles.clickElement(roles.pencilIcon.first());
    await expect(roles.editAndAddModal).toBeVisible();
});

test('Korisnik moze da otvori add user modal', async ({ page }) => {
    const roles = new RolesPage(page);
    await roles.clickElement(roles.addRoleIcon);
    await expect(roles.editAndAddModal).toBeVisible();
});

test('Provjera da permisija moze da se doda i vracanje permisije u all permisions box', async ({ page }) => {
    const roles = new RolesPage(page);
    await roles.clickElement(roles.pencilIcon.nth(8))
    await page.waitForLoadState('networkidle');
    await roles.dragAndDropPermissionToCurrentPermissionsBox();
    await roles.clickElement(roles.saveButton);
    await roles.editAndAddModal.waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await roles.clickElement(roles.pencilIcon.nth(8));
    const permission = await roles.accountingEditPermissionsInCurrentBox.allTextContents();
    await expect(roles.currentPermissionsBox).toContainText(permission);
    await roles.dragAndDropPermissionFromCurrentPermissionsBox();
    await roles.clickElement(roles.saveButton);
    await roles.editAndAddModal.waitFor({ state: 'detached', timeout: 5000 });
});

test('Dodavanje role sa dodavanjem vise permisija', async ({ page }) => {
    const roles = new RolesPage(page);
    await roles.clickElement(roles.addRoleIcon);
    const roleName = 'Playwright Role ' + get6RandomNumber().join('');
    const expectedText = roleName.toUpperCase();
    await roles.enterRoleName(roles.nameRoleField, roleName);
    await roles.dragAndDropPermissionToCurrentPermissionsBoxAddModal();
    await roles.dragAndDropSecondPermissionToCurrentPermissionsBox();
    await roles.clickElement(roles.addButton);
    await roles.editAndAddModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(roles.snackMessage).toContainText(expectedText + ' role successfully added')
});

test('Korisnik ne moze da doda rolu sa vec postojecim imenom role', async ({ page }) => {
    const roles = new RolesPage(page);
    await roles.clickElement(roles.addRoleIcon);
    await roles.enterRoleName(roles.nameRoleField, Constants.readRole);
    await roles.clickElement(roles.addButton);
    await expect(roles.errorMessage).toBeVisible({ timeout: 2000 });
    await expect(roles.errorMessage).toContainText('Role must be unique')
});

test('Korisnik ne moze da doda rolu sa praznim role name poljem', async ({ page }) => {
    const roles = new RolesPage(page);
    await roles.clickElement(roles.addRoleIcon);
    await roles.enterRoleName(roles.nameRoleField, '');
    await roles.clickElement(roles.addButton);
    await expect(roles.errorMessage).toBeVisible({ timeout: 2000 });
    await expect(roles.errorMessage).toContainText('The name field is required')
});