import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { TrailersPage } from '../../page/trailer/trailer.page';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeEach(async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.goto(Constants.trailerUrl);
    await trailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da pretrazuje trailer po kompaniji', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    await trailer.selectCompanyFromMenu(trailer.companyFilter, trailer.testCompanyOption);
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(7)', { hasText: Constants.testCompany })
    });
    await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await trailer.companyNameColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await trailer.companyNameColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.testCompany);
    }
});

test('Korisnik moze da pretrazuje trailer po statusu', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    await trailer.selectStatusFromStatusMenu(trailer.statusFilter, trailer.stolenStatusOption);
    await page.waitForLoadState('networkidle');
    await expect(trailer.statusColumn.first()).toContainText(Constants.stolenStatus, { timeout: 5000 });
    const count = await trailer.statusColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await trailer.statusColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.stolenStatus);
    }
});

test('Korisnik moze da pretrazuje trailer po yardi', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    await trailer.selectYardFromStatusMenu(trailer.yardFilter, trailer.novaYardaOption);
    await page.waitForLoadState('networkidle');
    await expect(trailer.yardColumn.first()).toContainText(Constants.novaYarda, { timeout: 5000 });
    const count = await trailer.yardColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await trailer.yardColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.novaYarda);
    }
});

test('Korisnik moze da pretrazuje trailer po broju trailera', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    await trailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailer.enterTrailerName(trailer.trailerNumberFilter, Constants.trailerTest);
    await page.waitForLoadState('networkidle');
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(2)', { hasText: Constants.trailerTest })
    });
    await page.waitForLoadState('networkidle');
    await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await trailer.trailerNameColumn.count();
    let found = false;
    for (let i = 0; i < count; i++) {
        const cellText = await trailer.trailerNameColumn.nth(i).textContent();
        if (cellText?.trim() === Constants.trailerTest) {
            found = true;
            break;
        }
    }
    expect(found).toBe(true);
});

test('Korisnik moze da pretrazuje trailer po driver name', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    await trailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailer.enterDriverName(trailer.driverNameFilter, Constants.driverName);
    await page.waitForLoadState('networkidle');
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(5)', { hasText: Constants.driverName })
    });
    await page.waitForLoadState('networkidle');
    await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await trailer.driverNameColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await trailer.driverNameColumn.nth(i).textContent();
        expect(cellText?.trim()).toContain(Constants.driverName);
    }
});

test('Korisnik moze da pretrazuje trailer po Owneru', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    await trailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailer.enterOwnerrName(trailer.ownerFilter, Constants.ownerTrailer);
    await page.waitForLoadState('networkidle');
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(8)', { hasText: Constants.ownerTrailer })
    });
    await page.waitForLoadState('networkidle');
    await expect(trailer.ownerNameColumn.first()).toContainText(Constants.ownerTrailer, { timeout: 5000 });
    await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await trailer.ownerNameColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await trailer.ownerNameColumn.nth(i).textContent();
        expect(cellText?.trim()).toContain(Constants.ownerTrailer);
    }
});

test('Korisnik moze da pretrazuje trailer po Dealersihp', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    await trailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailer.enterDealershiprName(trailer.dealerShipFilter, Constants.dealership);
    await page.waitForLoadState('networkidle');
    await expect(trailer.dealershipColumn.first()).toContainText(Constants.dealership, { timeout: 5000 });
    const count = await trailer.dealershipColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await trailer.dealershipColumn.nth(i).textContent();
        expect(cellText?.trim()).toContain(Constants.dealership);
    }
});

test('Korisnik moze da otvori trailer history modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.trailerNameColumn.first());
    await expect(trailer.trailerAndTruckHistoryModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori truck history modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await page.waitForLoadState('networkidle');
    const count = await trailer.truckColumn.count();
    for (let i = 0; i < count; i++) {
        const cell = trailer.truckColumn.nth(i);
        const text = await cell.textContent();
        if (text && !text.includes('/')) {
            await cell.click();
            break;
        }
    };
    await expect(trailer.trailerAndTruckHistoryModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori company history modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.reloadIconInCompanyColumn.first());
    await expect(trailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori plate history modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.reloadIconInPlateColumn.first());
    await expect(trailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori temp plate exp history modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.reloadIconInTempPlateExp.first());
    await expect(trailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori annual dot history modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.annualDotColumn.first());
    await expect(trailer.annualDotInspectionModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori repairs history modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.repairsColumn.first());
    await expect(trailer.addRepairButton).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori info modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.infoColumn.first());
    await expect(trailer.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori note modal', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.notesColumn.first());
    await expect(trailer.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da doda trailer history', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.trailerNameColumn.first());
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.history-wraper.small .mdi.mdi-delete';
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
    await trailer.clickElement(trailer.addHistoryButton);
    await trailer.selectTruckInTrailerModal(trailer.truckFieldInTrailerModal, Constants.truckName, trailer.truckOptionFromMenu);
    const selectedDate = await trailer.selectExpiringDateInPastMonth();
    await trailer.toFieldModal.click();
    await trailer.currentDate.click();
    await trailer.addButton.last().click();
});

test('Korisnik moze da otvori edit modal iz trailer history', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.trailerNameColumn.first());
    await trailer.clickElement(trailer.editTrailerButtonInTrailerHistory);
    await expect(trailer.activeDialogbox).toBeVisible();
});

