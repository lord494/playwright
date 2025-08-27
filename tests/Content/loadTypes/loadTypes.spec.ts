import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { LoadTypesPage } from '../../../page/Content/loadTypes.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.loadTypesUrl, { waitUntil: 'networkidle', timeout: 20000 });
});

test('Korisnik moze da doda Load Type i da ga obrise', async ({ page }) => {
    const type = new LoadTypesPage(page);
    await type.clickElement(type.addTypeIcon);
    await type.fillBoardName(type.nameTypeField, Constants.newLoadType);
    const desiredColor = type.colorOptions.filter({
        has: page.locator('[style*="rgb(194, 24, 91)"]')
    });
    await desiredColor.first().click();
    await type.clickAddButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(type.typeColumn.last()).toContainText(Constants.newLoadType);
    await expect(type.colorColumn.last()).toHaveCSS('background-color', 'rgb(194, 24, 91)');
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await type.clickElement(type.grayDeleteIcon.last());
    await expect(type.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Name load type je obavezno polje', async ({ page }) => {
    const type = new LoadTypesPage(page);
    await type.clickElement(type.addTypeIcon);
    await type.clickAddButton();
    await expect(type.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(type.errorMessage).toContainText('The type field is required');
});

test('Korisnik moze da doda Load Type, postavi is Active false i da ga obrise', async ({ page }) => {
    const type = new LoadTypesPage(page);
    await type.clickElement(type.addTypeIcon);
    await type.fillBoardName(type.nameTypeField, Constants.newLoadType);
    const desiredColor = type.colorOptions.filter({
        has: page.locator('[style*="rgb(194, 24, 91)"]')
    });
    await desiredColor.first().click();
    await type.uncheck(type.isActiveCheckbox);
    await type.clickAddButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(type.typeColumn.last()).toContainText(Constants.newLoadType);
    await expect(type.colorColumn.last()).toHaveCSS('background-color', 'rgb(194, 24, 91)');
    await expect(type.isActiveColumn.last()).toContainText(Constants.notAcitve);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await type.clickElement(type.grayDeleteIcon.last());
    await expect(type.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Korisnik moze da doda Load Type i podesi boje pomocu slider-a i da ga obrise', async ({ page }) => {
    const type = new LoadTypesPage(page);
    await type.clickElement(type.addTypeIcon);
    await type.fillBoardName(type.nameTypeField, Constants.newLoadType);
    const box = await type.sliderThumb.first().boundingBox();
    if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 55, box.y + box.height / 2);
        await page.mouse.up();
    }
    const styleAttr = await type.dotColorPicker.getAttribute('style');
    const background = styleAttr?.match(/background:\s*(.*);?/i)?.[1];
    await type.clickAddButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(type.typeColumn.last()).toContainText(Constants.newLoadType);
    const styleInTable = await type.colorColumn.last().getAttribute('style');
    const backgroundInTable = styleInTable?.match(/background:\s*(.*);?/i)?.[1];
    expect(backgroundInTable).toBe(background);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await type.clickElement(type.grayDeleteIcon.last());
    await expect(type.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Korisnik moze da doda Load Type i podesi obe boje pomocu slider-a i da ga obrise', async ({ page }) => {
    const type = new LoadTypesPage(page);
    await type.clickElement(type.addTypeIcon);
    await type.fillBoardName(type.nameTypeField, Constants.newLoadType);
    const box = await type.sliderThumb.first().boundingBox();
    if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 55, box.y + box.height / 2);
        await page.mouse.up();
    }
    const box2 = await type.sliderThumb.last().boundingBox();
    if (box2) {
        await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
        await page.mouse.down();
        await page.mouse.move(box2.x + box2.width / 2 - 55, box2.y + box2.height / 2);
        await page.mouse.up();
    }
    const styleAttr = await type.dotColorPicker.getAttribute('style');
    const background = styleAttr?.match(/background:\s*(.*);?/i)?.[1];
    await type.clickAddButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(type.typeColumn.last()).toContainText(Constants.newLoadType);
    const styleInTable = await type.colorColumn.last().getAttribute('style');
    const backgroundInTable = styleInTable?.match(/background:\s*(.*);?/i)?.[1];
    expect(backgroundInTable).toBe(background);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await type.clickElement(type.grayDeleteIcon.last());
    await expect(type.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Korisnik moze da doda Load Type, izmeni boju i da ga obrise', async ({ page }) => {
    const type = new LoadTypesPage(page);
    await type.clickElement(type.addTypeIcon);
    await type.fillBoardName(type.nameTypeField, Constants.newLoadType);
    const initialColor = 'rgb(194, 24, 91)';
    const firstColor = type.colorOptions.filter({
        has: page.locator(`[style*="${initialColor}"]`)
    });
    await firstColor.first().click();
    await type.clickAddButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(type.typeColumn.last()).toContainText(Constants.newLoadType);
    await expect(type.colorColumn.last()).toHaveCSS('background-color', initialColor);
    await type.clickElement(type.pencilIcon.last());
    const updatedColor = 'rgb(142, 36, 170)';
    const secondColor = type.colorOptions.filter({
        has: page.locator(`[style*="${updatedColor}"]`)
    });
    await secondColor.first().click();
    await type.nameTypeField.clear();
    await type.fillBoardName(type.nameTypeField, Constants.newLoadTypeEdit);
    await type.clickSaveButton();
    await type.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(type.typeColumn.last()).toContainText(Constants.newLoadTypeEdit);
    await expect(type.colorColumn.last()).toHaveCSS('background-color', updatedColor);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await type.clickElement(type.grayDeleteIcon.last());
    await expect(type.snackMessage).toContainText(Constants.newLoadTypeEdit + " successfully deleted");
});
