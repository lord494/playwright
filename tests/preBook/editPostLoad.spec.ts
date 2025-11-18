import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { generateRandomString } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

// test.use({ storageState: 'auth.json' });

// let page: Page;

// test.beforeEach(async ({ page }) => {
//     const postLoad = new PostLoadsPage(page);
//     const add = new AddEditPostLoadPage(page);
//     const loadId = generateRandomString();
//     await page.goto(Constants.postLoadPrebookUrl);
//     await page.waitForLoadState('networkidle');
//     await postLoad.newLoadButton.click();
//     await add.saveButton.waitFor({ state: 'visible', timeout: 5000 });
//     await add.enterLoadId(add.loadId, loadId);
//     await add.selectOrigin(add.originMenu, Constants.deliveryCity, add.originOption);
//     await add.selecDestination(add.destinatinMenu, Constants.seconDeliveryCity, add.destinationOption);
//     await add.selectTodayDate(add.pickupDateField, add.todayDate);
//     await add.selectTodayDate(add.deliveryDateField, add.todayDate.last());
//     await add.selectCompany(add.companyField, add.companyOption);
//     await add.enterBrokerName(add.brokerNameField, Constants.playWrightUser);
//     await add.enterBrokerEmail(add.brokerEmailField, Constants.testEmail);
//     await add.enterBrokerPhone(add.brokerPhoneField, Constants.phoneNumberOfUserApp);
//     await add.enterWeight(add.weightField, Constants.weight);
//     await add.enterRate(add.rateField, Constants.amount);
//     await add.enterSyggestedRate(add.suggestedRateField, Constants.suggestedRate);
//     await add.check(add.dedicaterCheckbox);
//     await add.enterNote(add.noteField, Constants.noteFirst);
//     await add.saveButton.click();
//     await add.addEditDialogbox.waitFor({ state: 'detached', timeout: 5000 });
//     await page.waitForLoadState('networkidle');
//     await postLoad.loadIdSearchInputField.click();
//     await page.waitForTimeout(100);
//     for (const char of loadId) {
//         await postLoad.loadIdSearchInputField.type(char);
//         await page.waitForTimeout(300);
//         await postLoad.loadIdSearchInputField.click();
//     }
//     const truckCell = page.locator(`tr:nth-child(1) td:nth-child(1):has-text("${loadId}")`);
//     await truckCell.waitFor({ state: 'visible', timeout: 10000 });
//     await expect(postLoad.loadIdColumn.first()).toContainText(loadId);
// });

test('Korisnik moze da edituje post Load', async ({ editPostLoadSetup, postLoad }) => {
    test.setTimeout(90_000);
    const loadId = generateRandomString();
    await postLoad.pencilIcon.click();
    await editPostLoadSetup.saveButton.last().waitFor({ state: 'visible', timeout: 5000 });
    await editPostLoadSetup.loadId.clear();
    await editPostLoadSetup.enterLoadId(editPostLoadSetup.loadId, loadId);
    await editPostLoadSetup.selectOrigin(editPostLoadSetup.originMenu, Constants.miamiOriginCity, editPostLoadSetup.miamiOption);
    await editPostLoadSetup.selecDestination(editPostLoadSetup.destinatinMenu, Constants.newYorkCity, editPostLoadSetup.newYorkOption);
    await editPostLoadSetup.selectTodayDate(editPostLoadSetup.pickupDateField, editPostLoadSetup.page.getByRole('button', { name: '20', exact: true }).locator('div').first());
    await editPostLoadSetup.selectTodayDate(editPostLoadSetup.deliveryDateField, editPostLoadSetup.page.getByRole('button', { name: '22', exact: true }).nth(1));
    await editPostLoadSetup.selectTime(editPostLoadSetup.pickupTimeField, editPostLoadSetup.hours, editPostLoadSetup.minutes);
    await editPostLoadSetup.selectTime(editPostLoadSetup.toPickupTimeField, editPostLoadSetup.secondHours, editPostLoadSetup.secondMinutes);
    await editPostLoadSetup.selectTime(editPostLoadSetup.deliveryTimeField, editPostLoadSetup.secondHours, editPostLoadSetup.secondMinutes);
    await editPostLoadSetup.selectTime(editPostLoadSetup.toDilevryTimeField, editPostLoadSetup.hours, editPostLoadSetup.minutes);
    await editPostLoadSetup.selectCompany(editPostLoadSetup.companyField, editPostLoadSetup.editTestCompanyOption);
    await editPostLoadSetup.brokerNameField.clear();
    await editPostLoadSetup.enterBrokerName(editPostLoadSetup.brokerNameField, Constants.appTestUser);
    await editPostLoadSetup.brokerEmailField.clear();
    await editPostLoadSetup.enterBrokerEmail(editPostLoadSetup.brokerEmailField, Constants.fndPlaywrightEmail);
    await editPostLoadSetup.brokerPhoneField.clear();
    await editPostLoadSetup.enterBrokerPhone(editPostLoadSetup.brokerPhoneField, Constants.secondPhone);
    await editPostLoadSetup.uncheck(editPostLoadSetup.dedicaterCheckbox);
    await editPostLoadSetup.noteField.clear();
    await editPostLoadSetup.enterNote(editPostLoadSetup.noteField, Constants.noteSecond);
    await editPostLoadSetup.saveButton.last().click();
    await editPostLoadSetup.addEditDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await editPostLoadSetup.page.waitForLoadState('networkidle');
    await postLoad.dateMenu.click();
    await postLoad.page.getByRole('button', { name: '20', exact: true }).locator('div').first().click();
    await postLoad.page.getByRole('button', { name: '22', exact: true }).locator('div').last().click();
    await postLoad.loadIdSearchInputField.click();
    await postLoad.loadIdSearchInputField.press('Control+A');
    await postLoad.loadIdSearchInputField.press('Backspace');
    await postLoad.loadIdSearchInputField.click();
    await postLoad.page.waitForTimeout(100);
    for (const char of loadId) {
        await postLoad.loadIdSearchInputField.type(char);
        await postLoad.page.waitForTimeout(300);
        await postLoad.loadIdSearchInputField.click();
    }
    const truckCell = postLoad.page.locator(`tr:nth-child(1) td:nth-child(1):has-text("${loadId}")`);
    await truckCell.waitFor({ state: 'visible', timeout: 10000 });
    await expect(postLoad.loadIdColumn.first()).toContainText(loadId);
    await expect(postLoad.originColumn.first()).toContainText(Constants.miamiOriginCity);
    await expect(postLoad.destinationColumn.first()).toContainText(Constants.newYorkCity);
    await expect(postLoad.weightColumn.first()).toContainText(Constants.weight);
    await expect(postLoad.rateColumn.first()).toContainText(Constants.amount);
    await expect(postLoad.companyColumn.first()).toContainText(Constants.freighttincCompany);
    await expect(postLoad.contactPersonColumn.first()).toContainText(Constants.appTestUser);
    await expect(postLoad.emailColumn.first()).toContainText(Constants.fndPlaywrightEmail);
    await expect(postLoad.suggestedRateColumn.first()).toContainText(Constants.suggestedRate);
    await postLoad.noteIcon.hover();
    await expect(postLoad.noteIcon).toHaveAttribute('aria-expanded', 'true');
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    await expect(postLoad.pickUpColumn.first()).toContainText(month + '/20/' + year + ' 03:40 - 15:30');
    await expect(postLoad.deliveryColumn.first()).toContainText(month + '/22/' + year + ' 15:30 - 03:40');
    await expect(postLoad.trailerTypeColumn).toContainText(Constants.firstTrailerType);
});