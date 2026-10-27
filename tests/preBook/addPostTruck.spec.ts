import { expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da edituje post truck', async ({ cleanupSetupAddPostTruck, addPostTruckSetup }) => {
    await addPostTruckSetup.pencilIcon.first().click();
    await addPostTruckSetup.selectAvail(addPostTruckSetup.availField, addPostTruckSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first());
    await addPostTruckSetup.selectOrigin(addPostTruckSetup.originField, Constants.miamiOriginCity, addPostTruckSetup.miamiOption);
    await addPostTruckSetup.selecDestination(addPostTruckSetup.destinatinField, Constants.newYorkCity, addPostTruckSetup.newYorkOption);
    await addPostTruckSetup.selectTrailerType(addPostTruckSetup.trailerTypeField, addPostTruckSetup.secondTrailerType);
    await addPostTruckSetup.noteField.clear();
    await addPostTruckSetup.fillNote(addPostTruckSetup.noteField, Constants.noteSecond);
    await addPostTruckSetup.saveButton.click();
    await addPostTruckSetup.dialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await addPostTruckSetup.page.waitForLoadState('networkidle');
    await expect(addPostTruckSetup.originColumn.first()).toContainText(Constants.miamiOriginCity);
    await expect(addPostTruckSetup.destinationColumn.first()).toContainText(Constants.newYorkCity);
    await expect(addPostTruckSetup.trailerTypeColumn.first()).toContainText('V');
    await expect(addPostTruckSetup.noteColumn.first()).toContainText(Constants.noteSecond);
});

test('Korisnik moze da obrise post truck', async ({ addPostTruckSetup }) => {
    const id = await addPostTruckSetup.idColumn.first().textContent();
    addPostTruckSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await addPostTruckSetup.page.waitForLoadState('networkidle');
    await addPostTruckSetup.grayDeleteIcon.first().click();
    await addPostTruckSetup.snackMessage.waitFor({ state: 'visible', timeout: 5000 });
    const allIds = await addPostTruckSetup.idColumn.allTextContents();
    for (const currentId of allIds) {
        expect(currentId).not.toBe(id);
    }
});

test('Korisnik se redirektuje na post load stranicu kada klikne na truck id', async ({ addPostTruckSetup }) => {
    await addPostTruckSetup.truckIdColumn.first().click();
    await expect(addPostTruckSetup.page).toHaveURL(/pre-book\/post-loads/);
});

test('Avail polje je obavezno polje', async ({ addPostTruckSetup }) => {
    await addPostTruckSetup.addCompnayIcon.click();
    await addPostTruckSetup.selectOrigin(addPostTruckSetup.originField, Constants.deliveryCity, addPostTruckSetup.originOption);
    await addPostTruckSetup.selecDestination(addPostTruckSetup.destinatinField, Constants.seconDeliveryCity, addPostTruckSetup.destinationOption);
    await addPostTruckSetup.selectTrailerType(addPostTruckSetup.trailerTypeField, addPostTruckSetup.trailerTypeOption);
    await addPostTruckSetup.noteField.fill(Constants.noteFirst);
    await addPostTruckSetup.saveButton.click();
    await expect(addPostTruckSetup.errorMessage).toContainText('The avail field is required');
});

test('Origin polje je obavezno polje', async ({ addPostTruckSetup }) => {
    await addPostTruckSetup.addCompnayIcon.click();
    await addPostTruckSetup.selectAvail(addPostTruckSetup.availField, addPostTruckSetup.todayDateInDatepicker);
    await addPostTruckSetup.selecDestination(addPostTruckSetup.destinatinField, Constants.seconDeliveryCity, addPostTruckSetup.destinationOption);
    await addPostTruckSetup.selectTrailerType(addPostTruckSetup.trailerTypeField, addPostTruckSetup.trailerTypeOption);
    await addPostTruckSetup.noteField.fill(Constants.noteFirst);
    await addPostTruckSetup.saveButton.click();
    await expect(addPostTruckSetup.errorMessage).toContainText('The origin field is required');
});

test('Trailer type polje je obavezno polje', async ({ addPostTruckSetup }) => {
    await addPostTruckSetup.addCompnayIcon.click();
    await addPostTruckSetup.selectAvail(addPostTruckSetup.availField, addPostTruckSetup.todayDateInDatepicker);
    await addPostTruckSetup.selectOrigin(addPostTruckSetup.originField, Constants.deliveryCity, addPostTruckSetup.originOption);
    await addPostTruckSetup.selecDestination(addPostTruckSetup.destinatinField, Constants.seconDeliveryCity, addPostTruckSetup.destinationOption);
    await addPostTruckSetup.noteField.fill(Constants.noteFirst);
    await addPostTruckSetup.saveButton.click();
    await expect(addPostTruckSetup.errorMessage).toContainText('The trailer type field is required');
});

test('Post truck je prikazan u posted trucks stranici', async ({ addPostTruckSetup }) => {
    const id = (await addPostTruckSetup.idColumn.first().allInnerTexts()).toString();
    await addPostTruckSetup.page.goto(Constants.postedTruckUrl, { waitUntil: 'networkidle', timeout: 10000 });
    await Promise.all([
        addPostTruckSetup.page.waitForResponse(response =>
            response.url().includes('/api/post-trucks') &&
            response.status() === 200 || response.status() == 304
        ),
        addPostTruckSetup.page.locator('.v-input__slot').first().locator('input').fill(id)
    ]);
    await expect(addPostTruckSetup.idColumn.first()).toContainText(id);
});