import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { AvailableTruckPage } from '../../page/truck/availableTruck.page';

test.use({ storageState: 'auth.json' });

// All three tests add/remove/transfer the SAME single truck (Constants.availableTruckName = 489)
// on /available-trucks, so they cannot run in parallel against each other — one test's
// beforeEach would delete the row another test just added. Run them serially (one worker, in
// order) so the shared truck has a deterministic lifecycle. 489 is used ONLY by this spec, so
// no other spec contends for it under 4 workers.
test.describe.configure({ mode: 'serial' });

const targetText = Constants.availableTruckTargetText;

// test.beforeEach(async ({ page }) => {
//     const availableTruck = new AvailableTruckPage(page);
//     await page.goto(Constants.availableTrukcUrl, { waitUntil: 'networkidle', timeout: 10000 });
//     await availableTruck.addTruckIcon.first().waitFor({ state: 'visible', timeout: 10000 });
//     page.on('dialog', async (dialog) => {
//         await dialog.accept();
//     });
//     const statusColumns = page.locator('.status-column');
//     const count = await statusColumns.count();
//     let found = false;
//     for (let i = 0; i < count; i++) {
//         const column = statusColumns.nth(i);
//         const text = await column.textContent();
//         if (text?.trim() === targetText) {
//             await column.click({ button: 'right' });
//             await availableTruck.deleteIconInStatusMenu.click();
//             await page.waitForTimeout(1000);
//             await await availableTruck.addTruckIcon.first().click();
//             await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
//             found = true;
//             break;
//         }
//     }

//     if (!found) {
//         await await availableTruck.addTruckIcon.first().click();
//         await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
//     }
// });

//////////////////

// const targetMap: Record<string, string> = {
//     'Test 1': "11996 - FREIGHTLINER / CASCADIA / 2025 *Default note*",
//     'Test 2': "55101 - FREIGHTLINER / CASCADIA / 2018",
//     'Test 3': "1010 - MACK / ANTHEM / 2021",
// };

// test.beforeEach(async ({ page }, testInfo) => {
//     const availableTruck = new AvailableTruckPage(page);
//     const targetText = targetMap[testInfo.title];

//     console.log("TARGET TEXT:", JSON.stringify(targetText));

//     await page.goto(Constants.availableTrukcUrl, {
//         waitUntil: 'networkidle',
//         timeout: 10000
//     });

//     page.on('dialog', async (dialog) => {
//         await dialog.accept();
//     });

//     const statusColumns = page.locator('.status-column');
//     const count = await statusColumns.count();

//     console.log("COLUMNS COUNT:", count);

//     let found = false;

//     for (let i = 0; i < count; i++) {
//         const column = statusColumns.nth(i);
//         const text = await column.textContent();

//         console.log(`--- COLUMN ${i} ---`);
//         console.log("RAW TEXT:", JSON.stringify(text));

//         const normalized = text?.replace(/\s+/g, " ").trim();

//         console.log("NORMALIZED:", JSON.stringify(normalized));

//         console.log("MATCH?", normalized?.includes(targetText));

//         if (normalized?.includes(targetText)) {
//             console.log("✅ MATCH FOUND at index:", i);

//             await column.click({ button: 'right' });
//             await availableTruck.deleteIconInStatusMenu.click();

//             await page.waitForTimeout(1000);

//             found = true;
//             break;
//         }
//     }

//     if (!found) {
//         console.log("❌ NO MATCH FOUND");
//     }
// });

test.beforeEach(async ({ page }) => {
    const availableTruck = new AvailableTruckPage(page);
    await page.goto(Constants.availableTrukcUrl, { waitUntil: 'networkidle', timeout: 10000 });
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    // Guarantee the shared truck is NOT already available, regardless of which yard a prior
    // test left it in (the helper scrolls all yard cards before scanning, then deletes it).
    await availableTruck.removeFromAvailable(targetText);
});

test('Korisnik moze da doda available Truck', async ({ page }) => {
    const availableTruck = new AvailableTruckPage(page);
    await availableTruck.addTruckIcon.first().click();
    await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await availableTruck.selectTruck(availableTruck.selectATruckMenu, Constants.availableTruckName, availableTruck.truckOption);
    await availableTruck.enterAdditionalInfo(availableTruck.aditionalInfoField, Constants.noteFirst);
    await availableTruck.selectCompanyFromMenu(availableTruck.divisonMenu, availableTruck.testCompanyOption);
    await availableTruck.enterMileage(availableTruck.mileageField, Constants.millage);
    await availableTruck.enterInfo(availableTruck.infoField, Constants.noteSecond);
    await availableTruck.submitButton.click();
    await availableTruck.addTruckModal.waitFor({ state: 'detached', timeout: 10000 });
    await page.waitForLoadState('networkidle')
    const statusColumns = await availableTruck.statusColumn;
    const texts = await statusColumns.allTextContents();
    const index = texts.findIndex(text => text.trim() === targetText);
    expect(index).not.toBe(-1);
    if (index === -1) {
        throw new Error(`Target text "${targetText}" not found in status columns.`);
    }
    const divisionText = await availableTruck.divisionColumn.nth(index).textContent();
    expect(divisionText?.trim()).toBe(Constants.testCompany);
    const mileageText = await availableTruck.mileageColumn.nth(index).textContent();
    expect(mileageText?.trim()).toBe(Constants.millage);
    const availableInfoText = await availableTruck.availableInfoColumn.nth(index).textContent();
    expect(availableInfoText?.trim()).toBe(Constants.noteSecond);
});

