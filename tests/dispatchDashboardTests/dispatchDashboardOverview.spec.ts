import { test, expect, chromium, Page } from '@playwright/test';
import { DispatchDashboardOverview } from '../../page/dispatchDashboard/dispatchDashboardOverview.page';
import { Constants } from '../../helpers/constants';
import { getWeekRange } from '../../helpers/dateUtilis';
import fs from 'fs';


test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.dashboardUrl);
});

test('Korisnik moze da pretrazuje User-a po imenu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.nameSearchInput, Constants.driverName);
    const imeZaPretragu = Constants.driverName;
    await dispatch.driverNameColumn.locator(`text=${imeZaPretragu}`).waitFor({ state: 'visible' });
    const firstDriverName = await dispatch.driverNameColumn.first().textContent();
    expect(firstDriverName?.trim()).toContain(imeZaPretragu);
});

test('Korisnik moze da pretrazuje User-a po kamionu', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.truckSeachInput, Constants.truckName);
    const truck = page.locator('tr', {
        has: page.locator('td:nth-child(8)', { hasText: Constants.truckName })
    });
    await truck.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(dispatch.truckColumn.first()).toContainText(Constants.truckName);
});

test('Korisnik moze da pretrazuje User-a po prikolici', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.trailerSearchInput, Constants.trailerTest);
    const trailer = page.locator('tr', {
        has: page.locator('td:nth-child(9)', { hasText: Constants.trailerTest })
    });
    await trailer.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(dispatch.trailerColumn.first()).toContainText(Constants.trailerTest);
});

test('Korisnik moze da obrise unose iz input polja', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    const nameInputField = page.locator('.v-input__slot').first();
    const truckInputField = page.locator('.v-input__slot').nth(1);
    const trailerInputField = page.locator('.v-input__slot').last();
    await dispatch.fillInputField(dispatch.nameSearchInput, Constants.driverName);
    await dispatch.fillInputField(dispatch.truckSeachInput, Constants.truckName);
    await dispatch.fillInputField(dispatch.trailerSearchInput, Constants.trailerTest);
    await page.waitForLoadState('networkidle');
    await nameInputField.click();
    await dispatch.xIconInInputField.first().click();
    await truckInputField.click();
    await dispatch.xIconInInputField.nth(1).click();
    await trailerInputField.click();
    await dispatch.xIconInInputField.last().click();
    await page.waitForLoadState('networkidle');
    await expect(dispatch.nameSearchInput).toBeEmpty();
    await expect(dispatch.truckSeachInput).toBeEmpty();
    await expect(dispatch.trailerSearchInput).toBeEmpty();
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

test('Korisnik moze da otvori trailer tabelu kada klikne na ime kamiona', async ({ page }) => {
    const dispatch = new DispatchDashboardOverview(page);
    await dispatch.fillInputField(dispatch.trailerSearchInput, Constants.trailerTest);
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
    await page.locator('.v-dialog--active').isVisible();
});