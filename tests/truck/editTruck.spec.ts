import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { AddTruckPage } from '../../page/truck/addTruck.page';
import { TruckPage } from '../../page/truck/truck.page';
import { get17RandomNumbers, get6RandomNumber } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const add = new AddTruckPage(page);
    const truck = new TruckPage(page);
    await page.goto(Constants.truckUrl, { waitUntil: 'networkidle' });
    await truck.truckColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await truck.addButton.click();
    await add.phoneField.waitFor({ state: 'visible', timeout: 10000 });
    const truckNumber = get6RandomNumber().join('');
    await add.enterTruckNumber(add.truckNumberField, truckNumber);
    await add.selectDriver(add.driverField, Constants.driverPlaywright, add.driverOption);
    await add.enterInfo(add.infoField, Constants.noteFirst);
    await add.enterPhone(add.phoneField, Constants.phoneNumberOfUserApp);
    await add.selectDivision(add.divisionMenu, add.testCompanyDivisionOption);
    await add.selectMake(add.makeMenu, add.volvoMakeOption);
    await add.selectModel(add.modelMenu, add.VNL760ModleOption);
    await add.enterColor(add.truckColorField, Constants.truckColor);
    await add.selectYear(add.yearMenu, add.year2002);
    const vin = get17RandomNumbers().join('');
    await add.enterVinNumber(add.vinNumberField, vin);
    await add.enterPlate(add.plateField, Constants.plateNumber);
    await add.selectTruckEngine(add.truckEngineMenu, add.cumminsTruckEngine);
    await add.selectTransmission(add.transmissionMenu, add.automaticTransmissionOption);
    await add.enterMileage(add.truckMileageMenu, Constants.millage);
    await add.check(add.rentedRadioButton);
    await add.check(add.brokenTruckRadioButton);
    await add.check(add.totalDemage);
    await add.addButtonInModal.click();
    await add.dialogBox.waitFor({ state: 'detached', timeout: 10000 });
    await truck.enterTruckName(truck.searchInput, truckNumber);
    await page.waitForLoadState('networkidle');
    const truckCell = page.locator(`tr:nth-child(1) td:nth-child(2):has-text("${truckNumber}")`);
    await expect(truckCell).toBeVisible({ timeout: 10000 });
    await truck.pencilIcon.click();
});

test('Korisnik moze da edituje truck', async ({ page }) => {
    const add = new AddTruckPage(page);
    const truck = new TruckPage(page);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await add.phoneField.waitFor({ state: 'visible', timeout: 5000 });
    const truckNumber2 = get6RandomNumber().join('');
    await add.truckNumberField.clear();
    await add.enterTruckNumber(add.truckNumberField, truckNumber2);
    await add.driverField.clear();
    await add.selectDriver(add.driverField, Constants.driverTest, add.driverTest);
    await add.infoField.clear();
    await add.enterInfo(add.infoField, Constants.noteSecond);
    await add.phoneField.clear();
    await add.enterPhone(add.phoneField, Constants.ownerPhone);
    await add.selectDivision(add.divisionMenu, add.rocketDivision);
    const vin2 = get17RandomNumbers().join('');
    await add.vinNumberField.clear();
    await add.enterVinNumber(add.vinNumberField, vin2);
    await add.uncheck(add.brokenTruckRadioButton);
    await add.clickSaveButton();
    await add.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await expect(truck.truckColumn).toContainText(truckNumber2);
    await expect(truck.driverColumn).toContainText(Constants.driverTest);
    await expect(truck.infoColumn).toContainText(Constants.noteSecond);
    await expect(truck.phoneColumn).toContainText(Constants.ownerPhone);
    await expect(truck.divisionColumn).toContainText(Constants.rocketCompany);
    await expect(truck.vinColumn).toContainText(vin2);
    await expect(truck.isBrokenColumn).toHaveClass(/mdi-close/);
    await truck.pencilIcon.click();
});