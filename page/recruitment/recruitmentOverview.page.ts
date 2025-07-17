import { expect, Locator, Page } from "@playwright/test";
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
    readonly employedCheckbox: Locator;
    readonly unemployedCheckbox: Locator;
    readonly blocedCheckbox: Locator;
    readonly retiredCheckbox: Locator;
    readonly thirdCompanyCheckbox: Locator;
    readonly onwerOperatorCheckbox: Locator;
    readonly holdCheckbox: Locator;
    readonly incContactCheckbox: Locator;
    readonly progressBar: Locator;
    readonly searchRecruiterMenu: Locator;
    readonly recruiterOption: Locator;
    readonly secondRecruiterOption: Locator;
    readonly employeesTable: Locator;
    readonly checkboxOfEmployee: Locator;
    readonly moveButton: Locator;
    readonly okButton: Locator;
    readonly searchRecruiterMenuInMoveModal: Locator;
    readonly recruiterFieldValue: Locator;
    readonly moveAllButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addNewEmployeeButton = page.getByRole('button', { name: 'Add new employee' });
        this.pencilIcon = page.locator('.mdi-pencil');
        this.deleteIcon = page.locator('.mdi-delete');
        this.searchField = page.getByRole('textbox', { name: 'Search employees' });
        this.cdlColumn = page.locator('tr td:nth-child(1)');
        this.employeeNameColumn = page.locator('tr td:nth-child(2)');
        this.recruiterColumn = page.locator('tr td:nth-child(3)');
        this.stausColumn = page.locator('tr td:nth-child(5)');
        this.emailColumn = page.locator('tr td:nth-child(6)');
        this.phoneColumn = page.locator('tr td:nth-child(7)');
        this.countryColumn = page.locator('tr td:nth-child(9)');
        this.ssnColumn = page.locator('tr td:nth-child(10)');
        this.noteColumn = page.locator('tr td:nth-child(11)');
        this.recruiterTab = page.getByRole('tab', { name: 'Recruiters' });
        this.employeesTab = page.getByRole('tab', { name: 'Employees' });
        this.dialogBox = page.locator('.v-dialog--active');
        this.employedCheckbox = page.locator('label').filter({ hasText: /Employed/ });
        this.unemployedCheckbox = page.locator('label').filter({ hasText: /Unemployed/ });
        this.blocedCheckbox = page.locator('label').filter({ hasText: 'Blocked' });
        this.retiredCheckbox = page.locator('label').filter({ hasText: 'Retired' });
        this.thirdCompanyCheckbox = page.locator('label').filter({ hasText: 'Third Company' });
        this.onwerOperatorCheckbox = page.locator('label').filter({ hasText: 'Owner operator' });
        this.holdCheckbox = page.locator('label').filter({ hasText: 'Hold' });
        this.incContactCheckbox = page.locator('label').filter({ hasText: 'In contact' });
        this.progressBar = page.getByRole('table').getByRole('progressbar').locator('div').nth(1);
        this.searchRecruiterMenu = page.locator('.v-select__slot', { hasText: 'Search Recruiter' });
        this.recruiterOption = page.locator('.v-list-item__title').filter({ hasText: 'Playwright Regruter' });
        this.secondRecruiterOption = page.locator('.v-list-item__title').filter({ hasText: 'Test Automation' });
        this.employeesTable = page.locator('.EmployeesTable');
        this.checkboxOfEmployee = page.locator('.v-data-table__wrapper .v-input--selection-controls__ripple').last();
        this.moveButton = page.getByRole('button', { name: 'Move', exact: true });
        this.okButton = page.locator('.v-btn__content', { hasText: "OK" });
        this.searchRecruiterMenuInMoveModal = page.locator('.v-select__slot', { hasText: 'Select a recruiter' });
        this.recruiterFieldValue = page.locator('.v-select__selection').first();
        this.moveAllButton = page.getByRole('button', { name: 'Move all', exact: true });
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

    selectRecruiter(menu: Locator, recruiter: Locator): Promise<void> {
        return this.selectFromMenu(menu, recruiter);
    }
}

