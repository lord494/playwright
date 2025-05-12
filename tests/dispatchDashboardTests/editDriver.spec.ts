import { test, expect, chromium, Page } from '@playwright/test';
import { DispatchDashboardOverview } from '../../page/dispatchDashboard/dispatchDashboardOverview.page';
import { Constants } from '../../helpers/constants';
import { EditDriver } from '../../page/dispatchDashboard/editDriver.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const dashboard = new DispatchDashboardOverview(page);
    await page.goto(Constants.dashboardUrl);
    await dashboard.fillInputField(dashboard.nameSearchInput, Constants.driverName);
    const driver = page.locator('tr', {
        has: page.locator('td:nth-child(2)', { hasText: 'btest' })
    });
    await driver.first().waitFor({ state: 'visible', timeout: 10000 });
    await dashboard.driveNameColumn.first().click({ button: "right" });
});

test.describe('Testovi bez afterAll', () => {
    test('Driver name je obavezno polje', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.driverName.clear();
        await edit.saveButton.click();
        await page.waitForLoadState('networkidle');
        await expect(edit.errorMessage).toContainText('The name field is required');
    });

    test('Dispatcher je obavezno polje', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.dispatcher.clear();
        await edit.saveButton.click();
        await expect(edit.errorMessage.nth(1)).toBeVisible();
    });

    test('Phone je obavezno polje', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.phone.clear();
        await edit.saveButton.click();
        await expect(edit.errorMessage).toContainText('The phone field is required');
    });

    test('Truck je obavezno polje', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.truck.clear();
        await edit.saveButton.click();
        await expect(edit.errorMessage).toContainText('The Truck field is required');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Name polje', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.fillInputField(edit.driverName, "123!@#")
        await expect(edit.invalidMessage.first()).toContainText('The name field format is invalid');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Second driver name polje', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.fillInputField(edit.secondDrverName, "123!@#")
        await expect(edit.invalidMessage.first()).toContainText("The second_driver field format is invalid");
    });

    test('Korisnik moze da ukljuci "Is priority" toggle button', async ({ page }) => {
        const edit = new EditDriver(page);
        const dashboard = new DispatchDashboardOverview(page);
        await edit.check(edit.isPriorityToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(dashboard.driverNameColumn).toContainText('*');
    });

    test('Korisnik moze da ukljuci "FC" toggle button', async ({ page }) => {
        const edit = new EditDriver(page);
        const dashboard = new DispatchDashboardOverview(page);
        await page.waitForLoadState('networkidle');
        await edit.unCheckFC();
        //await edit.fcTogglebuttonOff.click();
        await edit.saveButton.click();
        await page.waitForLoadState('networkidle');

        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await expect(dashboard.fcColumn).toContainText("ON");
    });

    test('Korisnik moze da ukljuci "Is new" toggle button', async ({ page }) => {
        const edit = new EditDriver(page);
        const dashboard = new DispatchDashboardOverview(page);
        await edit.check(edit.isNewToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(dashboard.driverNameColumn).toContainText('(NEW)');
    });

    test('Korisnik moze da ukljuci "Is company" toggle button', async ({ page }) => {
        const edit = new EditDriver(page);
        const dashboard = new DispatchDashboardOverview(page);
        await edit.check(edit.isCompanyToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(dashboard.driverNameColumn).toContainText('(company driver)');
    });

    test('Korisnik moze da ukljuci "Is time" toggle button', async ({ page }) => {
        const edit = new EditDriver(page);
        const dashboard = new DispatchDashboardOverview(page);
        await edit.check(edit.isTimeToggleButton);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await expect(dashboard.driverNameColumn).toContainText('(time)');
    });

    test('Korisnik moze da cekira checkboxove', async ({ page }) => {
        const edit = new EditDriver(page);
        const dashboard = new DispatchDashboardOverview(page);
        await edit.check(edit.isActiveCheckbox);
        await edit.check(edit.noCutCheckbox);
        await edit.check(edit.hassAnAppAccount);
        await edit.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await page.waitForLoadState('networkidle');
        await dashboard.driveNameColumn.click({ button: "right" });
        await page.waitForLoadState('networkidle');
        await expect(edit.isActiveCheckbox).toBeChecked();
        await expect(edit.noCutCheckbox).toBeChecked();
        await expect(edit.hassAnAppAccount).toBeChecked();
    });

    test('Korisnik moze da otvori trailer history kada klikne na "Show trailer history" toggle button', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.check(edit.showTrailerHistoryToggleButton);
        await expect(edit.trailerHistoryList).toBeVisible();
    });

    test('Korisnik moze da obrise trailer history', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.check(edit.showTrailerHistoryToggleButton);
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        await edit.firtsDeleteIconOnHistoryTrailer.click();
        await expect(edit.snackContent).toContainText(Constants.snackContentHistorySuccessfullyDeleted);
    });

    test('Korisnik moze da izadje iz modala na Cancel dugme', async ({ page }) => {
        const edit = new EditDriver(page);
        await edit.cancelButton.click();
        await page.waitForLoadState('networkidle');
        await expect(edit.editDriverTitle).not.toBeVisible();
    });
});

test.describe('Testovi sa afterAll', () => {
    test('Driver moze da se edituje', async ({ page }) => {
        const edit = new EditDriver(page);
        const dashboard = new DispatchDashboardOverview(page);
        await edit.fillInputField(edit.driverName, Constants.secondDriverName);
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
        await page.locator('.v-input__slot').first().click();
        await dashboard.xIconInInputField.first().click();
        await dashboard.fillInputField(dashboard.nameSearchInput, Constants.secondDriverName);
        const nameText = dashboard.driverNameColumn.filter({ hasText: Constants.secondDriverName });
        await nameText.waitFor({ state: 'visible', timeout: 5000 });
        await expect(dashboard.noteIcon).toBeVisible();
        await expect(dashboard.driverNameColumn).toContainText(Constants.secondDriverName);
        await expect(dashboard.driverNameColumn).toContainText(Constants.secondOwner);
        await expect(dashboard.driverNameColumn).toContainText(Constants.secondDriverTest);
        await expect(dashboard.typeColumn).toContainText(Constants.secondTrailerType);
        await expect(dashboard.companyColumn).toContainText(Constants.secondSCompany);
        await expect(dashboard.extColumn).toContainText(Constants.secondDispatcher);
        await expect(dashboard.extColumn).toContainText(Constants.secondSubstitutleDispatcher);
        await expect(dashboard.extColumn).toContainText(Constants.secondDiss);
        await expect(dashboard.tryTimeExtColumn).toContainText(Constants.secondDiss);
        await expect(dashboard.rocketExtColumn).toContainText(Constants.secondDiss);
        await expect(dashboard.jordanExt).toContainText(Constants.secondDiss);
        await expect(dashboard.truckColumn).toContainText(Constants.secondTruckName);
        await expect(dashboard.trailerColumn).toContainText(Constants.secondTrailerName);
        await expect(dashboard.phoneColumn).toContainText(Constants.secondPhone);
        await expect(dashboard.phoneColumn).toContainText(Constants.secondOwnerPhone);
        await expect(dashboard.boardColumn).toContainText(Constants.secondBoard);
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'auth.json' });
        const page = await context.newPage();
        const edit = new EditDriver(page);
        await edit.returnOnPreviousState();
        await context.close();
    });
});