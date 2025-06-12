import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailerTypesPage } from '../../page/trailer/trailerTypes.page';
import { TruckModelPage } from '../../page/truck/truckModel.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.truckModelUrl);
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da doda Truck Model i da ga obrise', async ({ page }) => {
    const truckModel = new TruckModelPage(page);
    await truckModel.clickElement(truckModel.addModelIcon);
    await truckModel.selectMake(truckModel.makeMenu, truckModel.volvoModelOption);
    await truckModel.fillName(truckModel.nameTypeField, Constants.makeName);
    await truckModel.fillNote(truckModel.noteField, Constants.noteFirst);
    await truckModel.check(truckModel.isActiveCheckbox);
    await truckModel.clickAddButton();
    await truckModel.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(truckModel.modelNameColumn.last()).toContainText(Constants.makeName);
    await expect(truckModel.truckMakeColumn.last()).toContainText(Constants.makeVolvo);
    await expect(truckModel.noteColumn.last()).toContainText(Constants.noteFirst);
    await expect(truckModel.isActiveColumn.last()).toContainText('YES');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await truckModel.clickElement(truckModel.grayDeleteIcon.last());
    expect(truckModel.snackMessage).toContainText(Constants.makeName + " successfully deleted");
});

test('Name make type je obavezno polje', async ({ page }) => {
    const truckModel = new TruckModelPage(page);
    await truckModel.clickElement(truckModel.addModelIcon);
    await truckModel.selectMake(truckModel.makeMenu, truckModel.volvoModelOption);
    await truckModel.clickAddButton();
    await expect(truckModel.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(truckModel.errorMessage).toContainText('The name field is required');
});

test('Make je obavezno polje', async ({ page }) => {
    const truckModel = new TruckModelPage(page);
    await truckModel.clickElement(truckModel.addModelIcon);
    await truckModel.fillName(truckModel.nameTypeField, Constants.makeName);
    await truckModel.clickAddButton();
    await expect(truckModel.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(truckModel.errorMessage).toContainText('The make field is required');
});

test('Korisnik moze da doda Trailer Type, edituje i da ga obrise', async ({ page }) => {
    const truckModel = new TruckModelPage(page);
    await truckModel.clickElement(truckModel.addModelIcon);
    await truckModel.selectMake(truckModel.makeMenu, truckModel.volvoModelOption);
    await truckModel.fillName(truckModel.nameTypeField, Constants.makeName);
    await truckModel.fillNote(truckModel.noteField, Constants.noteFirst);
    await truckModel.check(truckModel.isActiveCheckbox);
    await truckModel.clickAddButton();
    await truckModel.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await truckModel.clickElement(truckModel.pencilIcon.last());
    await truckModel.selectMake(truckModel.makeMenu, truckModel.freightlinerOption);
    await truckModel.nameTypeField.clear();
    await truckModel.fillName(truckModel.nameTypeField, Constants.newMakeName);
    await truckModel.noteField.clear();
    await truckModel.fillNote(truckModel.noteField, Constants.noteSecond);
    await truckModel.uncheck(truckModel.isActiveCheckbox);
    await truckModel.clickSaveButton();
    await expect(truckModel.modelNameColumn.last()).toContainText(Constants.newMakeName);
    await expect(truckModel.truckMakeColumn.last()).toContainText(Constants.freightlinerOption);
    await expect(truckModel.noteColumn.last()).toContainText(Constants.noteSecond);
    await expect(truckModel.isActiveColumn.last()).toContainText('NO');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await truckModel.clickElement(truckModel.grayDeleteIcon.last());
    await expect(truckModel.snackMessage).toContainText(Constants.newMakeName + " successfully deleted");
});

