import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da pretrazuje trailer po kompaniji', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverviewSetup.waitForTrailersResponse(() =>
        trailerOverviewSetup.selectCompanyFromMenu(trailerOverviewSetup.companyFilter, trailerOverviewSetup.testCompanyOption));
    // Every filtered row must belong to the searched company.
    await trailerOverviewSetup.expectEveryCellMatches(trailerOverviewSetup.companyNameColumn, t => t === Constants.testCompany);
});

test('Korisnik moze da pretrazuje trailer po statusu', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverviewSetup.waitForTrailersResponse(() =>
        trailerOverviewSetup.selectStatusFromStatusMenu(trailerOverviewSetup.statusFilter, trailerOverviewSetup.stolenStatusOption));
    await trailerOverviewSetup.expectEveryCellMatches(trailerOverviewSetup.statusColumn, t => t === Constants.stolenStatus);
});

test('Korisnik moze da pretrazuje trailer po broju trailera', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverviewSetup.waitForTrailersResponse(() =>
        trailerOverviewSetup.enterTrailerName(trailerOverviewSetup.trailerNumberFilter, Constants.trailerTest));
    // Number filter matches on number OR VIN, so assert the searched trailer is present.
    await expect(trailerOverviewSetup.getRowByTrailerNumber(Constants.trailerTest).first()).toBeVisible({ timeout: 15000 });
});

test('Korisnik moze da pretrazuje trailer po driver name', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverviewSetup.waitForTrailersResponse(() =>
        trailerOverviewSetup.enterDriverName(trailerOverviewSetup.driverNameFilter, Constants.driverName));
    // Every filtered row's driver column must contain the searched driver name.
    await trailerOverviewSetup.expectEveryCellMatches(trailerOverviewSetup.driverNameColumn, t => t.includes(Constants.driverName));
});

test('Korisnik moze da pretrazuje trailer po Owneru', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverviewSetup.waitForTrailersResponse(() =>
        trailerOverviewSetup.enterOwnerrName(trailerOverviewSetup.ownerFilter, Constants.ownerTrailer));
    await trailerOverviewSetup.expectEveryCellMatches(trailerOverviewSetup.ownerNameColumn, t => t.includes(Constants.ownerTrailer));
});

test('Korisnik moze da pretrazuje trailer po Dealersihp', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await trailerOverviewSetup.waitForTrailersResponse(() =>
        trailerOverviewSetup.enterDealershiprName(trailerOverviewSetup.dealerShipFilter, Constants.dealership));
    await trailerOverviewSetup.expectEveryCellMatches(trailerOverviewSetup.dealershipColumn, t => t.includes(Constants.dealership));
});

test('Korisnik moze da otvori trailer history modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.trailerNameColumn.first());
    await expect(trailerOverviewSetup.trailerAndTruckHistoryModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori truck history modal', async ({ trailerOverviewSetup }) => {
    const count = await trailerOverviewSetup.truckColumn.count();
    for (let i = 0; i < count; i++) {
        const cell = trailerOverviewSetup.truckColumn.nth(i);
        const text = await cell.textContent();
        if (text && !text.includes('/')) {
            await cell.click();
            break;
        }
    };
    await expect(trailerOverviewSetup.trailerAndTruckHistoryModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori company history modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.reloadIconInCompanyColumn.first());
    await expect(trailerOverviewSetup.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori plate history modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.reloadIconInPlateColumn.first());
    await expect(trailerOverviewSetup.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori temp plate exp history modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.reloadIconInTempPlateExp.first());
    await expect(trailerOverviewSetup.historyModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori annual dot history modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.annualDotColumn.first());
    await expect(trailerOverviewSetup.annualDotInspectionModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori repairs history modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.repairsColumn.first());
    await expect(trailerOverviewSetup.addRepairButton).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori info modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.infoColumn.first());
    await expect(trailerOverviewSetup.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori note modal', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.notesColumn.first());
    await expect(trailerOverviewSetup.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da doda trailer history', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.trailerNameColumn.first());
    trailerOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.history-wraper.small .mdi.mdi-delete';
    try {
        await trailerOverviewSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await trailerOverviewSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await trailerOverviewSetup.page.locator(deleteSelector).count();
            await trailerOverviewSetup.page.locator(deleteSelector).first().click();
            await trailerOverviewSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addHistoryButton);
    await trailerOverviewSetup.selectTruckInTrailerModal(trailerOverviewSetup.truckFieldInTrailerModal, Constants.truckName, trailerOverviewSetup.truckOptionFromMenu);
    const selectedDate = await trailerOverviewSetup.selectExpiringDateInPastMonth();
    await trailerOverviewSetup.toFieldModal.click();
    await trailerOverviewSetup.currentDate.click();
    await trailerOverviewSetup.addButton.last().click();
});

test('Korisnik moze da otvori edit modal iz trailer history', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.trailerNameColumn.first());
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.editTrailerButtonInTrailerHistory);
    await expect(trailerOverviewSetup.activeDialogbox).toBeVisible();
});

