import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('korisnik moze da pretrazuje drivere po drivers with no truck opciji', async ({ driverOverviewSetup }) => {
    const [response] = await Promise.all([
        driverOverviewSetup.page.waitForResponse(res =>
            res.url().includes('/api/drivers') &&
            res.url().includes('searchBy=no_truck')
        ),
        await driverOverviewSetup.selectOptionFromSearchMenu(driverOverviewSetup.driversWithNoTruckOrTrailerFilter, driverOverviewSetup.drivertsWithNoTruckOption)
    ]);
    expect([200, 304]).toContain(response.status());
    const isEmptyVisible = await driverOverviewSetup.noDataAvailableLocator.isVisible();
    if (isEmptyVisible) {
        expect(isEmptyVisible).toBeTruthy();
    } else {
        const truck = await driverOverviewSetup.truckColumn.all();
        for (let i = 0; i < truck.length; i++) {
            const text = await driverOverviewSetup.truckColumn.nth(i).innerText();
            expect(text.trim()).toBe('');
        }
    }
});

test('korisnik moze da pretrazuje drivere po drivers with no trailer opciji', async ({ driverOverviewSetup }) => {
    const [response] = await Promise.all([
        driverOverviewSetup.page.waitForResponse(res =>
            res.url().includes('/api/drivers') &&
            res.url().includes('searchBy=no_trailer')
        ),
        await driverOverviewSetup.selectOptionFromSearchMenu(driverOverviewSetup.driversWithNoTruckOrTrailerFilter, driverOverviewSetup.driversWithNoTrailerOption)
    ]);
    expect([200, 304]).toContain(response.status());
    const isEmptyVisible = await driverOverviewSetup.noDataAvailableLocator.isVisible();
    if (isEmptyVisible) {
        expect(isEmptyVisible).toBeTruthy();
    } else {
        const trailer = await driverOverviewSetup.trailerColumn.all();
        for (let i = 0; i < trailer.length; i++) {
            const text = await driverOverviewSetup.trailerColumn.nth(i).innerText();
            expect(text.trim()).toBe('');
        }
    }
});

test('Korisnik moze da otvori truck sranicu kada klikne na truck broj iz truck kolone', async ({ driverOverviewSetup }) => {
    let clickedValue = '';
    const truckCells = await driverOverviewSetup.truckColumn.all();
    for (let i = 0; i < truckCells.length; i++) {
        const cell = driverOverviewSetup.truckColumn.nth(i);
        const text = await cell.innerText();
        if (text.trim() !== '') {
            clickedValue = text.trim();
            await cell.click();
            break;
        }
    }
    await expect(driverOverviewSetup.page).toHaveURL('trucks/all?search=' + clickedValue);
});

test('Korisnik moze da otvori truck sranicu kada klikne na trialer broj iz trailer kolone', async ({ driverOverviewSetup }) => {
    let clickedValue = '';
    const trailerCells = await driverOverviewSetup.trailerColumn.all();
    for (let i = 0; i < trailerCells.length; i++) {
        const cell = driverOverviewSetup.trailerColumn.nth(i);
        const text = await cell.innerText();
        if (text.trim() !== '') {
            clickedValue = text.trim();
            await cell.click();
            break;
        }
    }
    await expect(driverOverviewSetup.page).toHaveURL('trailers?search=' + clickedValue);
});

test('Korisnik moze da doda, edituje i brise employment history', async ({ driverOverviewSetup }) => {
    await driverOverviewSetup.clickElement(driverOverviewSetup.employmentHistoryIcon.nth(2));
    driverOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.v-menu__content .mdi-delete';
    try {
        await driverOverviewSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await driverOverviewSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await driverOverviewSetup.page.locator(deleteSelector).count();
            await driverOverviewSetup.page.locator(deleteSelector).first().click();
            await driverOverviewSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await driverOverviewSetup.clickElement(driverOverviewSetup.addEmploymentHistoryButton);
    await driverOverviewSetup.selectDateFromDatapicker(driverOverviewSetup.terminatedDate, driverOverviewSetup.currentDataInModal);
    await driverOverviewSetup.clickElement(driverOverviewSetup.addButtonInModal);
    await driverOverviewSetup.dialogbox.waitFor({ state: "detached", timeout: 10000 });
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    await expect(driverOverviewSetup.historyList).toContainText("Terminated: " + formattedDate);
    await driverOverviewSetup.editIconInModal.click();
    await driverOverviewSetup.selectDateFromDatapicker(driverOverviewSetup.terminatedDate, driverOverviewSetup.page.getByRole('button', { name: '28', exact: true }));
    await driverOverviewSetup.clickElement(driverOverviewSetup.editButtonInModal);
    await expect(driverOverviewSetup.historyList).toContainText("Terminated: " + year + '-' + month + '-' + '28');
    await driverOverviewSetup.deleteIconInModal.click();
    await expect(driverOverviewSetup.historyList).not.toBeVisible();
});

test('korisnik moze da pretrazuje drivere po imenu', async ({ driverOverviewSetup }) => {
    const [response] = await Promise.all([
        driverOverviewSetup.page.waitForResponse(res =>
            res.url().includes('/api/drivers')
        ),
        await driverOverviewSetup.enterDriverNameInSearchField(driverOverviewSetup.searchInputField, Constants.markLabatDriver)
    ]);
    expect([200, 304]).toContain(response.status());
    const driverNumber = await driverOverviewSetup.driverNameColumn.all();
    for (let i = 0; i < driverNumber.length; i++) {
        const text = await driverOverviewSetup.driverNameColumn.nth(i).innerText();
        expect(text.trim()).toContain(Constants.markLabatDriver);
    }
});