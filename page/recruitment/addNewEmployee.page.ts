import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import { Constants } from "../../helpers/constants";
import { get6RandomNumber, getRandom10Number } from "../../helpers/dateUtilis";

/**
 * Data for filling the Add/Edit employee modal. `recruiterOption` and
 * `statusOption` are the menu-option locators to pick (declared as readonly
 * fields on this page, or on RecrutimentPage for the "Test Automation"
 * recruiter used by the edit flow).
 */
export type EmployeeFormData = {
    cdl: string;
    recruiterOption: Locator;
    name: string;
    email: string;
    phone: string;
    country: string;
    note: string;
    statusOption: Locator;
};

export class AddNewEmployeePage extends BasePage {
    readonly page: Page;
    readonly cdlField: Locator;
    readonly recruiterMenu: Locator;
    readonly nameField: Locator;
    readonly emailField: Locator;
    readonly phoneField: Locator;
    readonly countryField: Locator;
    readonly noteField: Locator;
    readonly stausMenu: Locator;
    readonly saveButton: Locator;
    readonly recruiterOption: Locator;
    readonly recruiterPetarPetrovicOption: Locator;
    readonly empolyedStatus: Locator;
    readonly unemployedStatus: Locator;
    readonly blockedStatus: Locator;
    readonly exDriversStatus: Locator;
    readonly holdStatus: Locator;
    readonly stopStatus: Locator;
    readonly errorMessage: Locator;
    readonly alertMessage: Locator;
    readonly employeesTab: Locator;
    readonly addNewEmployeeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.cdlField = this.page.getByRole('textbox', { name: 'CDL' });
        this.recruiterMenu = this.page.getByRole('textbox', { name: 'Recruiter' });
        this.nameField = this.page.getByRole('textbox', { name: 'Name*' });
        this.emailField = this.page.getByRole('textbox', { name: 'Email' });
        this.phoneField = this.page.getByRole('textbox', { name: 'Phone*' });
        this.countryField = this.page.getByRole('textbox', { name: 'Country*' });
        this.noteField = this.page.getByRole('textbox', { name: 'Note' });
        this.stausMenu = this.page.getByRole('textbox', { name: 'Status' });
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.recruiterOption = this.page.locator('.v-list-item__title').filter({ hasText: Constants.plawrightRecruiter });
        this.recruiterPetarPetrovicOption = this.page.locator('.v-list-item__title').filter({ hasText: Constants.recruiterPetarPetrovic });
        this.empolyedStatus = this.page.getByRole('option', { name: 'Employed', exact: true });
        this.unemployedStatus = this.page.getByRole('option', { name: 'Unemployed' });
        this.blockedStatus = this.page.getByRole('option', { name: 'Blocked' });
        this.exDriversStatus = this.page.getByRole('option', { name: 'EX DRIVERS' });
        this.holdStatus = this.page.getByRole('option', { name: 'Hold' });
        this.stopStatus = this.page.getByRole('option', { name: 'Stop' });
        this.errorMessage = this.page.locator('.v-messages__message');
        this.alertMessage = this.page.locator('.v-alert__content');
        this.employeesTab = this.page.getByRole('tab', { name: 'Employees' });
        this.addNewEmployeeButton = this.page.getByRole('button', { name: 'Add new employee' });
    }

    enterCdl(cdl: string): Promise<void> {
        return this.fillInputField(this.cdlField, cdl);
    }

    selectRecruiter(recruiter: Locator): Promise<void> {
        return this.selectFromMenu(this.recruiterMenu, recruiter);
    }

    enterName(name: string): Promise<void> {
        return this.fillInputField(this.nameField, name);
    }

    enterEmail(email: string): Promise<void> {
        return this.fillInputField(this.emailField, email);
    }

    enterPhone(phone: string): Promise<void> {
        return this.fillInputField(this.phoneField, phone);
    }

    enterCountry(country: string): Promise<void> {
        return this.fillInputField(this.countryField, country);
    }

    enterNote(note: string): Promise<void> {
        return this.fillInputField(this.noteField, note);
    }

    selectStatus(status: Locator): Promise<void> {
        return this.selectFromMenu(this.stausMenu, status);
    }

    /** Fills every field of a fresh Add Employee modal (does NOT click Save). */
    async fillEmployeeForm(data: EmployeeFormData): Promise<void> {
        await this.enterCdl(data.cdl);
        await this.selectRecruiter(data.recruiterOption);
        await this.enterName(data.name);
        await this.enterEmail(data.email);
        await this.enterPhone(data.phone);
        await this.enterCountry(data.country);
        await this.enterNote(data.note);
        await this.selectStatus(data.statusOption);
    }

    /**
     * Re-fills the Edit Employee modal, clearing each field before typing
     * (via BasePage.fillInputFieldEdit). Does NOT click Save.
     */
    async editEmployeeForm(data: EmployeeFormData): Promise<void> {
        await this.fillInputFieldEdit(this.cdlField, data.cdl);
        await this.selectRecruiter(data.recruiterOption);
        await this.fillInputFieldEdit(this.nameField, data.name);
        await this.fillInputFieldEdit(this.emailField, data.email);
        await this.fillInputFieldEdit(this.phoneField, data.phone);
        await this.fillInputFieldEdit(this.countryField, data.country);
        await this.fillInputFieldEdit(this.noteField, data.note);
        await this.selectStatus(data.statusOption);
    }

    async addHoldNumbers(): Promise<void> {
        const randomCdl = get6RandomNumber().join('');
        const randomPhone = getRandom10Number().join('');
        await this.employeesTab.click();
        await this.addNewEmployeeButton.click();
        await this.fillEmployeeForm({
            cdl: randomCdl,
            recruiterOption: this.recruiterPetarPetrovicOption,
            name: Constants.driverName,
            email: Constants.testEmail,
            phone: randomPhone,
            country: Constants.state,
            note: Constants.noteFirst,
            statusOption: this.holdStatus,
        });
        await this.saveButton.click();
        await this.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    }
}
