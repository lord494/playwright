import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da edituje ownera', async ({ ownerStup, addOwner }) => {
    addOwner.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomCdl = get6RandomNumber().join('');
    const randomName = `Third Party ${Math.floor(Math.random() * 1000)}`;
    await addOwner.enterName(addOwner.nameField, randomName);
    await addOwner.enterNote(addOwner.noteField, Constants.noteFirst);
    await addOwner.enterCdl(addOwner.cdlField, randomCdl);
    await addOwner.isChecked(addOwner.isActiveCheckbox);
    await addOwner.addButton.click();
    await ownerStup.dialogBox.waitFor({ state: 'detached' });
    await ownerStup.searchOwner(ownerStup.searchField, randomName);
    await ownerStup.pencilIcon.click();
    const editRandomName = `Edited ${randomName}`;
    await addOwner.nameField.clear();
    await addOwner.enterName(addOwner.nameField, editRandomName);
    await addOwner.noteField.clear();
    await addOwner.enterNote(addOwner.noteField, Constants.noteSecond);
    const editDotNumber = get6RandomNumber().join('');
    await addOwner.cdlField.clear();
    await addOwner.enterCdl(addOwner.cdlField, editDotNumber);
    await addOwner.uncheck(addOwner.isActiveCheckbox);
    await addOwner.saveButton.click();
    await ownerStup.dialogBox.waitFor({ state: 'detached' });
    await expect(ownerStup.nameColumn).toContainText(editRandomName);
    await expect(ownerStup.cdlColumn).toContainText(editDotNumber);
    await expect(ownerStup.isActiveColumn).toContainText('NO');
    await ownerStup.deleteIcon.click();
    await expect(ownerStup.snackMessage).toContainText(' ' + editRandomName + ' successfully deleted');
});