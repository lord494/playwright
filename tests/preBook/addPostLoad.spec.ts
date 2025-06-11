import { test, expect, Page, Locator } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { PostLoadsPage } from '../../page/preBook/postLoads.page';
import { AddEditPostLoadPage } from '../../page/preBook/addEditPostLoad.page';
import { generateRandomString } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.postLoadPrebookUrl);
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da doda post Load', async ({ page }) => {
    const postLoad = new PostLoadsPage(page);
    const add = new AddEditPostLoadPage(page);
    const loadId = generateRandomString();
    await postLoad.newLoadButton.click();
    await add.saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await add.enterLoadId(add.loadId, loadId);
    await add.selectOrigin(add.originMenu, Constants.deliveryCity, add.originOption);
    await add.selecDestination(add.destinatinMenu, Constants.seconDeliveryCity, add.destinationOption);
    await add.selectTodayDate(add.pickupDateField, add.todayDate);
    await add.selectTodayDate(add.deliveryDateField, add.todayDate.last());
    await add.selectCompany(add.companyField, add.companyOption);
    await add.enterBrokerName(add.brokerNameField, Constants.playWrightUser);
    await add.enterBrokerEmail(add.brokerEmailField, Constants.testEmail);
    await add.enterBrokerPhone(add.brokerPhoneField, Constants.phoneNumberOfUserApp);
    await add.enterWeight(add.weightField, Constants.weight);
    await add.enterRate(add.rateField, Constants.amount);
    await add.enterSyggestedRate(add.suggestedRateField, Constants.suggestedRate);
    await add.check(add.dedicaterCheckbox);
    await add.enterNote(add.noteField, Constants.noteFirst);
    await add.saveButton.click();
    await add.addEditDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await postLoad.loadIdSearchInputField.click();
    await page.waitForTimeout(100);
    for (const char of loadId) {
        await postLoad.loadIdSearchInputField.type(char);
        await page.waitForTimeout(300);
        await postLoad.loadIdSearchInputField.click();
    }
    const truckCell = page.locator(`tr:nth-child(1) td:nth-child(1):has-text("${loadId}")`);
    await truckCell.waitFor({ state: 'visible', timeout: 10000 });
    await expect(postLoad.loadIdColumn.first()).toContainText(loadId);
    await expect(postLoad.originColumn.first()).toContainText(Constants.deliveryCity);
    await expect(postLoad.destinationColumn.first()).toContainText(Constants.seconDeliveryCity);
    await expect(postLoad.weightColumn.first()).toContainText(Constants.weight);
    await expect(postLoad.rateColumn.first()).toContainText(Constants.amount);
    await expect(postLoad.companyColumn.first()).toContainText(Constants.testKompanija011);
    await expect(postLoad.contactPersonColumn.first()).toContainText(Constants.playWrightUser);
    await expect(postLoad.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(postLoad.suggestedRateColumn.first()).toContainText(Constants.suggestedRate);
    await postLoad.noteIcon.hover();
    await expect(postLoad.noteIcon).toHaveAttribute('aria-expanded', 'true');
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // meseci idu od 0
    const year = today.getFullYear();
    const formatted = `${month}/${day}/${year}`;
    await expect(postLoad.pickUpColumn.first()).toContainText(formatted);
    await expect(postLoad.deliveryColumn.first()).toContainText(formatted);
    await expect(postLoad.dedicatedColumn).toHaveClass(/mdi-alpha-d-box/);
    await expect(postLoad.trailerTypeColumn).toContainText(Constants.firstTrailerType);
});

