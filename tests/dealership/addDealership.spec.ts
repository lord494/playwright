import { expect } from '@playwright/test';
import { get6RandomNumber } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda truck dealership i da ga obrise', async ({ delaershipPageSetup, addDealership }) => {
    delaershipPageSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomOrder = get6RandomNumber().join('');
    const randomName = `Dealer Truck ${Math.floor(Math.random() * 1000)}`;
    await addDealership.enterName(addDealership.nameField, randomName);
    await addDealership.selectType(addDealership.typeMenu, addDealership.truckOption);
    await addDealership.enterOrder(addDealership.orderField, randomOrder);
    await addDealership.isChecked(addDealership.isSpecialCheckbox);
    await addDealership.isChecked(addDealership.isActiveCheckbox);
    await addDealership.addButton.click();
    await delaershipPageSetup.dialogBox.waitFor({ state: 'detached' });
    await delaershipPageSetup.nameColumn.last().waitFor({ state: 'visible' });
    await expect(delaershipPageSetup.nameColumn.last()).toContainText(randomName);
    await expect(delaershipPageSetup.isActiveColumn.last()).toContainText('YES');
    await expect(delaershipPageSetup.typeColumn.last()).toContainText('TRUCK');
    await expect(delaershipPageSetup.isSpecialColumn.last()).toContainText('YES');
    await expect(delaershipPageSetup.orderColumn.last()).toContainText(randomOrder);
    await delaershipPageSetup.deleteIcon.last().click();
    await expect(delaershipPageSetup.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Korisnik moze da doda trailer dealership i da ga obrise', async ({ delaershipPageSetup, addDealership }) => {
    delaershipPageSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomOrder = get6RandomNumber().join('');
    const randomName = `Dealer Trailer ${Math.floor(Math.random() * 1000)}`;
    await addDealership.enterName(addDealership.nameField, randomName);
    await addDealership.selectType(addDealership.typeMenu, addDealership.trailerOption);
    await addDealership.enterOrder(addDealership.orderField, randomOrder);
    await addDealership.isChecked(addDealership.isSpecialCheckbox);
    await addDealership.isChecked(addDealership.isActiveCheckbox);
    await addDealership.addButton.click();
    await delaershipPageSetup.dialogBox.waitFor({ state: 'detached' });
    await delaershipPageSetup.nameColumn.last().waitFor({ state: 'visible' });
    await expect(delaershipPageSetup.nameColumn.last()).toContainText(randomName);
    await expect(delaershipPageSetup.isActiveColumn.last()).toContainText('YES');
    await expect(delaershipPageSetup.typeColumn.last()).toContainText('TRAILER');
    await expect(delaershipPageSetup.isSpecialColumn.last()).toContainText('YES');
    await expect(delaershipPageSetup.orderColumn.last()).toContainText(randomOrder);
    await delaershipPageSetup.deleteIcon.last().click();
    await expect(delaershipPageSetup.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Name field je obavezno polje', async ({ delaershipPageSetup, addDealership }) => {
    await addDealership.addButton.click();
    await expect(addDealership.errorMessage).toContainText('The name field is required');
});

