import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { InviteAddEditModalPage } from '../../../page/userManagement/users/inviteAddEditUser.page';
import { UsersPage } from '../../../page/userManagement/users/users.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.userUrl);
    const user = new UsersPage(page);
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.addUserIcon);
});

test('Korisnik moze da doda usera popunjavanjem svih polja', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const user = new UsersPage(page);
    const email = invite.generateUniqueEmail();
    await invite.enterData(invite.emailField, email);
    await invite.enterData(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await invite.selectOptionFromMenu(invite.boardField, invite.b1Board);
    await invite.enterData(invite.extField, Constants.extField);
    await invite.enterData(invite.phoneField, Constants.adminPhone);
    await invite.enterOrder(invite.orderField, Constants.order);
    await invite.checkCheckbox(invite.teamLeadCheckbox);
    await invite.checkCheckbox(invite.isActiveCheckbox);
    await invite.enterData(invite.passwordField, Constants.password);
    await invite.dragAndDrop();
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.snackMessage).toContainText("User: " + email + " successfully added");
    await user.searchUser(user.searchInputField, email);
    await user.emailColumn.nth(3).waitFor({ state: 'hidden', timeout: 5000 });
    await expect(user.emailColumn).toContainText(email);
    await expect(user.userNameColumn).toContainText(Constants.playWrightUser);
    await expect(user.boardColumn).toContainText(Constants.firtsBoard);
    await expect(user.roleColumn).toContainText(Constants.dispatcher);
    await expect(user.orderColumn).toContainText(Constants.order);
    await expect(user.teamLeadColumn).toContainText(Constants.teamLeadYes);
    await expect(user.extColumn).toContainText(Constants.extField);
});

test('Email polje mora biti unique', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.fillInputField(invite.emailField, Constants.playWrightUserEmail);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await invite.errorMessage.waitFor({ state: "visible", timeout: 5000 });
    await expect(invite.errorMessage).toContainText("Email must be unique");
});

test('Email polje je obavezno', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The email field is required');
});

test('Name polje je obavezno', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.fillInputField(invite.emailField, email);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The name field is required');
});

test('Role polje je obavezno', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.fillInputField(invite.emailField, email);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The role field is required');
});

test('Password polje je obavezno', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.fillInputField(invite.emailField, email);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The password field is required');
});

test('Email forma mora biti validna', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.fillInputField(invite.emailField, Constants.wrongEmailFormat);
    await expect(invite.errorMessage).toContainText("The email field must be a valid email");
});

test('Phone number polje je vidljivo kada korisnik izabere Dispatcher rolu', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.fillInputField(invite.emailField, email);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await expect(invite.phoneField).toBeVisible();
    await invite.selectOptionFromMenu(invite.roleField, invite.safetyRole);
    await expect(invite.phoneField).not.toBeVisible();
});

test('FM city polje je vidljivo kada korisnik izabere Fleet Manager rolu', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.fillInputField(invite.emailField, email);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.fleetManager);
    await expect(invite.fmMenu).toBeVisible();
    await invite.selectOptionFromMenu(invite.roleField, invite.safetyRole);
    await expect(invite.fmMenu).not.toBeVisible();
});

test('Tooltip sa svim permisijama je prikazan kada korisnik hoveruje info ikonicu u current permissions boxu', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.selectOptionFromMenu(invite.roleField, invite.fleetManager);
    await invite.infoIcon.hover();
    await expect(invite.tooltip).toBeVisible();
});

test('Provjera da je permisija vidljiva nakon dodavanja usera', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const user = new UsersPage(page);
    const email = invite.generateUniqueEmail();
    await invite.enterData(invite.emailField, email);
    await invite.enterData(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await invite.enterData(invite.passwordField, Constants.password);
    const nameOfPermission = await invite.permissionItem.allInnerTexts();
    await invite.dragAndDrop();
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await user.searchUser(user.searchInputField, email);
    await user.emailColumn.nth(1).waitFor({ state: 'hidden', timeout: 5000 });
    await user.pencilIcon.click();
    await page.waitForLoadState('networkidle');
    await expect(invite.currentPermissionsBox).toContainText(nameOfPermission);
});

