import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda load ako popuni samo Deliver city polje i "Default" load type je izabran po dafault-u', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.defaultLoad);
    await expect(bgColor).toBe(Constants.defauktLoadColor);
    await expect(dispatcDashboard.loadColumn.first()).toContainText(Constants.deliveryCity);
});

test('Korisnik moze da doda "Empty, Need Load" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.emptyNeedLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.emptyNeedLoad);
    await expect(bgColor).toBe(Constants.emptyNeedLoadColor);
});

test('Korisnik moze da doda "Loaded" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.loadedLoad)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadedLoad);
    await expect(bgColor).toBe(Constants.loadedLoadColor);
});

test('Korisnik moze da doda "Dispatched, not Loaded" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.dispatcherNotLoadedLoad)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.dispatchedNotLoaded);
    await expect(bgColor).toBe(Constants.dispatchedNotLoadedColor);
});

test('Korisnik moze da doda "Load problem" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.loadProblemLoad)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.loadProblemLoad);
    await expect(bgColor).toBe(Constants.loadProblemLoadColor);
});

test('Korisnik moze da doda "Broken" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.brokenLoad)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.brokenLoad);
    await expect(bgColor).toBe(Constants.brokenLoadColor);
});

test('Korisnik moze da doda "Special note" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.specialNote)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.specialNoteLoad);
    await expect(bgColor).toBe(Constants.specialNoteLoadColor);
});

test('Korisnik moze da doda "PM SERVICE" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.pmService)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.pmServiceLoad);
    await expect(bgColor).toBe(Constants.pmServiceLoadColor);
});

test('Korisnik moze da doda "Repo" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.repoLoad)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.repoLoad);
    await expect(bgColor).toBe(Constants.repoLoadColor);
});

test('Korisnik moze da doda "L.O.T.R" load', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.lotrLoad)
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    const bgColor = await dispatcDashboard.loadColumn.first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    await expect(title).toContain(Constants.lotrLoad);
    await expect(bgColor).toBe(Constants.lotrLoadColor);
});

test('Korisnik moze da cekira "dedicated load" checkbox', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.check(addLoadSetup.dedicatetLoadCheckbox);
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.dedicatedIcon.first().getAttribute('title');
    await expect(dispatcDashboard.dedicatedIcon.first()).toBeVisible();
    await expect(title).toContain(Constants.dedicatedLoad);
});

test('Datumi u proslosti su onemoguceni (disabled)', async ({ addLoadSetup }) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 6);
    const pastDateDay = pastDate.getDate();
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.hometimeAbsence);
    await addLoadSetup.dateField.click();
    const pastDateElement = addLoadSetup.page.locator(`.v-btn.v-btn--flat.v-btn--text.v-btn--rounded.v-btn--disabled:has-text("${pastDateDay}")`);
    await pastDateElement.waitFor({ state: 'visible', timeout: 5000 });
    await expect(pastDateElement).toHaveClass(/v-btn--disabled/);
});

test('Korisnik moze da izabere datume koji su u buducnosti u odnosu na selektovani datum', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.hometimeAbsence);
    await addLoadSetup.dateField.click();
    const dateText = await addLoadSetup.selectedDate.textContent();
    const selectedDay = parseInt(dateText?.trim() || '0', 10);
    const futureDate = new Date();
    futureDate.setDate(selectedDay + 1);
    const futureDateDay = futureDate.getDate();
    const day = String(futureDateDay).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const month2 = String(futureDate.getMonth()).padStart(2, '0');
    const year = futureDate.getFullYear();
    const formattedFutureDate = `${month}/${day}/${year}`;
    const formattedFutureDate2 = `${month2}/${day}/${year}`;
    const futureDateButton = addLoadSetup.page.locator(`.v-btn__content:has-text("${futureDateDay}")`);
    await futureDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await futureDateButton.first().click();
    await addLoadSetup.okButtonInDatePicker.click();
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    expect(
        title?.includes(formattedFutureDate.toString()) ||
        title?.includes(formattedFutureDate2.toString())
    ).toBeTruthy();

});

