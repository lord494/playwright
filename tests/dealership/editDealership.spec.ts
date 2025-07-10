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

test('Korisnik moze da edituje dealership', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const dealership = new DealershipPage(page);
    const addDealership = new AddDealershipPage(page);
    const randomOrder = get6RandomNumber().join('');
    const randomName = `Dealer Truck ${Math.floor(Math.random() * 1000)}`;
    const randomNameEdit = `Edited Dealer Truck ${Math.floor(Math.random() * 1000)}`;
    const randomOrderEdit = get6RandomNumber().join('');
    await addDealership.enterName(addDealership.nameField, randomName);
    await addDealership.selectType(addDealership.typeMenu, addDealership.truckOption);
    await addDealership.enterOrder(addDealership.orderField, randomOrder);
    await addDealership.isChecked(addDealership.isSpecialCheckbox);
    await addDealership.isChecked(addDealership.isActiveCheckbox);
    await addDealership.addButton.click();
    await dealership.dialogBox.waitFor({ state: 'detached' });
    await dealership.pencilIcon.last().click();
    await addDealership.nameField.clear();
    await addDealership.enterName(addDealership.nameField, randomNameEdit);
    await addDealership.selectType(addDealership.typeMenu, addDealership.trailerOption);
    await addDealership.orderField.clear();
    await addDealership.enterOrder(addDealership.orderField, randomOrderEdit);
    await addDealership.uncheck(addDealership.isSpecialCheckbox);
    await addDealership.uncheck(addDealership.isActiveCheckbox);
    await addDealership.saveButton.click();
    await dealership.dialogBox.waitFor({ state: 'detached' });
    await expect(dealership.nameColumn.last()).toContainText(randomNameEdit);
    await expect(dealership.isActiveColumn.last()).toContainText('NO');
    await expect(dealership.typeColumn.last()).toContainText("TRAILER");
    await expect(dealership.isSpecialColumn.last()).toContainText('NO');
    await expect(dealership.orderColumn.last()).toContainText(randomOrderEdit);
    await dealership.deleteIcon.last().click();
    await expect(dealership.snackMessage).toContainText(' ' + randomNameEdit + ' successfully deleted');
});