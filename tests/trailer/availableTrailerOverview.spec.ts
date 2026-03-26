import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

// test.use({ storageState: 'auth.json' });

// test.beforeEach(async ({ page }) => {
//     const availableTrailer = new AvailableTrailersPage(page);
//     await page.goto(Constants.availableTrailerUrl, { waitUntil: 'networkidle' })
//     await availableTrailer.companyNameColumn.first().waitFor({ state: 'visible', timeout: 10000 });
// });

// test('Korisnik moze da pretrazuje trailer po kompaniji', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.selectCompanyFromMenu(availableTrailerSetup.companyFilter, availableTrailerSetup.testCompanyOption);
//     const targetRow = availableTrailerSetup.page.locator('tr', {
//         has: availableTrailerSetup.page.locator('td:nth-child(7)', { hasText: Constants.testCompany })
//     });
//     await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
//     const count = await availableTrailerSetup.ownerThirdPartyColumn.count();
//     for (let i = 0; i < count; i++) {
//         const cellText = await availableTrailerSetup.ownerThirdPartyColumn.nth(i).textContent();
//         expect(cellText?.trim()).toBe(Constants.testCompany);
//     }
// });

// test('Korisnik moze da pretrazuje trailer po statusu', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.selectStatusFromStatusMenu(availableTrailerSetup.statusFilter.last(), availableTrailerSetup.stolenStatusOption);
//     await availableTrailerSetup.page.waitForLoadState('networkidle');
//     await expect(availableTrailerSetup.statusColumn.first()).toContainText(Constants.stolenStatus, { timeout: 5000 });
//     const count = await availableTrailerSetup.statusColumn.count();
//     for (let i = 0; i < count; i++) {
//         const cellText = await availableTrailerSetup.statusColumn.nth(i).textContent();
//         expect(cellText?.trim()).toBe(Constants.stolenStatus);
//     }
// });

test('Korisnik moze da pretrazuje trailer po yardi', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.selectYardFromStatusMenu(availableTrailerSetup.yardFilter, availableTrailerSetup.novaYardaOption);
    await availableTrailerSetup.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304);
    const count = await availableTrailerSetup.yardColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailerSetup.yardColumn.nth(i).textContent();
        expect(cellText?.trim()).toBe(Constants.novaYarda);
    }
});

test('Korisnik moze da pretrazuje trailer po broju trailera', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.page.waitForLoadState('networkidle');
    await availableTrailerSetup.driverThirdPartyColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await availableTrailerSetup.enterTrailerName(availableTrailerSetup.trailerNumberFilter, Constants.availableTrailer);
    await availableTrailerSetup.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304, { timeout: 10000 });
    const targetRow = availableTrailerSetup.page.locator('tr', {
        has: availableTrailerSetup.page.locator('td:nth-child(1)', { hasText: Constants.availableTrailer })
    });
    await targetRow.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await availableTrailerSetup.trailerNameColumn.count();
    let found = false;
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailerSetup.trailerNameColumn.nth(i).textContent();
        if (cellText?.trim() === Constants.availableTrailer) {
            found = true;
            break;
        }
    }
    expect(found).toBe(true);
});

test('Korisnik moze da pretrazuje trailer po driver name', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.page.waitForLoadState('networkidle');
    await availableTrailerSetup.driverThirdPartyColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await availableTrailerSetup.enterDriverName(availableTrailerSetup.driverNameFilter, Constants.driverNameAvTrailer);
    await availableTrailerSetup.page.waitForResponse(response => response.url().includes('/api/trailers') && response.status() == 200 || response.status() == 304, { timeout: 10000 });
    const count = await availableTrailerSetup.driverThirdPartyColumn.count();
    for (let i = 0; i < count; i++) {
        const cellText = await availableTrailerSetup.driverThirdPartyColumn.nth(i).textContent();
        expect(cellText?.trim()).toContain(Constants.driverNameAvTrailer);
    }
});

// test('Korisnik moze da otvori trailer history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.trailerNameColumn.first());
//     await expect(availableTrailerSetup.trailerAndTruckHistoryModal).toBeVisible({ timeout: 3000 });
// });

// test('Korisnik moze da otvori truck history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.page.waitForLoadState('networkidle');
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconInTruckColumn.first());
//     await expect(availableTrailerSetup.historyModal).toBeVisible({ timeout: 3000 });
// });

// test('Korisnik moze da otvori company history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconInCompanyColumn.first());
//     await expect(availableTrailerSetup.historyModal).toBeVisible({ timeout: 3000 });
// });

// test('Korisnik moze da otvori plate history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconInPlateColumn.first());
//     await expect(availableTrailerSetup.historyModal).toBeVisible({ timeout: 3000 });
// });

