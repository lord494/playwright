import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da edituje Delivery city', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.seconDeliveryCity, editLoadSetup.deliveryCitySecond);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    await expect(dispatcDashboard.loadColumn.first()).toContainText(Constants.seconDeliveryCity);
});

test('Korisnik moze da edituje load na "Empty, Need Load" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.emptyNeedLoad)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.emptyNeedLoad);
    await expect(bgColor).toBe(Constants.emptyNeedLoadColor);
});

test('Korisnik moze da edituje load na "Loaded" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.loadedLoad)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadedLoad);
    await expect(bgColor).toBe(Constants.loadedLoadColor);
});

test('Korisnik moze da edituje load na "Dispatched, not Loaded" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.dispatcherNotLoadedLoad)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.dispatchedNotLoaded);
    await expect(bgColor).toBe(Constants.dispatchedNotLoadedColor);
});

test('Korisnik moze da edituje load na "Load problem" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.loadProblemLoad)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadProblemLoad);
    await expect(bgColor).toBe(Constants.loadProblemLoadColor);
});

test('Korisnik moze da edituje load na "Broken" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.brokenLoad)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.brokenLoad);
    await expect(bgColor).toBe(Constants.brokenLoadColor);
});

test('Korisnik moze da edituje load na "Special note" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.specialNote)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.specialNoteLoad);
    await expect(bgColor).toBe(Constants.specialNoteLoadColor);
});

test('Korisnik moze da edituje load na "PM SERVICE" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.pmService)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.pmServiceLoad);
    await expect(bgColor).toBe(Constants.pmServiceLoadColor);
});

test('Korisnik moze da edituje load na "Repo" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.repoLoad)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.repoLoad);
    await expect(bgColor).toBe(Constants.repoLoadColor);
});

test('Korisnik moze da edituje load na "L.O.T.R" load', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.selectFromMenu(editLoadSetup.loadType, editLoadSetup.lotrLoad)
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.lotrLoad);
    await expect(bgColor).toBe(Constants.lotrLoadColor);
});

test('Korisnik moze da cekira "dedicated load" checkbox', async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await editLoadSetup.check(editLoadSetup.dedicatetLoadCheckbox);
    await editLoadSetup.saveButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    const title = await dispatcDashboard.dedicatedIcon.first().getAttribute('title');
    await expect(dispatcDashboard.dedicatedIcon.first()).toBeVisible();
    await expect(title).toContain(Constants.dedicatedLoad);
});

test('Type of absence i Date picker su disejblovani u Edit load modalu', async ({ editLoadSetup }) => {
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.page.waitForLoadState("networkidle");
    await expect(editLoadSetup.disabledAbsence).toBeVisible();
    await expect(editLoadSetup.disabledDatePicker).toBeVisible();
});

test("Korisnik moze da doda komentar", async ({ editLoadSetup }) => {
    const today = new Date();
    const formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
        today.getDate().toString().padStart(2, '0') + '/' +
        today.getFullYear();
    await editLoadSetup.enterComment(editLoadSetup.commentTextfield, Constants.driverName, editLoadSetup.addCommentButton);
    await editLoadSetup.page.waitForLoadState('networkidle');
    await expect(editLoadSetup.comments.last()).toContainText(Constants.driverName);
    await expect(editLoadSetup.comments.last()).toContainText(formattedDate);
});

test("Korisnik moze da edituje komentar", async ({ editLoadSetup, dispatcDashboard }) => {
    const today = new Date();
    const formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
        today.getDate().toString().padStart(2, '0') + '/' +
        today.getFullYear();
    await editLoadSetup.deleteLoadButton.click();
    await dispatcDashboard.loadColumn.first().click({ button: "right" })
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.enterComment(editLoadSetup.commentTextfield, Constants.driverName, editLoadSetup.addCommentButton);
    await editLoadSetup.page.waitForLoadState('networkidle');
    await editLoadSetup.saveButton.click();
    await dispatcDashboard.loadColumn.first().click({ button: "right" });
    await dispatcDashboard.page.waitForLoadState('networkidle');
    await editLoadSetup.editComment(editLoadSetup.pencilIconOnComment, editLoadSetup.commentTextfield, Constants.noteSecond, editLoadSetup.editCommentButton);
    await expect(editLoadSetup.comments).toContainText(Constants.noteSecond);
    await expect(editLoadSetup.comments).toContainText(formattedDate);
});

test("Korisnik moze da obrise komentar", async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.deleteLoadButton.click();
    await dispatcDashboard.loadColumn.first().click({ button: "right" })
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.enterComment(editLoadSetup.commentTextfield, Constants.driverName, editLoadSetup.addCommentButton);
    await editLoadSetup.page.waitForLoadState('networkidle');
    await editLoadSetup.saveButton.click();
    await dispatcDashboard.loadColumn.first().click({ button: "right" });
    await dispatcDashboard.page.waitForLoadState('networkidle');
    await editLoadSetup.deleteCommentIcon.click();
    await expect(editLoadSetup.comments).not.toBeVisible();
});

test("Korisnik moze da obrise load", async ({ editLoadSetup, dispatcDashboard }) => {
    await editLoadSetup.deleteLoadButton.click();
    await editLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 10000 });
    await expect(dispatcDashboard.loadColumn.first()).toBeEmpty();
});

test("Dodati komentar se vidi i na hover load-a na dashboard stranici", async ({ editLoadSetup, dispatcDashboard }) => {
    const today = new Date();
    const formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '/' +
        today.getDate().toString().padStart(2, '0') + '/' +
        today.getFullYear();
    await editLoadSetup.deleteLoadButton.click();
    await dispatcDashboard.loadColumn.first().click({ button: "right" })
    await editLoadSetup.fillAndSelectOption(editLoadSetup.deliveryCityLabel, Constants.deliveryCity, editLoadSetup.deliveryCity);
    await editLoadSetup.enterComment(editLoadSetup.commentTextfield, Constants.driverName, editLoadSetup.addCommentButton);
    await editLoadSetup.page.waitForLoadState('networkidle');
    await editLoadSetup.saveButton.click();
    await dispatcDashboard.loadColumn.first().hover();
    await expect(editLoadSetup.commentsHolder).toBeVisible();
    await expect(editLoadSetup.commentsHolder).toContainText(Constants.driverName);
    await expect(editLoadSetup.commentsHolder).toContainText(formattedDate);
});