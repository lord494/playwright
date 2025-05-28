import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailerMakesPage } from '../../page/trailer/trailerMakes.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.trailerMakesUrl);
});

test('Korisnik moze da doda Trailer Make i da ga obrise', async ({ page }) => {
    const make = new TrailerMakesPage(page);
    await page.waitForLoadState('networkidle');
    await make.clickElement(make.addMakeIcon);
    await make.fillMakeName(make.nameMakeField, Constants.makeName);
    await make.fillVinPrefix(make.vinPrefixField, Constants.extThird);
    await make.fillVinPrefix(make.noteField, Constants.noteFirst);
    await make.check(make.isActiveCheckbox);
    await make.clickAddButton();
    await make.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(make.makeNameColumn.nth(2)).toContainText(Constants.makeName);
    await expect(make.vinPrefix.nth(2)).toContainText(Constants.extThird);
    await expect(make.noteColumn.nth(2)).toContainText(Constants.noteFirst);
    await expect(make.isActiveColumn.nth(2)).toContainText('YES');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await make.clickElement(make.grayDeleteIcon.nth(2));
    await expect(make.snackMessage).toContainText(Constants.makeName + " successfully deleted");
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
    await page.waitForLoadState('networkidle');
    await make.clickElement(make.addMakeIcon);
    await make.fillMakeName(make.nameMakeField, Constants.makeName);
    await make.fillVinPrefix(make.vinPrefixField, Constants.extThird);
    await make.fillVinPrefix(make.noteField, Constants.noteFirst);
    await make.check(make.isActiveCheckbox);
    await make.clickAddButton();
    await make.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await make.clickElement(make.pencilIcon.nth(2));
    await make.nameMakeField.clear();
    await make.fillMakeName(make.nameMakeField, Constants.newMakeName);
    await make.vinPrefixField.clear();
    await make.fillVinPrefix(make.vinPrefixField, Constants.extFourth);
    await make.noteField.clear();
    await make.fillNote(make.noteField, Constants.noteSecond);
    await make.uncheck(make.isActiveCheckbox);
    await make.clickSaveButton();
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(make.makeNameColumn.nth(2)).toContainText(Constants.newMakeName);
    await expect(make.vinPrefix.nth(2)).toContainText(Constants.extFourth);
    await expect(make.noteColumn.nth(2)).toContainText(Constants.noteSecond);
    await expect(make.isActiveColumn.nth(2)).toContainText('NO');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await make.clickElement(make.grayDeleteIcon.nth(2));
    await expect(make.snackMessage).toContainText(Constants.newMakeName + " successfully deleted");
});

