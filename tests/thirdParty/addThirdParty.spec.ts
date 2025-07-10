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

test('Korisnik moze da doda third party', async ({ page }) => {
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
    await expect(thirdParty.nameColumn).toContainText(randomName);
    await expect(thirdParty.temporaryColumn).toContainText('YES');
    await expect(thirdParty.dotColumn).toContainText(randomDot);
    await expect(thirdParty.phoneColumn).toContainText(randomPhone);
    await expect(thirdParty.isActiveColumn).toContainText('YES');
    await thirdParty.deleteIcon.click();
    await expect(thirdParty.snackMessage).toContainText(' ' + randomName + ' successfully deleted');
});

test('Name field je obavezno polje', async ({ page }) => {
    const addThirdParty = new AddThirdParty(page);
    await addThirdParty.addButton.click();
    await expect(addThirdParty.errorMessage).toContainText('The name field is required');
});

test('Dot broj mora biti unique', async ({ page }) => {
    const addThirdParty = new AddThirdParty(page);
    const thirdParty = new ThirdPartyPage(page);
    await thirdParty.dotColumn.first().waitFor();
    let existingDot = '';
    const dotCount = await thirdParty.dotColumn.count();
    for (let i = 0; i < dotCount; i++) {
        const dotText = await thirdParty.dotColumn.nth(i).textContent();
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
