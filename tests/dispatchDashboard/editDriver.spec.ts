import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { EditDriver } from '../../page/dispatchDashboard/editDriver.page';
import { test } from '../fixtures/fixtures';

test.describe('Testovi bez afterAll', () => {
    test('Driver name je obavezno polje', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.driverName.clear();
        await editDrive.saveButton.click();
        await editDrive.page.waitForLoadState('networkidle');
        await expect(editDrive.errorMessage).toContainText('The name field is required');
    });

    test('Dispatcher je obavezno polje', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.dispatcher.clear();
        await editDrive.saveButton.click();
        await expect(editDrive.errorMessage.nth(0)).toBeVisible();
    });

    test('Phone je obavezno polje', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.phone.clear();
        await editDrive.saveButton.click();
        await expect(editDrive.errorMessage).toContainText('The phone field is required');
    });

    test('Truck je obavezno polje', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.truck.clear();
        await editDrive.saveButton.click();
        await expect(editDrive.errorMessage).toContainText('The Truck field is required');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Name polje', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.fillInputField(editDrive.driverName, "123!@#")
        await expect(editDrive.invalidMessage.first()).toContainText('The name field format is invalid');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Second driver name polje', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.fillInputField(editDrive.secondDrverName, "123!@#")
        await expect(editDrive.invalidMessage.first()).toContainText("The second_driver field format is invalid");
    });

    test('Korisnik moze da ukljuci "Is priority" toggle button', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.check(editDrive.isPriorityToggleButton);
        await editDrive.saveButton.click();
        await editDrive.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDrive.page.waitForLoadState('networkidle');
        await expect(editDriverDIspatchDashboardSetup.driverNameColumn).toContainText('*');
    });

    test('Korisnik moze da ukljuci "FC" toggle button', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.page.waitForLoadState('networkidle');
        await editDrive.unCheckFC();
        await editDrive.saveButton.click();
        await editDrive.page.waitForLoadState('networkidle');
        await editDrive.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await expect(editDriverDIspatchDashboardSetup.fcColumn).toContainText("ON");
    });

    test('Korisnik moze da ukljuci "Is new" toggle button', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.check(editDrive.isNewToggleButton);
        await editDrive.saveButton.click();
        await editDrive.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDrive.page.waitForLoadState('networkidle');
        await expect(editDriverDIspatchDashboardSetup.driverNameColumn).toContainText('(NEW)');
    });

    test('Korisnik moze da ukljuci "Is company" toggle button', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.check(editDrive.isCompanyToggleButton);
        await editDrive.saveButton.click();
        await editDrive.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDrive.page.waitForLoadState('networkidle');
        await expect(editDriverDIspatchDashboardSetup.driverNameColumn).toContainText('(company driver)');
    });

    test('Korisnik moze da ukljuci "Is time" toggle button', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.check(editDrive.isTimeToggleButton);
        await editDrive.saveButton.click();
        await editDrive.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDrive.page.waitForLoadState('networkidle');
        await expect(editDriverDIspatchDashboardSetup.driverNameColumn).toContainText('(time)');
    });

    test('Korisnik moze da cekira checkboxove', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.check(editDrive.isActiveCheckbox);
        await editDrive.check(editDrive.noCutCheckbox);
        await editDrive.check(editDrive.hassAnAppAccount);
        await editDrive.saveButton.click();
        await editDrive.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDrive.page.waitForLoadState('networkidle');
        await editDriverDIspatchDashboardSetup.driveNameColumn.click({ button: "right" });
        await editDriverDIspatchDashboardSetup.page.waitForLoadState('networkidle');
        await expect(editDrive.isActiveCheckbox).toBeChecked();
        await expect(editDrive.noCutCheckbox).toBeChecked();
        await expect(editDrive.hassAnAppAccount).toBeChecked();
    });

    test('Korisnik moze da otvori trailer history kada klikne na "Show trailer history" toggle button', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.check(editDrive.showTrailerHistoryToggleButton);
        await expect(editDrive.trailerHistoryList).toBeVisible();
    });

    test('Korisnik moze da obrise trailer history', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.check(editDrive.showTrailerHistoryToggleButton);
        editDrive.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        await editDrive.firtsDeleteIconOnHistoryTrailer.click();
        await expect(editDrive.snackContent).toContainText(Constants.snackContentHistorySuccessfullyDeleted);
    });

    test('Korisnik moze da izadje iz modala na Cancel dugme', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.cancelButton.click();
        await editDrive.page.waitForLoadState('networkidle');
        await expect(editDrive.editDriverTitle).not.toBeVisible();
    });
});

