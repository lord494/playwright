import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda novog Ownera i da ga obrise', async ({ ownerStup, addOwner }) => {
    addOwner.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomCdl = get6RandomNumber().join('');
    const randomName = `Owner ${Math.floor(Math.random() * 1000)}`;
    await addOwner.enterName(addOwner.nameField, randomName);
    await addOwner.enterNote(addOwner.noteField, Constants.noteFirst);
    await addOwner.enterCdl(addOwner.cdlField, randomCdl);
    await addOwner.isChecked(addOwner.isActiveCheckbox);
    await addOwner.addButton.click();
    await ownerStup.dialogBox.waitFor({ state: 'detached' });
    await ownerStup.searchOwner(ownerStup.searchField, randomName);
    await expect(ownerStup.nameColumn).toContainText(randomName);
    await expect(ownerStup.cdlColumn).toContainText(randomCdl);
    await expect(ownerStup.isActiveColumn).toContainText('YES');
    await ownerStup.deleteIcon.click();
    await expect(ownerStup.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Name field je obavezno polje', async ({ ownerStup, addOwner }) => {
    await addOwner.addButton.click();
    await expect(addOwner.errorMessage).toContainText('The name field is required');
});

test('Dot broj mora biti unique', async ({ ownerStup, addOwner }) => {
    await ownerStup.cdlColumn.first().waitFor();
    let existingCdl = '';
    const dotCount = await ownerStup.cdlColumn.count();
    for (let i = 0; i < dotCount; i++) {
        const dotText = await ownerStup.cdlColumn.nth(i).textContent();
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
