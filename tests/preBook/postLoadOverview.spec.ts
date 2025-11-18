import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { waitForPrebookLoads } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik može da pretražuje load po datumu', async ({ cleanupSetupPostLoad, postLoadSetup }) => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    await postLoadSetup.dateMenu.click();
    await postLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.page.getByRole('button', { name: '22', exact: true }).locator('div').first().click()
    });
    await postLoadSetup.page.waitForLoadState('networkidle');
    await postLoadSetup.page.screenshot({ path: 'screenshots/fullpage.png', fullPage: true });
    const pickUpItems = await postLoadSetup.pickUpColumn.all();
    const expectedDates = [`${month}/20/${year}`, `${month}/22/${year}`];
    for (let i = 0; i < pickUpItems.length; i++) {
        const text = await pickUpItems[i].textContent();
        expect(expectedDates.some(date => text?.includes(date))).toBeTruthy();
    }
});

test('Korisnik može da pretražuje load trailer type', async ({ postLoadSetup, addPostLoad }) => {
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.selectTrailerType(postLoadSetup.trailerTypeMenu, addPostLoad.trailerTypeOption)
    });
    await postLoadSetup.page.waitForLoadState('networkidle');
    await postLoadSetup.dateMenu.click();
    await postLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    const trailerTypeItems = await postLoadSetup.trailerTypeColumn.all();
    for (const item of trailerTypeItems) {
        const text = await item.textContent();
        expect(text).toContain('R');
    }
});

test('Korisnik može da pretražuje load po Origin', async ({ postLoadSetup, addPostLoad }) => {
    await waitForPrebookLoads(addPostLoad.page, async () => {
        addPostLoad.selectOrigin(postLoadSetup.originMenu, Constants.miamiOriginCity, addPostLoad.miamiOption)
    });
    await postLoadSetup.page.waitForLoadState('networkidle');
    await postLoadSetup.dateMenu.click();
    await postLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await expect(postLoadSetup.page.locator('tr:nth-child(1) td:nth-child(5)')).toContainText(Constants.miamiOriginCity, { timeout: 10000 });
    const originItems = await postLoadSetup.originColumn.all();
    for (const item of originItems) {
        const text = await item.textContent();
        expect(text).toContain(Constants.miamiOriginCity);
    }
});

test('Korisnik može da npretražuje load po Destiation', async ({ postLoadSetup, addPostLoad }) => {
    test.setTimeout(60_000);
    await postLoadSetup.page.waitForLoadState('networkidle');
    await postLoadSetup.dateMenu.click();
    await postLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await postLoadSetup.page.waitForLoadState('networkidle');
    await waitForPrebookLoads(addPostLoad.page, async () => {
        addPostLoad.selecDestination(postLoadSetup.destinationMenu, Constants.newYorkCity, addPostLoad.newYorkOption)
    });
    await addPostLoad.page.waitForLoadState('networkidle');
    const destinationItems = await postLoadSetup.destinationColumn.all();
    for (const item of destinationItems) {
        const text = await item.textContent();
        expect(text).toContain(Constants.newYorkCity);
    }
});

test('Korisnik moze da otvori Posted by me sekciju', async ({ postLoadSetup, addPostLoad }) => {
    await postLoadSetup.dateMenu.click();
    await postLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await Promise.all([
        postLoadSetup.page.waitForResponse(response =>
            response.url().includes('/api/prebook-loads?filter=posted') &&
            response.status() === 200 || response.status() == 304
        ),
        postLoadSetup.postedByMeRadiobutton.click()
    ]);
    const postedByMeItems = await postLoadSetup.postedByColumn.all();
    for (const item of postedByMeItems) {
        const text = await item.textContent();
        expect(text).toContain(Constants.appTestEmail);
    }
});

test('Korisnik moze da obrise load', async ({ postLoadSetup }) => {
    await postLoadSetup.dateMenu.click();
    await postLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await Promise.all([
        postLoadSetup.page.waitForResponse(response =>
            response.url().includes('/api/prebook-loads?filter=posted') &&
            response.status() === 200 || response.status() == 304
        ),
        postLoadSetup.postedByMeRadiobutton.click()
    ]);
    const rows = await postLoadSetup.page.locator('table tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const deleteBtn = row.locator('.v-btn__content').filter({ hasText: 'DELETE' });
        if (await deleteBtn.count() > 0) {
            const loadId = await row.locator('td').nth(0).innerText();
            await deleteBtn.click();
            await postLoadSetup.yesButton.click();
            await expect(postLoadSetup.snackBar).toBeVisible({ timeout: 5000 });
            await expect(postLoadSetup.snackBar).toContainText(' Load successfully deleted: ' + loadId);
            break;
        }
    }
});

test('Korisnik moze da otovri mapu od Load-a', async ({ postLoadSetup }) => {
    await postLoadSetup.dateMenu.click();
    await postLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await waitForPrebookLoads(postLoadSetup.page, async () => {
        postLoadSetup.page.getByRole('button', { name: '21', exact: true }).locator('div').first().click()
    });
    await Promise.all([
        postLoadSetup.page.waitForResponse(response =>
            response.url().includes('/api/prebook-loads?filter=posted') &&
            response.status() === 200 || response.status() == 304
        ),
        postLoadSetup.postedByMeRadiobutton.click()
    ]);
    await postLoadSetup.mapIcon.first().click();
    await expect(postLoadSetup.dialogBox).toBeVisible({ timeout: 5000 });
});

test('Korisnik moze da klikne na Search Truck button', async ({ postLoadSetup }) => {
    await postLoadSetup.searchTruckButton.click();
    await expect(postLoadSetup.page.url()).toContain('/posted-trucks');
});