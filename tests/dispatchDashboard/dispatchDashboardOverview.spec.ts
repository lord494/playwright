import { test, expect } from '@playwright/test';
import { DispatchDashboardOverview } from '../../page/dispatchDashboard/dispatchDashboardOverview.page';
import { Constants } from '../../helpers/constants';
import { getWeekRange } from '../../helpers/dateUtilis';
import fs from 'fs';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await page.goto(Constants.dashboardUrl, { waitUntil: 'networkidle', timeout: 15000 });
    await dispatch.driveNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da pretrazuje User-a po imenu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.nameSearchInput, Constants.driverNameFraser);
    const imeZaPretragu = Constants.driverNameFraser;
    await dispatch.driverNameColumn.locator(`text=${imeZaPretragu}`).waitFor({ state: 'visible' });
    const firstDriverName = await dispatch.driverNameColumn.first().textContent();
    expect(firstDriverName?.trim()).toContain(imeZaPretragu);
});

test('Korisnik moze da pretrazuje User-a po kamionu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        dispatch.fillInputField(dispatch.truckSeachInput, Constants.truckName)
    ]);
    await expect(dispatch.truckColumn.first()).toContainText(Constants.truckName, { timeout: 5000 });
});

test('Korisnik moze da pretrazuje User-a po prikolici', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const [response] = await Promise.all([
        page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        dispatch.fillInputField(dispatch.trailerSearchInput, Constants.trailerTestNumber)
    ]);
    await expect(dispatch.trailerColumn.first()).toContainText(Constants.trailerTestNumber);
});

test('Korisnik moze da mijenja datum u mjesecu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.changeDate();
    await page.waitForLoadState('networkidle');
    await dispatch.dateLabel.click();
    await expect(dispatch.selectedDate).toContainText("13");
});

test('Danasnji datum je oznacen u date pickeru po defaultu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const today = new Date();
    const day = today.getDate().toString();
    await dispatch.dateLabel.click();
    await expect(dispatch.todayDate).toHaveText(day);
});

test('Korisnik moze da izabere datum u proslosti i vrati se na danasnji datum klikom na Today dugme', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const today = new Date();
    const day = today.getDate().toString();
    await dispatch.selectDateInPastAndBackOnToday();
    await dispatch.dateLabel.click();
    await expect(dispatch.todayDate).toHaveText(day);
});

test('Korisnik moze da izabere datum u buducnosti i vrati se na danasnji datum klikom na Today dugme', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const today = new Date();
    const day = today.getDate().toString();
    await dispatch.selectDateInFutureAndBackOnToday();
    await dispatch.dateLabel.click();
    await expect(dispatch.todayDate).toHaveText(day);
});

test('Korisnik moze da izabere godinu u proslosti', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.selectYearInPast();
    await dispatch.dateLabel.click();
    await page.waitForLoadState('networkidle');
    await expect(dispatch.monthOryearLabelInDatePicker).toContainText(/2023/);
});

test('Korisnik moze da izabere godinu u buducnosti', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.selectYearInFuture();
    await dispatch.dateLabel.click();
    await page.waitForLoadState('networkidle');
    await expect(dispatch.monthOryearLabelInDatePicker).toContainText(/2030/);
});

test('Korisnik moze da mijenja datum, mjesec i godinu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.selectDateInPast();
    await dispatch.dateLabel.click();
    await page.waitForLoadState('networkidle');
    await expect(dispatch.monthOryearLabelInDatePicker).toContainText(/January 2023/)
    await expect(dispatch.selectedDate).toContainText(/13/);
});

test('Korisnik moze da mijenja range na next dugme', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await expect(dispatch.dateRange).toBeVisible();
    const initialRange = await dispatch.dateRange.textContent();
    if (!initialRange) throw new Error("Date range not found");
    const expectedNextRange = getWeekRange(1);
    await dispatch.nextButton.click();
    await page.waitForLoadState('networkidle');
    const nextRange = await dispatch.dateRange.textContent();
    const normalizedNextRange = nextRange?.replace(/\./g, '');
    const normalizedExpectedNextRange = expectedNextRange.replace(/\./g, '');
    expect(normalizedNextRange).toBe(normalizedExpectedNextRange);
});

test('Korisnik moze da mijenja range na prev dugme', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await expect(dispatch.dateRange).toBeVisible();
    const initialRange = await dispatch.dateRange.textContent();
    if (!initialRange) throw new Error("Date range not found");
    const expectedNextRange = getWeekRange(-1);
    await dispatch.prevButton.click();
    await page.waitForLoadState('networkidle');
    const nextRange = await dispatch.dateRange.textContent();
    const normalizedNextRange = nextRange?.replace(/\./g, '');
    const normalizedExpectedNextRange = expectedNextRange.replace(/\./g, '');
    expect(normalizedNextRange).toBe(normalizedExpectedNextRange);
});

test('Korisnik moze da preuzme pdf klikon na pdf ikonicu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        dispatch.pdfIcon.click(),
    ]);
    const filePath = `downloads/${download.suggestedFilename()}`;
    await download.saveAs(filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
});

test('Korisnik moze da uradi refresh stranice kada klikne na refresh ikonicu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const initialUrl = page.url();
    await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        dispatch.refreshIcon.click(),
    ]);
    expect(page.url()).toBe(initialUrl);
});

test('Korisnik moze da otvori truck tabelu kada klikne na ime kamiona', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.truckSeachInput, Constants.truckName);
    await page.waitForLoadState("networkidle");
    const truckName = await dispatch.truckColumn.first().textContent();
    await dispatch.truckColumn.first().click();
    await page.waitForLoadState('networkidle');
    const currentURL = page.url();
    expect(currentURL).toContain(truckName);
});

test('Korisnik moze da otvori trailer tabelu kada klikne na ime trailera', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.trailerSearchInput, Constants.trailerTestNumber);
    await page.waitForLoadState("networkidle");
    const trailerName = await dispatch.trailerColumn.first().textContent();
    await dispatch.trailerColumn.first().click();
    await page.waitForLoadState('networkidle');
    const currentURL = page.url();
    expect(currentURL).toContain(trailerName);
});

test('Korisnik moze da otvori edit driver modal kada klikne na ime kamiona', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.nameSearchInput, Constants.driverName);
    await page.waitForLoadState("networkidle");
    await dispatch.driveNameColumn.first().click({ button: "right" });
    await dispatch.activeDialogbox.isVisible();
});