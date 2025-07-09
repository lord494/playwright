import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { MessagePage } from '../../page/messages/messages.page';
import { AddMessagePage } from '../../page/messages/addMessage.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const message = new MessagePage(page);
    await page.goto(Constants.messageUrl, { waitUntil: 'networkidle' });
    await message.addMessageButton.click();
});

test('Korisnik moze da doda message', async ({ page }) => {
    const message = new MessagePage(page);
    const addMessagePage = new AddMessagePage(page);
    await addMessagePage.enterTitle(addMessagePage.titleField, Constants.messagTitle);
    await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
    await addMessagePage.uncheck(addMessagePage.dailyReportCheckbox);
    await addMessagePage.uncheck(addMessagePage.weeklyReportCheckbox);
    await addMessagePage.selectRole(addMessagePage.roleField, addMessagePage.userRole);
    await addMessagePage.contentField.click();
    await addMessagePage.sendButton.click();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(message.nameColumn.first()).toHaveText(Constants.messagTitle);
    await expect(message.contentColumn.first()).toHaveText(Constants.messageContent);
    await message.eyeIcon.first().click();
    await expect(addMessagePage.roleField).toHaveText('USER');
});

test('Svi podaci o poruci su prikazani u modalu kada korisnik klikne na eye ikonicu', async ({ page }) => {
    const message = new MessagePage(page);
    const addMessagePage = new AddMessagePage(page);
    await addMessagePage.enterTitle(addMessagePage.titleField, Constants.messagTitle);
    await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
    await addMessagePage.uncheck(addMessagePage.dailyReportCheckbox);
    await addMessagePage.uncheck(addMessagePage.weeklyReportCheckbox);
    await addMessagePage.selectRole(addMessagePage.roleField, addMessagePage.userRole);
    await addMessagePage.contentField.click();
    await addMessagePage.sendButton.click();
    await page.reload({ waitUntil: 'networkidle' });
    await message.eyeIcon.first().click();
    await expect(addMessagePage.titleField).toHaveValue(Constants.messagTitle);
    await expect(addMessagePage.contentField).toHaveValue(Constants.messageContent);
    await expect(addMessagePage.roleField).toHaveText('USER');
});

test('Kada korisnik selektuje Weekly report for market updates? checkbox, role polje bude popunjeno automatski', async ({ page }) => {
    const addMessagePage = new AddMessagePage(page);
    await addMessagePage.enterTitle(addMessagePage.titleField, Constants.messagTitle);
    await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
    await addMessagePage.check(addMessagePage.weeklyReportCheckbox);
    await expect(addMessagePage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
});

test('Kada korisnik selektuje Daily report for market updates? checkbox, role polje bude popunjeno automatski', async ({ page }) => {
    const addMessagePage = new AddMessagePage(page);
    await addMessagePage.enterTitle(addMessagePage.titleField, Constants.messagTitle);
    await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
    await addMessagePage.check(addMessagePage.dailyReportCheckbox);
    await expect(addMessagePage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
});

test('Poruka se prikazuje na ekranu za odgovarajucu rolu kada korisnik posalje poruku', async ({ page }) => {
    const message = new MessagePage(page);
    const addMessagePage = new AddMessagePage(page);
    await addMessagePage.enterTitle(addMessagePage.titleField, Constants.messagTitle);
    await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
    await addMessagePage.uncheck(addMessagePage.dailyReportCheckbox);
    await addMessagePage.uncheck(addMessagePage.weeklyReportCheckbox);
    await addMessagePage.selectRole(addMessagePage.roleField, addMessagePage.superadminRole);
    await addMessagePage.contentField.click();
    await addMessagePage.sendButton.click();
    await page.waitForLoadState('networkidle');
    await expect(message.dialogBox).toBeVisible({ timeout: 5000 });
    await expect(message.dialogBox).toContainText(Constants.messagTitle);
    await expect(message.dialogBox).toContainText(Constants.messageContent);
    await message.okButton.click();
    await expect(message.dialogBox).not.toBeVisible();
});

test('Korisnik moze da salje daily report', async ({ page }) => {
    const addMessagePage = new AddMessagePage(page);
    const message = new MessagePage(page);
    await addMessagePage.enterTitle(addMessagePage.titleField, Constants.dailyRepor);
    await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
    await addMessagePage.check(addMessagePage.dailyReportCheckbox);
    await expect(addMessagePage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
    await addMessagePage.contentField.click();
    await addMessagePage.sendButton.click();
    await expect(message.dialogBox).toBeVisible({ timeout: 5000 });
    await expect(message.dialogBox).toContainText(Constants.dailyRepor);
    await expect(message.dialogBox).toContainText(Constants.messageContent);
    await message.okButton.click();
    await expect(message.dialogBox).not.toBeVisible();
});

test('Korisnik moze da salje weekly report', async ({ page }) => {
    const addMessagePage = new AddMessagePage(page);
    const message = new MessagePage(page);
    await addMessagePage.enterTitle(addMessagePage.titleField, Constants.weeklyReport);
    await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
    await addMessagePage.check(addMessagePage.dailyReportCheckbox);
    await expect(addMessagePage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
    await addMessagePage.contentField.click();
    await addMessagePage.sendButton.click();
    await expect(message.dialogBox).toBeVisible({ timeout: 5000 });
    await expect(message.dialogBox).toContainText(Constants.weeklyReport);
    await expect(message.dialogBox).toContainText(Constants.messageContent);
    await message.okButton.click();
    await expect(message.dialogBox).not.toBeVisible();
});
