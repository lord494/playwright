import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da prebaci usere u shift card', async ({ eldShiftsPage }) => {
    await eldShiftsPage.addUserToShift(Constants.eldPlaywright, eldShiftsPage.shiftCard.first());
    await expect(eldShiftsPage.shiftCard.first()).toContainText(Constants.eldPlaywright);
});

test('Korisnik moze da pretrazuje usere', async ({ eldShiftsPage }) => {
    await eldShiftsPage.searchUsers(eldShiftsPage.searchField, Constants.eldPlaywright);
    const count = await eldShiftsPage.selectedUser.count()
    for (let i = 0; i < count; i++) {
        const text = await eldShiftsPage.selectedUser.nth(i).textContent();
        const normalizedText = text!.trim().toLowerCase();
        await expect(normalizedText).toContain(Constants.eldPlaywright.toLowerCase());
    }
});

test('Korisnik moze da doda shift', async ({ eldShiftsPage }) => {
    const shiftsBeforeNewShift = await eldShiftsPage.shiftCard.count();
    await eldShiftsPage.addShift();
    const shiftsAfterNewShift = await eldShiftsPage.shiftCard.count();
    const result = shiftsAfterNewShift - shiftsBeforeNewShift;
    await expect(result).toEqual(1);
    await eldShiftsPage.deleteShift();
});

test('Korisnik moze da obrise shift', async ({ eldShiftsPage }) => {
    await eldShiftsPage.addShift();
    const shiftsAfterNewShift = await eldShiftsPage.shiftCard.count();
    await eldShiftsPage.deleteShift();
    const shiftAfterDelete = await eldShiftsPage.shiftCard.count();
    const result = shiftsAfterNewShift - shiftAfterDelete;
    await expect(result).toEqual(1);
});

test('Korisnik moze izbrise sve usere iz kartice', async ({ eldShiftsPage }) => {
    await eldShiftsPage.addShift();
    await eldShiftsPage.addUserToShift(Constants.eldPlaywright, eldShiftsPage.shiftCard.last());
    await expect(eldShiftsPage.shiftCard.last()).toContainText(Constants.eldPlaywright);
    eldShiftsPage.page.once('dialog', async dialog => {
        await dialog.accept();
    });
    await eldShiftsPage.removeAllUsersButton.last().click();
    await expect(eldShiftsPage.shiftCard.last()).not.toContainText(Constants.eldPlaywright);
    await eldShiftsPage.deleteShift();
});
