import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { DriverOverviewPage } from '../../page/drivers/drriversOverview.page';
import { EditDriver } from '../../page/drivers/editDrive.page';
import { generateRandomLetters } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    await page.goto(Constants.inactiveDriveUrl, { waitUntil: 'networkidle' });
    await driver.driverNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await driver.addDriverButton.click();
});

test('Korisnik moze da doda i obrise drivera', async ({ page }) => {
    const edit = new EditDriver(page);
    const driver = new DriverOverviewPage(page);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const driverName = generateRandomLetters();
    await edit.fillInputField(edit.driverName, driverName);
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
    await driver.addButtonInModal.click();
    await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await page.goto(Constants.driverUrl, { waitUntil: 'networkidle' });
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/drivers')
        ),
        await driver.enterDriverNameInSearchField(driver.searchInputField, driverName)
    ]);
    expect([200, 304]).toContain(response.status());
    await expect(driver.driverNameColumn).toContainText(driverName);
    await expect(driver.driverNameColumn).toContainText(Constants.secondOwner);
    await expect(driver.driverNameColumn).toContainText(Constants.secondDriverTest);
    await expect(driver.trailerTypeColumn).toContainText(Constants.secondTrailerType);
    await expect(driver.companyColumn).toContainText(Constants.secondSCompany);
    await expect(driver.dispExtColumn).toContainText(Constants.secDis);
    await expect(driver.truckColumn).toContainText(Constants.secondTruckName);
    await expect(driver.trailerColumn).toContainText(Constants.secondTrailerName);
    await expect(driver.phoneColumn).toContainText(Constants.secondPhone);
    await expect(driver.boardColumn).toContainText(Constants.secondBoard);
    await driver.deleteIcon.click();
    await expect(driver.snackMessage).toContainText(driverName + " " + 'successfully deleted')
});