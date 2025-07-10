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

test('Korisnik moze da edituje ownera', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const owner = new OwnersPage(page);
    const editOwner = new AddOwner(page);
    const randomCdl = get6RandomNumber().join('');
    const randomName = `Third Party ${Math.floor(Math.random() * 1000)}`;
    await editOwner.enterName(editOwner.nameField, randomName);
    await editOwner.enterNote(editOwner.noteField, Constants.noteFirst);
    await editOwner.enterCdl(editOwner.cdlField, randomCdl);
    await editOwner.isChecked(editOwner.isActiveCheckbox);
    await editOwner.addButton.click();
    await owner.dialogBox.waitFor({ state: 'detached' });
    await owner.searchOwner(owner.searchField, randomName);
    await owner.pencilIcon.click();
    const editRandomName = `Edited ${randomName}`;
    await editOwner.nameField.clear();
    await editOwner.enterName(editOwner.nameField, editRandomName);
    await editOwner.noteField.clear();
    await editOwner.enterNote(editOwner.noteField, Constants.noteSecond);
    const editDotNumber = get6RandomNumber().join('');
    await editOwner.cdlField.clear();
    await editOwner.enterCdl(editOwner.cdlField, editDotNumber);
    await editOwner.uncheck(editOwner.isActiveCheckbox);
    await editOwner.saveButton.click();
    await owner.dialogBox.waitFor({ state: 'detached' });
    await expect(owner.nameColumn).toContainText(editRandomName);
    await expect(owner.cdlColumn).toContainText(editDotNumber);
    await expect(owner.isActiveColumn).toContainText('NO');
    await owner.deleteIcon.click();
    await expect(owner.snackMessage).toContainText(' ' + editRandomName + ' successfully deleted');
});