import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { ThirdPartyPage } from '../../page/thirdParty/thirdPartyOverview.page';
import { AddThirdParty } from '../../page/thirdParty/addThirdParty.page';
import { get6RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const thirdParty = new ThirdPartyPage(page);
    await page.goto(Constants.thirdPartyUrl, { waitUntil: 'networkidle' });
    await thirdParty.addThirdPartyButton.click();
});

test('Korisnik moze da edituje third party', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const thirdParty = new ThirdPartyPage(page);
    const addThirdParty = new AddThirdParty(page);
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
    await thirdParty.dialogBox.waitFor({ state: 'detached' });
    await thirdParty.searchThirdParty(thirdParty.searchField, randomName);
    await thirdParty.pencilIcon.click();
    const editRandomName = `Edited ${randomName}`;
    await addThirdParty.nameField.clear();
    await addThirdParty.enterName(addThirdParty.nameField, editRandomName);
    await addThirdParty.noteField.clear();
    await addThirdParty.enterNote(addThirdParty.noteField, Constants.noteSecond);
    const editDotNumber = get6RandomNumber().join('');
    await addThirdParty.dotField.clear();
    await addThirdParty.enterDot(addThirdParty.dotField, editDotNumber);
    const editPhoneNumber = getRandom10Number().join('');
    await addThirdParty.phoneField.clear();
    await addThirdParty.enterPhone(addThirdParty.phoneField, editPhoneNumber);
    await addThirdParty.uncheck(addThirdParty.temporaryCheckbox);
    await addThirdParty.uncheck(addThirdParty.isActiveCheckbox);
    await addThirdParty.saveButton.click();
    await thirdParty.dialogBox.waitFor({ state: 'detached' });
    await expect(thirdParty.nameColumn).toContainText(editRandomName);
    await expect(thirdParty.temporaryColumn).toContainText('NO');
    await expect(thirdParty.dotColumn).toContainText(editDotNumber);
    await expect(thirdParty.phoneColumn).toContainText(editPhoneNumber);
    await expect(thirdParty.isActiveColumn).toContainText('NO');
    await thirdParty.deleteIcon.click();
    await expect(thirdParty.snackMessage).toContainText(' ' + editRandomName + ' successfully deleted');
});