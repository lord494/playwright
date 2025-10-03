import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { EditInactiveDriver } from '../../page/inactiveDrivers/editInactiveDriver.page';
import { test } from '../fixtures/fixtures';

test.describe('Testovi bez afterAll', () => {
    test('Driver name je obavezno polje', async ({ editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.driverName.clear();
        await editInactiveDriverSetup.saveButton.click();
        await editInactiveDriverSetup.page.waitForLoadState('networkidle');
        await expect(editInactiveDriverSetup.errorMessage).toContainText('The name field is required');
    });

    test('Phone je obavezno polje', async ({ editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.phone.clear();
        await editInactiveDriverSetup.saveButton.click();
        await expect(editInactiveDriverSetup.errorMessage.last()).toContainText('The phone field is required');
    });

    test('Truck je obavezno polje', async ({ editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.truck.clear();
        await editInactiveDriverSetup.saveButton.click();
        await expect(editInactiveDriverSetup.errorMessage).toContainText('The Truck field is required');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Name polje', async ({ editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.driverName, "123!@#")
        await expect(editInactiveDriverSetup.invalidMessage.first()).toContainText('The name field format is invalid');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Second driver name polje', async ({ editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.secondDrverName, "123!@#")
        await expect(editInactiveDriverSetup.invalidMessage.first()).toContainText("The second_driver field format is invalid");
    });

    test('Korisnik moze da ukljuci "Is priority" toggle button', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.check(editInactiveDriverSetup.isPriorityToggleButton);
        await editInactiveDriverSetup.saveButton.click();
        await editInactiveDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editInactiveDriverSetup.page.waitForLoadState('networkidle');
        await expect(inactiveDriver.driverNameColumn).toContainText('*');
    });

    test('Korisnik moze da ukljuci "Is new" toggle button', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.check(editInactiveDriverSetup.isNewToggleButton);
        await editInactiveDriverSetup.saveButton.click();
        await editInactiveDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editInactiveDriverSetup.page.waitForLoadState('networkidle');
        await expect(inactiveDriver.driverNameColumn).toContainText('(NEW)');
    });

    test('Korisnik moze da ukljuci "Is company" toggle button', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.check(editInactiveDriverSetup.isCompanyToggleButton);
        await editInactiveDriverSetup.saveButton.click();
        await editInactiveDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editInactiveDriverSetup.page.waitForLoadState('networkidle');
        await expect(inactiveDriver.driverNameColumn).toContainText('(company driver)');
    });

    test('Korisnik moze da ukljuci "Is time" toggle button', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.check(editInactiveDriverSetup.isTimeToggleButton);
        await editInactiveDriverSetup.saveButton.click();
        await editInactiveDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editInactiveDriverSetup.page.waitForLoadState('networkidle');
        await expect(inactiveDriver.driverNameColumn).toContainText('(time)');
    });

    test('Korisnik moze da cekira checkboxove', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.check(editInactiveDriverSetup.noCutCheckbox);
        await editInactiveDriverSetup.check(editInactiveDriverSetup.hassAnAppAccount);
        await editInactiveDriverSetup.saveButton.click();
        await editInactiveDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editInactiveDriverSetup.page.waitForLoadState('networkidle');
        await inactiveDriver.pencilIcon.click();
        await inactiveDriver.page.waitForLoadState('networkidle');
        await expect(editInactiveDriverSetup.noCutCheckbox).toBeChecked();
        await expect(editInactiveDriverSetup.hassAnAppAccount).toBeChecked();
    });

    test('Korisnik moze da otvori trailer history kada klikne na "Show trailer history" toggle button', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.driverName.waitFor({ state: 'visible', timeout: 10000 });
        await Promise.all([
            editInactiveDriverSetup.page.waitForResponse(response =>
                response.url().includes('/api/owners/all') &&
                (response.status() === 200 || response.status() === 304)
            ),
            await editInactiveDriverSetup.check(editInactiveDriverSetup.showTrailerHistoryToggleButton)
        ]);
        if (await inactiveDriver.noHistoryLocator.isVisible()) {
            expect(await inactiveDriver.noHistoryLocator.isVisible()).toBeTruthy();
        } else {
            await expect(editInactiveDriverSetup.trailerHistoryList.first()).toBeVisible();
        }
    });

    test('Korisnik moze da obrise trailer history', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.check(editInactiveDriverSetup.showTrailerHistoryToggleButton);
        editInactiveDriverSetup.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        const isEmptyVisible = await inactiveDriver.noHistoryLocator.isVisible();
        if (isEmptyVisible) {
            expect(isEmptyVisible).toBeTruthy();
        } const deleteSelector = '.history-actions .v-icon--link.mdi.mdi-delete';
        try {
            await inactiveDriver.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
            while (await inactiveDriver.page.locator(deleteSelector).count() > 0) {
                const previousCount = await inactiveDriver.page.locator(deleteSelector).count();
                await inactiveDriver.page.locator(deleteSelector).first().click();
                await inactiveDriver.page.waitForFunction(
                    ({ selector, prevCount }) => {
                        return document.querySelectorAll(selector).length < prevCount;
                    },
                    { selector: deleteSelector, prevCount: previousCount }
                );
            }
        } catch (e) {
        }
        await expect(editInactiveDriverSetup.trailerHistoryList).not.toBeVisible();
    });
});

