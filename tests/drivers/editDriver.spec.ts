import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { EditDriver } from '../../page/drivers/editDrive.page';
import { test } from '../fixtures/fixtures';

test.describe('Testovi bez afterAll', () => {
    test('Driver name je obavezno polje', async ({ editDriverSetup }) => {
        await editDriverSetup.driverName.clear();
        await editDriverSetup.saveButton.click();
        await editDriverSetup.page.waitForLoadState('networkidle');
        await expect(editDriverSetup.errorMessage).toContainText('The name field is required');
    });

    test('Phone je obavezno polje', async ({ editDriverSetup }) => {
        await editDriverSetup.phone.clear();
        await editDriverSetup.saveButton.click();
        await expect(editDriverSetup.errorMessage.last()).toContainText('The phone field is required');
    });

    test('Truck je obavezno polje', async ({ editDriverSetup }) => {
        await editDriverSetup.truck.clear();
        await editDriverSetup.saveButton.click();
        await expect(editDriverSetup.errorMessage).toContainText('The Truck field is required');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Name polje', async ({ editDriverSetup }) => {
        await editDriverSetup.fillInputField(editDriverSetup.driverName, "123!@#")
        await expect(editDriverSetup.invalidMessage.first()).toContainText('The name field format is invalid');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Second driver name polje', async ({ editDriverSetup }) => {
        await editDriverSetup.fillInputField(editDriverSetup.secondDrverName, "123!@#")
        await expect(editDriverSetup.invalidMessage.first()).toContainText("The second_driver field format is invalid");
    });

    test('Korisnik moze da ukljuci "Is priority" toggle button', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.check(editDriverSetup.isPriorityToggleButton);
        await editDriverSetup.saveButton.click();
        await editDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDriverSetup.page.waitForLoadState('networkidle');
        await expect(driverOverview.driverNameColumn).toContainText('*');
    });

    test('Korisnik moze da ukljuci "Is new" toggle button', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.check(editDriverSetup.isNewToggleButton);
        await editDriverSetup.saveButton.click();
        await editDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDriverSetup.page.waitForLoadState('networkidle');
        await expect(driverOverview.driverNameColumn).toContainText('(NEW)');
    });

    test('Korisnik moze da ukljuci "Is company" toggle button', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.check(editDriverSetup.isCompanyToggleButton);
        await editDriverSetup.saveButton.click();
        await editDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDriverSetup.page.waitForLoadState('networkidle');
        await expect(driverOverview.driverNameColumn).toContainText('(company driver)');
    });

    test('Korisnik moze da ukljuci "Is time" toggle button', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.check(editDriverSetup.isTimeToggleButton);
        await editDriverSetup.saveButton.click();
        await editDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDriverSetup.page.waitForLoadState('networkidle');
        await expect(driverOverview.driverNameColumn).toContainText('(time)');
    });

    test('Korisnik moze da cekira checkboxove', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.check(editDriverSetup.noCutCheckbox);
        await editDriverSetup.check(editDriverSetup.hassAnAppAccount);
        await editDriverSetup.saveButton.click();
        await editDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDriverSetup.page.waitForLoadState('networkidle');
        await driverOverview.pencilIcon.click();
        await driverOverview.page.waitForLoadState('networkidle');
        await expect(editDriverSetup.noCutCheckbox).toBeChecked();
        await expect(editDriverSetup.hassAnAppAccount).toBeChecked();
    });

    test('Korisnik moze da otvori trailer history kada klikne na "Show trailer history" toggle button', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.driverName.waitFor({ state: 'visible', timeout: 10000 });
        await Promise.all([
            editDriverSetup.page.waitForResponse(response =>
                response.url().includes('/api/owners/all') &&
                (response.status() === 200 || response.status() === 304)
            ),
            await editDriverSetup.check(editDriverSetup.showTrailerHistoryToggleButton)
        ]);
        if (await driverOverview.noHistoryLocator.isVisible()) {
            expect(await driverOverview.noHistoryLocator.isVisible()).toBeTruthy();
        } else {
            await expect(editDriverSetup.trailerHistoryList.first()).toBeVisible();
        }
    });

    test('Korisnik moze da obrise trailer history', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.check(editDriverSetup.showTrailerHistoryToggleButton);
        editDriverSetup.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        const isEmptyVisible = await driverOverview.noHistoryLocator.isVisible();
        if (isEmptyVisible) {
            expect(isEmptyVisible).toBeTruthy();
        } const deleteSelector = '.history-actions .v-icon--link.mdi.mdi-delete';
        try {
            await driverOverview.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
            while (await driverOverview.page.locator(deleteSelector).count() > 0) {
                const previousCount = await driverOverview.page.locator(deleteSelector).count();
                await driverOverview.page.locator(deleteSelector).first().click();
                await driverOverview.page.waitForFunction(
                    ({ selector, prevCount }) => {
                        return document.querySelectorAll(selector).length < prevCount;
                    },
                    { selector: deleteSelector, prevCount: previousCount }
                );
            }
        } catch (e) {
        }
        await expect(editDriverSetup.trailerHistoryList).not.toBeVisible();
    });
});

