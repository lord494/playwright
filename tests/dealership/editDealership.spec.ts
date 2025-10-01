import { expect } from '@playwright/test';
import { get6RandomNumber } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da edituje dealership', async ({ delaershipPageSetup, addDealership }) => {
    delaershipPageSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
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
    await delaershipPageSetup.dialogBox.waitFor({ state: 'detached' });
    await delaershipPageSetup.pencilIcon.last().click();
    await addDealership.nameField.clear();
    await addDealership.enterName(addDealership.nameField, randomNameEdit);
    await addDealership.selectType(addDealership.typeMenu, addDealership.trailerOption);
    await addDealership.orderField.clear();
    await addDealership.enterOrder(addDealership.orderField, randomOrderEdit);
    await addDealership.uncheck(addDealership.isSpecialCheckbox);
    await addDealership.uncheck(addDealership.isActiveCheckbox);
    await addDealership.saveButton.click();
    await delaershipPageSetup.dialogBox.waitFor({ state: 'detached' });
    await expect(delaershipPageSetup.nameColumn.last()).toContainText(randomNameEdit);
    await expect(delaershipPageSetup.isActiveColumn.last()).toContainText('NO');
    await expect(delaershipPageSetup.typeColumn.last()).toContainText("TRAILER");
    await expect(delaershipPageSetup.isSpecialColumn.last()).toContainText('NO');
    await expect(delaershipPageSetup.orderColumn.last()).toContainText(randomOrderEdit);
    await delaershipPageSetup.deleteIcon.last().click();
    await expect(delaershipPageSetup.snackMessage).toContainText(' ' + randomNameEdit + ' successfully deleted');
});