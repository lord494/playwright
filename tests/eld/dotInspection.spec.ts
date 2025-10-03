import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda dot inspection', async ({ dotInspection }) => {
    dotInspection.page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dotInspection.addDotInspections.click();
    await dotInspection.selectTruck(dotInspection.truckMenu, Constants.truckName, dotInspection.truckOption);
    await dotInspection.selectTimezone(dotInspection.timezoneMenu, dotInspection.centralTimezoneOption);
    await dotInspection.selectTime(dotInspection.startTimeButton, dotInspection.minutesInClockPicker.nth(1), dotInspection.minutesInClockPicker.nth(2));
    await dotInspection.selectTime(dotInspection.endTimeButton, dotInspection.minutesInClockPicker.nth(4), dotInspection.minutesInClockPicker.nth(4));
    await dotInspection.enterNote(dotInspection.noteField, Constants.noteFirst);
    await dotInspection.enterOrigin(dotInspection.originField, Constants.miamiOriginCity);
    await dotInspection.enterDestination(dotInspection.destinationField, Constants.newYorkCity);
    await dotInspection.enterLocation(dotInspection.locationField, Constants.miamiOriginCity);
    await dotInspection.addButtonInModal.click();
    await dotInspection.dailogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(dotInspection.truckNumberColumn.last()).toContainText(Constants.truckName);
    await expect(dotInspection.timeZoneColumn.last()).toContainText(Constants.centralTimezone);
    await expect(dotInspection.startTimeColumn.last()).toContainText('08:10');
    await expect(dotInspection.endDateColumn.last()).toContainText('11:20');
    await expect(dotInspection.originColumn.last()).toContainText(Constants.miamiOriginCity);
    await expect(dotInspection.destinationColumn.last()).toContainText(Constants.newYorkCity);
    await expect(dotInspection.locationColumn.last()).toContainText(Constants.miamiOriginCity);
    await expect(dotInspection.noteColumn.last()).toContainText(Constants.noteFirst);
    await dotInspection.deleteIcon.last().click();
});

test('Korisnik moze da edituje dot inspection i da ga obrise', async ({ dotInspection }) => {
    dotInspection.page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dotInspection.addDotInspections.click();
    await dotInspection.selectTruck(dotInspection.truckMenu, Constants.truckName, dotInspection.truckOption);
    await dotInspection.selectTimezone(dotInspection.timezoneMenu, dotInspection.centralTimezoneOption);
    await dotInspection.selectTime(dotInspection.startTimeButton, dotInspection.minutesInClockPicker.nth(1), dotInspection.minutesInClockPicker.nth(2));
    await dotInspection.selectTime(dotInspection.endTimeButton, dotInspection.minutesInClockPicker.nth(4), dotInspection.minutesInClockPicker.nth(4));
    await dotInspection.enterNote(dotInspection.noteField, Constants.noteFirst);
    await dotInspection.enterOrigin(dotInspection.originField, Constants.miamiOriginCity);
    await dotInspection.enterDestination(dotInspection.destinationField, Constants.newYorkCity);
    await dotInspection.enterLocation(dotInspection.locationField, Constants.miamiOriginCity);
    await dotInspection.addButtonInModal.click();
    await dotInspection.dailogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(dotInspection.truckNumberColumn.last()).toContainText(Constants.truckName);
    await dotInspection.editIcon.last().click()
    await dotInspection.dailogBox.waitFor({ state: 'visible', timeout: 10000 });
    await dotInspection.selectTimezone(dotInspection.timeZoneMenuEdit, dotInspection.pacificTimeZone);
    await dotInspection.noteField.clear();
    await dotInspection.enterNote(dotInspection.noteField, Constants.noteSecond);
    await dotInspection.originField.clear();
    await dotInspection.clickSaveButton();
    await dotInspection.dailogBox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(dotInspection.startTimeColumn.last()).toContainText('01:10');
    await expect(dotInspection.endDateColumn.last()).toContainText('04:20');
    await expect(dotInspection.noteColumn.last()).toContainText(Constants.noteSecond);
    await dotInspection.deleteIcon.last().click();
});