test.describe('Testovi sa afterAll', () => {
    test('Driver moze da se edituje', async ({ editDriverSetup, driverOverview }) => {
        await editDriverSetup.fillInputField(editDriverSetup.driverName, Constants.driver);
        await editDriverSetup.fillInputField(editDriverSetup.secondDrverName, Constants.secondDriverTest);
        await editDriverSetup.selectFromMenu(editDriverSetup.owner, editDriverSetup.secondOwnerOption);
        await editDriverSetup.selectFromMenu(editDriverSetup.board, editDriverSetup.b2Board);
        await editDriverSetup.page.waitForTimeout(1000);
        await editDriverSetup.selectFromMenu(editDriverSetup.dispatcher, editDriverSetup.testPassDispatcher);
        await editDriverSetup.fillAndSelectOption(editDriverSetup.substituteDispatcher, Constants.test, editDriverSetup.secondSubstituteDsipatcher);
        await editDriverSetup.selectFromMenu(editDriverSetup.payroll, editDriverSetup.secondPayroll);
        await editDriverSetup.selectFromMenu(editDriverSetup.trailerManager, editDriverSetup.secondTrailerManager);
        await editDriverSetup.fillInputField(editDriverSetup.dissField, Constants.secondDiss);
        await editDriverSetup.fillInputField(editDriverSetup.diss2Field, Constants.secondDiss);
        await editDriverSetup.fillInputField(editDriverSetup.diss3Field, Constants.secondDiss);
        await editDriverSetup.fillInputField(editDriverSetup.diss4Field, Constants.secondDiss);
        await editDriverSetup.selectFromMenu(editDriverSetup.company, editDriverSetup.secondCompany);
        await editDriverSetup.fillInputField(editDriverSetup.phone, Constants.secondPhone);
        await editDriverSetup.fillInputField(editDriverSetup.ownerPhone, Constants.secondOwnerPhone);
        await editDriverSetup.fillAndSelectOption(editDriverSetup.truck, Constants.secondTruckName, editDriverSetup.secondTruckName);
        await editDriverSetup.fillAndSelectOption(editDriverSetup.trailer, Constants.secondTrailerName, editDriverSetup.secondTrailerName);
        await editDriverSetup.fillInputField(editDriverSetup.trailerType, Constants.secondTrailerType);
        await editDriverSetup.fillInputField(editDriverSetup.noteBox, Constants.noteSecond);
        await editDriverSetup.saveButton.click();
        await editDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await editDriverSetup.page.waitForLoadState('networkidle');
        await expect(driverOverview.driverNameColumn).toContainText(Constants.driver);
        await expect(driverOverview.driverNameColumn).toContainText(Constants.secondOwner);
        await expect(driverOverview.driverNameColumn).toContainText(Constants.secondDriverTest);
        await expect(driverOverview.trailerTypeColumn).toContainText(Constants.secondTrailerType);
        await expect(driverOverview.companyColumn).toContainText(Constants.secondSCompany);
        await expect(driverOverview.dispExtColumn).toContainText(Constants.secDis);
        await expect(driverOverview.truckColumn).toContainText(Constants.secondTruckName);
        await expect(driverOverview.trailerColumn).toContainText(Constants.secondTrailerName);
        await expect(driverOverview.phoneColumn).toContainText(Constants.secondPhone);
        await expect(driverOverview.boardColumn).toContainText(Constants.secondBoard);
    });

    test.afterAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'auth.json' });
        const page = await context.newPage();
        const edit = new EditDriver(page);
        await edit.returnOnPreviousState();
        await context.close();
    });
});