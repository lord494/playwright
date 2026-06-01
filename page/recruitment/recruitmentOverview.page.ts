import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../helpers/base";

/** Expected values for a single employee row (used by create/edit assertions). */
export type EmployeeRowExpectation = {
    cdl: string;
    name: string;
    recruiter: string;
    status: string;
    statusColor: string;
    email: string;
    phone: string;
    country: string;
    note: string;
};

export class RecrutimentPage extends BasePage {
    readonly page: Page;
    readonly addNewEmployeeButton: Locator;
    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly searchField: Locator;
    readonly cdlColumn: Locator;
    readonly employeeNameColumn: Locator;
    readonly recruiterColumn: Locator;
    readonly stausColumn: Locator;
    readonly emailColumn: Locator;
    readonly phoneColumn: Locator;
    readonly countryColumn: Locator;
    readonly ssnColumn: Locator;
    readonly noteColumn: Locator;
    readonly recruiterTab: Locator;
    readonly employeesTab: Locator;
    readonly dialogBox: Locator;
    readonly progressBar: Locator;
    readonly searchRecruiterMenu: Locator;
    readonly recruiterOption: Locator;
    readonly stagingRecruiterOption: Locator;
    readonly temporaryUserOption: Locator;
    readonly recruiterPetarPetrovicOption: Locator;
    readonly secondRecruiterOption: Locator;
    readonly employeesTable: Locator;
    readonly checkboxOfEmployee: Locator;
    readonly moveButton: Locator;
    readonly okButton: Locator;
    readonly searchRecruiterMenuInMoveModal: Locator;
    readonly recruiterFieldValue: Locator;
    readonly moveAllButton: Locator;
    readonly closeButton: Locator;
    readonly searchPhoneNumberField: Locator;
    readonly searchButton: Locator;
    readonly statusCheckboxes: Record<string, Locator>;
    readonly pauseIcon: Locator;
    readonly snackMessage: Locator;
    readonly disabledSearchButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addNewEmployeeButton = this.page.getByRole('button', { name: 'Add new employee' });
        this.pencilIcon = this.page.locator('.mdi-pencil');
        this.deleteIcon = this.page.locator('.mdi-delete');
        this.searchField = this.page.getByRole('textbox', { name: 'Search employees' });
        this.cdlColumn = this.page.locator('tr td:nth-child(1)');
        this.employeeNameColumn = this.page.locator('tr td:nth-child(2)');
        this.recruiterColumn = this.page.locator('tr td:nth-child(3)');
        this.stausColumn = this.page.locator('tr td:nth-child(5)');
        this.emailColumn = this.page.locator('tr td:nth-child(6)');
        this.phoneColumn = this.page.locator('tr td:nth-child(7)');
        this.countryColumn = this.page.locator('tr td:nth-child(9)');
        this.ssnColumn = this.page.locator('tr td:nth-child(10)');
        this.noteColumn = this.page.locator('tr td:nth-child(11)');
        this.recruiterTab = this.page.getByRole('tab', { name: 'Recruiters' });
        this.employeesTab = this.page.getByRole('tab', { name: 'Employees' });
        this.dialogBox = this.page.locator('.v-dialog--active');
        this.progressBar = this.page.getByRole('table').getByRole('progressbar').locator('div').nth(1);
        this.searchRecruiterMenu = this.page.locator('.v-select__slot', { hasText: 'Search Recruiter' });
        this.recruiterOption = this.page.locator('.v-list-item__title').filter({ hasText: 'Playwright Regruter' });
        this.stagingRecruiterOption = this.page.locator('.v-list-item__title').filter({ hasText: 'Regruter Staging Test' });
        this.temporaryUserOption = this.page.locator('.v-list-item__title').filter({ hasText: 'TemporaryUser' });
        this.recruiterPetarPetrovicOption = this.page.locator('.v-list-item__title').filter({ hasText: 'Petar Petrovic' });
        this.secondRecruiterOption = this.page.locator('.v-list-item__title').filter({ hasText: 'Test Automation' });
        this.employeesTable = this.page.locator('.EmployeesTable');
        this.checkboxOfEmployee = this.page.locator('.v-data-table__wrapper .v-input--selection-controls__ripple').last();
        this.moveButton = this.page.getByRole('button', { name: 'Move', exact: true });
        this.okButton = this.page.locator('.v-btn__content', { hasText: "OK" });
        this.searchRecruiterMenuInMoveModal = this.page.locator('.v-select__slot', { hasText: 'Select a recruiter' });
        this.recruiterFieldValue = this.page.locator('.v-select__selection').first();
        this.moveAllButton = this.page.getByRole('button', { name: 'Move all', exact: true });
        this.closeButton = this.page.locator('.v-dialog--active .v-btn__content', { hasText: "Close" });
        // NOTE: This chained Vuetify class selector (incl. the theme class
        // `.theme--light`, normally discouraged) is intentionally left unchanged.
        // Two phone-search inputs render across the Employees / Recruiters tabs and
        // callers rely on this exact selector resolving to a single element on the
        // Employees tab while disambiguating with .last() on the Recruiters tab.
        // A role/placeholder-based replacement could not be verified against the
        // auth-gated staging DOM, so it is flagged as a follow-up rather than
        // changed blindly.
        this.searchPhoneNumberField = this.page.locator('.v-input.v-input--hide-details.v-input--dense.theme--light');
        this.searchButton = this.page.locator('.v-btn__content', { hasText: 'Search' });
        this.statusCheckboxes = {
            hold: this.page.locator('label').filter({ hasText: 'Hold' }),
            employed: this.page.locator('label').filter({ hasText: /Employed/ }),
            unemployed: this.page.locator('label').filter({ hasText: /Unemployed/ }),
            stop: this.page.locator('label').filter({ hasText: 'Stop' }),
            blocked: this.page.locator('label').filter({ hasText: 'Blocked' }),
            retired: this.page.locator('label').filter({ hasText: 'Retired' }),
            inContact: this.page.locator('label').filter({ hasText: 'In contact' })
        };
        this.pauseIcon = this.page.locator('.mdi-pause-circle-outline');
        this.snackMessage = page.locator('.v-snack__content');
        this.disabledSearchButton = page.locator('.v-btn--disabled.v-btn--has-bg').first();
    }

    async selectRecruiter(menu: Locator, recruiter: Locator): Promise<void> {
        return this.selectRecruiterFromMenu(menu, recruiter);
    }

    async searchPhoneNumber(field: Locator, number: string): Promise<void> {
        await this.fillInputField(field, number);
        await this.searchButton.click();
    }

    /** Waits for any /api/employees table refresh to settle. */
    async waitForEmployees(): Promise<void> {
        await this.page.waitForResponse(res =>
            res.url().includes('/api/employees') &&
            (res.status() === 200 || res.status() === 304)
        );
    }

    /** Waits for the phone-search /api/employees request for `search` to settle. */
    async waitForEmployeesSearch(search: string): Promise<void> {
        await this.page.waitForResponse(res =>
            res.url().includes('/api/employees?page=1&perPage=100&search=' + search) &&
            (res.status() === 200 || res.status() === 304)
        );
    }

    /** Types a phone number into the search field, submits, and waits for results. */
    async searchEmployeeByPhone(phone: string): Promise<void> {
        await this.searchPhoneNumber(this.searchPhoneNumberField, phone);
        await this.waitForEmployeesSearch(phone);
    }

    /** Clears whatever is currently in the phone-search field. */
    async clearPhoneSearch(): Promise<void> {
        await this.searchPhoneNumberField.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
    }

    async selectOnlyStatus(statusToKeep: keyof typeof this.statusCheckboxes) {
        for (const [name, cb] of Object.entries(this.statusCheckboxes)) {
            if (name === statusToKeep) {
                continue;
            }
            await cb.uncheck();

            await this.waitForEmployees();
        }
    }

    /**
     * Asserts every visible status cell reads exactly `statusText` and is painted
     * with `color`. Iterates all rows (not just the first) to catch a stray row
     * that the status filter failed to exclude.
     */
    async expectAllStatusCellsAre(statusText: string, color: string): Promise<void> {
        await this.progressBar.waitFor({ state: 'hidden' });
        const cells = await this.stausColumn.all();
        for (const cell of cells) {
            await expect(cell).toHaveText(statusText);
            const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
            expect(backgroundColor).toBe(color);
        }
    }

    /** Asserts the employees table currently shows no rows (empty result). */
    async expectNoEmployees(): Promise<void> {
        await expect(this.phoneColumn).toHaveCount(0);
    }

    /** Asserts the first employee row matches the expected create/edit values. */
    async expectFirstEmployeeRow(data: EmployeeRowExpectation): Promise<void> {
        await expect(this.cdlColumn.first()).toContainText(data.cdl);
        await expect(this.employeeNameColumn.first()).toContainText(data.name);
        await expect(this.recruiterColumn.first()).toContainText(data.recruiter);
        await expect(this.stausColumn.first()).toContainText(data.status);
        await expect(this.stausColumn.first()).toHaveCSS('background-color', data.statusColor);
        await expect(this.emailColumn.first()).toContainText(data.email);
        await expect(this.phoneColumn.first()).toContainText(data.phone);
        await expect(this.countryColumn.first()).toContainText(data.country);
        await expect(this.noteColumn.first()).toContainText(data.note);
    }

    async deleteLastIf20OrMore(): Promise<void> {
        await this.progressBar.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        const count = await this.deleteIcon.count();
        if (count >= 20) {
            await this.deleteIcon.last().click();
        }
    }
}
