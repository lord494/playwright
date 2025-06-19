import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TruckMakePage } from '../../page/truck/truckMake.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const make = new TruckMakePage(page);
    await page.goto(Constants.truckMakeUrl, { waitUntil: 'networkidle' });
    await make.makeNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da doda Truck Make i da ga obrise', async ({ page }) => {
    const make = new TruckMakePage(page);
    await make.clickElement(make.addMakeIcon);
    await make.fillMakeName(make.nameMakeField, Constants.makeName);
    await make.fillNote(make.noteField, Constants.noteFirst);
    await make.check(make.isActiveCheckbox);
    await make.clickAddButton();
    await make.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await expect(make.makeNameColumn.last()).toContainText(Constants.makeName);
    await expect(make.noteColumn.last()).toContainText(Constants.noteFirst);
    await expect(make.isActiveColumn.last()).toContainText('YES');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await make.clickElement(make.grayDeleteIcon.last());
    await expect(make.snackMessage).toContainText(Constants.makeName + " successfully deleted");
});

test('Make name je obavezno polje', async ({ page }) => {
    const make = new TruckMakePage(page);
    await make.clickElement(make.addMakeIcon);
    await make.fillNote(make.noteField, Constants.noteFirst)
    await make.clickAddButton();
    await expect(make.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(make.errorMessage).toContainText('The name field is required');
});

test('Note je obavezno polje', async ({ page }) => {
    const make = new TruckMakePage(page);
    await make.clickElement(make.addMakeIcon);
    await make.fillMakeName(make.nameMakeField, Constants.makeName);
    await make.clickAddButton();
    await expect(make.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(make.errorMessage).toContainText('The note field is required');
});

test('Korisnik moze da doda Truck Make, edituje i da ga obrise', async ({ page }) => {
    const make = new TruckMakePage(page);
    await make.clickElement(make.addMakeIcon);
    await make.fillMakeName(make.nameMakeField, Constants.makeName);
    await make.fillNote(make.noteField, Constants.noteFirst);
    await make.check(make.isActiveCheckbox);
    await make.clickAddButton();
    await make.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await make.clickElement(make.pencilIcon.last());
    await make.nameMakeField.clear();
    await make.fillMakeName(make.nameMakeField, Constants.newMakeName);
    await make.noteField.clear();
    await make.fillNote(make.noteField, Constants.noteSecond);
    await make.uncheck(make.isActiveCheckbox);
    await make.clickSaveButton();
    await make.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await expect(make.makeNameColumn.last()).toContainText(Constants.newMakeName);
    await expect(make.noteColumn.last()).toContainText(Constants.noteSecond);
    await expect(make.isActiveColumn.last()).toContainText('NO');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await make.clickElement(make.grayDeleteIcon.last());
    await expect(make.snackMessage).toContainText(Constants.newMakeName + " successfully deleted");
});

