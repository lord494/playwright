import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { InviteAddEditModalPage } from '../../../page/userManagement/users/inviteAddEditUser.page';
import { AddFndUser } from '../../../page/userManagement/fndUsers/addFndUser.page';
import { FndUserPage } from '../../../page/userManagement/fndUsers/fndUser.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const user = new FndUserPage(page);
    await page.goto(Constants.fndUserUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await user.userNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.addUserIcon);
});

test('Korisnik moze da doda usera popunjavanjem svih polja', async ({ page }) => {
    const fnd = new AddFndUser(page);
    const user = new FndUserPage(page);
    const email = fnd.generateUniqueEmail();
    await fnd.enterData(fnd.emailField, email);
    await fnd.enterData(fnd.nameField, Constants.playWrightUser);
    await fnd.selectOptionFromMenu(fnd.roleField, fnd.fndUserRole);
    await fnd.checkCheckbox(fnd.isActiveCheckbox);
    await fnd.enterData(fnd.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await fnd.clickElement(fnd.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(fnd.snackMessage).toContainText("User: " + email + " successfully added");
    await user.searchUser(user.searchInputField, email);
    await user.emailColumn.nth(3).waitFor({ state: 'hidden', timeout: 5000 });
    await expect(user.emailColumn).toContainText(email);
    await expect(user.userNameColumn).toContainText(Constants.playWrightUser);
    await expect(user.roleColumn).toContainText(Constants.fndUserRole);
});

test('Email polje mora biti unique', async ({ page }) => {
    const invite = new AddFndUser(page);
    await invite.fillInputField(invite.emailField, Constants.playWrightUserEmail);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.fndUserRole);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await invite.errorMessage.waitFor({ state: "visible", timeout: 5000 });
    await expect(invite.errorMessage).toContainText("Email must be unique");
});

test('Email polje je obavezno', async ({ page }) => {
    const invite = new AddFndUser(page);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.fndUserRole);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The email field is required');
});

test('Name polje je obavezno', async ({ page }) => {
    const invite = new AddFndUser(page);
    const email = invite.generateUniqueEmail();
    await invite.fillInputField(invite.emailField, email);
    await invite.selectOptionFromMenu(invite.roleField, invite.fndUserRole);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.saveButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The name field is required');
});

test('Password polje je obavezno', async ({ page }) => {
    const invite = new AddFndUser(page);
    const email = invite.generateUniqueEmail();
    await invite.fillInputField(invite.emailField, email);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.fndUserRole);
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

