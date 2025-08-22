import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { EldDashboardPage } from '../../page/eldDashboard/eldDashboard.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.eldDashboardUrl, { waitUntil: 'networkidle', timeout: 10000 });
});

test('Dodavanje call-a sa default call tipom', async ({ page }) => {
    const eld = new EldDashboardPage(page);
    await eld.handleTruckNumber();
    await eld.selectTruck(eld.truckMenu, Constants.truckName, eld.truckNumberFromMenu);
    await eld.enterComment(eld.commentInput, Constants.noteFirst);
    await eld.startButton.click();
    await eld.dialogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(eld.firstCellEdit).toHaveText(Constants.truckName);
    await eld.firstCellEdit.click({ button: 'right' });
    await expect(eld.callTypeFieldEdit).toContainText(Constants.defaultCallType);
    await expect(eld.commentContent).toContainText(Constants.noteFirst);
});

test('Dodavanje call-a sa Problem call tipom', async ({ page }) => {
    const eld = new EldDashboardPage(page);
    await eld.handleTruckNumber();
    await eld.selectTruck(eld.truckMenu, Constants.truckName, eld.truckNumberFromMenu);
    await eld.selectCallType(eld.callTypeMenu, eld.problemCallTypeOption);
    await eld.enterComment(eld.commentInput, Constants.noteFirst);
    await eld.startButton.click();
    await expect(eld.firstCellEdit).toHaveText(Constants.truckName);
    await expect(eld.firstCellEdit).toHaveCSS('background-color', Constants.expiredStatusColor)
    await eld.firstCellEdit.click({ button: 'right' });
    await expect(eld.callTypeFieldEdit).toContainText(Constants.problemCallType);
    await expect(eld.commentContent).toContainText(Constants.noteFirst);
});

test('Korisnik moze da mijenja call type', async ({ page }) => {
    const eld = new EldDashboardPage(page);
    await eld.handleTruckNumber();
    await eld.selectTruck(eld.truckMenu, Constants.truckName, eld.truckNumberFromMenu);
    await eld.enterComment(eld.commentInput, Constants.noteFirst);
    await eld.startButton.click();
    await expect(eld.firstCellEdit).toHaveText(Constants.truckName);
    await eld.firstCellEdit.click({ button: 'right' });
    await eld.selectCallType(eld.callTypeFieldEdit, eld.finishedCallTypeOption);
    await eld.editButton.click()
    await eld.dialogBox.waitFor({ state: 'hidden' });
    await expect(eld.firstCellEdit).toHaveText(Constants.truckName);
    await expect(eld.firstCellEdit).toHaveCSS('background-color', Constants.validStatusColor);
});

test('Korisnik moze da mijenja truck', async ({ page }) => {
    const eld = new EldDashboardPage(page);
    await eld.handleTruckNumber();
    await eld.handleTruckNumberLocked11996();
    await eld.selectTruck(eld.truckMenu, Constants.truckName, eld.truckNumberFromMenu);
    await eld.enterComment(eld.commentInput, Constants.noteFirst);
    await eld.startButton.click();
    await expect(eld.firstCellEdit).toHaveText(Constants.truckName);
    await eld.handleTruckNumberLocked();
    await eld.handleTruckNumber4721();
    await eld.firstCellEdit.click({ button: 'right' });
    await eld.selectTruck(eld.truckMenuEdit, Constants.secondTruckName, eld.secondTruckNumberFromMenu);
    await eld.editButton.click()
    await eld.dialogBox.waitFor({ state: 'hidden' });
    await expect(eld.firstCellEdit).toHaveText(Constants.secondTruckName);
});
