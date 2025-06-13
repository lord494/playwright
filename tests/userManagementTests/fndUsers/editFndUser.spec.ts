import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { InviteAddEditModalPage } from '../../../page/userManagement/users/inviteAddEditUser.page';
import { AddFndUser } from '../../../page/userManagement/fndUsers/addFndUser.page';
import { FndUserPage } from '../../../page/userManagement/fndUsers/fndUser.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const user = new FndUserPage(page);
    await page.goto(Constants.fndUserUrl);
    await user.userNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await user.pencilIcon.first().click();
    const fndBoard = page.locator('tr', {
        has: page.locator('td:nth-child(3)', { hasText: 'Fnd User' })
    });
    await fndBoard.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da edituje usera popunjavanjem svih polja', async ({ page }) => {
    const fnd = new AddFndUser(page);
    const user = new FndUserPage(page);
    const email = fnd.generateUniqueEmail();
    await fnd.editData(fnd.emailField, email);
    await fnd.editData(fnd.nameField, Constants.playWrightUser);
    await fnd.selectOptionFromMenu(fnd.roleField, fnd.fndUserRole);
    await fnd.checkCheckbox(fnd.isActiveCheckbox);
    await fnd.editData(fnd.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await fnd.clickElement(fnd.updateButton);
    await page.waitForLoadState('networkidle');
    await expect(fnd.snackMessage).toContainText(" User: " + email + " was successfully updated");
    await page.waitForLoadState('networkidle');
    await user.searchUser(user.searchInputField, email);
    await expect(user.emailColumn.first()).toContainText(email, { timeout: 10000 });
    await expect(user.userNameColumn.first()).toContainText(Constants.playWrightUser);
    await expect(user.roleColumn.first()).toContainText(Constants.fndUserRole);
});

test('Email polje mora biti unique', async ({ page }) => {
    const invite = new AddFndUser(page);
    await invite.emailField.clear();
    await invite.nameField.clear();
    await invite.fillInputField(invite.emailField, Constants.playWrightUserEmail);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.fndUserRole);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.updateButton);
    await invite.errorMessage.waitFor({ state: "visible", timeout: 5000 });
    await expect(invite.errorMessage).toContainText("Email must be unique");
});

test('Email polje je obavezno', async ({ page }) => {
    const invite = new AddFndUser(page);
    await invite.emailField.clear();
    await invite.nameField.clear();
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.updateButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The email field is required');
});

test('Name polje je obavezno', async ({ page }) => {
    const invite = new AddFndUser(page);
    await invite.nameField.clear();
    await invite.enterData(invite.passwordField, Constants.password);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.updateButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The name field is required');
});

test('Email forma mora biti validna', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.fillInputField(invite.emailField, Constants.wrongEmailFormat);
    await expect(invite.errorMessage).toContainText("The email field must be a valid email");
});

