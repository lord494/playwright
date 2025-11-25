import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

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
    readonly statusCheckboxes: Record<string, any>;
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
        this.stagingRecruiterOption = this.page.locator('.v-list-item__title').filter({ hasText: 'Regruter Staging' });
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

    async check(checkbox: Locator): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            await checkbox.click();
        }
    }

    async uncheck(checkbox: Locator): Promise<void> {
        if (await checkbox.isChecked()) {
            await checkbox.click();
        }
    }

    async selectRecruiter(menu: Locator, recruiter: Locator): Promise<void> {
        return this.selectRecruiterFromMenu(menu, recruiter);
    }

    async searchPhoneNumber(field: Locator, number: string): Promise<void> {
        await this.fillInputField(field, number);
        await this.searchButton.click();
    }

    async selectOnlyStatus(statusToKeep: keyof typeof this.statusCheckboxes) {
        for (const [name, cb] of Object.entries(this.statusCheckboxes)) {
            if (name === statusToKeep) {
                continue;
            }
            await cb.uncheck();

            await this.page.waitForResponse(
                res =>
                    res.url().includes('/api/employees') &&
                    (res.status() === 200 || res.status() === 304)

            );
        }
    }

    async deleteLastIf20OrMore(): Promise<void> {
        await this.page.waitForTimeout(1000);
        const count = await this.deleteIcon.count();
        console.log('Number of employees:', count);
        if (count >= 20) {
            await this.deleteIcon.last().click();
        }
    }
}

