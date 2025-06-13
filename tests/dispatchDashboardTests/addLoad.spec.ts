import { test, expect } from '@playwright/test';
import { DispatchDashboardOverview } from '../../page/dispatchDashboard/dispatchDashboardOverview.page';
import { Constants } from '../../helpers/constants';
import { AddAndEditLoadModal } from '../../page/dispatchDashboard/addAndEditLoad.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await page.goto(Constants.dashboardUrl);
    await page.waitForLoadState('networkidle');
    await dashboard.loadColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await dashboard.fillInputField(dashboard.nameSearchInput, Constants.driverName);
    const nameText = dashboard.driverNameColumn.filter({ hasText: Constants.driverName });
    await nameText.waitFor({ state: 'visible', timeout: 5000 });
    const text = await dashboard.loadColumn.first().textContent();
    page.on('dialog', async (dialog: { accept: () => any; }) => {
        await dialog.accept();
    });
    if (text && text.trim() !== '') {
        await dashboard.loadColumn.first().click({ button: "right" });
        await addLoad.deleteLoadButton.click();
        await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
        await expect(dashboard.loadColumn.first()).toHaveText('');
    }
    await dashboard.loadColumn.first().click({ button: "right" });
});

test('Korisnik moze da doda load ako popuni samo Deliver city polje i "Default" load type je izabran po dafault-u', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.defaultLoad);
    await expect(bgColor).toBe(Constants.defauktLoadColor);
    await expect(dashboard.loadColumn.first()).toContainText(Constants.deliveryCity);
});

test('Korisnik moze da doda "Empty, Need Load" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.emptyNeedLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.emptyNeedLoad);
    await expect(bgColor).toBe(Constants.emptyNeedLoadColor);
});

test('Korisnik moze da doda "Loaded" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.loadedLoad)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadedLoad);
    await expect(bgColor).toBe(Constants.loadedLoadColor);
});

test('Korisnik moze da doda "Dispatched, not Loaded" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.dispatcherNotLoadedLoad)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.dispatchedNotLoaded);
    await expect(bgColor).toBe(Constants.dispatchedNotLoadedColor);
});

test('Korisnik moze da doda "Load problem" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.loadProblemLoad)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadProblemLoad);
    await expect(bgColor).toBe(Constants.loadProblemLoadColor);
});

test('Korisnik moze da doda "Broken" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.brokenLoad)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.brokenLoad);
    await expect(bgColor).toBe(Constants.brokenLoadColor);
});

test('Korisnik moze da doda "Special note" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.specialNote)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.specialNoteLoad);
    await expect(bgColor).toBe(Constants.specialNoteLoadColor);
});

test('Korisnik moze da doda "PM SERVICE" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.pmService)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.pmServiceLoad);
    await expect(bgColor).toBe(Constants.pmServiceLoadColor);
});

test('Korisnik moze da doda "Repo" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.repoLoad)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.repoLoad);
    await expect(bgColor).toBe(Constants.repoLoadColor);
});

test('Korisnik moze da doda "L.O.T.R" load', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.lotrLoad)
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.lotrLoad);
    await expect(bgColor).toBe(Constants.lotrLoadColor);
});

test('Korisnik moze da cekira "dedicated load" checkbox', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.check(addLoad.dedicatetLoadCheckbox);
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.dedicatedIcon.first().getAttribute('title');
    await expect(dashboard.dedicatedIcon.first()).toBeVisible();
    await expect(title).toContain(Constants.dedicatedLoad);
});

test('Datumi u proslosti su onemoguceni (disabled)', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 6);
    const pastDateDay = pastDate.getDate();
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.hometimeAbsence);
    await addLoad.dateField.click();
    const pastDateElement = page.locator(`.v-btn.v-btn--flat.v-btn--text.v-btn--rounded.v-btn--disabled:has-text("${pastDateDay}")`);
    await pastDateElement.waitFor({ state: 'visible', timeout: 5000 });
    await expect(pastDateElement).toHaveClass(/v-btn--disabled/);
});

test('Korisnik moze da izabere datume koji su u buducnosti u odnosu na selektovani datum', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.hometimeAbsence);
    await addLoad.dateField.click();
    const dateText = await addLoad.selectedDate.textContent();
    const selectedDay = parseInt(dateText?.trim() || '0', 10);
    const futureDate = new Date();
    futureDate.setDate(selectedDay + 1);
    const futureDateDay = futureDate.getDate();
    const day = String(futureDateDay).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const year = futureDate.getFullYear();
    const formattedFutureDate = `${month}/${day}/${year}`;
    const futureDateButton = page.locator(`.v-btn__content:has-text("${futureDateDay}")`);
    await futureDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await futureDateButton.first().click();
    await addLoad.okButtonInDatePicker.click();
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    await expect(title).toContain(formattedFutureDate.toString());
});