test('Korisnik moze da doda, edituje i brise company history', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.reloadIconInCompanyColumn.nth(3));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.v-list.trailer-history .mdi.mdi-delete';
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
    await trailer.clickElement(trailer.addHistoryButtonModal);
    await trailer.enterOldState(trailer.oldState, Constants.oldStateValue);
    await trailer.enterNewState(trailer.newState, Constants.newStateValue);
    await trailer.dateOfChanged.click();
    await trailer.currentDate.click();
    await trailer.clickSaveButton();
    await trailer.activeDialogbox.waitFor({ state: 'detached' });
    await expect(trailer.changedCompanyTitle).toContainText('from ' + Constants.oldStateValue + ' to ' + Constants.newStateValue);
    await trailer.pencilIconInModal.click();
    await trailer.newState.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await trailer.enterNewState(trailer.newState, 'edit new state');
    await trailer.clickSaveButton();
    await expect(trailer.changedCompanyTitle).toContainText('from ' + Constants.oldStateValue + ' to ' + 'edit new state');
    await page.click(deleteSelector);
    await expect(page.locator('text=No field history ...')).toBeVisible();
});

test('Korisnik moze da doda, edituje i brise repair history', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.repairsColumn.nth(3));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.trailer-repairs__content .mdi.mdi-delete';
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
    await trailer.clickElement(trailer.addRepairButton);
    await trailer.enterInvoiceNumber(trailer.invoiceNumber, Constants.invoiceNumber);
    await trailer.enterAmount(trailer.amount, Constants.amount);
    await trailer.enterState(trailer.state, Constants.state);
    await trailer.enterCity(trailer.city, Constants.city);
    await trailer.enterShopInfo(trailer.shopInfo, Constants.shopInfo);
    await trailer.clickElement(trailer.addButton.last());
    await trailer.activeDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await expect(trailer.repairCard).toContainText('Invoice number: ' + Constants.invoiceNumber);
    await expect(trailer.repairCard).toContainText('Amount: ' + Constants.amount);
    await expect(trailer.repairCard).toContainText('State: ' + Constants.state);
    await expect(trailer.repairCard).toContainText('City: ' + Constants.city);
    await expect(trailer.repairCard).toContainText('Shop info: ' + Constants.shopInfo);
});

test('Korisnik moze da doda, edituje i brise info', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.infoColumn.nth(3));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.comments-wrapper .mdi.mdi-delete';
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
    await trailer.clickElement(trailer.cancelButton);
    await page.locator('v-menu__content theme--light menuable__content__active').waitFor({ state: 'hidden', timeout: 5000 });
    await trailer.clickElement(trailer.infoColumn.nth(3));
    await trailer.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await trailer.clickSaveButton();
    await page.waitForLoadState('networkidle');
    await trailer.clickElement(trailer.commentPencilIcon);
    await trailer.commentInput.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await trailer.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await trailer.clickElement(trailer.editButton);
    await expect(trailer.commentList).toContainText(Constants.oldStateValue);
});

test('Korisnik moze da doda, edituje i brise note', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.notesColumn.nth(4));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.comments-wrapper .mdi.mdi-delete';
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
    await trailer.clickElement(trailer.cancelButton);
    await page.locator('v-menu__content theme--light menuable__content__active').waitFor({ state: 'hidden', timeout: 5000 });
    await trailer.clickElement(trailer.notesColumn.nth(4));
    await trailer.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await trailer.clickSaveButton();
    await page.waitForLoadState('networkidle');
    await trailer.clickElement(trailer.commentPencilIcon);
    await trailer.commentInput.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await trailer.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await trailer.clickElement(trailer.editButton);
    await expect(trailer.commentList).toContainText(Constants.oldStateValue);
});

test('Korisnik moze da doda, edituje i brise annual dot inspection', async ({ page }) => {
    const trailer = new TrailersPage(page);
    await trailer.clickElement(trailer.annualDotColumn.nth(1));
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await trailer.addAnnualDotButton.waitFor({ state: 'visible', timeout: 3000 });
    const deleteSelector = '.TrailerDotInspectionList__content .mdi.mdi-delete';
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
    await trailer.clickElement(trailer.addAnnualDotButton);
    await trailer.enterInvoiceNumber(trailer.invoiceNumber, Constants.invoiceNumber);
    await trailer.enterAmount(trailer.amount, Constants.amount);
    await trailer.enterState(trailer.state, Constants.state);
    await trailer.enterCity(trailer.city, Constants.city);
    await trailer.enterShopInfo(trailer.shopInfo, Constants.shopInfo);
    await trailer.clickElement(trailer.addButton.last());
    await trailer.activeDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await expect(trailer.annualdotInspectionModalCard).toContainText('Invoice number: ' + Constants.invoiceNumber);
    await expect(trailer.annualdotInspectionModalCard).toContainText('Amount: ' + Constants.amount);
    await expect(trailer.annualdotInspectionModalCard).toContainText('State: ' + Constants.state);
    await expect(trailer.annualdotInspectionModalCard).toContainText('City: ' + Constants.city);
    await expect(trailer.annualdotInspectionModalCard).toContainText('Shop info: ' + Constants.shopInfo);
});