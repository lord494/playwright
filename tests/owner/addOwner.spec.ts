import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber } from '../../helpers/dateUtilis';
import { OwnersPage } from '../../page/owner/ownerOverview.page';
import { AddOwner } from '../../page/owner/addOwner.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const owner = new OwnersPage(page);
    await page.goto(Constants.ownerUrl, { waitUntil: 'networkidle' });
    await owner.addOwnerButton.click();
});

test('Korisnik moze da doda novog Ownera i da ga obrise', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const owner = new OwnersPage(page);
    const addOwner = new AddOwner(page);
    const randomCdl = get6RandomNumber().join('');
    const randomName = `Owner ${Math.floor(Math.random() * 1000)}`;
    await addOwner.enterName(addOwner.nameField, randomName);
    await addOwner.enterNote(addOwner.noteField, Constants.noteFirst);
    await addOwner.enterCdl(addOwner.cdlField, randomCdl);
    await addOwner.isChecked(addOwner.isActiveCheckbox);
    await addOwner.addButton.click();
    await owner.dialogBox.waitFor({ state: 'detached' });
    await owner.searchOwner(owner.searchField, randomName);
    await expect(owner.nameColumn).toContainText(randomName);
    await expect(owner.cdlColumn).toContainText(randomCdl);
    await expect(owner.isActiveColumn).toContainText('YES');
    await owner.deleteIcon.click();
    await expect(owner.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Name field je obavezno polje', async ({ page }) => {
    const addOwner = new AddOwner(page);
    await addOwner.addButton.click();
    await expect(addOwner.errorMessage).toContainText('The name field is required');
});

test('Dot broj mora biti unique', async ({ page }) => {
    const addOwner = new AddOwner(page);
    const owner = new OwnersPage(page);
    await owner.cdlColumn.first().waitFor();
    let existingCdl = '';
    const dotCount = await owner.cdlColumn.count();
    for (let i = 0; i < dotCount; i++) {
        const dotText = await owner.cdlColumn.nth(i).textContent();
        if (dotText && dotText.trim() !== '') {
            existingCdl = dotText.trim();
            break;
        }
    }
    await addOwner.enterName(addOwner.nameField, Constants.driverNameFraser);
    await addOwner.enterCdl(addOwner.cdlField, existingCdl);
    await addOwner.addButton.click();
    await expect(addOwner.errorMessage).toContainText('This field must be unique');
});
