import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber } from '../../helpers/dateUtilis';
import { DealershipPage } from '../../page/dealership/dealership.page';
import { addDealership as AddDealershipPage } from '../../page/dealership/addDealership.page';
import { YardsPage } from '../../page/yards/yards.page';
import { AddYard } from '../../page/yards/addYard.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const yard = new YardsPage(page);
    await page.goto(Constants.yardUrl, { waitUntil: 'networkidle' });
    await yard.addYards.click();
});

test('Korisnik moze da doda truck yardu i da je obrise', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const yard = new YardsPage(page);
    const addYard = new AddYard(page);
    const randomOrder = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1).join('');
    const randomName = `Truck Yard ${Math.floor(Math.random() * 1000)}`;
    await addYard.enterName(addYard.nameField, randomName);
    await addYard.selectType(addYard.typeMenu, addYard.truckOption);
    await addYard.nameField.click();
    await addYard.enterOrder(addYard.orderField, randomOrder);
    await addYard.isChecked(addYard.isSpecialCheckbox);
    await addYard.isChecked(addYard.isActiveCheckbox);
    await addYard.addButton.click();
    await yard.dialogBox.waitFor({ state: 'detached' });
    await yard.nameColumn.last().waitFor({ state: 'visible' });
    await expect(yard.nameColumn.last()).toContainText(randomName);
    await expect(yard.isActiveColumn.last()).toContainText('YES');
    await expect(yard.typeColumn.last()).toContainText('TRUCK');
    await expect(yard.isSpecialColumn.last()).toContainText('YES');
    await expect(yard.orderColumn.last()).toContainText(randomOrder);
    await yard.deleteIcon.last().click();
    await expect(yard.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Korisnik moze da doda trailer yard i da je obrise', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const yard = new YardsPage(page);
    const addYard = new AddYard(page);
    const randomOrder = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1).join('');
    const randomName = `Trailer Yard ${Math.floor(Math.random() * 1000)}`;
    await addYard.enterName(addYard.nameField, randomName);
    await addYard.selectType(addYard.typeMenu, addYard.trailerOption); // changed to trailerOption
    await addYard.nameField.click();
    await addYard.enterOrder(addYard.orderField, randomOrder);
    await addYard.isChecked(addYard.isSpecialCheckbox);
    await addYard.isChecked(addYard.isActiveCheckbox);
    await addYard.addButton.click();
    await yard.dialogBox.waitFor({ state: 'detached' });
    await yard.nameColumn.last().waitFor({ state: 'visible' });
    await expect(yard.nameColumn.last()).toContainText(randomName);
    await expect(yard.isActiveColumn.last()).toContainText('YES');
    await expect(yard.typeColumn.last()).toContainText('TRAILER');
    await expect(yard.isSpecialColumn.last()).toContainText('YES');
    await expect(yard.orderColumn.last()).toContainText(randomOrder);
    await yard.deleteIcon.last().click();
    await expect(yard.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Korisnik moze da doda yardu koja je i za truck i za trailer i da je obrise', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const yard = new YardsPage(page);
    const addYard = new AddYard(page);
    const randomOrder = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1).join('');
    const randomName = `Trailer and Truck Yard ${Math.floor(Math.random() * 1000)}`;
    await addYard.enterName(addYard.nameField, randomName);
    await addYard.selectType(addYard.typeMenu, addYard.trailerOption);
    await addYard.nameField.click();
    await addYard.selectType(addYard.typeMenu, addYard.truckOption);
    await addYard.nameField.click();
    await addYard.enterOrder(addYard.orderField, randomOrder);
    await addYard.isChecked(addYard.isSpecialCheckbox);
    await addYard.isChecked(addYard.isActiveCheckbox);
    await addYard.addButton.click();
    await yard.dialogBox.waitFor({ state: 'detached' });
    await yard.nameColumn.last().waitFor({ state: 'visible' });
    await expect(yard.nameColumn.last()).toContainText(randomName);
    await expect(yard.isActiveColumn.last()).toContainText('YES');
    await expect(yard.typeColumn.last()).toContainText('TRAILER,TRUCK');
    await expect(yard.isSpecialColumn.last()).toContainText('YES');
    await expect(yard.orderColumn.last()).toContainText(randomOrder);
    await yard.deleteIcon.last().click();
    await expect(yard.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Name field je obavezno polje', async ({ page }) => {
    const addYard = new AddYard(page);
    await addYard.addButton.click();
    await expect(addYard.errorMessage).toContainText('The name field is required');
});

