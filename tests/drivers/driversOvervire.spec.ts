import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { DriverOverviewPage } from '../../page/drivers/drriversOverview.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.driverUrl, { waitUntil: 'networkidle' });
});

test('korisnik moze da pretrazuje drivere po drivers with no truck opciji', async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/drivers') &&
            res.url().includes('searchBy=no_truck')
        ),
        await driver.selectOptionFromSearchMenu(driver.driversWithNoTruckOrTrailerFilter, driver.drivertsWithNoTruckOption)
    ]);
    expect([200, 304]).toContain(response.status());
    const isEmptyVisible = await driver.noDataAvailableLocator.isVisible();
    if (isEmptyVisible) {
        expect(isEmptyVisible).toBeTruthy();
    } else {
        const truck = await driver.truckColumn.all();
        for (let i = 0; i < truck.length; i++) {
            const text = await driver.truckColumn.nth(i).innerText();
            expect(text.trim()).toBe('');
        }
    }
});

test('korisnik moze da pretrazuje drivere po drivers with no trailer opciji', async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/drivers') &&
            res.url().includes('searchBy=no_trailer')
        ),
        await driver.selectOptionFromSearchMenu(driver.driversWithNoTruckOrTrailerFilter, driver.driversWithNoTrailerOption)
    ]);
    expect([200, 304]).toContain(response.status());
    const isEmptyVisible = await driver.noDataAvailableLocator.isVisible();
    if (isEmptyVisible) {
        expect(isEmptyVisible).toBeTruthy();
    } else {
        const trailer = await driver.trailerColumn.all();
        for (let i = 0; i < trailer.length; i++) {
            const text = await driver.trailerColumn.nth(i).innerText();
            expect(text.trim()).toBe('');
        }
    }
});

test('Korisnik moze da otvori truck sranicu kada klikne na truck broj iz truck kolone', async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    let clickedValue = '';
    const truckCells = await driver.truckColumn.all();
    for (let i = 0; i < truckCells.length; i++) {
        const cell = driver.truckColumn.nth(i);
        const text = await cell.innerText();
        if (text.trim() !== '') {
            clickedValue = text.trim();
            await cell.click();
            break;
        }
    }
    await expect(page).toHaveURL('trucks/all?search=' + clickedValue);
});

test('Korisnik moze da otvori truck sranicu kada klikne na trialer broj iz trailer kolone', async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    let clickedValue = '';
    const trailerCells = await driver.trailerColumn.all();
    for (let i = 0; i < trailerCells.length; i++) {
        const cell = driver.trailerColumn.nth(i);
        const text = await cell.innerText();
        if (text.trim() !== '') {
            clickedValue = text.trim();
            await cell.click();
            break;
        }
    }
    await expect(page).toHaveURL('trailers?search=' + clickedValue);
});

test('Korisnik moze da doda, edituje i brise employment history', async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    await driver.clickElement(driver.employmentHistoryIcon.nth(2));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.v-menu__content .mdi-delete';
    try {
        await page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await page.locator(deleteSelector).count() > 0) {
            const previousCount = await page.locator(deleteSelector).count();
            await page.locator(deleteSelector).first().click();
            await page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await driver.clickElement(driver.addEmploymentHistoryButton);
    await driver.selectDateFromDatapicker(driver.terminatedDate, driver.currentDataInModal);
    await driver.clickElement(driver.addButtonInModal);
    await driver.dialogbox.waitFor({ state: "detached", timeout: 10000 });
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    await expect(driver.historyList).toContainText("Terminated: " + formattedDate);
    await driver.editIconInModal.click();
    await driver.selectDateFromDatapicker(driver.terminatedDate, page.getByRole('button', { name: '28', exact: true }));
    await driver.clickElement(driver.editButtonInModal);
    await expect(driver.historyList).toContainText("Terminated: " + year + '-' + month + '-' + '28');
    await driver.deleteIconInModal.click();
    await expect(driver.historyList).not.toBeVisible();
});

test('korisnik moze da pretrazuje drivere po imenu', async ({ page }) => {
    const driver = new DriverOverviewPage(page);
    const [response] = await Promise.all([
        page.waitForResponse(res =>
            res.url().includes('/api/drivers')
        ),
        await driver.enterDriverNameInSearchField(driver.searchInputField, Constants.markLabatDriver)
    ]);
    expect([200, 304]).toContain(response.status());
    const driverNumber = await driver.driverNameColumn.all();
    for (let i = 0; i < driverNumber.length; i++) {
        const text = await driver.driverNameColumn.nth(i).innerText();
        expect(text.trim()).toContain(Constants.markLabatDriver);
    }
});