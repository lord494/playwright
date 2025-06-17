import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { InviteAddEditModalPage } from '../../../page/userManagement/users/inviteAddEditUser.page';
import { UsersPage } from '../../../page/userManagement/users/users.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.userUrl);
    const user = new UsersPage(page);
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.inviteUserIcon);
});

test('Korisnik moze da pozove usera popunjavanjem svih polja', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.enterData(invite.emailField, email);
    await invite.enterData(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await invite.selectOptionFromMenu(invite.boardField, invite.b1Board);
    await invite.enterData(invite.extField, Constants.extField);
    await invite.enterData(invite.extSecond, Constants.extSecond);
    await invite.enterData(invite.extThird, Constants.extThird);
    await invite.enterData(invite.extFourth, Constants.extFourth);
    await invite.enterData(invite.phoneField, Constants.adminPhone);
    await invite.enterOrder(invite.orderField, Constants.order);
    await invite.checkCheckbox(invite.teamLeadCheckbox);
    await invite.checkCheckbox(invite.isActiveCheckbox);
    await invite.dragAndDrop();
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.inviteButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.snackMessage).toContainText("User: " + email + " successfully invited");
});

test('Email polje mora biti unique', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.enterData(invite.emailField, Constants.playWrightUserEmail);
    await invite.enterData(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.inviteButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText("Email must be unique");
});

test('Email polje je obavezno', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.enterData(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.inviteButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The email field is required');
});

test('Name polje je obavezno', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.enterData(invite.emailField, email);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.inviteButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The name field is required');
});

test('Role polje je obavezno', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.fillInputField(invite.emailField, Constants.playWrightUserEmail);
    await invite.fillInputField(invite.nameField, Constants.playWrightUser);
    await page.waitForLoadState('networkidle');
    await invite.clickElement(invite.inviteButton);
    await page.waitForLoadState('networkidle');
    await expect(invite.errorMessage).toContainText('The role field is required');
});

test('Email forma mora biti validna', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    await invite.fillInputField(invite.emailField, Constants.wrongEmailFormat);
    await expect(invite.errorMessage).toContainText("The email field must be a valid email");
});

test('Phone number polje je vidljivo kada korisnik izabere Dispatcher rolu', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.enterData(invite.emailField, email);
    await invite.enterData(invite.nameField, Constants.playWrightUser);
    await invite.selectOptionFromMenu(invite.roleField, invite.dispatcherRole);
    await expect(invite.phoneField).toBeVisible();
    await invite.selectOptionFromMenu(invite.roleField, invite.safetyRole);
    await expect(invite.phoneField).not.toBeVisible();
});

test('FM city polje je vidljivo kada korisnik izabere Fleet Manager rolu', async ({ page }) => {
    const invite = new InviteAddEditModalPage(page);
    const email = invite.generateUniqueEmail();
    await invite.enterData(invite.emailField, email);
    await invite.enterData(invite.nameField, Constants.playWrightUser);
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
