import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailerMakesPage } from '../../page/trailer/trailerMakes.page';
import { generateRandomString } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const make = new TrailerMakesPage(page);
    await page.goto(Constants.trailerMakesUrl, { waitUntil: 'networkidle' });
    await make.makeNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da doda Trailer Make i da ga obrise', async ({ page }) => {
    const make = new TrailerMakesPage(page);
    // Unique per run: the table is sorted by name, so the row is found by name, not position.
    const makeName = `${Constants.makeName} ${generateRandomString()}`;
    await page.waitForLoadState('networkidle');
    await make.clickElement(make.addMakeIcon);
    await make.fillMakeName(make.nameMakeField, makeName);
    await make.fillVinPrefix(make.vinPrefixField, Constants.extThird);
    await make.fillVinPrefix(make.noteField, Constants.noteFirst);
    await make.check(make.isActiveCheckbox);
    await make.clickAddButton();
    await make.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(make.getMakeNameCell(makeName)).toContainText(makeName);
    await expect(make.getVinPrefixCell(makeName)).toContainText(Constants.extThird);
    await expect(make.getNoteCell(makeName)).toContainText(Constants.noteFirst);
    await expect(make.getIsActiveCell(makeName)).toContainText('YES');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await make.clickElement(make.getDeleteIcon(makeName));
    await expect(make.snackMessage).toContainText(makeName + " successfully deleted");
});

test('Make name je obavezno polje', async ({ page }) => {
    const type = new TrailerMakesPage(page);
    await page.waitForLoadState('networkidle');
    await type.clickElement(type.addMakeIcon);
    await type.clickAddButton();
    await expect(type.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(type.errorMessage).toContainText('The name field is required');
});

test('Korisnik moze da doda Trailer Make, edituje i da ga obrise', async ({ page }) => {
    const make = new TrailerMakesPage(page);
    const suffix = generateRandomString();
    const makeName = `${Constants.makeName} ${suffix}`;
    const editedMakeName = `${Constants.newMakeName} ${suffix}`;
    await page.waitForLoadState('networkidle');
    await make.clickElement(make.addMakeIcon);
    await make.fillMakeName(make.nameMakeField, makeName);
    await make.fillVinPrefix(make.vinPrefixField, Constants.extThird);
    await make.fillVinPrefix(make.noteField, Constants.noteFirst);
    await make.check(make.isActiveCheckbox);
    await make.clickAddButton();
    await make.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await make.clickElement(make.getPencilIcon(makeName));
    await make.nameMakeField.clear();
    await make.fillMakeName(make.nameMakeField, editedMakeName);
    await make.vinPrefixField.clear();
    await make.fillVinPrefix(make.vinPrefixField, Constants.extFourth);
    await make.noteField.clear();
    await make.fillNote(make.noteField, Constants.noteSecond);
    await make.uncheck(make.isActiveCheckbox);
    await make.clickSaveButton();
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(make.getMakeNameCell(editedMakeName)).toContainText(editedMakeName);
    await expect(make.getVinPrefixCell(editedMakeName)).toContainText(Constants.extFourth);
    await expect(make.getNoteCell(editedMakeName)).toContainText(Constants.noteSecond);
    await expect(make.getIsActiveCell(editedMakeName)).toContainText('NO');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await make.clickElement(make.getDeleteIcon(editedMakeName));
    await expect(make.snackMessage).toContainText(editedMakeName + " successfully deleted");
});

