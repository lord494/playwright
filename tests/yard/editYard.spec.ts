import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { YardsPage } from '../../page/yards/yards.page';
import { AddYard } from '../../page/yards/addYard.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const yard = new YardsPage(page);
    await page.goto(Constants.yardUrl, { waitUntil: 'networkidle' });
    await yard.addYards.click();
});

test('Korisnik moze da edituje yardu', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const yard = new YardsPage(page);
    const addYard = new AddYard(page);
    const randomOrder = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1).join('');
    const randomName = `Trailer Yard ${Math.floor(Math.random() * 1000)}`;
    await addYard.enterName(addYard.nameField, randomName);
    await addYard.selectType(addYard.typeMenu, addYard.trailerOption);
    await addYard.nameField.click();
    await addYard.enterOrder(addYard.orderField, randomOrder);
    await addYard.isChecked(addYard.isSpecialCheckbox);
    await addYard.isChecked(addYard.isActiveCheckbox);
    await addYard.addButton.click();
    await yard.dialogBox.waitFor({ state: 'detached' });
    await yard.nameColumn.last().waitFor({ state: 'visible' });
    await yard.pencilIcon.last().click();
    const editRandomName = `Edited ${randomName}`;
    const editRandomOrder = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1).join('');
    await addYard.enterName(addYard.nameField, editRandomName);
    await addYard.selectType(addYard.typeMenu, addYard.truckOption);
    await addYard.nameField.click();
    await addYard.enterOrder(addYard.orderField, editRandomOrder);
    await addYard.uncheck(addYard.isSpecialCheckbox);
    await addYard.uncheck(addYard.isActiveCheckbox);
    await addYard.saveButton.click();
    await yard.dialogBox.waitFor({ state: 'detached' });
    await expect(yard.nameColumn.last()).toContainText(editRandomName);
    await expect(yard.isActiveColumn.last()).toContainText('NO');
    await expect(yard.typeColumn.last()).toContainText('TRAILER,TRUCK');
    await expect(yard.isSpecialColumn.last()).toContainText('NO');
    await expect(yard.orderColumn.last()).toContainText(editRandomOrder);
    await yard.deleteIcon.last().click();
    await expect(yard.snackMessage).toContainText(' ' + editRandomName + ' successfully deleted');
});