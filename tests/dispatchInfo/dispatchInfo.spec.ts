import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { waitForBrokerLoad } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda novog Brokera', async ({ dispatchInfo }) => {
    dispatchInfo.page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dispatchInfo.addNewBrokerButton.click();
    await dispatchInfo.enterBrokerName(dispatchInfo.brokerNameInput, Constants.driverNameFraser);
    await dispatchInfo.enterDescription(dispatchInfo.descriptionInput, Constants.noteFirst);
    await dispatchInfo.selectMC(dispatchInfo.mcInput, 'MC-1', dispatchInfo.mc1Option);
    await dispatchInfo.descriptionInput.click();
    await dispatchInfo.saveButton.click();
    await dispatchInfo.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(dispatchInfo.page, async () => {
        await dispatchInfo.searchInput.fill(Constants.driverNameFraser);
    });
    await expect(dispatchInfo.brokerName.first()).toContainText(Constants.driverNameFraser, { timeout: 10000 });
    await expect(dispatchInfo.description).toContainText(Constants.noteFirst);
    await expect(dispatchInfo.mc).toContainText('MC-1');
    await dispatchInfo.deleteButton.click();
});

test('Korisnik moze da doda novog Brokera sa vise MCs', async ({ dispatchInfo }) => {
    dispatchInfo.page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dispatchInfo.addNewBrokerButton.click();
    await dispatchInfo.enterBrokerName(dispatchInfo.brokerNameInput, Constants.driverNameFraser);
    await dispatchInfo.enterDescription(dispatchInfo.descriptionInput, Constants.noteFirst);
    await dispatchInfo.selectMC(dispatchInfo.mcInput, 'MC-1', dispatchInfo.mc1Option);
    await dispatchInfo.mc14Option.click();
    await dispatchInfo.descriptionInput.click();
    await dispatchInfo.saveButton.click();
    await dispatchInfo.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(dispatchInfo.page, async () => {
        await dispatchInfo.searchInput.fill(Constants.driverNameFraser);
    });
    await expect(dispatchInfo.brokerName.first()).toContainText(Constants.driverNameFraser, { timeout: 10000 });
    await expect(dispatchInfo.description).toContainText(Constants.noteFirst);
    const expectedTexts = ['MC-10', 'MC-14'];
    for (let i = 0; i < await dispatchInfo.mc.count(); i++) {
        const text = await dispatchInfo.mc.nth(i).innerText();
        if (expectedTexts.some(expected => text.includes(expected))) {
        }
    }
    await dispatchInfo.deleteButton.click();
});

test('Korisnik moze da edituje Brokera', async ({ dispatchInfo }) => {
    dispatchInfo.page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dispatchInfo.addNewBrokerButton.click();
    await dispatchInfo.enterBrokerName(dispatchInfo.brokerNameInput, Constants.driverNameFraser);
    await dispatchInfo.enterDescription(dispatchInfo.descriptionInput, Constants.noteFirst);
    await dispatchInfo.selectMC(dispatchInfo.mcInput, 'MC-1', dispatchInfo.mc1Option);
    await dispatchInfo.descriptionInput.click();
    await dispatchInfo.saveButton.click();
    await dispatchInfo.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(dispatchInfo.page, async () => {
        await dispatchInfo.searchInput.fill(Constants.driverNameFraser);
    });
    await expect(dispatchInfo.brokerName.first()).toContainText(Constants.driverNameFraser, { timeout: 10000 });
    await dispatchInfo.editButton.click();
    await dispatchInfo.brokerNameInput.clear();
    await dispatchInfo.enterBrokerName(dispatchInfo.brokerNameInput, Constants.driverName);
    await dispatchInfo.descriptionInput.clear();
    await dispatchInfo.enterDescription(dispatchInfo.descriptionInput, Constants.noteSecond);
    await dispatchInfo.selectMC(dispatchInfo.mcInput, 'MC-14', dispatchInfo.mc14Option);
    await dispatchInfo.descriptionInput.click();
    await dispatchInfo.saveButton.click();
    await dispatchInfo.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(dispatchInfo.page, async () => {
        await dispatchInfo.searchInput.fill(Constants.driverName);
    });
    await expect(dispatchInfo.brokerName.first()).toContainText(Constants.driverName, { timeout: 10000 });
    await expect(dispatchInfo.description).toContainText(Constants.noteSecond);
    const expectedTexts = ['MC-10', 'MC-14'];
    for (let i = 0; i < await dispatchInfo.mc.count(); i++) {
        const text = await dispatchInfo.mc.nth(i).innerText();
        if (expectedTexts.some(expected => text.includes(expected))) {
        }
    }
    await dispatchInfo.deleteButton.click();
});