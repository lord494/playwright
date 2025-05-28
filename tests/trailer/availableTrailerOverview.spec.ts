import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { AvailableTrailersPage } from '../../page/trailer/availableTrailer.page';

test.use({ storageState: 'auth.json' });

let page: Page;

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.availableTrailerUrl)
    await page.waitForLoadState('networkidle');
});

test('Korisnik moze da pretrazuje trailer po kompaniji', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await page.waitForLoadState('networkidle');
    await availableTrailer.selectCompanyFromMenu(availableTrailer.companyFilter, availableTrailer.testCompanyOption);
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(7)', { hasText: Constants.testCompany })
    });
    await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await availableTrailer.companyNameColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailer.companyNameColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.testCompany);
    }
});

test('Korisnik moze da pretrazuje trailer po statusu', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await page.waitForLoadState('networkidle');
    await availableTrailer.selectStatusFromStatusMenu(availableTrailer.statusFilter.last(), availableTrailer.stolenStatusOption);
    await page.waitForLoadState('networkidle');
    await expect(availableTrailer.statusColumn.first()).toContainText(Constants.stolenStatus, { timeout: 5000 });
    const count = await availableTrailer.statusColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailer.statusColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.stolenStatus);
    }
});

test('Korisnik moze da pretrazuje trailer po yardi', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await page.waitForLoadState('networkidle');
    await availableTrailer.selectYardFromStatusMenu(availableTrailer.yardFilter, availableTrailer.novaYardaOption);
    await page.waitForLoadState('networkidle');
    await expect(availableTrailer.yardColumn.first()).toContainText(Constants.novaYarda, { timeout: 5000 });
    const count = await availableTrailer.yardColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailer.yardColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.novaYarda);
    }
});

test('Korisnik moze da pretrazuje trailer po broju trailera', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await page.waitForLoadState('networkidle');
    await availableTrailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await availableTrailer.enterTrailerName(availableTrailer.trailerNumberFilter, Constants.availableTrailer);
    await page.waitForLoadState('networkidle');
    await availableTrailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    const targetRow = page.locator('tr', {
        has: page.locator('td:nth-child(1)', { hasText: Constants.availableTrailer })
    });
    await page.waitForLoadState('networkidle');
    await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await availableTrailer.trailerNameColumn.count();
    let found = false;
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailer.trailerNameColumn.nth(i).textContent();
        if (cellText?.trim() === Constants.availableTrailer) {
            found = true;
            break;
        }
    }
    expect(found).toBe(true);
});

test('Korisnik moze da pretrazuje trailer po driver name', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await page.waitForLoadState('networkidle');
    await availableTrailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await availableTrailer.enterDriverName(availableTrailer.driverNameFilter, Constants.driverName);
    await page.waitForLoadState('networkidle');
    await availableTrailer.driverNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForLoadState('networkidle');
    const count = await availableTrailer.driverNameColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailer.driverNameColumn.nth(i).textContent();
        expect(cellText?.trim()).toContain(Constants.driverName);
    }
});