test.describe('Testovi sa afterAll', () => {
    test('Driver moze da se edituje', async ({ inactiveDriver, editInactiveDriverSetup }) => {
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.driverName, Constants.brianDriver);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.secondDrverName, Constants.secondDriverTest);
        await editInactiveDriverSetup.selectFromMenu(editInactiveDriverSetup.owner, editInactiveDriverSetup.secondOwnerOption);
        await editInactiveDriverSetup.selectFromMenu(editInactiveDriverSetup.board, editInactiveDriverSetup.b2Board);
        await editInactiveDriverSetup.page.waitForTimeout(1000);
        await editInactiveDriverSetup.selectFromMenu(editInactiveDriverSetup.dispatcher, editInactiveDriverSetup.testPassDispatcher);
        await editInactiveDriverSetup.fillAndSelectOption(editInactiveDriverSetup.substituteDispatcher, Constants.test, editInactiveDriverSetup.secondSubstituteDsipatcher);
        await editInactiveDriverSetup.selectFromMenu(editInactiveDriverSetup.payroll, editInactiveDriverSetup.secondPayroll);
        await editInactiveDriverSetup.selectFromMenu(editInactiveDriverSetup.trailerManager, editInactiveDriverSetup.secondTrailerManager);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.dissField, Constants.secondDiss);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.diss2Field, Constants.secondDiss);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.diss3Field, Constants.secondDiss);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.diss4Field, Constants.secondDiss);
        await editInactiveDriverSetup.selectFromMenu(editInactiveDriverSetup.company, editInactiveDriverSetup.secondCompany);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.phone, Constants.secondPhone);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.ownerPhone, Constants.secondOwnerPhone);
        await editInactiveDriverSetup.fillAndSelectOption(editInactiveDriverSetup.truck, Constants.secondTruckName, editInactiveDriverSetup.secondTruckName);
        await editInactiveDriverSetup.fillAndSelectOption(editInactiveDriverSetup.trailer, Constants.secondTrailerName, editInactiveDriverSetup.secondTrailerName);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.trailerType, Constants.secondTrailerType);
        await editInactiveDriverSetup.fillInputField(editInactiveDriverSetup.noteBox, Constants.noteSecond);
        await editInactiveDriverSetup.saveButton.click();
        await editInactiveDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editInactiveDriverSetup.page.waitForLoadState('networkidle');
        await expect(inactiveDriver.driverNameColumn).toContainText(Constants.brianDriver);
        await expect(inactiveDriver.driverNameColumn).toContainText(Constants.secondOwner);
        await expect(inactiveDriver.driverNameColumn).toContainText(Constants.secondDriverTest);
        await expect(inactiveDriver.trailerTypeColumn).toContainText(Constants.secondTrailerType);
        await expect(inactiveDriver.companyColumn).toContainText(Constants.secondSCompany);
        await expect(inactiveDriver.dispExtColumn).toContainText(Constants.secDis);
        await expect(inactiveDriver.truckColumn).toContainText(Constants.secondTruckName);
        await expect(inactiveDriver.trailerColumn).toContainText(Constants.secondTrailerName);
        await expect(inactiveDriver.phoneColumn).toContainText(Constants.secondPhone);
        await expect(inactiveDriver.boardColumn).toContainText(Constants.secondBoard);
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'auth.json' });
        const page = await context.newPage();
        const edit = new EditInactiveDriver(page);
        await edit.returnOnPreviousState();
        await context.close();
    });
});