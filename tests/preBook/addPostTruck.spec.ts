import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { PostTrucksPage } from '../../page/preBook/postTrucks.page';

test.use({ storageState: 'auth.json' });

let page: Page;

//before all u uvom slucaju se koristi da se napravi load pre nego sto se testovi izvrsavaju
test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const postTruck = new PostTrucksPage(page);
    await page.goto(Constants.postTruckPrebookUrl);
    await postTruck.addCompnayIcon.waitFor({ state: 'visible', timeout: 10000 });
    await postTruck.addCompnayIcon.click();
    await postTruck.selectAvail(postTruck.availField, postTruck.todayDateInDatepicker);
    await postTruck.selectOrigin(postTruck.originField, Constants.deliveryCity, postTruck.originOption);
    await postTruck.selecDestination(postTruck.destinatinField, Constants.seconDeliveryCity, postTruck.destinationOption);
    await postTruck.selectTrailerType(postTruck.trailerTypeField, postTruck.trailerTypeOption);
    await postTruck.fillNote(postTruck.noteField, Constants.noteFirst);
    await postTruck.saveButton.click();
    await postTruck.dialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await page.goto(Constants.postTruckPrebookUrl, { waitUntil: 'networkidle', timeout: 10000 });
    await expect(postTruck.originColumn.first()).toContainText(Constants.deliveryCity);
    await expect(postTruck.destinationColumn.first()).toContainText(Constants.seconDeliveryCity);
    await expect(postTruck.trailerTypeColumn.first()).toContainText('R');
    await expect(postTruck.noteColumn.first()).toContainText(Constants.noteFirst);
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    await expect(postTruck.availColumn.first()).toContainText(formattedDate);
});

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.postTruckPrebookUrl, { waitUntil: 'networkidle', timeout: 10000 });
});

test('Korisnik moze da edituje post truck', async ({ page }) => {
    const postTruck = new PostTrucksPage(page);
    await postTruck.pencilIcon.first().click();
    await postTruck.selectAvail(postTruck.availField, page.getByRole('button', { name: '20', exact: true }).locator('div').first());
    await postTruck.selectOrigin(postTruck.originField, Constants.miamiOriginCity, postTruck.miamiOption);
    await postTruck.selecDestination(postTruck.destinatinField, Constants.newYorkCity, postTruck.newYorkOption);
    await postTruck.selectTrailerType(postTruck.trailerTypeField, postTruck.secondTrailerType);
    await postTruck.noteField.clear();
    await postTruck.fillNote(postTruck.noteField, Constants.noteSecond);
    await postTruck.saveButton.click();
    await postTruck.dialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await expect(postTruck.originColumn.first()).toContainText(Constants.miamiOriginCity);
    await expect(postTruck.destinationColumn.first()).toContainText(Constants.newYorkCity);
    await expect(postTruck.trailerTypeColumn.first()).toContainText('V');
    await expect(postTruck.noteColumn.first()).toContainText(Constants.noteSecond);
});

test('Korisnik moze da obrise post truck', async ({ page }) => {
    const postTruck = new PostTrucksPage(page);
    const id = await postTruck.idColumn.first().textContent();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await page.waitForLoadState('networkidle');
    await postTruck.grayDeleteIcon.first().click();
    await postTruck.snackMessage.waitFor({ state: 'visible', timeout: 5000 });
    const allIds = await postTruck.idColumn.allTextContents();
    for (const currentId of allIds) {
        expect(currentId).not.toBe(id);
    }
});

test('Korisnik se redirektuje na post load stranicu kada klikne na truck id', async ({ page }) => {
    const postTruck = new PostTrucksPage(page);
    await postTruck.truckIdColumn.first().click();
    await expect(page).toHaveURL(/pre-book\/post-loads/);
});

test('Avail polje je obavezno polje', async ({ page }) => {
    const postTruck = new PostTrucksPage(page);
    await postTruck.addCompnayIcon.click();
    await postTruck.selectOrigin(postTruck.originField, Constants.deliveryCity, postTruck.originOption);
    await postTruck.selecDestination(postTruck.destinatinField, Constants.seconDeliveryCity, postTruck.destinationOption);
    await postTruck.selectTrailerType(postTruck.trailerTypeField, postTruck.trailerTypeOption);
    await postTruck.noteField.fill(Constants.noteFirst);
    await postTruck.saveButton.click();
    await expect(postTruck.errorMessage).toContainText('The avail field is required');
});

test('Origin polje je obavezno polje', async ({ page }) => {
    const postTruck = new PostTrucksPage(page);
    await postTruck.addCompnayIcon.click();
    await postTruck.selectAvail(postTruck.availField, postTruck.todayDateInDatepicker);
    await postTruck.selecDestination(postTruck.destinatinField, Constants.seconDeliveryCity, postTruck.destinationOption);
    await postTruck.selectTrailerType(postTruck.trailerTypeField, postTruck.trailerTypeOption);
    await postTruck.noteField.fill(Constants.noteFirst);
    await postTruck.saveButton.click();
    await expect(postTruck.errorMessage).toContainText('The origin field is required');
});

test('Trailer type polje je obavezno polje', async ({ page }) => {
    const postTruck = new PostTrucksPage(page);
    await postTruck.addCompnayIcon.click();
    await postTruck.selectAvail(postTruck.availField, postTruck.todayDateInDatepicker);
    await postTruck.selectOrigin(postTruck.originField, Constants.deliveryCity, postTruck.originOption);
    await postTruck.selecDestination(postTruck.destinatinField, Constants.seconDeliveryCity, postTruck.destinationOption);
    await postTruck.noteField.fill(Constants.noteFirst);
    await postTruck.saveButton.click();
    await expect(postTruck.errorMessage).toContainText('The trailer type field is required');
});

test('Post truck je prikazan u posted trucks stranici', async ({ page }) => {
    const postTruck = new PostTrucksPage(page);
    const id = (await postTruck.idColumn.first().allInnerTexts()).toString();
    await page.goto(Constants.postedTruckUrl, { waitUntil: 'networkidle', timeout: 10000 });
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/api/post-trucks') &&
            response.status() === 200 || response.status() == 304
        ),
        page.locator('.v-input__slot').first().locator('input').fill(id)
    ]);
    await expect(postTruck.idColumn.first()).toContainText(id);
});