test.describe('Testovi sa afterAll', () => {
    test('Driver moze da se edituje', async ({ editDriverDIspatchDashboardSetup, editDrive }) => {
        await editDrive.fillInputField(editDrive.driverName, Constants.secondDriverName);
        await editDrive.fillInputField(editDrive.secondDrverName, Constants.secondDriverTest);
        await editDrive.selectFromMenu(editDrive.owner, editDrive.secondOwnerOption);
        await editDrive.selectFromMenu(editDrive.board, editDrive.b2Board);
        await editDrive.page.waitForTimeout(1000);
        await editDrive.selectFromMenu(editDrive.dispatcher, editDrive.testPassDispatcher);
        await editDrive.fillAndSelectOption(editDrive.substituteDispatcher, Constants.test, editDrive.secondSubstituteDsipatcher);
        await editDrive.selectFromMenu(editDrive.payroll, editDrive.secondPayroll);
        await editDrive.selectFromMenu(editDrive.trailerManager, editDrive.secondTrailerManager);
        await editDrive.fillInputField(editDrive.dissField, Constants.secondDiss);
        await editDrive.fillInputField(editDrive.diss2Field, Constants.secondDiss);
        await editDrive.fillInputField(editDrive.diss3Field, Constants.secondDiss);
        await editDrive.fillInputField(editDrive.diss4Field, Constants.secondDiss);
        await editDrive.selectFromMenu(editDrive.company, editDrive.secondCompany);
        await editDrive.fillInputField(editDrive.phone, Constants.secondPhone);
        await editDrive.fillInputField(editDrive.ownerPhone, Constants.secondOwnerPhone);
        await editDrive.fillAndSelectOption(editDrive.truck, Constants.secondTruckName, editDrive.secondTruckName);
        await editDrive.fillAndSelectOption(editDrive.trailer, Constants.secondTrailerName, editDrive.secondTrailerName);
        await editDrive.fillInputField(editDrive.trailerType, Constants.secondTrailerType);
        await editDrive.fillInputField(editDrive.noteBox, Constants.noteSecond);
        await editDrive.saveButton.click();
        await editDrive.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDrive.page.waitForLoadState('networkidle');
        await editDrive.page.locator('.v-input__slot').first().click();
        await editDriverDIspatchDashboardSetup.xIconInInputField.first().click();
        await editDriverDIspatchDashboardSetup.fillInputField(editDriverDIspatchDashboardSetup.nameSearchInput, Constants.secondDriverName);
        const nameText = editDriverDIspatchDashboardSetup.driverNameColumn.filter({ hasText: Constants.secondDriverName });
        await nameText.waitFor({ state: 'visible', timeout: 5000 });
        await expect(editDriverDIspatchDashboardSetup.noteIcon).toBeVisible();
        await expect(editDriverDIspatchDashboardSetup.driverNameColumn).toContainText(Constants.secondDriverName);
        await expect(editDriverDIspatchDashboardSetup.driverNameColumn).toContainText(Constants.secondOwner);
        await expect(editDriverDIspatchDashboardSetup.driverNameColumn).toContainText(Constants.secondDriverTest);
        await expect(editDriverDIspatchDashboardSetup.typeColumn).toContainText(Constants.secondTrailerType);
        await expect(editDriverDIspatchDashboardSetup.companyColumn).toContainText(Constants.secondSCompany);
        await expect(editDriverDIspatchDashboardSetup.extColumn).toContainText(Constants.secondDispatcher);
        await expect(editDriverDIspatchDashboardSetup.extColumn).toContainText(Constants.secondSubstitutleDispatcher);
        await expect(editDriverDIspatchDashboardSetup.extColumn).toContainText(Constants.secondDiss);
        await expect(editDriverDIspatchDashboardSetup.tryTimeExtColumn).toContainText(Constants.secondDiss);
        await expect(editDriverDIspatchDashboardSetup.rocketExtColumn).toContainText(Constants.secondDiss);
        await expect(editDriverDIspatchDashboardSetup.jordanExt).toContainText(Constants.secondDiss);
        await expect(editDriverDIspatchDashboardSetup.truckColumn).toContainText(Constants.secondTruckName);
        await expect(editDriverDIspatchDashboardSetup.trailerColumn).toContainText(Constants.secondTrailerName);
        await expect(editDriverDIspatchDashboardSetup.phoneColumn).toContainText(Constants.secondPhone);
        await expect(editDriverDIspatchDashboardSetup.phoneColumn).toContainText(Constants.secondOwnerPhone);
        await expect(editDriverDIspatchDashboardSetup.boardColumn).toContainText(Constants.secondBoard);
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'auth.json' });
        const page = await context.newPage();
        const edit = new EditDriver(page);
        await edit.returnOnPreviousState();
        await context.close();
    });
});