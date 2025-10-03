import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda message', async ({ messagesPage, addMessage }) => {
    await addMessage.enterTitle(addMessage.titleField, Constants.messagTitle);
    await addMessage.enterMessageContent(addMessage.contentField, Constants.messageContent);
    await addMessage.uncheck(addMessage.dailyReportCheckbox);
    await addMessage.uncheck(addMessage.weeklyReportCheckbox);
    await addMessage.selectRole(addMessage.roleField, addMessage.userRole);
    await addMessage.contentField.click();
    await addMessage.sendButton.click();
    await addMessage.page.reload({ waitUntil: 'networkidle' });
    await expect(messagesPage.nameColumn.first()).toHaveText(Constants.messagTitle);
    await expect(messagesPage.contentColumn.first()).toHaveText(Constants.messageContent);
    await messagesPage.eyeIcon.first().click();
    await expect(addMessage.roleField).toHaveText('USER');
});

test('Svi podaci o poruci su prikazani u modalu kada korisnik klikne na eye ikonicu', async ({ messagesPage, addMessage }) => {
    await addMessage.enterTitle(addMessage.titleField, Constants.messagTitle);
    await addMessage.enterMessageContent(addMessage.contentField, Constants.messageContent);
    await addMessage.uncheck(addMessage.dailyReportCheckbox);
    await addMessage.uncheck(addMessage.weeklyReportCheckbox);
    await addMessage.selectRole(addMessage.roleField, addMessage.userRole);
    await addMessage.contentField.click();
    await addMessage.sendButton.click();
    await addMessage.page.reload({ waitUntil: 'networkidle' });
    await messagesPage.eyeIcon.first().click();
    await expect(addMessage.titleField).toHaveValue(Constants.messagTitle);
    await expect(addMessage.contentField).toHaveValue(Constants.messageContent);
    await expect(addMessage.roleField).toHaveText('USER');
});

test('Kada korisnik selektuje Weekly report for market updates? checkbox, role polje bude popunjeno automatski', async ({ messagesPage, addMessage }) => {
    await addMessage.enterTitle(addMessage.titleField, Constants.messagTitle);
    await addMessage.enterMessageContent(addMessage.contentField, Constants.messageContent);
    await addMessage.check(addMessage.weeklyReportCheckbox);
    await expect(addMessage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
});

test('Kada korisnik selektuje Daily report for market updates? checkbox, role polje bude popunjeno automatski', async ({ messagesPage, addMessage }) => {
    await addMessage.enterTitle(addMessage.titleField, Constants.messagTitle);
    await addMessage.enterMessageContent(addMessage.contentField, Constants.messageContent);
    await addMessage.check(addMessage.dailyReportCheckbox);
    await expect(addMessage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
});

/////////////////////////////////// SALJU SE MEJLOVI SVIMA //////////////////////////////////////////////

// test('Poruka se prikazuje na ekranu za odgovarajucu rolu kada korisnik posalje poruku', async ({ page }) => {
//     const message = new MessagePage(page);
//     const addMessagePage = new AddMessagePage(page);
//     await addMessagePage.enterTitle(addMessagePage.titleField, Constants.messagTitle);
//     await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
//     await addMessagePage.uncheck(addMessagePage.dailyReportCheckbox);
//     await addMessagePage.uncheck(addMessagePage.weeklyReportCheckbox);
//     await addMessagePage.selectRole(addMessagePage.roleField, addMessagePage.superadminRole);
//     await addMessagePage.contentField.click();
//     await addMessagePage.sendButton.click();
//     await page.waitForLoadState('networkidle');
//     await expect(message.dialogBox).toBeVisible({ timeout: 5000 });
//     await expect(message.dialogBox).toContainText(Constants.messagTitle);
//     await expect(message.dialogBox).toContainText(Constants.messageContent);
//     await message.okButton.click();
//     await expect(message.dialogBox).not.toBeVisible();
// });
// test('Korisnik moze da salje daily report', async ({ page }) => {
//     const addMessagePage = new AddMessagePage(page);
//     const message = new MessagePage(page);
//     await addMessagePage.enterTitle(addMessagePage.titleField, Constants.dailyRepor);
//     await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
//     await addMessagePage.check(addMessagePage.dailyReportCheckbox);
//     await expect(addMessagePage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
//     await addMessagePage.contentField.click();
//     await addMessagePage.sendButton.click();
//     await expect(message.dialogBox).toBeVisible({ timeout: 5000 });
//     await expect(message.dialogBox).toContainText(Constants.dailyRepor);
//     await expect(message.dialogBox).toContainText(Constants.messageContent);
//     await message.okButton.click();
//     await expect(message.dialogBox).not.toBeVisible();
// });

// test('Korisnik moze da salje weekly report', async ({ page }) => {
//     const addMessagePage = new AddMessagePage(page);
//     const message = new MessagePage(page);
//     await addMessagePage.enterTitle(addMessagePage.titleField, Constants.weeklyReport);
//     await addMessagePage.enterMessageContent(addMessagePage.contentField, Constants.messageContent);
//     await addMessagePage.check(addMessagePage.dailyReportCheckbox);
//     await expect(addMessagePage.roleField).toHaveText('DISPATCHER, BROKER, ADMIN, SUPERADMIN');
//     await addMessagePage.contentField.click();
//     await addMessagePage.sendButton.click();
//     await expect(message.dialogBox).toBeVisible({ timeout: 5000 });
//     await expect(message.dialogBox).toContainText(Constants.weeklyReport);
//     await expect(message.dialogBox).toContainText(Constants.messageContent);
//     await message.okButton.click();
//     await expect(message.dialogBox).not.toBeVisible();
// });
