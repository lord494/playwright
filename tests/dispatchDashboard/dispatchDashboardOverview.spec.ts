import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { getWeekRange } from '../../helpers/dateUtilis';
import fs from 'fs';
import { test } from '../fixtures/fixtures';


test('Korisnik moze da pretrazuje User-a po imenu', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.fillInputField(dispatchDashboardSetup.nameSearchInput, Constants.driverNameFraser);
    const imeZaPretragu = Constants.driverNameFraser;
    await dispatchDashboardSetup.driverNameColumn.locator(`text=${imeZaPretragu}`).waitFor({ state: 'visible' });
    const firstDriverName = await dispatchDashboardSetup.driverNameColumn.first().textContent();
    expect(firstDriverName?.trim()).toContain(imeZaPretragu);
});

test('Korisnik moze da pretrazuje User-a po kamionu', async ({ dispatchDashboardSetup }) => {
    const [response] = await Promise.all([
        dispatchDashboardSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        dispatchDashboardSetup.fillInputField(dispatchDashboardSetup.truckSeachInput, Constants.truckName)
    ]);
    await expect(dispatchDashboardSetup.truckColumn.first()).toContainText(Constants.truckName, { timeout: 5000 });
});

test('Korisnik moze da pretrazuje User-a po prikolici', async ({ dispatchDashboardSetup }) => {
    const [response] = await Promise.all([
        dispatchDashboardSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        dispatchDashboardSetup.fillInputField(dispatchDashboardSetup.trailerSearchInput, Constants.trailerTestNumber)
    ]);
    await expect(dispatchDashboardSetup.trailerColumn.first()).toContainText(Constants.trailerTestNumber);
});

test('Korisnik moze da mijenja datum u mjesecu', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.changeDate();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    await dispatchDashboardSetup.dateLabel.click();
    await expect(dispatchDashboardSetup.selectedDate).toContainText("13");
});

test('Danasnji datum je oznacen u date pickeru po defaultu', async ({ dispatchDashboardSetup }) => {
    const today = new Date();
    const day = today.getDate().toString();
    await dispatchDashboardSetup.dateLabel.click();
    await expect(dispatchDashboardSetup.todayDate).toHaveText(day);
});

test('Korisnik moze da izabere datum u proslosti i vrati se na danasnji datum klikom na Today dugme', async ({ dispatchDashboardSetup }) => {
    const today = new Date();
    const day = today.getDate().toString();
    await dispatchDashboardSetup.selectDateInPastAndBackOnToday();
    await dispatchDashboardSetup.dateLabel.click();
    await expect(dispatchDashboardSetup.todayDate).toHaveText(day);
});

test('Korisnik moze da izabere datum u buducnosti i vrati se na danasnji datum klikom na Today dugme', async ({ dispatchDashboardSetup }) => {
    const today = new Date();
    const day = today.getDate().toString();
    await dispatchDashboardSetup.selectDateInFutureAndBackOnToday();
    await dispatchDashboardSetup.dateLabel.click();
    await expect(dispatchDashboardSetup.todayDate).toHaveText(day);
});

test('Korisnik moze da izabere godinu u proslosti', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.selectYearInPast();
    await dispatchDashboardSetup.dateLabel.click();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    await expect(dispatchDashboardSetup.monthOryearLabelInDatePicker).toContainText(/2023/);
});

test('Korisnik moze da izabere godinu u buducnosti', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.selectYearInFuture();
    await dispatchDashboardSetup.dateLabel.click();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    await expect(dispatchDashboardSetup.monthOryearLabelInDatePicker).toContainText(/2030/);
});

test('Korisnik moze da mijenja datum, mjesec i godinu', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.selectDateInPast();
    await dispatchDashboardSetup.dateLabel.click();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    await expect(dispatchDashboardSetup.monthOryearLabelInDatePicker).toContainText(/January 2023/);
    await expect(dispatchDashboardSetup.selectedDate).toContainText(/13/);
});

