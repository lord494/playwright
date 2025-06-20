import { test, expect } from '@playwright/test';
import { DispatchDashboardOverview } from '../../page/dispatchDashboard/dispatchDashboardOverview.page';
import { Constants } from '../../helpers/constants';
import { AddAndEditLoadModal } from '../../page/dispatchDashboard/addAndEditLoad.page';


test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const dashboard = new DispatchDashboardOverview(page);
    const addLoad = new AddAndEditLoadModal(page);
    await page.goto(Constants.dashboardUrl);
    await dashboard.driveNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await dashboard.fillInputField(dashboard.nameSearchInput, Constants.driverName);
    const driver = page.locator('tr', {
        has: page.locator('td:nth-child(2)', { hasText: 'btest' })
    });
    await driver.first().waitFor({ state: 'visible', timeout: 10000 });
    const text = await dashboard.loadColumn.first().textContent();
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    if (!text || text.trim() === '') {
        await dashboard.loadColumn.first().click({ button: "right" });
        await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
        await page.waitForLoadState("networkidle");
        await addLoad.saveButton.click();
        await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
        await expect(dashboard.loadColumn.first()).toContainText(Constants.deliveryCity);
    };
    await dashboard.loadColumn.first().click({ button: 'right' });
});

test('Korisnik moze da edituje Delivery city', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.seconDeliveryCity, addLoad.deliveryCitySecond);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    await expect(dashboard.loadColumn.first()).toContainText(Constants.seconDeliveryCity);
});

test('Korisnik moze da edituje load na "Empty, Need Load" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.emptyNeedLoad)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.emptyNeedLoad);
    await expect(bgColor).toBe(Constants.emptyNeedLoadColor);
});

test('Korisnik moze da edituje load na "Loaded" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.loadedLoad)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadedLoad);
    await expect(bgColor).toBe(Constants.loadedLoadColor);
});

test('Korisnik moze da edituje load na "Dispatched, not Loaded" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.dispatcherNotLoadedLoad)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.dispatchedNotLoaded);
    await expect(bgColor).toBe(Constants.dispatchedNotLoadedColor);
});

test('Korisnik moze da edituje load na "Load problem" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.loadProblemLoad)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadProblemLoad);
    await expect(bgColor).toBe(Constants.loadProblemLoadColor);
});

test('Korisnik moze da edituje load na "Broken" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.brokenLoad)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.brokenLoad);
    await expect(bgColor).toBe(Constants.brokenLoadColor);
});

test('Korisnik moze da edituje load na "Special note" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.specialNote)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.specialNoteLoad);
    await expect(bgColor).toBe(Constants.specialNoteLoadColor);
});

test('Korisnik moze da edituje load na "PM SERVICE" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.pmService)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.pmServiceLoad);
    await expect(bgColor).toBe(Constants.pmServiceLoadColor);
});

test('Korisnik moze da edituje load na "Repo" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.repoLoad)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.repoLoad);
    await expect(bgColor).toBe(Constants.repoLoadColor);
});

test('Korisnik moze da edituje load na "L.O.T.R" load', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.selectFromMenu(editLoad.loadType, editLoad.lotrLoad)
    await page.waitForLoadState("networkidle");
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.lotrLoad);
    await expect(bgColor).toBe(Constants.lotrLoadColor);
});

test('Korisnik moze da cekira "dedicated load" checkbox', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await editLoad.check(editLoad.dedicatetLoadCheckbox);
    await editLoad.saveButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dashboard.dedicatedIcon.first().getAttribute('title');
    await expect(dashboard.dedicatedIcon.first()).toBeVisible();
    await expect(title).toContain(Constants.dedicatedLoad);
});

test('Type of absence i Date picker su disejblovani u Edit load modalu', async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await expect(editLoad.disabledAbsence).toBeVisible();
    await expect(editLoad.disabledDatePicker).toBeVisible();
});

test("Korisnik moze da doda komentar", async ({ page }) => {
    const today = new Date();
    const formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
        today.getDate().toString().padStart(2, '0') + '/' +
        today.getFullYear();
    const editLoad = new AddAndEditLoadModal(page);
    await editLoad.enterComment(editLoad.commentTextfield, Constants.driverName, editLoad.addCommentButton);
    await page.waitForLoadState('networkidle');
    await expect(editLoad.comments.last()).toContainText(Constants.driverName);
    await expect(editLoad.comments.last()).toContainText(formattedDate);
});

test("Korisnik moze da edituje komentar", async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    const today = new Date();
    const formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
        today.getDate().toString().padStart(2, '0') + '/' +
        today.getFullYear();
    await editLoad.deleteLoadButton.click();
    await dashboard.loadColumn.first().click({ button: "right" })
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await editLoad.enterComment(editLoad.commentTextfield, Constants.driverName, editLoad.addCommentButton);
    await page.waitForLoadState('networkidle');
    await editLoad.saveButton.click();
    await dashboard.loadColumn.first().click({ button: "right" });
    await page.waitForLoadState('networkidle');
    await editLoad.editComment(editLoad.pencilIconOnComment, editLoad.commentTextfield, Constants.noteSecond, editLoad.editCommentButton);
    await expect(editLoad.comments).toContainText(Constants.noteSecond);
    await expect(editLoad.comments).toContainText(formattedDate);
});

test("Korisnik moze da obrise komentar", async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.deleteLoadButton.click();
    await dashboard.loadColumn.first().click({ button: "right" })
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await editLoad.enterComment(editLoad.commentTextfield, Constants.driverName, editLoad.addCommentButton);
    await page.waitForLoadState('networkidle');
    await editLoad.saveButton.click();
    await dashboard.loadColumn.first().click({ button: "right" });
    await page.waitForLoadState('networkidle');
    await editLoad.deleteCommentIcon.click();
    await expect(editLoad.comments).not.toBeVisible();
});

test("Korisnik moze da obrise load", async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await editLoad.deleteLoadButton.click();
    await editLoad.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    await expect(dashboard.loadColumn.first()).toBeEmpty();
});

test("Dodati komentar se vidi i na hover load-a na dashboard stranici", async ({ page }) => {
    const editLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    const today = new Date();
    const formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
        today.getDate().toString().padStart(2, '0') + '/' +
        today.getFullYear();
    await editLoad.deleteLoadButton.click();
    await dashboard.loadColumn.first().click({ button: "right" })
    await editLoad.fillAndSelectOption(editLoad.deliveryCityLabel, Constants.deliveryCity, editLoad.deliveryCity);
    await editLoad.enterComment(editLoad.commentTextfield, Constants.driverName, editLoad.addCommentButton);
    await page.waitForLoadState('networkidle');
    await editLoad.saveButton.click();
    await dashboard.loadColumn.first().hover();
    await expect(editLoad.commentsHolder).toBeVisible();
    await expect(editLoad.commentsHolder).toContainText(Constants.driverName);
    await expect(editLoad.commentsHolder).toContainText(formattedDate);
});