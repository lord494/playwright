import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Dodavanje call-a sa default call tipom', async ({ eldDashboard }) => {
    await eldDashboard.handleTruckNumber();
    await eldDashboard.selectTruck(eldDashboard.truckMenu, Constants.truckName, eldDashboard.truckNumberFromMenu);
    await eldDashboard.enterComment(eldDashboard.commentInput, Constants.noteFirst);
    await eldDashboard.startButton.click();
    await eldDashboard.dialogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(eldDashboard.firstCellEdit).toHaveText(Constants.truckName);
    await eldDashboard.firstCellEdit.click({ button: 'right' });
    await expect(eldDashboard.callTypeFieldEdit).toContainText(Constants.defaultCallType);
    await expect(eldDashboard.commentContent).toContainText(Constants.noteFirst);
});

test('Dodavanje call-a sa Problem call tipom', async ({ eldDashboard }) => {
    await eldDashboard.handleTruckNumber();
    await eldDashboard.selectTruck(eldDashboard.truckMenu, Constants.truckName, eldDashboard.truckNumberFromMenu);
    await eldDashboard.selectCallType(eldDashboard.callTypeMenu, eldDashboard.problemCallTypeOption);
    await eldDashboard.enterComment(eldDashboard.commentInput, Constants.noteFirst);
    await eldDashboard.startButton.click();
    await expect(eldDashboard.firstCellEdit).toHaveText(Constants.truckName);
    await expect(eldDashboard.firstCellEdit).toHaveCSS('background-color', Constants.expiredStatusColor)
    await eldDashboard.firstCellEdit.click({ button: 'right' });
    await expect(eldDashboard.callTypeFieldEdit).toContainText(Constants.problemCallType);
    await expect(eldDashboard.commentContent).toContainText(Constants.noteFirst);
});

test('Korisnik moze da mijenja call type', async ({ eldDashboard }) => {
    await eldDashboard.handleTruckNumber();
    await eldDashboard.selectTruck(eldDashboard.truckMenu, Constants.truckName, eldDashboard.truckNumberFromMenu);
    await eldDashboard.enterComment(eldDashboard.commentInput, Constants.noteFirst);
    await eldDashboard.startButton.click();
    await expect(eldDashboard.firstCellEdit).toHaveText(Constants.truckName);
    await eldDashboard.firstCellEdit.click({ button: 'right' });
    await eldDashboard.selectCallType(eldDashboard.callTypeFieldEdit, eldDashboard.finishedCallTypeOption);
    await eldDashboard.editButton.click()
    await eldDashboard.dialogBox.waitFor({ state: 'hidden' });
    await expect(eldDashboard.firstCellEdit).toHaveText(Constants.truckName);
    await expect(eldDashboard.firstCellEdit).toHaveCSS('background-color', Constants.validStatusColor);
});

test('Korisnik moze da mijenja truck', async ({ eldDashboard }) => {
    await eldDashboard.handleTruckNumber();
    await eldDashboard.handleTruckNumberLocked11996();
    await eldDashboard.selectTruck(eldDashboard.truckMenu, Constants.truckName, eldDashboard.truckNumberFromMenu);
    await eldDashboard.enterComment(eldDashboard.commentInput, Constants.noteFirst);
    await eldDashboard.startButton.click();
    await expect(eldDashboard.firstCellEdit).toHaveText(Constants.truckName);
    await eldDashboard.handleTruckNumberLocked();
    await eldDashboard.handleTruckNumber4721();
    await eldDashboard.firstCellEdit.click({ button: 'right' });
    await eldDashboard.selectTruck(eldDashboard.truckMenuEdit, Constants.secondTruckName, eldDashboard.secondTruckNumberFromMenu);
    await eldDashboard.editButton.click()
    await eldDashboard.dialogBox.waitFor({ state: 'hidden' });
    await expect(eldDashboard.firstCellEdit).toHaveText(Constants.secondTruckName);
});