test('Korisnik moze da mijenja range na next dugme', async ({ dispatchDashboardSetup }) => {
    await expect(dispatchDashboardSetup.dateRange).toBeVisible();
    const initialRange = await dispatchDashboardSetup.dateRange.textContent();
    if (!initialRange) throw new Error("Date range not found");
    const expectedNextRange = getWeekRange(1);
    await dispatchDashboardSetup.nextButton.click();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    const nextRange = await dispatchDashboardSetup.dateRange.textContent();
    const normalizedNextRange = nextRange?.replace(/\./g, '');
    const normalizedExpectedNextRange = expectedNextRange.replace(/\./g, '');
    expect(normalizedNextRange).toBe(normalizedExpectedNextRange);
});

test('Korisnik moze da mijenja range na prev dugme', async ({ dispatchDashboardSetup }) => {
    await expect(dispatchDashboardSetup.dateRange).toBeVisible();
    const initialRange = await dispatchDashboardSetup.dateRange.textContent();
    if (!initialRange) throw new Error("Date range not found");
    const expectedNextRange = getWeekRange(-1);
    await dispatchDashboardSetup.prevButton.click();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    const nextRange = await dispatchDashboardSetup.dateRange.textContent();
    const normalizedNextRange = nextRange?.replace(/\./g, '');
    const normalizedExpectedNextRange = expectedNextRange.replace(/\./g, '');
    expect(normalizedNextRange).toBe(normalizedExpectedNextRange);
});

test('Korisnik moze da preuzme pdf klikon na pdf ikonicu', async ({ dispatchDashboardSetup }) => {
    const [download] = await Promise.all([
        dispatchDashboardSetup.page.waitForEvent('download'),
        dispatchDashboardSetup.pdfIcon.click(),
    ]);
    const filePath = `downloads/${download.suggestedFilename()}`;
    await download.saveAs(filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
});

test('Korisnik moze da uradi refresh stranice kada klikne na refresh ikonicu', async ({ dispatchDashboardSetup }) => {
    const initialUrl = dispatchDashboardSetup.page.url();
    await Promise.all([
        dispatchDashboardSetup.page.waitForLoadState('domcontentloaded'),
        dispatchDashboardSetup.refreshIcon.click(),
    ]);
    expect(dispatchDashboardSetup.page.url()).toBe(initialUrl);
});

test('Korisnik moze da otvori truck tabelu kada klikne na ime kamiona', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.fillInputField(dispatchDashboardSetup.truckSeachInput, Constants.truckName);
    await dispatchDashboardSetup.page.waitForLoadState("networkidle");
    const truckName = await dispatchDashboardSetup.truckColumn.first().textContent();
    await dispatchDashboardSetup.truckColumn.first().click();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    const currentURL = dispatchDashboardSetup.page.url();
    expect(currentURL).toContain(truckName);
});

test('Korisnik moze da otvori trailer tabelu kada klikne na ime trailera', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.fillInputField(dispatchDashboardSetup.trailerSearchInput, Constants.trailerTestNumber);
    await dispatchDashboardSetup.page.waitForLoadState("networkidle");
    const trailerName = await dispatchDashboardSetup.trailerColumn.first().textContent();
    await dispatchDashboardSetup.trailerColumn.first().click();
    await dispatchDashboardSetup.page.waitForLoadState('networkidle');
    const currentURL = dispatchDashboardSetup.page.url();
    expect(currentURL).toContain(trailerName);
});

test('Korisnik moze da otvori edit driver modal kada klikne na ime kamiona', async ({ dispatchDashboardSetup }) => {
    await dispatchDashboardSetup.fillInputField(dispatchDashboardSetup.nameSearchInput, Constants.driverName);
    await dispatchDashboardSetup.page.waitForLoadState("networkidle");
    await dispatchDashboardSetup.driveNameColumn.first().click({ button: "right" });
    await dispatchDashboardSetup.activeDialogbox.isVisible();
});
