import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda third party', async ({ thirdPartySetup, addThirdParty }) => {
    thirdPartySetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomDot = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    const randomName = `Third Party ${Math.floor(Math.random() * 1000)}`;
    await addThirdParty.enterName(addThirdParty.nameField, randomName);
    await addThirdParty.enterNote(addThirdParty.noteField, Constants.noteFirst);
    await addThirdParty.enterDot(addThirdParty.dotField, randomDot);
    await addThirdParty.enterPhone(addThirdParty.phoneField, randomPhone);
    await addThirdParty.isChecked(addThirdParty.isActiveCheckbox);
    await addThirdParty.isChecked(addThirdParty.temporaryCheckbox);
    await addThirdParty.addButton.click();
    await thirdPartySetup.dialogBox.waitFor({ state: 'detached' });
    await thirdPartySetup.searchThirdParty(thirdPartySetup.searchField, randomName);
    await expect(thirdPartySetup.nameColumn).toContainText(randomName);
    await expect(thirdPartySetup.temporaryColumn).toContainText('YES');
    await expect(thirdPartySetup.dotColumn).toContainText(randomDot);
    await expect(thirdPartySetup.phoneColumn).toContainText(randomPhone);
    await expect(thirdPartySetup.isActiveColumn).toContainText('YES');
    await thirdPartySetup.deleteIcon.click();
    await expect(thirdPartySetup.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Name field je obavezno polje', async ({ thirdPartySetup, addThirdParty }) => {
    await addThirdParty.addButton.click();
    await expect(addThirdParty.errorMessage).toContainText('The name field is required');
});

test('Dot broj mora biti unique', async ({ thirdPartySetup, addThirdParty }) => {
    await thirdPartySetup.dotColumn.first().waitFor();
    let existingDot = '';
    const dotCount = await thirdPartySetup.dotColumn.count();
    for (let i = 0; i < dotCount; i++) {
        const dotText = await thirdPartySetup.dotColumn.nth(i).textContent();
        if (dotText && dotText.trim() !== '') {
            existingDot = dotText.trim();
            break;
        }
    }
    await addThirdParty.enterName(addThirdParty.nameField, Constants.driverNameFraser);
    await addThirdParty.enterDot(addThirdParty.dotField, existingDot);
    await addThirdParty.addButton.click();
    await expect(addThirdParty.errorMessage).toContainText('This field must be unique');
});
