import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('korisnik moze da pretrazuje drivere po drivers with no truck opciji', async ({ inactiveDriverSetup }) => {
    const [response] = await Promise.all([
        inactiveDriverSetup.page.waitForResponse(res =>
            res.url().includes('/api/drivers') &&
            res.url().includes('searchBy=no_truck')
        ),
        await inactiveDriverSetup.selectOptionFromSearchMenu(inactiveDriverSetup.driversWithNoTruckOrTrailerFilter, inactiveDriverSetup.drivertsWithNoTruckOption)
    ]);
    expect([200, 304]).toContain(response.status());
    const isEmptyVisible = await inactiveDriverSetup.noDataAvailableLocator.isVisible();
    if (isEmptyVisible) {
        expect(isEmptyVisible).toBeTruthy();
    } else {
        const truck = await inactiveDriverSetup.truckColumn.all();
        for (let i = 0; i < truck.length; i++) {
            const text = await inactiveDriverSetup.truckColumn.nth(i).innerText();
            expect(text.trim()).toBe('');
        }
    }
});

test('korisnik moze da pretrazuje drivere po drivers with no trailer opciji', async ({ inactiveDriverSetup }) => {
    const [response] = await Promise.all([
        inactiveDriverSetup.page.waitForResponse(res =>
            res.url().includes('/api/drivers') &&
            res.url().includes('searchBy=no_trailer')
        ),
        await inactiveDriverSetup.selectOptionFromSearchMenu(inactiveDriverSetup.driversWithNoTruckOrTrailerFilter, inactiveDriverSetup.driversWithNoTrailerOption)
    ]);
    expect([200, 304]).toContain(response.status());
    const isEmptyVisible = await inactiveDriverSetup.noDataAvailableLocator.isVisible();
    if (isEmptyVisible) {
        expect(isEmptyVisible).toBeTruthy();
    } else {
        const trailer = await inactiveDriverSetup.trailerColumn.all();
        for (let i = 0; i < trailer.length; i++) {
            const text = await inactiveDriverSetup.trailerColumn.nth(i).innerText();
            expect(text.trim()).toBe('');
        }
    }
});

test('Korisnik moze da otvori truck sranicu kada klikne na truck broj iz truck kolone', async ({ inactiveDriverSetup }) => {
    let clickedValue = '';
    const truckCells = await inactiveDriverSetup.truckColumn.all();
    for (let i = 0; i < truckCells.length; i++) {
        const cell = inactiveDriverSetup.truckColumn.nth(i);
        const text = await cell.innerText();
        if (text.trim() !== '') {
            clickedValue = text.trim();
            await cell.click();
            break;
        }
    }
    await expect(inactiveDriverSetup.page).toHaveURL('trucks/all?search=' + clickedValue);
});

test('Korisnik moze da otvori truck sranicu kada klikne na trialer broj iz trailer kolone', async ({ inactiveDriverSetup }) => {
    let clickedValue = '';
    const trailerCells = await inactiveDriverSetup.trailerColumn.all();
    for (let i = 0; i < trailerCells.length; i++) {
        const cell = inactiveDriverSetup.trailerColumn.nth(i);
        const text = await cell.innerText();
        if (text.trim() !== '') {
            clickedValue = text.trim();
            await cell.click();
            break;
        }
    }
    await expect(inactiveDriverSetup.page).toHaveURL('trailers?search=' + clickedValue);
});

test('Korisnik moze da doda, edituje i brise employment history', async ({ inactiveDriverSetup }) => {
    await inactiveDriverSetup.clickElement(inactiveDriverSetup.employmentHistoryIcon.nth(2));
    inactiveDriverSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.v-menu__content .mdi-delete';
    try {
        await inactiveDriverSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await inactiveDriverSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await inactiveDriverSetup.page.locator(deleteSelector).count();
            await inactiveDriverSetup.page.locator(deleteSelector).first().click();
            await inactiveDriverSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await inactiveDriverSetup.clickElement(inactiveDriverSetup.addEmploymentHistoryButton);
    await inactiveDriverSetup.selectDateFromDatapicker(inactiveDriverSetup.terminatedDate, inactiveDriverSetup.currentDataInModal);
    await inactiveDriverSetup.clickElement(inactiveDriverSetup.addButtonInModal);
    await inactiveDriverSetup.dialogbox.waitFor({ state: "detached", timeout: 10000 });
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    await expect(inactiveDriverSetup.historyList).toContainText("Terminated: " + formattedDate);
    await inactiveDriverSetup.editIconInModal.click();
    await inactiveDriverSetup.selectDateFromDatapicker(inactiveDriverSetup.terminatedDate, inactiveDriverSetup.page.getByRole('button', { name: '28', exact: true }));
    await inactiveDriverSetup.clickElement(inactiveDriverSetup.editButtonInModal);
    await expect(inactiveDriverSetup.historyList).toContainText("Terminated: " + year + '-' + month + '-' + '28');
    await inactiveDriverSetup.deleteIconInModal.click();
    await expect(inactiveDriverSetup.historyList).not.toBeVisible();
});

test('korisnik moze da pretrazuje drivere po imenu', async ({ inactiveDriverSetup }) => {
    const [response] = await Promise.all([
        inactiveDriverSetup.page.waitForResponse(res =>
            res.url().includes('/api/drivers')
        ),
        await inactiveDriverSetup.enterDriverNameInSearchField(inactiveDriverSetup.searchInputField, Constants.markLabatDriver)
    ]);
    expect([200, 304]).toContain(response.status());
    const driverNumber = await inactiveDriverSetup.driverNameColumn.all();
    for (let i = 0; i < driverNumber.length; i++) {
        const text = await inactiveDriverSetup.driverNameColumn.nth(i).innerText();
        expect(text.trim()).toContain(Constants.markLabatDriver);
    }
});