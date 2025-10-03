import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { generateRandomLetters } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda i obrise drivera', async ({ addInactiveDriverSetup, driverOverview }) => {
    addInactiveDriverSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const driverName = generateRandomLetters();
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.driverName, driverName);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.secondDrverName, Constants.secondDriverTest);
    await addInactiveDriverSetup.selectFromMenu(addInactiveDriverSetup.owner, addInactiveDriverSetup.secondOwnerOption);
    await addInactiveDriverSetup.selectFromMenu(addInactiveDriverSetup.board, addInactiveDriverSetup.b2Board);
    await addInactiveDriverSetup.page.waitForTimeout(1000);
    await addInactiveDriverSetup.selectFromMenu(addInactiveDriverSetup.dispatcher, addInactiveDriverSetup.testPassDispatcher);
    await addInactiveDriverSetup.fillAndSelectOption(addInactiveDriverSetup.substituteDispatcher, Constants.test, addInactiveDriverSetup.secondSubstituteDsipatcher);
    await addInactiveDriverSetup.selectFromMenu(addInactiveDriverSetup.payroll, addInactiveDriverSetup.secondPayroll);
    await addInactiveDriverSetup.selectFromMenu(addInactiveDriverSetup.trailerManager, addInactiveDriverSetup.secondTrailerManager);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.dissField, Constants.secondDiss);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.diss2Field, Constants.secondDiss);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.diss3Field, Constants.secondDiss);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.diss4Field, Constants.secondDiss);
    await addInactiveDriverSetup.selectFromMenu(addInactiveDriverSetup.company, addInactiveDriverSetup.secondCompany);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.phone, Constants.secondPhone);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.ownerPhone, Constants.secondOwnerPhone);
    await addInactiveDriverSetup.fillAndSelectOption(addInactiveDriverSetup.truck, Constants.secondTruckName, addInactiveDriverSetup.secondTruckName);
    await addInactiveDriverSetup.fillAndSelectOption(addInactiveDriverSetup.trailer, Constants.secondTrailerName, addInactiveDriverSetup.secondTrailerName);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.trailerType, Constants.secondTrailerType);
    await addInactiveDriverSetup.fillInputField(addInactiveDriverSetup.noteBox, Constants.noteSecond);
    await driverOverview.addButtonInModal.click();
    await addInactiveDriverSetup.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
    await driverOverview.page.waitForLoadState('networkidle');
    await driverOverview.page.goto(Constants.driverUrl, { waitUntil: 'networkidle' });
    const [response] = await Promise.all([
        driverOverview.page.waitForResponse(res =>
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