test('Korisnik moze promjeni status u Out of company', async ({ page }) => {
    const availableTruck = new AvailableTruckPage(page);
    await availableTruck.addTruckIcon.first().click();
    await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await availableTruck.selectTruck(availableTruck.selectATruckMenu, Constants.availableTruckName, availableTruck.truckOption);
    await availableTruck.enterAdditionalInfo(availableTruck.aditionalInfoField, Constants.noteFirst);
    await availableTruck.selectCompanyFromMenu(availableTruck.divisonMenu, availableTruck.testCompanyOption);
    await availableTruck.enterMileage(availableTruck.mileageField, Constants.millage);
    await availableTruck.enterInfo(availableTruck.infoField, Constants.noteSecond);
    await availableTruck.submitButton.click();
    await availableTruck.addTruckModal.waitFor({ state: 'detached', timeout: 10000 });
    await page.waitForLoadState('networkidle')
    const statusColumns = await availableTruck.statusColumn;
    const count = await statusColumns.count();
    let found = false;
    for (let i = 0; i < count; i++) {
        const column = statusColumns.nth(i);
        const text = await column.textContent();
        if (text?.trim() === targetText) {
            await column.click({ button: 'right' });
            await availableTruck.editTruckIconInStatusMenu.click();
            await page.waitForLoadState('networkidle');
            await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
            found = true;
            break;
        }
    }
    await availableTruck.selectStatus(availableTruck.statusMenu, availableTruck.outOfCompanyStatus);
    await availableTruck.submitButton.click();
    await availableTruck.addTruckModal.waitFor({ state: 'detached', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    const texts = await statusColumns.allTextContents();
    const index = texts.findIndex(text => text.trim() === targetText);
    expect(index).not.toBe(-1);
    if (index === -1) {
        throw new Error(`Target text "${targetText}" not found in status columns.`);
    }
    const statusElement = statusColumns.nth(index);
    const backgroundColor = await statusElement.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
    });
    expect(backgroundColor).toBe('rgb(96, 125, 139)');
});

test('Korisnik da uradi transfer kamiona iz jedne yarde u drugu', async ({ page }) => {
    const availableTruck = new AvailableTruckPage(page);
    await availableTruck.addTruckIcon.first().click();
    await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await availableTruck.selectTruck(availableTruck.selectATruckMenu, Constants.availableTruckName, availableTruck.truckOption);
    await availableTruck.enterAdditionalInfo(availableTruck.aditionalInfoField, Constants.noteFirst);
    await availableTruck.selectCompanyFromMenu(availableTruck.divisonMenu, availableTruck.testCompanyOption);
    await availableTruck.enterMileage(availableTruck.mileageField, Constants.millage);
    await availableTruck.enterInfo(availableTruck.infoField, Constants.noteSecond);
    await availableTruck.submitButton.click();
    await availableTruck.addTruckModal.waitFor({ state: 'detached', timeout: 10000 });
    await page.waitForLoadState('networkidle')
    const statusColumns = await availableTruck.statusColumn;
    const texts = await statusColumns.allTextContents();
    const index = texts.findIndex(text => text.trim() === targetText);
    expect(index).not.toBe(-1);
    if (index === -1) {
        throw new Error(`Target text "${targetText}" not found in status columns.`);
    }
    const status = await availableTruck.statusColumn.nth(index);
    await status.click({ button: 'right' });
    await availableTruck.transferIconInStatusMenu.click();
    // Transfer to a specific, ACTIVE destination yard (noviYardicconi Test) and assert the
    // truck now lives in that yard's card — a stable, named target instead of a positional one.
    await availableTruck.transferTruck(Constants.availableTruckYardOption);
    await availableTruck.addTruckModal.waitFor({ state: 'detached', timeout: 10000 }).catch(() => { });
    await page.waitForLoadState('networkidle');
    await expect(
        availableTruck.yardCardByName(Constants.availableTruckYard)
            .filter({ hasText: Constants.availableTruckOptionText })
    ).toContainText(Constants.availableTruckOptionText, { timeout: 15000 });
});
