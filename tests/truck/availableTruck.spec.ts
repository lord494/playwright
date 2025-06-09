import { test, expect, chromium, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { AvailableTruckPage } from '../../page/truck/availableTruck.page';

test.use({ storageState: 'auth.json' });
const targetText = "11996 - FREIGHTLINER / CASCADIA / 2025 *Default note*";
test.beforeEach(async ({ page }) => {
    const availableTruck = new AvailableTruckPage(page);
    await page.goto(Constants.availableTrukcUrl);
    await availableTruck.addTruckIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const statusColumns = page.locator('.status-column');
    const count = await statusColumns.count();
    let found = false;
    for (let i = 0; i < count; i++) {
        const column = statusColumns.nth(i);
        const text = await column.textContent();
        if (text?.trim() === targetText) {
            await column.click({ button: 'right' });
            await availableTruck.deleteIconInStatusMenu.click();
            await page.waitForLoadState('networkidle');
            await await availableTruck.addTruckIcon.first().click();
            await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
            found = true;
            break;
        }
    }

    if (!found) {
        await await availableTruck.addTruckIcon.first().click();
        await availableTruck.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    }
});

test('Korisnik moze da doda available Truck', async ({ page }) => {
    const availableTruck = new AvailableTruckPage(page);
    await availableTruck.selectTruck(availableTruck.selectATruckMenu, Constants.truckName, availableTruck.truckOption);
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
    await availableTruck.selectTruck(availableTruck.selectATruckMenu, Constants.truckName, availableTruck.truckOption);
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
    await availableTruck.selectTruck(availableTruck.selectATruckMenu, Constants.truckName, availableTruck.truckOption);
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
    const statusText = await availableTruck.statusColumn.nth(index).allInnerTexts();
    await status.click({ button: 'right' });
    await availableTruck.transferIconInStatusMenu.click();
    await availableTruck.transferTruck();
    await expect(availableTruck.yardCard.nth(2)).toContainText(statusText);
});
