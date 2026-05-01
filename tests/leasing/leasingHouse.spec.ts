import { expect } from '@playwright/test';
import path from 'path';
import { test } from '../fixtures/fixtures';

const timestamp = Date.now();
const leasingHouseData = {
    name: `PW Leasing House ${timestamp}`,
    email: `leasing${timestamp}@example.com`,
    emailDomain: 'example.com',
    phone: '1111111111',
    address: `Test address ${timestamp}`,
    bank: 'Chase Bank',
    logoPath: path.resolve('helpers/sc/playwright.png'),
};

const editedLeasingHouseData = {
    ...leasingHouseData,
    name: `PW Edited Leasing House ${timestamp}`,
    email: `edited.leasing${timestamp}@example.com`,
    emailDomain: 'example.com',
    phone: '2222222222',
    address: `Edited address ${timestamp}`,
    bank: 'Wells Fargo',
};

test('Korisnik moze da vidi leasing houses stranicu', async ({ leasingHousePage }) => {
    const page = leasingHousePage.page;
    await expect(page).toHaveURL(/\/leasing\/houses$/);
    await expect(leasingHousePage.newLeasingHouseButton).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email domain', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Phone', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Address', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Bank', exact: true })).toBeVisible();
});

test('Obavezna polja se validiraju na new leasing house modalu', async ({ leasingHousePage }) => {
    await leasingHousePage.openNewLeasingHouseModal();
    await leasingHousePage.save();
    await expect(leasingHousePage.validationMessages).toContainText([
        'The Leasing house name field is required',
        'The Leasing house email field is required',
        'The Leasing house phone field is required',
        'The Leasing house address field is required',
        'The Bank field is required',
        'The Leasing house logo field is required',
    ]);
});

test('Korisnik moze da doda leasing house i da ga obrise', async ({ leasingHousePage }) => {
    const page = leasingHousePage.page;
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await leasingHousePage.createLeasingHouse(leasingHouseData);
    const row = leasingHousePage.getRowByName(leasingHouseData.name);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(leasingHouseData.email);
    await expect(row).toContainText(leasingHouseData.emailDomain);
    await expect(row).toContainText(leasingHouseData.phone);
    await expect(row).toContainText(leasingHouseData.address);
    await expect(row).toContainText(leasingHouseData.bank);
    await leasingHousePage.deleteLeasingHouseByName(leasingHouseData.name);
    await expect(leasingHousePage.snackMessage).toContainText('Leasing house deleted successfully');
    await expect(row).toBeHidden({ timeout: 10000 });
});

test('Korisnik moze da izmeni leasing house i da ga obrise', async ({ leasingHousePage }) => {
    const page = leasingHousePage.page;
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await leasingHousePage.createLeasingHouse(leasingHouseData);
    await expect(leasingHousePage.getRowByName(leasingHouseData.name)).toBeVisible({ timeout: 10000 });
    await page.reload({ waitUntil: 'networkidle' });
    await leasingHousePage.editLeasingHouse(leasingHouseData.name, editedLeasingHouseData);
    const editedRow = leasingHousePage.getRowByName(editedLeasingHouseData.name);
    await expect(editedRow).toBeVisible({ timeout: 10000 });
    await expect(editedRow).toContainText(editedLeasingHouseData.email);
    await expect(editedRow).toContainText(editedLeasingHouseData.emailDomain);
    await expect(editedRow).toContainText(editedLeasingHouseData.phone);
    await expect(editedRow).toContainText(editedLeasingHouseData.address);
    await expect(editedRow).toContainText(editedLeasingHouseData.bank);
    await leasingHousePage.deleteLeasingHouseByName(editedLeasingHouseData.name);
    await expect(leasingHousePage.snackMessage).toContainText('Leasing house deleted successfully');
    await expect(editedRow).toBeHidden({ timeout: 10000 });
});
