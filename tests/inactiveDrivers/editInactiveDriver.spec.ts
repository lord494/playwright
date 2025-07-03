import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { DriverOverviewPage } from '../../page/drivers/drriversOverview.page';
import { EditInactiveDriver } from '../../page/inactiveDrivers/editInactiveDriver.page';
import { InactiveDriverPage } from '../../page/inactiveDrivers/inactiveDriversOverview.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    await page.goto(Constants.inactiveDriveUrl, { waitUntil: 'networkidle' });
    await driver.driverNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/drivers')
        ),
        await driver.enterDriverNameInSearchField(driver.searchInputField, Constants.johnsonDriver)
    ]);
    await driver.pencilIcon.first().click();
});

test.describe('Testovi bez afterAll', () => {
    test('Driver name je obavezno polje', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        await edit.driverName.clear();
        await edit.saveButton.click();
        await page.waitForLoadState('networkidle');
        await expect(edit.errorMessage).toContainText('The name field is required');
    });

    test('Phone je obavezno polje', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        await edit.phone.clear();
        await edit.saveButton.click();
        await expect(edit.errorMessage.last()).toContainText('The phone field is required');
    });

    test('Truck je obavezno polje', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        await edit.truck.clear();
        await edit.saveButton.click();
        await expect(edit.errorMessage).toContainText('The Truck field is required');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Name polje', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        await edit.fillInputField(edit.driverName, "123!@#")
        await expect(edit.invalidMessage.first()).toContainText('The name field format is invalid');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Second driver name polje', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        await edit.fillInputField(edit.secondDrverName, "123!@#")
        await expect(edit.invalidMessage.first()).toContainText("The second_driver field format is invalid");
    });

    test('Korisnik moze da ukljuci "Is priority" toggle button', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.check(edit.isPriorityToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(driver.driverNameColumn).toContainText('*');
    });

    test('Korisnik moze da ukljuci "Is new" toggle button', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.check(edit.isNewToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(driver.driverNameColumn).toContainText('(NEW)');
    });

    test('Korisnik moze da ukljuci "Is company" toggle button', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.check(edit.isCompanyToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(driver.driverNameColumn).toContainText('(company driver)');
    });

    test('Korisnik moze da ukljuci "Is time" toggle button', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.check(edit.isTimeToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(driver.driverNameColumn).toContainText('(time)');
    });

    test('Korisnik moze da cekira checkboxove', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.check(edit.noCutCheckbox);
        await edit.check(edit.hassAnAppAccount);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await driver.pencilIcon.click();
        await page.waitForLoadState('networkidle');
        await expect(edit.noCutCheckbox).toBeChecked();
        await expect(edit.hassAnAppAccount).toBeChecked();
    });

    test('Korisnik moze da otvori trailer history kada klikne na "Show trailer history" toggle button', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.driverName.waitFor({ state: 'visible', timeout: 10000 });
        await Promise.all([
            page.waitForResponse(response =>
                response.url().includes('/api/owners/all') &&
                (response.status() === 200 || response.status() === 304)
            ),
            await edit.check(edit.showTrailerHistoryToggleButton)
        ]);
        if (await driver.noHistoryLocator.isVisible()) {
            expect(await driver.noHistoryLocator.isVisible()).toBeTruthy();
        } else {
            await expect(edit.trailerHistoryList.first()).toBeVisible();
        }
    });

    test('Korisnik moze da obrise trailer history', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.check(edit.showTrailerHistoryToggleButton);
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        const isEmptyVisible = await driver.noHistoryLocator.isVisible();
        if (isEmptyVisible) {
            expect(isEmptyVisible).toBeTruthy();
        } const deleteSelector = '.history-actions .v-icon--link.mdi.mdi-delete';
        try {
            await page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
            while (await page.locator(deleteSelector).count() > 0) {
                const previousCount = await page.locator(deleteSelector).count();
                await page.locator(deleteSelector).first().click();
                await page.waitForFunction(
                    ({ selector, prevCount }) => {
                        return document.querySelectorAll(selector).length < prevCount;
                    },
                    { selector: deleteSelector, prevCount: previousCount }
                );
            }
        } catch (e) {
        }
        await expect(edit.trailerHistoryList).not.toBeVisible();
    });
});

test.describe('Testovi sa afterAll', () => {
    test('Driver moze da se edituje', async ({ page }) => {
        const edit = new EditInactiveDriver(page);
        const driver = new InactiveDriverPage(page);
        await edit.fillInputField(edit.driverName, Constants.brianDriver);
        await edit.fillInputField(edit.secondDrverName, Constants.secondDriverTest);
        await edit.selectFromMenu(edit.owner, edit.secondOwnerOption);
        await edit.selectFromMenu(edit.board, edit.b2Board);
        await page.waitForTimeout(1000);
        await edit.selectFromMenu(edit.dispatcher, edit.testPassDispatcher);
        await edit.fillAndSelectOption(edit.substituteDispatcher, Constants.test, edit.secondSubstituteDsipatcher);
        await edit.selectFromMenu(edit.payroll, edit.secondPayroll);
        await edit.selectFromMenu(edit.trailerManager, edit.secondTrailerManager);
        await edit.fillInputField(edit.dissField, Constants.secondDiss);
        await edit.fillInputField(edit.diss2Field, Constants.secondDiss);
        await edit.fillInputField(edit.diss3Field, Constants.secondDiss);
        await edit.fillInputField(edit.diss4Field, Constants.secondDiss);
        await edit.selectFromMenu(edit.company, edit.secondCompany);
        await edit.fillInputField(edit.phone, Constants.secondPhone);
        await edit.fillInputField(edit.ownerPhone, Constants.secondOwnerPhone);
        await edit.fillAndSelectOption(edit.truck, Constants.secondTruckName, edit.secondTruckName);
        await edit.fillAndSelectOption(edit.trailer, Constants.secondTrailerName, edit.secondTrailerName);
        await edit.fillInputField(edit.trailerType, Constants.secondTrailerType);
        await edit.fillInputField(edit.noteBox, Constants.noteSecond);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(driver.driverNameColumn).toContainText(Constants.brianDriver);
        await expect(driver.driverNameColumn).toContainText(Constants.secondOwner);
        await expect(driver.driverNameColumn).toContainText(Constants.secondDriverTest);
        await expect(driver.trailerTypeColumn).toContainText(Constants.secondTrailerType);
        await expect(driver.companyColumn).toContainText(Constants.secondSCompany);
        await expect(driver.dispExtColumn).toContainText(Constants.secDis);
        await expect(driver.truckColumn).toContainText(Constants.secondTruckName);
        await expect(driver.trailerColumn).toContainText(Constants.secondTrailerName);
        await expect(driver.phoneColumn).toContainText(Constants.secondPhone);
        await expect(driver.boardColumn).toContainText(Constants.secondBoard);
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'auth.json' });
        const page = await context.newPage();
        const edit = new EditInactiveDriver(page);
        await edit.returnOnPreviousState();
        await context.close();
    });
});