test('Korisnik moze da doda, edituje i brise company history', async ({ createdTrailer, trailerOverview }) => {
    // Use a freshly-created, worker-unique trailer: it has ZERO company-history entries, so
    // the add/edit/delete assertions match exactly this run's entry. The previous version
    // used nth(3) of a shared trailer whose history accumulated across runs (deletes are
    // client-side) and shifted as other workers added trailers — both made it flaky.
    await trailerOverview.openCompanyHistoryForRow(createdTrailer.number);
    await trailerOverview.clickElement(trailerOverview.addHistoryButtonModal);
    await trailerOverview.enterOldState(trailerOverview.oldState, Constants.oldStateValue);
    await trailerOverview.enterNewState(trailerOverview.newState, Constants.newStateValue);
    await trailerOverview.dateOfChanged.click();
    await trailerOverview.currentDate.click();
    await trailerOverview.clickSaveButton();
    await trailerOverview.activeDialogbox.waitFor({ state: 'detached' });
    await expect(trailerOverview.changedCompanyTitle.first()).toContainText('from ' + Constants.oldStateValue + ' to ' + Constants.newStateValue);
    await trailerOverview.pencilIconInModal.first().click();
    await trailerOverview.newState.click();
    await trailerOverview.page.keyboard.press('Control+A');
    await trailerOverview.page.keyboard.press('Backspace');
    await trailerOverview.enterNewState(trailerOverview.newState, 'edit new state');
    await trailerOverview.clickSaveButton();
    await expect(trailerOverview.changedCompanyTitle.first()).toContainText('from ' + Constants.oldStateValue + ' to ' + 'edit new state');
    await trailerOverview.page.locator('.v-list.trailer-history .mdi.mdi-delete').first().click();
    await expect(trailerOverview.page.locator('text=No field history ...')).toBeVisible();
});

test('Korisnik moze da doda, edituje i brise repair history', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.repairsColumn.nth(3));
    trailerOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.trailer-repairs__content .mdi.mdi-delete';
    try {
        await trailerOverviewSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await trailerOverviewSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await trailerOverviewSetup.page.locator(deleteSelector).count();
            await trailerOverviewSetup.page.locator(deleteSelector).first().click();
            await trailerOverviewSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addRepairButton);
    await trailerOverviewSetup.enterInvoiceNumber(trailerOverviewSetup.invoiceNumber, Constants.invoiceNumber);
    await trailerOverviewSetup.enterAmount(trailerOverviewSetup.amount, Constants.amount);
    await trailerOverviewSetup.enterState(trailerOverviewSetup.state, Constants.state);
    await trailerOverviewSetup.enterCity(trailerOverviewSetup.city, Constants.city);
    await trailerOverviewSetup.enterShopInfo(trailerOverviewSetup.shopInfo, Constants.shopInfo);
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addButton.last());
    await trailerOverviewSetup.activeDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await expect(trailerOverviewSetup.repairCard).toContainText('Invoice number: ' + Constants.invoiceNumber);
    await expect(trailerOverviewSetup.repairCard).toContainText('Amount: ' + Constants.amount);
    await expect(trailerOverviewSetup.repairCard).toContainText('State: ' + Constants.state);
    await expect(trailerOverviewSetup.repairCard).toContainText('City: ' + Constants.city);
    await expect(trailerOverviewSetup.repairCard).toContainText('Shop info: ' + Constants.shopInfo);
});