test('Korisnik moze da promjeni mjesec unaprijed kada klikne na desnu strelicu', async ({ addLoadSetup }) => {
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.hometimeAbsence);
    await addLoadSetup.dateField.click();
    const headerLocator = await addLoadSetup.headerDatePicker;
    const initialHeaderText = await headerLocator.textContent();
    const [initialMonthName, initialYear] = initialHeaderText?.split(' ') ?? [];
    const initialDate = new Date(`${initialMonthName} 1, ${initialYear}`);
    const initialMonthIndex = initialDate.getMonth();
    const expectedNextMonthIndex = (initialMonthIndex + 1) % 12;
    await addLoadSetup.rightArrowIconDatePicker.click();
    await addLoadSetup.page.waitForLoadState('networkidle');
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

test('Korisnik moze da promjeni mjesec unazad kada klikne na lijevu strelicu', async ({ addLoadSetup }) => {
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.hometimeAbsence);
    await addLoadSetup.dateField.click();
    const headerLocator = await addLoadSetup.headerDatePicker;
    const initialHeaderText = await headerLocator.textContent();
    const [initialMonthName, initialYear] = initialHeaderText?.split(' ') ?? [];
    const initialDate = new Date(`${initialMonthName} 1, ${initialYear}`);
    const initialMonthIndex = initialDate.getMonth();
    const expectedPrevMonthIndex = (initialMonthIndex - 1 + 12) % 12;
    await addLoadSetup.leftArrowIconDatePicker.click();
    await addLoadSetup.page.waitForLoadState('networkidle');
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

test('Datum je po defaultu izabran kada izaberemo absence', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.hometimeAbsence);
    await addLoadSetup.dateField.click();
    const dateText = await addLoadSetup.selectedDate.textContent();
    const selectedDay = parseInt(dateText?.trim() || '0', 10);
    const defaultDate = new Date();
    defaultDate.setDate(selectedDay);
    const defaultMonth = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const month = String(defaultDate.getMonth()).padStart(2, '0');
    const defaultYear = defaultDate.getFullYear();
    const formattedDefaultDate = `${defaultMonth}/${selectedDay.toString().padStart(2, '0')}/${defaultYear}`;
    const formattedDefaultDate2 = `${month}/${selectedDay.toString().padStart(2, '0')}/${defaultYear}`;
    await addLoadSetup.okButtonInDatePicker.click();
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const title = await dispatcDashboard.loadColumn.first().getAttribute('title');
    expect(
        title?.includes("from " + formattedDefaultDate + " to " + formattedDefaultDate) ||
        title?.includes("from " + formattedDefaultDate2 + " to " + formattedDefaultDate2)
    ).toBeTruthy();
});

test("Korisnik moze da izabere 'Hometime' absence", async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.hometimeAbsence);
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(dispatcDashboard.loadColumn.first()).toContainText(Constants.hometimeAbsence);
});

test("Korisnik moze da izabere 'Vacation' absence", async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.vacationAbsence);
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(dispatcDashboard.loadColumn.first()).toContainText(Constants.vacationAbsence);
});

test("Korisnik moze da izabere 'Off' absence", async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.selectFromMenu(addLoadSetup.typeOfAbsence, addLoadSetup.offAbsence);
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(dispatcDashboard.loadColumn.first()).toContainText(Constants.offAbsence);
});

test("Korisnik moze da doda komentar", async ({ addLoadSetup }) => {
    await addLoadSetup.enterComment(addLoadSetup.commentTextfield, Constants.driverName, addLoadSetup.addCommentButton);
    await addLoadSetup.page.waitForLoadState('networkidle');
    await expect(addLoadSetup.comments).toContainText(Constants.driverName);
});

test("Korisnik moze da zatvori modal na Close button", async ({ addLoadSetup }) => {
    await addLoadSetup.closeButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    await expect(addLoadSetup.addLoadModal).not.toBeVisible();
});

test('Korisnik moze da doda "Empty, Need Load" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.emptyNeedLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.emptyNeedLoadFilter;
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.emptyNeedLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Loaded" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.loadedLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.loadedLoadFilter.first();
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.loadedLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Dispatched not loaded" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.dispatcherNotLoadedLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.dispatchedNotLoadedFilter;
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.dispatchedNotLoadedColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Load problem" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.loadProblemLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.loadProblemFilter;
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.loadProblemLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Broken" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.brokenLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.brokenLoadFilter.first();
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.brokenLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Special Note" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.specialNote);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.specialNoteFilter;
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.specialNoteLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "PM Setvice" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.pmService);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.pmServiceFilter;
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.pmServiceLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "Repo" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.repoLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.repoFilter;
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.repoLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});

test('Korisnik moze da doda "LOTR" load i provjeri filter load-a', async ({ addLoadSetup, dispatcDashboard }) => {
    await addLoadSetup.fillAndSelectOption(addLoadSetup.deliveryCityLabel, Constants.deliveryCity, addLoadSetup.deliveryCity);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.selectFromMenu(addLoadSetup.loadType, addLoadSetup.lotrLoad);
    await addLoadSetup.page.waitForLoadState("networkidle");
    await addLoadSetup.saveButton.click();
    await addLoadSetup.addLoadModal.waitFor({ state: 'detached', timeout: 5000 });
    const filterButton = await addLoadSetup.lotrFilter;
    const [response] = await Promise.all([
        addLoadSetup.page.waitForResponse(resp =>
            resp.url().includes('/api/drivers/dashboard') &&
            (resp.status() === 200 || resp.status() === 304)
        ),
        filterButton.click()
    ]);
    const fields = await dispatcDashboard.loadColumn;
    await Promise.all(
        Array.from({ length: await fields.count() }, async (_, i) => {
            const field = fields.nth(i);
            const backgroundColor = await field.evaluate(el => window.getComputedStyle(el).backgroundColor);
            await expect(backgroundColor === Constants.lotrLoadColor || backgroundColor === Constants.noColor).toBeTruthy();
        })
    );
});