test('Korisnik moze da promjeni mjesec unaprijed kada klikne na desnu strelicu', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.hometimeAbsence);
    await addLoad.dateField.click();
    const headerLocator = await addLoad.headerDatePicker;
    const initialHeaderText = await headerLocator.textContent();
    const [initialMonthName, initialYear] = initialHeaderText?.split(' ') ?? [];
    const initialDate = new Date(`${initialMonthName} 1, ${initialYear}`);
    const initialMonthIndex = initialDate.getMonth();
    const expectedNextMonthIndex = (initialMonthIndex + 1) % 12;
    await await addLoad.rightArrowIconDatePicker.click();
    await page.waitForLoadState('networkidle');
    const newHeaderText = await headerLocator.textContent();
    const [newMonthName, newYear] = newHeaderText?.split(' ') ?? [];
    const newDate = new Date(`${newMonthName} 1, ${newYear}`);
    const newMonthIndex = newDate.getMonth();
    await expect(newMonthIndex).toBe(expectedNextMonthIndex);
    if (expectedNextMonthIndex === 0) {
        await expect(parseInt(newYear)).toBe(parseInt(initialYear) + 1);
    } else {
        await expect(parseInt(newYear)).toBe(parseInt(initialYear));
    }
});

test('Korisnik moze da promjeni mjesec unazad kada klikne na lijevu strelicu', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.hometimeAbsence);
    await addLoad.dateField.click();
    const headerLocator = await addLoad.headerDatePicker;
    const initialHeaderText = await headerLocator.textContent();
    const [initialMonthName, initialYear] = initialHeaderText?.split(' ') ?? [];
    const initialDate = new Date(`${initialMonthName} 1, ${initialYear}`);
    const initialMonthIndex = initialDate.getMonth();
    const expectedPrevMonthIndex = (initialMonthIndex - 1 + 12) % 12;
    await addLoad.leftArrowIconDatePicker.click();
    await page.waitForLoadState('networkidle');
    const newHeaderText = await headerLocator.textContent();
    const [newMonthName, newYear] = newHeaderText?.split(' ') ?? [];
    const newDate = new Date(`${newMonthName} 1, ${newYear}`);
    const newMonthIndex = newDate.getMonth();
    await expect(newMonthIndex).toBe(expectedPrevMonthIndex);
    if (expectedPrevMonthIndex === 11) {
        await expect(parseInt(newYear)).toBe(parseInt(initialYear) - 1);
    } else {
        await expect(parseInt(newYear)).toBe(parseInt(initialYear));
    }
});

test('Datum je po defaultu izabran kada izaberemo absence', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.hometimeAbsence);
    await addLoad.dateField.click();
    const dateText = await addLoad.selectedDate.textContent();
    const selectedDay = parseInt(dateText?.trim() || '0', 10);
    const defaultDate = new Date();
    defaultDate.setDate(selectedDay);
    const defaultMonth = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const defaultYear = defaultDate.getFullYear();
    const formattedDefaultDate = `${defaultMonth}/${selectedDay.toString().padStart(2, '0')}/${defaultYear}`;
    await addLoad.okButtonInDatePicker.click();
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dashboard.loadColumn.first().getAttribute('title');
    await expect(title).toContain("from " + formattedDefaultDate + " to " + formattedDefaultDate);
});

test("Korisnik moze da izabere 'Hometime' absence", async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.hometimeAbsence);
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(dashboard.loadColumn.first()).toContainText(Constants.hometimeAbsence);
});

test("Korisnik moze da izabere 'Vacation' absence", async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.vacationAbsence);
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(dashboard.loadColumn.first()).toContainText(Constants.vacationAbsence);
});

test("Korisnik moze da izabere 'Off' absence", async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.selectFromMenu(addLoad.typeOfAbsence, addLoad.offAbsence);
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(dashboard.loadColumn.first()).toContainText(Constants.offAbsence);
});

test("Korisnik moze da doda komentar", async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    await addLoad.enterComment(addLoad.commentTextfield, Constants.driverName, addLoad.addCommentButton);
    await page.waitForLoadState('networkidle');
    await expect(addLoad.comments).toContainText(Constants.driverName);
});

test("Korisnik moze da zatvori modal na Close button", async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    await addLoad.closeButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(addLoad.addLoadModal).not.toBeVisible();
});

test('Korisnik moze da doda "Empty, Need Load" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.emptyNeedLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.emptyNeedLoadFilter;
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.emptyNeedLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Loaded" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.loadedLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.loadedLoadFilter.first();
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.loadedLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Dispatched not loaded" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.dispatcherNotLoadedLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.dispatchedNotLoadedFilter;
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.dispatchedNotLoadedColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Load problem" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.loadProblemLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.loadProblemFilter;
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.loadProblemLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Broken" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.brokenLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.brokenLoadFilter.first();
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.brokenLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Special Note" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.specialNote);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.specialNoteFilter;
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.specialNoteLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "PM Setvice" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.pmService);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.pmServiceFilter;
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.pmServiceLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Repo" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.repoLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.repoFilter;
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.repoLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "LOTR" load i provjeri filter load-a', async ({ page }) => {
    const addLoad = new AddAndEditLoadModal(page);
    const dashboard = new DispatchDashboardOverview(page);
    await addLoad.fillAndSelectOption(addLoad.deliveryCityLabel, Constants.deliveryCity, addLoad.deliveryCity);
    await page.waitForLoadState("networkidle");
    await addLoad.selectFromMenu(addLoad.loadType, addLoad.lotrLoad);
    await page.waitForLoadState("networkidle");
    await addLoad.saveButton.click();
    await addLoad.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoad.lotrFilter;
    await filterButton.click();
    await page.waitForTimeout(1000);
    const fields = await dashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.lotrLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});