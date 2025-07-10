import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber } from '../../helpers/dateUtilis';
import { DealershipPage } from '../../page/dealership/dealership.page';
import { addDealership as AddDealershipPage } from '../../page/dealership/addDealership.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const dealership = new DealershipPage(page);
    await page.goto(Constants.dealersshipUrl, { waitUntil: 'networkidle' });
    await dealership.addDealership.click();
});

test('Korisnik moze da doda truck dealership i da ga obrise', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const dealership = new DealershipPage(page);
    const addDealership = new AddDealershipPage(page);
    const randomOrder = get6RandomNumber().join('');
    const randomName = `Dealer Truck ${Math.floor(Math.random() * 1000)}`;
    await addDealership.enterName(addDealership.nameField, randomName);
    await addDealership.selectType(addDealership.typeMenu, addDealership.truckOption);
    await addDealership.enterOrder(addDealership.orderField, randomOrder);
    await addDealership.isChecked(addDealership.isSpecialCheckbox);
    await addDealership.isChecked(addDealership.isActiveCheckbox);
    await addDealership.addButton.click();
    await dealership.dialogBox.waitFor({ state: 'detached' });
    await dealership.nameColumn.last().waitFor({ state: 'visible' });
    await expect(dealership.nameColumn.last()).toContainText(randomName);
    await expect(dealership.isActiveColumn.last()).toContainText('YES');
    await expect(dealership.typeColumn.last()).toContainText('TRUCK');
    await expect(dealership.isSpecialColumn.last()).toContainText('YES');
    await expect(dealership.orderColumn.last()).toContainText(randomOrder);
    await dealership.deleteIcon.last().click();
    await expect(dealership.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Korisnik moze da doda trailer dealership i da ga obrise', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const dealership = new DealershipPage(page);
    const addDealership = new AddDealershipPage(page);
    const randomOrder = get6RandomNumber().join('');
    const randomName = `Dealer Trailer ${Math.floor(Math.random() * 1000)}`;
    await addDealership.enterName(addDealership.nameField, randomName);
    await addDealership.selectType(addDealership.typeMenu, addDealership.trailerOption);
    await addDealership.enterOrder(addDealership.orderField, randomOrder);
    await addDealership.isChecked(addDealership.isSpecialCheckbox);
    await addDealership.isChecked(addDealership.isActiveCheckbox);
    await addDealership.addButton.click();
    await dealership.dialogBox.waitFor({ state: 'detached' });
    await dealership.nameColumn.last().waitFor({ state: 'visible' });
    await expect(dealership.nameColumn.last()).toContainText(randomName);
    await expect(dealership.isActiveColumn.last()).toContainText('YES');
    await expect(dealership.typeColumn.last()).toContainText('TRAILER');
    await expect(dealership.isSpecialColumn.last()).toContainText('YES');
    await expect(dealership.orderColumn.last()).toContainText(randomOrder);
    await dealership.deleteIcon.last().click();
    await expect(dealership.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Name field je obavezno polje', async ({ page }) => {
    const addDealership = new AddDealershipPage(page);
    await addDealership.addButton.click();
    await expect(addDealership.errorMessage).toContainText('The name field is required');
});

