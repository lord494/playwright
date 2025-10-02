import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { generateRandomLetters } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda i obrise drivera', async ({ addDriverSetup, driverOverview }) => {
    addDriverSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const driverName = generateRandomLetters();
    await addDriverSetup.fillInputField(addDriverSetup.driverName, driverName);
    await addDriverSetup.fillInputField(addDriverSetup.secondDrverName, Constants.secondDriverTest);
    await addDriverSetup.selectFromMenu(addDriverSetup.owner, addDriverSetup.secondOwnerOption);
    await addDriverSetup.selectFromMenu(addDriverSetup.board, addDriverSetup.b2Board);
    await addDriverSetup.page.waitForTimeout(1000);
    await addDriverSetup.selectFromMenu(addDriverSetup.dispatcher, addDriverSetup.testPassDispatcher);
    await addDriverSetup.fillAndSelectOption(addDriverSetup.substituteDispatcher, Constants.test, addDriverSetup.secondSubstituteDsipatcher);
    await addDriverSetup.selectFromMenu(addDriverSetup.payroll, addDriverSetup.secondPayroll);
    await addDriverSetup.selectFromMenu(addDriverSetup.trailerManager, addDriverSetup.secondTrailerManager);
    await addDriverSetup.fillInputField(addDriverSetup.dissField, Constants.secondDiss);
    await addDriverSetup.fillInputField(addDriverSetup.diss2Field, Constants.secondDiss);
    await addDriverSetup.fillInputField(addDriverSetup.diss3Field, Constants.secondDiss);
    await addDriverSetup.fillInputField(addDriverSetup.diss4Field, Constants.secondDiss);
    await addDriverSetup.selectFromMenu(addDriverSetup.company, addDriverSetup.secondCompany);
    await addDriverSetup.fillInputField(addDriverSetup.phone, Constants.secondPhone);
    await addDriverSetup.fillInputField(addDriverSetup.ownerPhone, Constants.secondOwnerPhone);
    await addDriverSetup.fillAndSelectOption(addDriverSetup.truck, Constants.secondTruckName, addDriverSetup.secondTruckName);
    await addDriverSetup.fillAndSelectOption(addDriverSetup.trailer, Constants.secondTrailerName, addDriverSetup.secondTrailerName);
    await addDriverSetup.fillInputField(addDriverSetup.trailerType, Constants.secondTrailerType);
    await addDriverSetup.fillInputField(addDriverSetup.noteBox, Constants.noteSecond);
    await driverOverview.addButtonInModal.click();
    await addDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
    await addDriverSetup.page.waitForLoadState('networkidle');
    const [response] = await Promise.all([
        addDriverSetup.page.waitForResponse(res =>
            res.url().includes('/api/drivers')
        ),
        await driverOverview.enterDriverNameInSearchField(driverOverview.searchInputField, driverName)
    ]);
    expect([200, 304]).toContain(response.status());
    await expect(driverOverview.driverNameColumn).toContainText(driverName);
    await expect(driverOverview.driverNameColumn).toContainText(Constants.secondOwner);
    await expect(driverOverview.driverNameColumn).toContainText(Constants.secondDriverTest);
    await expect(driverOverview.trailerTypeColumn).toContainText(Constants.secondTrailerType);
    await expect(driverOverview.companyColumn).toContainText(Constants.secondSCompany);
    await expect(driverOverview.dispExtColumn).toContainText(Constants.secDis);
    await expect(driverOverview.truckColumn).toContainText(Constants.secondTruckName);
    await expect(driverOverview.trailerColumn).toContainText(Constants.secondTrailerName);
    await expect(driverOverview.phoneColumn).toContainText(Constants.secondPhone);
    await expect(driverOverview.boardColumn).toContainText(Constants.secondBoard);
    await driverOverview.deleteIcon.click();
    await expect(driverOverview.snackMessage).toContainText(driverName + " " + 'successfully deleted')
});