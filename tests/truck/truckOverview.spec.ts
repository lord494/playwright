import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TruckPage } from '../../page/truck/truck.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const truck = new TruckPage(page);
    await page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
    await truck.truckColumn.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da pretrazuje truck po truck number', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.enterTruckName(truck.searchInput, Constants.truckName);
    await page.waitForLoadState('networkidle');
    const trailerCell = page.locator(`tr:nth-child(1) td:nth-child(2):has-text("${Constants.truckName}")`);
    await expect(trailerCell).toBeVisible({ timeout: 10000 });
    await expect(truck.truckColumn).toHaveText(Constants.truckName, { timeout: 10000 });
});

test('Korisnik moze da pretrazuje truck po in Company radiobutton-u', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.inCompanyRadiobutton.click({ force: true });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(Constants.truckInCompanyUrl, { timeout: 10000 });
});

test('Korisnik moze da pretrazuje truck po Third Party radiobutton-u', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.thirpartyradiobutton.click({ force: true });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(Constants.truckThirdPartyUrl, { timeout: 10000 });
});

test('Korisnik moze da pretrazuje truck po Inactive radiobutton-u', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.inactiveTrucksRadiobutton.click({ force: true });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(Constants.inactiveTruckUrl, { timeout: 10000 });
});

test('Korisnik moze da pretrazuje truck po Deleted radiobutton-u', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.deletedRadiobutton.click({ force: true });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(Constants.deletedTruckUrl, { timeout: 10000 });
});

test('Korisnik moze da pretrazuje truck po imenu kompanije', async ({ page }) => {
    const truck = new TruckPage(page);
    await page.waitForLoadState('networkidle');
    await truck.filterRadiobutton.click();
    await truck.selectCompanyFromMenu(truck.companyMenu, truck.testCompanyOption);
    await page.waitForLoadState('networkidle');
    const trailerCell = page.locator(`tr:nth-child(1) td:nth-child(7):has-text("${Constants.testCompany}")`);
    await expect(trailerCell).toBeVisible({ timeout: 10000 });
    const count = await truck.divisionColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await truck.divisionColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.testCompany);
    }
});

test('Korisnik moze da pretrazuje truck po vin broju', async ({ page }) => {
    const truck = new TruckPage(page);
    await page.waitForLoadState('networkidle');
    await truck.filterRadiobutton.click();
    await truck.enterVinNumber(truck.vinNumberField, Constants.vinNumber);
    await page.waitForLoadState('networkidle');
    const trailerCell = page.locator(`tr:nth-child(1) td:nth-child(14):has-text("${Constants.vinNumber}")`);
    await expect(trailerCell).toBeVisible({ timeout: 10000 });
    const count = await truck.vinColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await truck.vinColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.vinNumber);
    }
});

test('Korisnik moze da ponisti filtere kada klikne na X ikonicu', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.thirpartyradiobutton.click({ force: true });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(Constants.truckThirdPartyUrl, { timeout: 10000 });
    await truck.deleteAllFilterButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(Constants.truckUrl, { timeout: 10000 });
});

test('Korisnik moze da otvoriti stats page kada klikne na stats button', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.statsButton.click();
    await expect(page).toHaveURL(/statistics/, { timeout: 10000 });
});

test('Korisnik moze da otvoriti available truck page kada klikne na available trucks button', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.availableTrucksButton.click();
    await expect(page).toHaveURL(/available-trucks/, { timeout: 10000 });
});

test('Korisnik moze da doda, edituje i brise trailer history', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.clickElement(truck.truckColumn.first());
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.history-wraper.small .mdi.mdi-delete';
    try {
        await page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await page.locator(deleteSelector).count() > 0) {
            const previousCount = await page.locator(deleteSelector).count();
            await page.locator(deleteSelector).first().click();
            await page.getByRole('img').locator('circle').waitFor({ state: 'hidden', timeout: 1000 });
            await page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await truck.clickElement(truck.addHistoryButton);
    await truck.selectTruckInTrailerModal(truck.driverField, Constants.driverName, truck.driverOptionFromMenu);
    const selectedDate = await truck.selectExpiringDateInPastMonth();
    await truck.toFieldModal.click();
    await truck.currentDate.click();
    await truck.addButton.last().click();
    await truck.dialogBox.waitFor({ state: 'hidden', timeout: 5000 });
    await expect(truck.histryList).toBeVisible({ timeout: 10000 });
    await expect(truck.histryList).toContainText(Constants.driverName);
    await truck.pencilIconInHistoryModal.click();
    await truck.enterNoteInHistoryModal(truck.noteInHistoryModal, Constants.noteFirst);
    await truck.editButton.click();
    await truck.dialogBox.waitFor({ state: 'hidden', timeout: 5000 });
    await expect(truck.histryList).toBeVisible({ timeout: 10000 });
    await expect(truck.histryList).toContainText(Constants.noteFirst, { timeout: 10000 });
    await truck.deleteIconInHistoryModal.click();
    await expect(truck.snackMessage).toContainText('History successfully deleted');
});