test('Korisnik moze da doda, edituje i brise info', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.infoColumn.nth(3));
    trailerOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.comments-wrapper .mdi.mdi-delete';
    try {
        await trailerOverviewSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await trailerOverviewSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await trailerOverviewSetup.page.locator(deleteSelector).count();
            await trailerOverviewSetup.page.locator(deleteSelector).first().click();
            await trailerOverviewSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.cancelButton);
    await trailerOverviewSetup.page.locator('v-menu__content theme--light menuable__content__active').waitFor({ state: 'hidden', timeout: 5000 });
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.infoColumn.nth(3));
    await trailerOverviewSetup.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await trailerOverviewSetup.clickSaveButton();
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.commentPencilIcon);
    await trailerOverviewSetup.commentInput.click();
    await trailerOverviewSetup.page.keyboard.press('Control+A');
    await trailerOverviewSetup.page.keyboard.press('Backspace');
    await trailerOverviewSetup.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.editButton);
    await expect(trailerOverviewSetup.commentList).toContainText(Constants.oldStateValue);
});

test('Korisnik moze da doda, edituje i brise note', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.notesColumn.nth(4));
    trailerOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.comments-wrapper .mdi.mdi-delete';
    try {
        await trailerOverviewSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await trailerOverviewSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await trailerOverviewSetup.page.locator(deleteSelector).count();
            await trailerOverviewSetup.page.locator(deleteSelector).first().click();
            await trailerOverviewSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.cancelButton);
    await trailerOverviewSetup.page.locator('v-menu__content theme--light menuable__content__active').waitFor({ state: 'hidden', timeout: 5000 });
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.notesColumn.nth(4));
    await trailerOverviewSetup.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await trailerOverviewSetup.clickSaveButton();
    await trailerOverviewSetup.page.waitForLoadState('networkidle');
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.commentPencilIcon);
    await trailerOverviewSetup.commentInput.click();
    await trailerOverviewSetup.page.keyboard.press('Control+A');
    await trailerOverviewSetup.page.keyboard.press('Backspace');
    await trailerOverviewSetup.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.editButton);
    await expect(trailerOverviewSetup.commentList).toContainText(Constants.oldStateValue);
});

test('Korisnik moze da doda, edituje i brise annual dot inspection', async ({ trailerOverviewSetup }) => {
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.annualDotColumn.nth(1));
    trailerOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await trailerOverviewSetup.addAnnualDotButton.waitFor({ state: 'visible', timeout: 3000 });
    const deleteSelector = '.TrailerDotInspectionList__content .mdi.mdi-delete';
    try {
        await trailerOverviewSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await trailerOverviewSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await trailerOverviewSetup.page.locator(deleteSelector).count();
            await trailerOverviewSetup.page.locator(deleteSelector).first().click();
            await trailerOverviewSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addAnnualDotButton);
    await trailerOverviewSetup.enterInvoiceNumber(trailerOverviewSetup.invoiceNumber, Constants.invoiceNumber);
    await trailerOverviewSetup.enterAmount(trailerOverviewSetup.amount, Constants.amount);
    await trailerOverviewSetup.enterState(trailerOverviewSetup.state, Constants.state);
    await trailerOverviewSetup.enterCity(trailerOverviewSetup.city, Constants.city);
    await trailerOverviewSetup.enterShopInfo(trailerOverviewSetup.shopInfo, Constants.shopInfo);
    await trailerOverviewSetup.clickElement(trailerOverviewSetup.addButton.last());
    await trailerOverviewSetup.activeDialogbox.waitFor({ state: 'detached', timeout: 5000 });
    await expect(trailerOverviewSetup.annualdotInspectionModalCard).toContainText('Invoice number: ' + Constants.invoiceNumber);
    await expect(trailerOverviewSetup.annualdotInspectionModalCard).toContainText('Amount: ' + Constants.amount);
    await expect(trailerOverviewSetup.annualdotInspectionModalCard).toContainText('State: ' + Constants.state);
    await expect(trailerOverviewSetup.annualdotInspectionModalCard).toContainText('City: ' + Constants.city);
    await expect(trailerOverviewSetup.annualdotInspectionModalCard).toContainText('Shop info: ' + Constants.shopInfo);
});
