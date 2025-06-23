import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { PostLoadsPage } from '../../page/preBook/postLoads.page';
import { AddEditPostLoadPage } from '../../page/preBook/addEditPostLoad.page';
import { generateRandomString, waitForPrebookLoads } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

let page: Page;
const loadId = generateRandomString();

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const postLoad = new PostLoadsPage(page);
    const add = new AddEditPostLoadPage(page);
    await page.goto(Constants.postLoadPrebookUrl);
    await page.waitForLoadState('networkidle');
    await postLoad.newLoadButton.click();
    await add.saveButton.last().waitFor({ state: 'visible', timeout: 5000 });
    await add.enterLoadId(add.loadId, loadId);
    await add.selectOrigin(add.originMenu, Constants.miamiOriginCity, add.miamiOption);
    await add.selecDestination(add.destinatinMenu, Constants.newYorkCity, add.newYorkOption);
    await add.selectTodayDate(add.pickupDateField, page.getByRole('button', { name: '20', exact: true }).locator('div').first());
    await add.selectTodayDate(add.deliveryDateField, page.getByRole('button', { name: '22', exact: true }).locator('div').last());
    await add.selectTime(add.pickupTimeField, add.hours, add.minutes);
    await add.selectTime(add.toPickupTimeField, add.secondHours, add.secondMinutes);
    await add.selectTime(add.deliveryTimeField, add.secondHours, add.secondMinutes);
    await add.selectTime(add.toDilevryTimeField, add.hours, add.minutes);
    await add.selectCompany(add.companyField, add.editTestCompanyOption);
    await add.enterBrokerName(add.brokerNameField, Constants.appTestUser);
    await add.enterBrokerEmail(add.brokerEmailField, Constants.fndPlaywrightEmail);
    await add.enterBrokerPhone(add.brokerPhoneField, Constants.secondPhone);
    await add.selectTrailerType(add.trailerTypeMenu, add.trailerTypeOption);
    await add.enterWeight(add.weightField, Constants.weight);
    await add.enterRate(add.rateField, Constants.amount);
    await add.enterSyggestedRate(add.suggestedRateField, Constants.suggestedRate);
    await add.check(add.dedicaterCheckbox);
    await add.enterNote(add.noteField, Constants.noteSecond);
    await waitForPrebookLoads(page, async () => {
        await add.saveButton.last().click();
    });
    await add.addEditDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForLoadState('networkidle');
});

test.beforeEach(async ({ page }) => {
    const postLoad = new PostLoadsPage(page);
    await page.goto(Constants.postLoadPrebookUrl);
    await page.waitForLoadState('networkidle');
    await waitForPrebookLoads(page, async () => {
        postLoad.xButtonInField.nth(1).click()
    });
    await waitForPrebookLoads(page, async () => {
        page.locator('.v-input__control').nth(7).locator('input').fill('0')
    });
    await waitForPrebookLoads(page, async () => {
        postLoad.xButtonInField.nth(2).click()
    });
    await waitForPrebookLoads(page, async () => {
        page.locator('.v-input__control').nth(8).locator('input').fill('0')
    });
    await page.waitForLoadState('networkidle');
});

test('Korisnik može da pretražuje load po datumu', async ({ page }) => {
    const postLoad = new PostLoadsPage(page);
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    await postLoad.dateMenu.click();
    await page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(page, async () => {
        page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await page.waitForLoadState('networkidle');
    const pickUpItems = await postLoad.pickUpColumn.all();
    const expectedDates = [`${month}/20/${year}`, `${month}/21/${year}`];
    for (let i = 0; i < pickUpItems.length; i++) {
        const text = await pickUpItems[i].textContent();
        expect(expectedDates.some(date => text?.includes(date))).toBeTruthy();
    }
});

test('Korisnik može da pretražuje load trailer type', async ({ page }) => {
    const postLoad = new PostLoadsPage(page);
    const addLoad = new AddEditPostLoadPage(page);
    await waitForPrebookLoads(page, async () => {
        postLoad.selectTrailerType(postLoad.trailerTypeMenu, addLoad.trailerTypeOption)
    });
    await page.waitForLoadState('networkidle');
    await postLoad.dateMenu.click();
    await page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(page, async () => {
        page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    const trailerTypeItems = await postLoad.trailerTypeColumn.all();
    for (const item of trailerTypeItems) {
        const text = await item.textContent();
        expect(text).toContain('R');
    }
});

test('Korisnik može da pretražuje load po Origin', async ({ page }) => {
    const postLoad = new PostLoadsPage(page);
    const addLoad = new AddEditPostLoadPage(page);
    await waitForPrebookLoads(page, async () => {
        addLoad.selectOrigin(postLoad.originMenu, Constants.miamiOriginCity, addLoad.miamiOption)
    });
    await page.waitForLoadState('networkidle');
    await postLoad.dateMenu.click();
    await page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(page, async () => {
        page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await expect(page.locator('tr:nth-child(1) td:nth-child(5)')).toContainText(Constants.miamiOriginCity, { timeout: 10000 });
    const originItems = await postLoad.originColumn.all();
    for (const item of originItems) {
        const text = await item.textContent();
        expect(text).toContain(Constants.miamiOriginCity);
    }
});

test('Korisnik može da npretražuje load po Destiation', async ({ page }) => {
    test.setTimeout(60_000);
    const postLoad = new PostLoadsPage(page);
    const addLoad = new AddEditPostLoadPage(page);
    await page.waitForLoadState('networkidle');
    await postLoad.dateMenu.click();
    await page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(page, async () => {
        page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await page.waitForLoadState('networkidle');
    await waitForPrebookLoads(page, async () => {
        addLoad.selecDestination(postLoad.destinationMenu, Constants.newYorkCity, addLoad.newYorkOption)
    });
    await page.waitForLoadState('networkidle');
    const destinationItems = await postLoad.destinationColumn.all();
    for (const item of destinationItems) {
        const text = await item.textContent();
        expect(text).toContain(Constants.newYorkCity);
    }
});

test('Korisnik moze da otvori Posted by me sekciju', async ({ page }) => {
    const postLoad = new PostLoadsPage(page);
    await postLoad.dateMenu.click();
    await page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(page, async () => {
        page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/api/prebook-loads?filter=posted') &&
            response.status() === 200 || response.status() == 304
        ),
        postLoad.postedByMeRadiobutton.click()
    ]);
    const postedByMeItems = await postLoad.postedByColumn.all();
    for (const item of postedByMeItems) {
        const text = await item.textContent();
        expect(text).toContain(Constants.appTestEmail);
    }
});

test('Korisnik moze da obrise load', async ({ page }) => {
    const postLoad = new PostLoadsPage(page);
    await postLoad.dateMenu.click();
    await page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(page, async () => {
        page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/api/prebook-loads?filter=posted') &&
            response.status() === 200 || response.status() == 304
        ),
        postLoad.postedByMeRadiobutton.click()
    ]);
    const rows = await page.locator('table tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const deleteBtn = row.locator('.v-btn__content').filter({ hasText: 'DELETE' });
        if (await deleteBtn.count() > 0) {
            const loadId = await row.locator('td').nth(0).innerText();
            await deleteBtn.click();
            await postLoad.yesButton.click();
            await expect(postLoad.snackBar).toBeVisible({ timeout: 5000 });
            await expect(postLoad.snackBar).toContainText(' Load successfully deleted: ' + loadId);
            break;
        }
    }
});