// test('Korisnik moze da otvori temp plate exp history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconInTempPlateExp.first());
//     await expect(availableTrailerSetup.historyModal).toBeVisible({ timeout: 3000 });
// });

test('Korisnik moze da otvori info modal', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.clickElement(availableTrailerSetup.infoColumn.first());
    await expect(availableTrailerSetup.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

test('Korisnik moze da otvori note modal', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.clickElement(availableTrailerSetup.notesColumn.first());
    await expect(availableTrailerSetup.infoAndNoteModal).toBeVisible({ timeout: 3000 });
});

// test('Korisnik moze da otvori RENT/BUY history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconOnRentBuyColumn.first());
//     await expect(availableTrailerSetup.historyModal).toBeVisible({ timeout: 3000 });
// });

// test('Korisnik moze da otvori phone history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconInPhoneColumn.first());
//     await expect(availableTrailerSetup.historyModal).toBeVisible({ timeout: 3000 });
// });

// test('Korisnik moze da otvori Location/Yard history modal', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconInLocationColumn.first());
//     await expect(availableTrailerSetup.historyModal).toBeVisible({ timeout: 3000 });
// });

// test('Korisnik moze da doda trailer history', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.truckColumn.first().waitFor({ state: 'visible', timeout: 10000 });
//     await availableTrailerSetup.clickElement(availableTrailerSetup.trailerNameColumn.first());
//     availableTrailerSetup.page.on('dialog', async (dialog) => {
//         await dialog.accept();
//     });
//     const deleteSelector = '.history-wraper.small .mdi.mdi-delete';
//     try {
//         await availableTrailerSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
//         while (await availableTrailerSetup.page.locator(deleteSelector).count() > 0) {
//             const previousCount = await availableTrailerSetup.page.locator(deleteSelector).count();
//             await availableTrailerSetup.page.locator(deleteSelector).first().click();
//             await availableTrailerSetup.page.waitForFunction(
//                 ({ selector, prevCount }) => {
//                     return document.querySelectorAll(selector).length < prevCount;
//                 },
//                 { selector: deleteSelector, prevCount: previousCount }
//             );
//         }
//     } catch (e) {
//     }
//     await availableTrailerSetup.clickElement(availableTrailerSetup.addHistoryButton);
//     await availableTrailerSetup.selectTruckInTrailerModal(availableTrailerSetup.truckFieldInTrailerModal, Constants.truckName, availableTrailerSetup.truckOptionFromMenu);
//     await availableTrailerSetup.fromFieldModal.click();
//     await availableTrailerSetup.currentDate.first().click();
//     await availableTrailerSetup.page.waitForTimeout(1000);
//     await availableTrailerSetup.toFieldModal.click();
//     await availableTrailerSetup.currentDate.last().click();
//     await availableTrailerSetup.addButtonInModal.last().click();
//     await availableTrailerSetup.page.locator('.v-dialog.v-dialog--active.v-dialog--persistent').waitFor({ state: 'detached', timeout: 5000 });
//     await expect(availableTrailerSetup.snackbar).toContainText('Trailer history successfully added');
// });

// test('Korisnik moze da otvori edit modal iz trailer history', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.trailerNameColumn.first());
//     await availableTrailerSetup.clickElement(availableTrailerSetup.editTrailerButtonInTrailerHistory);
//     await expect(availableTrailerSetup.activeDialogbox).toBeVisible();
// });

// test('Korisnik moze da doda, edituje i brise company history', async ({ availableTrailerSetup }) => {
//     await availableTrailerSetup.clickElement(availableTrailerSetup.reloadIconInCompanyColumn.nth(3));
//     availableTrailerSetup.page.on('dialog', async (dialog) => {
//         await dialog.accept();
//     });
//     const deleteSelector = '.v-list.trailer-history .mdi.mdi-delete';
//     try {
//         await availableTrailerSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
//         while (await availableTrailerSetup.page.locator(deleteSelector).count() > 0) {
//             const previousCount = await availableTrailerSetup.page.locator(deleteSelector).count();
//             await availableTrailerSetup.page.locator(deleteSelector).first().click();
//             await availableTrailerSetup.page.waitForFunction(
//                 ({ selector, prevCount }) => {
//                     return document.querySelectorAll(selector).length < prevCount;
//                 },
//                 { selector: deleteSelector, prevCount: previousCount }
//             );
//         }
//     } catch (e) {
//     }
//     await availableTrailerSetup.clickElement(availableTrailerSetup.addHistoryButtonModal);
//     await availableTrailerSetup.enterOldState(availableTrailerSetup.oldState, Constants.oldStateValue);
//     await availableTrailerSetup.enterNewState(availableTrailerSetup.newState, Constants.newStateValue);
//     await availableTrailerSetup.dateOfChanged.click();
//     await availableTrailerSetup.currentDate.click();
//     await availableTrailerSetup.clickSaveButton();
//     await availableTrailerSetup.activeDialogbox.waitFor({ state: 'detached' });
//     await expect(availableTrailerSetup.changedCompanyTitle).toContainText('from ' + Constants.oldStateValue + ' to ' + Constants.newStateValue);
//     await availableTrailerSetup.pencilIconInModal.click();
//     await availableTrailerSetup.newState.click();
//     await availableTrailerSetup.page.keyboard.press('Control+A');
//     await availableTrailerSetup.page.keyboard.press('Backspace');
//     await availableTrailerSetup.enterNewState(availableTrailerSetup.newState, 'edit new state');
//     await availableTrailerSetup.clickSaveButton();
//     await expect(availableTrailerSetup.changedCompanyTitle).toContainText('from ' + Constants.oldStateValue + ' to ' + 'edit new state');
//     await availableTrailerSetup.page.click(deleteSelector);
//     await expect(availableTrailerSetup.page.locator('text=No field history ...')).toBeVisible();
// });

test('Korisnik moze da doda, edituje i brise info', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.clickElement(availableTrailerSetup.infoColumn.nth(3));
    availableTrailerSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.comments-wrapper .mdi.mdi-delete';
    try {
        await availableTrailerSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await availableTrailerSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await availableTrailerSetup.page.locator(deleteSelector).count();
            await availableTrailerSetup.page.locator(deleteSelector).first().click();
            await availableTrailerSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await availableTrailerSetup.clickElement(availableTrailerSetup.cancelButton);
    await availableTrailerSetup.clickElement(availableTrailerSetup.infoColumn.nth(3));
    await availableTrailerSetup.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await availableTrailerSetup.clickSaveButton();
    await availableTrailerSetup.page.waitForLoadState('networkidle');
    await availableTrailerSetup.clickElement(availableTrailerSetup.commentPencilIcon);
    await availableTrailerSetup.commentInput.click();
    await availableTrailerSetup.page.keyboard.press('Control+A');
    await availableTrailerSetup.page.keyboard.press('Backspace');
    await availableTrailerSetup.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await availableTrailerSetup.clickElement(availableTrailerSetup.editButton);
    await expect(availableTrailerSetup.commentList).toContainText(Constants.oldStateValue);
    await availableTrailerSetup.page.click(deleteSelector);
});

test('Korisnik moze da doda, edituje i brise note', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.clickElement(availableTrailerSetup.notesColumn.nth(4));
    availableTrailerSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const deleteSelector = '.comments-wrapper .mdi.mdi-delete';
    try {
        await availableTrailerSetup.page.locator(deleteSelector).first().waitFor({ state: 'visible', timeout: 3000 });
        while (await availableTrailerSetup.page.locator(deleteSelector).count() > 0) {
            const previousCount = await availableTrailerSetup.page.locator(deleteSelector).count();
            await availableTrailerSetup.page.locator(deleteSelector).first().click();
            await availableTrailerSetup.page.waitForFunction(
                ({ selector, prevCount }) => {
                    return document.querySelectorAll(selector).length < prevCount;
                },
                { selector: deleteSelector, prevCount: previousCount }
            );
        }
    } catch (e) {
    }
    await availableTrailerSetup.clickElement(availableTrailerSetup.cancelButton);
    await availableTrailerSetup.clickElement(availableTrailerSetup.notesColumn.nth(4));
    await availableTrailerSetup.enterNoteInInfoAndNoteModal(Constants.newStateValue);
    await availableTrailerSetup.clickSaveButton();
    await availableTrailerSetup.page.waitForLoadState('networkidle');
    await availableTrailerSetup.clickElement(availableTrailerSetup.commentPencilIcon);
    await availableTrailerSetup.commentInput.click();
    await availableTrailerSetup.page.keyboard.press('Control+A');
    await availableTrailerSetup.page.keyboard.press('Backspace');
    await availableTrailerSetup.enterNoteInInfoAndNoteModal(Constants.oldStateValue);
    await availableTrailerSetup.clickElement(availableTrailerSetup.editButton);
    await expect(availableTrailerSetup.commentList).toContainText(Constants.oldStateValue);
    await availableTrailerSetup.page.click(deleteSelector);
});

test('Korisnik moze da otvori stats', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.clickElement(availableTrailerSetup.statsButton);
    await expect(availableTrailerSetup.page).toHaveURL(/available-trailers-statistics/);
});

test('Korisnik moze da otvori trailer', async ({ availableTrailerSetup }) => {
    await availableTrailerSetup.clickElement(availableTrailerSetup.allTrailersButton);
    await expect(availableTrailerSetup.page).toHaveURL(/trailers/);
});
