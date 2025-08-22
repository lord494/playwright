import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { EldShiftsPage } from '../../page/eld/shifts.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const shift = new EldShiftsPage(page);
    await page.goto(Constants.eldShifts, { waitUntil: 'networkidle', timeout: 10000 });
    await shift.removeUserFromShift(Constants.eldPlaywright);
});

test('Korisnik moze da prebaci usere u shift card', async ({ page }) => {
    const shift = new EldShiftsPage(page);
    await shift.addUserToShift(Constants.eldPlaywright, shift.shiftCard.first());
    await expect(shift.shiftCard.first()).toContainText(Constants.eldPlaywright);
});

test('Korisnik moze da pretrazuje usere', async ({ page }) => {
    const shift = new EldShiftsPage(page);
    await shift.searchUsers(shift.searchField, Constants.eldPlaywright);
    const count = await shift.selectedUser.count()
    for (let i = 0; i < count; i++) {
        const text = await shift.selectedUser.nth(i).textContent();
        const normalizedText = text!.trim().toLowerCase();
        await expect(normalizedText).toContain(Constants.eldPlaywright.toLowerCase());
    }
});

test('Korisnik moze da doda shift', async ({ page }) => {
    const shift = new EldShiftsPage(page);
    const shiftsBeforeNewShift = await shift.shiftCard.count();
    await shift.addShift();
    const shiftsAfterNewShift = await shift.shiftCard.count();
    const result = shiftsAfterNewShift - shiftsBeforeNewShift;
    await expect(result).toEqual(1);
    await shift.deleteShift();
});

test('Korisnik moze da obrise shift', async ({ page }) => {
    const shift = new EldShiftsPage(page);
    await shift.addShift();
    const shiftsAfterNewShift = await shift.shiftCard.count();
    await shift.deleteShift();
    const shiftAfterDelete = await shift.shiftCard.count();
    const result = shiftsAfterNewShift - shiftAfterDelete;
    await expect(result).toEqual(1);
});

test('Korisnik moze izbrise sve usere iz kartice', async ({ page }) => {
    const shift = new EldShiftsPage(page);
    await shift.addShift();
    await shift.addUserToShift(Constants.eldPlaywright, shift.shiftCard.last());
    await expect(shift.shiftCard.last()).toContainText(Constants.eldPlaywright);
    page.once('dialog', async dialog => {
        await dialog.accept();
    });
    await shift.removeAllUsersButton.last().click();
    await expect(shift.shiftCard.last()).not.toContainText(Constants.eldPlaywright);
    await shift.deleteShift();
});
