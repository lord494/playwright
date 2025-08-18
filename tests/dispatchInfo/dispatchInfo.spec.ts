import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { DispatchInfoPage } from '../../page/dispatchInfo/dispatcInfo.page';
import { waitForBrokerLoad } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.dispatchInfoUrl, { waitUntil: 'networkidle', timeout: 20000 });
});

test('Korisnik moze da doda novog Brokera', async ({ page }) => {
    const dispatchInfoPage = new DispatchInfoPage(page);
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dispatchInfoPage.addNewBrokerButton.click();
    await dispatchInfoPage.enterBrokerName(dispatchInfoPage.brokerNameInput, Constants.driverNameFraser);
    await dispatchInfoPage.enterDescription(dispatchInfoPage.descriptionInput, Constants.noteFirst);
    await dispatchInfoPage.selectMC(dispatchInfoPage.mcInput, 'MC-1', dispatchInfoPage.mc1Option);
    await dispatchInfoPage.descriptionInput.click();
    await dispatchInfoPage.saveButton.click();
    await dispatchInfoPage.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(page, async () => {
        await dispatchInfoPage.searchInput.fill(Constants.driverNameFraser);
    });
    await expect(dispatchInfoPage.brokerName.first()).toContainText(Constants.driverNameFraser, { timeout: 10000 });
    await expect(dispatchInfoPage.description).toContainText(Constants.noteFirst);
    await expect(dispatchInfoPage.mc).toContainText('MC-1');
    await dispatchInfoPage.deleteButton.click();
});

test('Korisnik moze da doda novog Brokera sa vise MCs', async ({ page }) => {
    const dispatchInfoPage = new DispatchInfoPage(page);
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dispatchInfoPage.addNewBrokerButton.click();
    await dispatchInfoPage.enterBrokerName(dispatchInfoPage.brokerNameInput, Constants.driverNameFraser);
    await dispatchInfoPage.enterDescription(dispatchInfoPage.descriptionInput, Constants.noteFirst);
    await dispatchInfoPage.selectMC(dispatchInfoPage.mcInput, 'MC-1', dispatchInfoPage.mc1Option);
    await dispatchInfoPage.mc14Option.click();
    await dispatchInfoPage.descriptionInput.click();
    await dispatchInfoPage.saveButton.click();
    await dispatchInfoPage.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(page, async () => {
        await dispatchInfoPage.searchInput.fill(Constants.driverNameFraser);
    });
    await expect(dispatchInfoPage.brokerName.first()).toContainText(Constants.driverNameFraser, { timeout: 10000 });
    await expect(dispatchInfoPage.description).toContainText(Constants.noteFirst);
    const expectedTexts = ['MC-10', 'MC-14'];
    for (let i = 0; i < await dispatchInfoPage.mc.count(); i++) {
        const text = await dispatchInfoPage.mc.nth(i).innerText();
        if (expectedTexts.some(expected => text.includes(expected))) {
        }
    }
    await dispatchInfoPage.deleteButton.click();
});

test('Korisnik moze da edituje Brokera', async ({ page }) => {
    const dispatchInfoPage = new DispatchInfoPage(page);
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await dispatchInfoPage.addNewBrokerButton.click();
    await dispatchInfoPage.enterBrokerName(dispatchInfoPage.brokerNameInput, Constants.driverNameFraser);
    await dispatchInfoPage.enterDescription(dispatchInfoPage.descriptionInput, Constants.noteFirst);
    await dispatchInfoPage.selectMC(dispatchInfoPage.mcInput, 'MC-1', dispatchInfoPage.mc1Option);
    await dispatchInfoPage.descriptionInput.click();
    await dispatchInfoPage.saveButton.click();
    await dispatchInfoPage.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(page, async () => {
        await dispatchInfoPage.searchInput.fill(Constants.driverNameFraser);
    });
    await expect(dispatchInfoPage.brokerName.first()).toContainText(Constants.driverNameFraser, { timeout: 10000 });
    await dispatchInfoPage.editButton.click();
    await dispatchInfoPage.brokerNameInput.clear();
    await dispatchInfoPage.enterBrokerName(dispatchInfoPage.brokerNameInput, Constants.driverName);
    await dispatchInfoPage.descriptionInput.clear();
    await dispatchInfoPage.enterDescription(dispatchInfoPage.descriptionInput, Constants.noteSecond);
    await dispatchInfoPage.selectMC(dispatchInfoPage.mcInput, 'MC-14', dispatchInfoPage.mc14Option);
    await dispatchInfoPage.descriptionInput.click();
    await dispatchInfoPage.saveButton.click();
    await dispatchInfoPage.dialogBox.waitFor({ state: 'hidden' });
    await waitForBrokerLoad(page, async () => {
        await dispatchInfoPage.searchInput.fill(Constants.driverName);
    });
    await expect(dispatchInfoPage.brokerName.first()).toContainText(Constants.driverName, { timeout: 10000 });
    await expect(dispatchInfoPage.description).toContainText(Constants.noteSecond);
    const expectedTexts = ['MC-10', 'MC-14'];
    for (let i = 0; i < await dispatchInfoPage.mc.count(); i++) {
        const text = await dispatchInfoPage.mc.nth(i).innerText();
        if (expectedTexts.some(expected => text.includes(expected))) {
        }
    }
    await dispatchInfoPage.deleteButton.click();
});