test('Korisnik moze da doda, edituje i brise company history', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.clickElement(truck.divisionColumn.nth(3));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.TruckHistory__content .mdi-delete';
    try {
        await page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await page.locator(deleteSelector).count() > 0) {
            const previousCount = await page.locator(deleteSelector).count();
            await page.locator(deleteSelector).first().click();
            await page.getByRole('img').locator('circle').waitFor({ state: 'hidden', timeout: 1000 });
            await page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await truck.clickElement(truck.addHistoryButton);
    await truck.selectOldState(truck.oldState, truck.rocketCompanyOption);
    await truck.selectNewState(truck.newState, truck.testCompanyOption);
    await truck.dateOfChanged.click();
    await truck.currentDate.click();
    await truck.editButton.click();
    await truck.dialogBox.waitFor({ state: 'detached' });
    await expect(truck.companyHistoryList).toContainText('Changed from ' + Constants.rocketCompany + ' to ' + Constants.testCompany);
    await truck.pencilIconInCompanyHistoryModal.click();
    await truck.selectNewState(truck.newState, truck.rocketCompanyOption);
    await truck.editButton.click();
    await truck.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await expect(truck.companyHistoryList).toContainText('Changed from ' + Constants.rocketCompany + ' to ' + Constants.rocketCompany);
    await page.click(deleteSelector);
    await expect(truck.companyHistoryList).not.toBeVisible();
});

test('Korisnik moze da doda, edituje i brise oil change history', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.clickElement(truck.oliChangeColumn.first());
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.OilChangeHistory__actions .mdi-delete';
    try {
        await page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await page.locator(deleteSelector).count() > 0) {
            const previousCount = await page.locator(deleteSelector).count();
            await page.locator(deleteSelector).first().click();
            await page.getByRole('img').locator('circle').waitFor({ state: 'hidden', timeout: 1000 });
            await page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await truck.clickElement(truck.addTruckOilChangeHistoruButton);
    await truck.enterOliType(truck.olyTypeField, Constants.castrolOliType);
    await truck.enterMillage(truck.millageField, Constants.millage)
    await truck.addButton.last().click();
    await truck.dialogBox.waitFor({ state: 'detached' });
    await expect(truck.truckOilList).toContainText('Millage: ' + Constants.millage);
    await expect(truck.truckOilList).toContainText('Oil Type: ' + Constants.castrolOliType);
    await truck.pencilIconInTruckOilList.click();
    await truck.olyTypeField.clear();
    await truck.enterOliType(truck.olyTypeField, Constants.optimaOilType);
    await truck.editButton.click();
    await truck.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await expect(truck.truckOilList).toContainText('Oil Type: ' + Constants.optimaOilType);
    await expect(truck.truckOilList).toContainText('Millage: ' + Constants.millage);
    await page.click(deleteSelector);
    await expect(truck.companyHistoryList).not.toBeVisible();
});

test('Korisnik moze da doda, edituje i brise annual dot inspection', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.clickElement(truck.annualDotColumn.nth(1));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await truck.addAnnualDotButton.waitFor({ state: 'visible', timeout: 3000 });
    const deleteSelector = '.TruckDotInspectionList__content .mdi.mdi-delete';
    try {
        await page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 5000 });
        while (await page.locator(deleteSelector).count() > 0) {
            const previousCount = await page.locator(deleteSelector).count();
            await page.locator(deleteSelector).first().click();
            await page.getByRole('img').locator('circle').waitFor({ state: 'hidden', timeout: 1000 });
            await page.waitForFunction(
                ({ selector, prevCount }: { selector: string, prevCount: number }) => document.querySelectorAll(selector).length < prevCount,
                { selector: deleteSelector, prevCount: previousCount }
            );
            await page.waitForTimeout(300);
        }
    } catch (e) {
    }
    await truck.clickElement(truck.addAnnualDotButton);
    await truck.enterInvoiceNumber(truck.invoiceNumber, Constants.invoiceNumber);
    await truck.enterAmount(truck.amount, Constants.amount);
    await truck.enterState(truck.state, Constants.state);
    await truck.enterCity(truck.city, Constants.city);
    await truck.enterShopInfo(truck.shopInfo, Constants.shopInfo);
    await truck.clickElement(truck.addButton.last());
    await truck.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await expect(truck.annualdotInspectionModalCard).toContainText('Invoice number: ' + Constants.invoiceNumber);
    await expect(truck.annualdotInspectionModalCard).toContainText('Amount: ' + Constants.amount);
    await expect(truck.annualdotInspectionModalCard).toContainText('State: ' + Constants.state);
    await expect(truck.annualdotInspectionModalCard).toContainText('City: ' + Constants.city);
    await expect(truck.annualdotInspectionModalCard).toContainText('Shop info: ' + Constants.shopInfo);
});

test('Korisnik moze da doda, edituje i brise repair history', async ({ page }) => {
    const truck = new TruckPage(page);
    await truck.clickElement(truck.repairColumn.nth(3));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.truck-repairs__content .mdi.mdi-delete';
    try {
        await page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await page.locator(deleteSelector).count() > 0) {
            const previousCount = await page.locator(deleteSelector).count();
            await page.locator(deleteSelector).first().click();
            await page.getByRole('img').locator('circle').waitFor({ state: 'hidden', timeout: 1000 });
            await page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await truck.clickElement(truck.addRepairButton);
    await truck.enterInvoiceNumber(truck.invoiceNumber, Constants.invoiceNumber);
    await truck.enterAmount(truck.amount, Constants.amount);
    await truck.enterState(truck.state, Constants.state);
    await truck.enterCity(truck.city, Constants.city);
    await truck.enterShopInfo(truck.shopInfo, Constants.shopInfo);
    await truck.clickElement(truck.addButton.last());
    await truck.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await expect(truck.repairCard).toContainText('Invoice number: ' + Constants.invoiceNumber);
    await expect(truck.repairCard).toContainText('Amount: ' + Constants.amount);
    await expect(truck.repairCard).toContainText('State: ' + Constants.state);
    await expect(truck.repairCard).toContainText('City: ' + Constants.city);
    await expect(truck.repairCard).toContainText('Shop info: ' + Constants.shopInfo);
});
