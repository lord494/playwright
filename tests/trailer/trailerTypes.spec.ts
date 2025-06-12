import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailerTypesPage } from '../../page/trailer/trailerTypes.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.trailerTypesUrl);
});

test('Korisnik moze da doda Trailer Type i da ga obrise', async ({ page }) => {
    const type = new TrailerTypesPage(page);
    await page.waitForLoadState('networkidle');
    await type.clickElement(type.addTypeIcon);
    await type.fillTypeName(type.nameTypeField, Constants.newTrailerType);
    await type.fillNote(type.noteField, Constants.noteFirst);
    await type.check(type.isActiveCheckbox);
    await type.clickAddButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(type.typeNameColumn.last()).toContainText(Constants.newTrailerType);
    await expect(type.noteColumn.last()).toContainText(Constants.noteFirst);
    await expect(type.isActiveColumn.last()).toContainText('YES');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await type.clickElement(type.grayDeleteIcon.last());
    await expect(type.snackMessage).toContainText(Constants.newTrailerType + " successfully deleted");
});

test('Name type type je obavezno polje', async ({ page }) => {
    const type = new TrailerTypesPage(page);
    await page.waitForLoadState('networkidle');
    await type.clickElement(type.addTypeIcon);
    await type.clickAddButton();
    await expect(type.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(type.errorMessage).toContainText('The name field is required');
});

test('Korisnik moze da doda Trailer Type, edituje i da ga obrise', async ({ page }) => {
    const type = new TrailerTypesPage(page);
    await page.waitForLoadState('networkidle');
    await type.clickElement(type.addTypeIcon);
    await type.fillTypeName(type.nameTypeField, Constants.newTrailerType);
    await type.fillNote(type.noteField, Constants.noteFirst);
    await type.check(type.isActiveCheckbox);
    await type.clickAddButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await type.clickElement(type.pencilIcon.last());
    await type.nameTypeField.clear();
    await type.fillTypeName(type.nameTypeField, Constants.editTrailerType);
    await type.noteField.clear();
    await type.fillNote(type.noteField, Constants.noteSecond);
    await type.uncheck(type.isActiveCheckbox);
    await type.clickSaveButton();
    await expect(type.typeNameColumn.last()).toContainText(Constants.editTrailerType);
    await expect(type.noteColumn.last()).toContainText(Constants.noteSecond);
    await expect(type.isActiveColumn.last()).toContainText('NO');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await type.clickElement(type.grayDeleteIcon.last());
    await expect(type.snackMessage).toContainText(Constants.editTrailerType + " successfully deleted");
});

test('Test za testiranje cicd', async ({ page }) => {
    const type = new TrailerTypesPage(page);
    await page.goto(Constants.trailerUrl);
    expect(page).toHaveURL(Constants.trailerUrl);
});

