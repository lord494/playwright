import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { DotInspectionsPage } from '../../page/eld/dotInspections.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.dotInspectionUrl, { waitUntil: 'networkidle', timeout: 20000 });
});

test('Korisnik moze da doda dot inspection', async ({ page }) => {
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    const dot = new DotInspectionsPage(page);
    await dot.addDotInspections.click();
    await dot.selectTruck(dot.truckMenu, Constants.truckName, dot.truckOption);
    await dot.selectTimezone(dot.timezoneMenu, dot.centralTimezoneOption);
    await dot.selectTime(dot.startTimeButton, dot.minutesInClockPicker.nth(1), dot.minutesInClockPicker.nth(2));
    await dot.selectTime(dot.endTimeButton, dot.minutesInClockPicker.nth(4), dot.minutesInClockPicker.nth(4));
    await dot.enterNote(dot.noteField, Constants.noteFirst);
    await dot.enterOrigin(dot.originField, Constants.miamiOriginCity);
    await dot.enterDestination(dot.destinationField, Constants.newYorkCity);
    await dot.enterLocation(dot.locationField, Constants.miamiOriginCity);
    await dot.addButtonInModal.click();
    await dot.dailogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(dot.truckNumberColumn.last()).toContainText(Constants.truckName);
    await expect(dot.timeZoneColumn.last()).toContainText(Constants.centralTimezone);
    await expect(dot.startTimeColumn.last()).toContainText('08:10');
    await expect(dot.endDateColumn.last()).toContainText('11:20');
    await expect(dot.originColumn.last()).toContainText(Constants.miamiOriginCity);
    await expect(dot.destinationColumn.last()).toContainText(Constants.newYorkCity);
    await expect(dot.locationColumn.last()).toContainText(Constants.miamiOriginCity);
    await expect(dot.noteColumn.last()).toContainText(Constants.noteFirst);
    await dot.deleteIcon.last().click();
});

test('Korisnik moze da edituje dot inspection i da ga obrise', async ({ page }) => {
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    const dot = new DotInspectionsPage(page);
    await dot.addDotInspections.click();
    await dot.selectTruck(dot.truckMenu, Constants.truckName, dot.truckOption);
    await dot.selectTimezone(dot.timezoneMenu, dot.centralTimezoneOption);
    await dot.selectTime(dot.startTimeButton, dot.minutesInClockPicker.nth(1), dot.minutesInClockPicker.nth(2));
    await dot.selectTime(dot.endTimeButton, dot.minutesInClockPicker.nth(4), dot.minutesInClockPicker.nth(4));
    await dot.enterNote(dot.noteField, Constants.noteFirst);
    await dot.enterOrigin(dot.originField, Constants.miamiOriginCity);
    await dot.enterDestination(dot.destinationField, Constants.newYorkCity);
    await dot.enterLocation(dot.locationField, Constants.miamiOriginCity);
    await dot.addButtonInModal.click();
    await dot.dailogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(dot.truckNumberColumn.last()).toContainText(Constants.truckName);
    await dot.editIcon.last().click()
    await dot.dailogBox.waitFor({ state: 'visible', timeout: 10000 });
    await dot.selectTimezone(dot.timeZoneMenuEdit, dot.pacificTimeZone);
    await dot.noteField.clear();
    await dot.enterNote(dot.noteField, Constants.noteSecond);
    await dot.originField.clear();
    await dot.clickSaveButton();
    await dot.dailogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(dot.startTimeColumn.last()).toContainText('01:10');
    await expect(dot.endDateColumn.last()).toContainText('04:20');
    await expect(dot.noteColumn.last()).toContainText(Constants.noteSecond);
    await dot.deleteIcon.last().click();
});