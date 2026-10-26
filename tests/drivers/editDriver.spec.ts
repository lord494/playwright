import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { generateRandomLetters } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test.describe('Validacija i trailer history (Mark Labat, bez snimanja)', () => {
    test('Driver name je obavezno polje', async ({ editDriverSetup }) => {
        await editDriverSetup.driverName.clear();
        await editDriverSetup.saveButton.click();
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
        await editDriverSetup.fillInputField(editDriverSetup.driverName, "123!@#");
        await expect(editDriverSetup.invalidMessage.first()).toContainText('The name field format is invalid');
    });

    test('Korisnik ne moze da unese brojeve i specijalne karaktere u Second driver name polje', async ({ editDriverSetup }) => {
        await editDriverSetup.fillInputField(editDriverSetup.secondDrverName, "123!@#");
        await expect(editDriverSetup.invalidMessage.first()).toContainText("The second_driver field format is invalid");
    });

    test('Korisnik moze da otvori trailer history kada klikne na "Show trailer history" toggle button', async ({ editDriverSetup }) => {
        await editDriverSetup.openTrailerHistory();
        await expect(editDriverSetup.noTrailerHistory.or(editDriverSetup.trailerHistoryList).first()).toBeVisible();
    });

    test('Korisnik moze da obrise trailer history', async ({ editDriverSetup }) => {
        editDriverSetup.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        await editDriverSetup.openTrailerHistory();
        await editDriverSetup.deleteAllTrailerHistory();
        await expect(editDriverSetup.trailerHistoryDeleteIcons).toHaveCount(0);
    });
});

test.describe('Izmjene koje se snimaju (novi vozac po testu)', () => {
    test('Korisnik moze da ukljuci "Is priority" toggle button', async ({ editCreatedDriverSetup, driverOverview }) => {
        await editCreatedDriverSetup.check(editCreatedDriverSetup.isPriorityToggleButton);
        await editCreatedDriverSetup.saveButton.click();
        await editCreatedDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await expect(driverOverview.driverNameColumn).toContainText('*');
    });

    test('Korisnik moze da ukljuci "Is new" toggle button', async ({ editCreatedDriverSetup, driverOverview }) => {
        await editCreatedDriverSetup.check(editCreatedDriverSetup.isNewToggleButton);
        await editCreatedDriverSetup.saveButton.click();
        await editCreatedDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await expect(driverOverview.driverNameColumn).toContainText('(NEW)');
    });

    test('Korisnik moze da ukljuci "Is company" toggle button', async ({ editCreatedDriverSetup, driverOverview }) => {
        await editCreatedDriverSetup.check(editCreatedDriverSetup.isCompanyToggleButton);
        await editCreatedDriverSetup.saveButton.click();
        await editCreatedDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await expect(driverOverview.driverNameColumn).toContainText('(company driver)');
    });

    test('Korisnik moze da ukljuci "Is time" toggle button', async ({ editCreatedDriverSetup, driverOverview }) => {
        await editCreatedDriverSetup.check(editCreatedDriverSetup.isTimeToggleButton);
        await editCreatedDriverSetup.saveButton.click();
        await editCreatedDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await expect(driverOverview.driverNameColumn).toContainText('(time)');
    });

    test('Korisnik moze da cekira checkboxove', async ({ editCreatedDriverSetup, driverOverview }) => {
        await editCreatedDriverSetup.check(editCreatedDriverSetup.noCutCheckbox);
        await editCreatedDriverSetup.check(editCreatedDriverSetup.hassAnAppAccount);
        await editCreatedDriverSetup.saveButton.click();
        await editCreatedDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await driverOverview.waitForTableLoads();
        await driverOverview.pencilIcon.first().click();
        await expect(editCreatedDriverSetup.noCutCheckbox).toBeChecked();
        await expect(editCreatedDriverSetup.hassAnAppAccount).toBeChecked();
    });

    test('Driver moze da se edituje', async ({ editCreatedDriverSetup, driverOverview }) => {
        test.slow(); // creates a driver in the fixture, then fills ~20 fields
        const newDriverName = `${Constants.driverTestPrefix} ${generateRandomLetters(8)}`;
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.driverName, newDriverName);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.secondDrverName, Constants.secondDriverTest);
        await editCreatedDriverSetup.selectFromMenu(editCreatedDriverSetup.owner, editCreatedDriverSetup.secondOwnerOption);
        await editCreatedDriverSetup.selectBoard(editCreatedDriverSetup.b2Board);
        await editCreatedDriverSetup.selectFromMenu(editCreatedDriverSetup.dispatcher, editCreatedDriverSetup.testPassDispatcher);
        await editCreatedDriverSetup.fillAndSelectOption(editCreatedDriverSetup.substituteDispatcher, Constants.test, editCreatedDriverSetup.secondSubstituteDsipatcher);
        await editCreatedDriverSetup.selectFromMenu(editCreatedDriverSetup.payroll, editCreatedDriverSetup.secondPayroll);
        await editCreatedDriverSetup.selectFromMenu(editCreatedDriverSetup.trailerManager, editCreatedDriverSetup.secondTrailerManager);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.dissField, Constants.secondDiss);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.diss2Field, Constants.secondDiss);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.diss3Field, Constants.secondDiss);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.diss4Field, Constants.secondDiss);
        await editCreatedDriverSetup.selectFromMenu(editCreatedDriverSetup.company, editCreatedDriverSetup.secondCompany);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.phone, Constants.secondPhone);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.ownerPhone, Constants.secondOwnerPhone);
        await editCreatedDriverSetup.fillAndSelectOption(editCreatedDriverSetup.truck, Constants.secondTruckName, editCreatedDriverSetup.secondTruckName);
        await editCreatedDriverSetup.fillAndSelectOption(editCreatedDriverSetup.trailer, Constants.secondTrailerName, editCreatedDriverSetup.secondTrailerName);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.trailerType, Constants.secondTrailerType);
        await editCreatedDriverSetup.fillInputField(editCreatedDriverSetup.noteBox, Constants.noteSecond);
        await editCreatedDriverSetup.saveButton.click();
        await editCreatedDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
        await driverOverview.searchDriverByName(newDriverName);
        await expect(driverOverview.driverNameColumn).toContainText(newDriverName);
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
});