test('Korisnik moze da otvori trailer history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.trailerNameColumn.first());
    await expect(availableTrailer.trailerAndTruckHistoryModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori truck history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await page.waitForLoadState('networkidle');
    await availableTrailer.clickElement(availableTrailer.reloadIconInTruckColumn.first());
    await expect(availableTrailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori company history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.reloadIconInCompanyColumn.first());
    await expect(availableTrailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori plate history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.reloadIconInPlateColumn.first());
    await expect(availableTrailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori temp plate exp history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.reloadIconInTempPlateExp.first());
    await expect(availableTrailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori info modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.infoColumn.first());
    await expect(availableTrailer.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori note modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.notesColumn.first());
    await expect(availableTrailer.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori RENT/BUY history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.reloadIconOnRentBuyColumn.first());
    await expect(availableTrailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori phone history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.reloadIconInPhoneColumn.first());
    await expect(availableTrailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori Location/Yard history modal', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.reloadIconInLocationColumn.first());
    await expect(availableTrailer.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da doda trailer history', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.truckColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await availableTrailer.clickElement(availableTrailer.trailerNameColumn.first());
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
    await availableTrailer.clickElement(availableTrailer.addHistoryButton);
    await availableTrailer.selectTruckInTrailerModal(availableTrailer.truckFieldInTrailerModal, Constants.truckName, availableTrailer.truckOptionFromMenu);
    await availableTrailer.fromFieldModal.click();
    await availableTrailer.currentDate.first().click();
    await page.waitForTimeout(1000);
    await availableTrailer.toFieldModal.click();
    await availableTrailer.currentDate.last().click();
    await availableTrailer.addButtonInModal.last().click();
    await page.locator('.v-dialog.v-dialog--active.v-dialog--persistent').waitFor({ state: 'detached', timeout: 5000 });
    await expect(availableTrailer.snackbar).toContainText('Trailer history successfully added');
});

test('Korisnik moze da otvori edit modal iz trailer history', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.trailerNameColumn.first());
    await availableTrailer.clickElement(availableTrailer.editTrailerButtonInTrailerHistory);
    await expect(availableTrailer.activeDialogbox).toBeVisible();
});

test('Korisnik moze da doda, edituje i brise company history', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.reloadIconInCompanyColumn.nth(3));
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
    await availableTrailer.clickElement(availableTrailer.addHistoryButtonModal);
    await availableTrailer.enterOldState(availableTrailer.oldState, Constants.oldStateValue);
    await availableTrailer.enterNewState(availableTrailer.newState, Constants.newStateValue);
    await availableTrailer.dateOfChanged.click();
    await availableTrailer.currentDate.click();
    await availableTrailer.clickSaveButton();
    await availableTrailer.activeDialogbox.waitFor({ state: 'detached' });
    await expect(availableTrailer.changedCompanyTitle).toContainText('from ' + Constants.oldStateValue + ' to ' + Constants.newStateValue);
    await availableTrailer.pencilIconInModal.click();
    await availableTrailer.newState.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await availableTrailer.enterNewState(availableTrailer.newState, 'edit new state');
    await availableTrailer.clickSaveButton();
    await expect(availableTrailer.changedCompanyTitle).toContainText('from ' + Constants.oldStateValue + ' to ' + 'edit new state');
    await page.click(deleteSelector);
    await expect(page.locator('text=No field history ...')).toBeVisible();
});

test('Korisnik moze da doda, edituje i brise info', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.infoColumn.nth(3));
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
    await availableTrailer.clickElement(availableTrailer.cancelButton);
    await availableTrailer.clickElement(availableTrailer.infoColumn.nth(3));
    await availableTrailer.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await availableTrailer.clickSaveButton();
    await page.waitForLoadState('networkidle');
    await availableTrailer.clickElement(availableTrailer.commentPencilIcon);
    await availableTrailer.commentInput.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await availableTrailer.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await availableTrailer.clickElement(availableTrailer.editButton);
    await expect(availableTrailer.commentList).toContainText(Constants.oldStateValue);
    await page.click(deleteSelector);
});

test('Korisnik moze da doda, edituje i brise note', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.notesColumn.nth(4));
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
    await availableTrailer.clickElement(availableTrailer.cancelButton);
    await availableTrailer.clickElement(availableTrailer.notesColumn.nth(4));
    await availableTrailer.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await availableTrailer.clickSaveButton();
    await page.waitForLoadState('networkidle');
    await availableTrailer.clickElement(availableTrailer.commentPencilIcon);
    await availableTrailer.commentInput.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await availableTrailer.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await availableTrailer.clickElement(availableTrailer.editButton);
    await expect(availableTrailer.commentList).toContainText(Constants.oldStateValue);
    await page.click(deleteSelector);
});

test('Korisnik moze da otvori stats', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.statsButton);
    await expect(page).toHaveURL(/stats/);
});

test('Korisnik moze da otvori trailer', async ({ page }) => {
    const availableTrailer = new AvailableTrailersPage(page);
    await availableTrailer.clickElement(availableTrailer.allTrailersButton);
    await expect(page).toHaveURL(/trailers/);
});