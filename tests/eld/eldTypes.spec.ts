import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda Load Type i da ga obrise', async ({ eldTypes }) => {
    await eldTypes.clickElement(eldTypes.addTypeIcon);
    await eldTypes.fillTypeName(eldTypes.nameTypeField, Constants.newLoadType);
    const colorOptions = eldTypes.page.locator('.v-color-picker__color');
    const desiredColor = colorOptions.filter({
        has: eldTypes.page.locator('[style*="rgb(194, 24, 91)"]')
    });
    await desiredColor.first().click();
    await eldTypes.clickAddButton();
    await eldTypes.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(eldTypes.typeColumn.last()).toContainText(Constants.newLoadType);
    await expect(eldTypes.colorColumn.last()).toHaveCSS('background-color', 'rgb(194, 24, 91)');
    eldTypes.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await eldTypes.clickElement(eldTypes.grayDeleteIcon.last());
    await expect(eldTypes.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Name load type je obavezno polje', async ({ eldTypes }) => {
    await eldTypes.clickElement(eldTypes.addTypeIcon);
    await eldTypes.page.waitForLoadState('networkidle');
    await eldTypes.clickAddButton();
    await expect(eldTypes.errorMessage).toBeVisible({ timeout: 3000 });
    await expect(eldTypes.errorMessage).toContainText('The type field is required');
});

test('Korisnik moze da doda Load Type, postavi is Active false i da ga obrise', async ({ eldTypes }) => {
    await eldTypes.clickElement(eldTypes.addTypeIcon);
    await eldTypes.page.waitForLoadState('networkidle');
    await eldTypes.fillTypeName(eldTypes.nameTypeField, Constants.newLoadType);
    await eldTypes.page.waitForLoadState('networkidle');
    const colorOptions = eldTypes.page.locator('.v-color-picker__color');
    const desiredColor = colorOptions.filter({
        has: eldTypes.page.locator('[style*="rgb(194, 24, 91)"]')
    });
    await desiredColor.first().click();
    await eldTypes.uncheck(eldTypes.isActiveCheckbox);
    await eldTypes.clickAddButton();
    await eldTypes.page.waitForLoadState('networkidle');
    await eldTypes.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(eldTypes.typeColumn.last()).toContainText(Constants.newLoadType);
    await expect(eldTypes.colorColumn.last()).toHaveCSS('background-color', 'rgb(194, 24, 91)');
    await expect(eldTypes.isActiveColumn.last()).toContainText(Constants.notAcitve);
    eldTypes.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await eldTypes.clickElement(eldTypes.grayDeleteIcon.last());
    await expect(eldTypes.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Korisnik moze da doda Load Type i podesi boje pomocu slider-a i da ga obrise', async ({ eldTypes }) => {
    await eldTypes.clickElement(eldTypes.addTypeIcon);
    await eldTypes.fillTypeName(eldTypes.nameTypeField, Constants.newLoadType);
    const box = await eldTypes.sliderThumb.first().boundingBox();
    if (box) {
        await eldTypes.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await eldTypes.page.mouse.down();
        await eldTypes.page.mouse.move(box.x + box.width / 2 + 55, box.y + box.height / 2);
        await eldTypes.page.mouse.up();
    }
    const styleAttr = await eldTypes.dotColorPicker.getAttribute('style');
    const background = styleAttr?.match(/background:\s*(.*);?/i)?.[1];
    await eldTypes.clickAddButton();
    await eldTypes.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(eldTypes.typeColumn.last()).toContainText(Constants.newLoadType);
    const styleInTable = await eldTypes.colorColumn.last().getAttribute('style');
    const backgroundInTable = styleInTable?.match(/background:\s*(.*);?/i)?.[1];
    expect(backgroundInTable).toBe(background);
    eldTypes.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await eldTypes.clickElement(eldTypes.grayDeleteIcon.last());
    await expect(eldTypes.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Korisnik moze da doda Load Type i podesi obe boje pomocu slider-a i da ga obrise', async ({ eldTypes }) => {
    await eldTypes.clickElement(eldTypes.addTypeIcon);
    await eldTypes.fillTypeName(eldTypes.nameTypeField, Constants.newLoadType);
    const box = await eldTypes.sliderThumb.first().boundingBox();
    if (box) {
        await eldTypes.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await eldTypes.page.mouse.down();
        await eldTypes.page.mouse.move(box.x + box.width / 2 + 55, box.y + box.height / 2);
        await eldTypes.page.mouse.up();
    }
    const box2 = await eldTypes.sliderThumb.last().boundingBox();
    if (box2) {
        await eldTypes.page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
        await eldTypes.page.mouse.down();
        await eldTypes.page.mouse.move(box2.x + box2.width / 2 - 55, box2.y + box2.height / 2);
        await eldTypes.page.mouse.up();
    }
    const styleAttr = await eldTypes.dotColorPicker.getAttribute('style');
    const background = styleAttr?.match(/background:\s*(.*);?/i)?.[1];
    await eldTypes.clickAddButton();
    await eldTypes.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(eldTypes.typeColumn.last()).toContainText(Constants.newLoadType);
    const styleInTable = await eldTypes.colorColumn.last().getAttribute('style');
    const backgroundInTable = styleInTable?.match(/background:\s*(.*);?/i)?.[1];
    expect(backgroundInTable).toBe(background);
    eldTypes.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await eldTypes.clickElement(eldTypes.grayDeleteIcon.last());
    await expect(eldTypes.snackMessage).toContainText(Constants.newLoadType + " successfully deleted");
});

test('Korisnik moze da doda Load Type, izmeni boju i da ga obrise', async ({ eldTypes }) => {
    await eldTypes.clickElement(eldTypes.addTypeIcon);
    await eldTypes.fillTypeName(eldTypes.nameTypeField, Constants.newLoadType);
    const colorOptions = eldTypes.page.locator('.v-color-picker__color');
    const initialColor = 'rgb(194, 24, 91)';
    const firstColor = colorOptions.filter({
        has: eldTypes.page.locator(`[style*="${initialColor}"]`)
    });
    await firstColor.first().click();
    await eldTypes.clickAddButton();
    await eldTypes.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(eldTypes.typeColumn.last()).toContainText(Constants.newLoadType);
    await expect(eldTypes.colorColumn.last()).toHaveCSS('background-color', initialColor);
    await eldTypes.clickElement(eldTypes.pencilIcon.last());
    const updatedColor = 'rgb(142, 36, 170)';
    const secondColor = colorOptions.filter({
        has: eldTypes.page.locator(`[style*="${updatedColor}"]`)
    });
    await secondColor.first().click();
    await eldTypes.nameTypeField.clear();
    await eldTypes.fillTypeName(eldTypes.nameTypeField, Constants.newLoadTypeEdit);
    await eldTypes.clickSaveButton();
    await eldTypes.addEditModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(eldTypes.typeColumn.last()).toContainText(Constants.newLoadTypeEdit);
    await expect(eldTypes.colorColumn.last()).toHaveCSS('background-color', updatedColor);
    eldTypes.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await eldTypes.clickElement(eldTypes.grayDeleteIcon.last());
    await expect(eldTypes.snackMessage).toContainText(Constants.newLoadTypeEdit + " successfully deleted");
});
