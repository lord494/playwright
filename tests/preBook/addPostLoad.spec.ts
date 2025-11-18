import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { generateRandomString } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda post Load', async ({ addPostLoadSetup, postLoad }) => {
    const loadId = generateRandomString();
    await postLoad.newLoadButton.click();
    await addPostLoadSetup.saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await addPostLoadSetup.enterLoadId(addPostLoadSetup.loadId, loadId);
    await addPostLoadSetup.selectOrigin(addPostLoadSetup.originMenu, Constants.deliveryCity, addPostLoadSetup.originOption);
    await addPostLoadSetup.selecDestination(addPostLoadSetup.destinatinMenu, Constants.seconDeliveryCity, addPostLoadSetup.destinationOption);
    await addPostLoadSetup.selectTodayDate(addPostLoadSetup.pickupDateField, addPostLoadSetup.todayDate);
    await addPostLoadSetup.selectTodayDate(addPostLoadSetup.deliveryDateField, addPostLoadSetup.todayDate.last());
    await addPostLoadSetup.selectCompany(addPostLoadSetup.companyField, addPostLoadSetup.companyOption);
    await addPostLoadSetup.enterBrokerName(addPostLoadSetup.brokerNameField, Constants.playWrightUser);
    await addPostLoadSetup.enterBrokerEmail(addPostLoadSetup.brokerEmailField, Constants.testEmail);
    await addPostLoadSetup.enterBrokerPhone(addPostLoadSetup.brokerPhoneField, Constants.phoneNumberOfUserApp);
    await addPostLoadSetup.enterWeight(addPostLoadSetup.weightField, Constants.weight);
    await addPostLoadSetup.enterRate(addPostLoadSetup.rateField, Constants.amount);
    await addPostLoadSetup.enterSyggestedRate(addPostLoadSetup.suggestedRateField, Constants.suggestedRate);
    await addPostLoadSetup.check(addPostLoadSetup.dedicaterCheckbox);
    await addPostLoadSetup.enterNote(addPostLoadSetup.noteField, Constants.noteFirst);
    await addPostLoadSetup.saveButton.click();
    await addPostLoadSetup.addEditDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await addPostLoadSetup.page.waitForLoadState('networkidle');
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

