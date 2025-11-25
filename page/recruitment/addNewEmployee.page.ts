import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import { Constants } from "../../helpers/constants";
import { get6RandomNumber, getRandom10Number } from "../../helpers/dateUtilis";

export class AddNewEmployeePage extends BasePage {
    readonly page: Page;
    readonly cdlField: Locator;
    readonly recruiterMenu: Locator;
    readonly numberOfDaysField: Locator;
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
        this.numberOfDaysField = this.page.getByText('Number of days');
        this.nameField = this.page.getByRole('textbox', { name: 'Name*' });
        this.emailField = this.page.getByRole('textbox', { name: 'Email' });
        this.phoneField = this.page.getByRole('textbox', { name: 'Phone*' });
        this.countryField = this.page.getByRole('textbox', { name: 'Country*' });
        this.noteField = this.page.getByRole('textbox', { name: 'Note' });
        this.stausMenu = this.page.getByRole('textbox', { name: 'Status' });
        this.saveButton = this.page.getByRole('button', { name: 'Save' });
        this.recruiterOption = this.page.locator('.v-list-item__title').filter({ hasText: 'Playwright Regruter' });
        this.recruiterPetarPetrovicOption = this.page.locator('.v-list-item__title').filter({ hasText: 'Petar Petrovic' });
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

    enterCdl(field: Locator, cdl: string): Promise<void> {
        return this.fillInputField(field, cdl);
    }

    selectRecruiter(menu: Locator, recruiter: Locator): Promise<void> {
        return this.selectFromMenu(menu, recruiter);
    }

    enterName(field: Locator, name: string): Promise<void> {
        return this.fillInputField(field, name);
    }

    enterEmail(field: Locator, email: string): Promise<void> {
        return this.fillInputField(field, email);
    }

    enterPhone(field: Locator, phone: string): Promise<void> {
        return this.fillInputField(field, phone);
    }

    enterCountry(field: Locator, country: string): Promise<void> {
        return this.fillInputField(field, country);
    }

    enterNote(field: Locator, note: string): Promise<void> {
        return this.fillInputField(field, note);
    }

    selectStatus(menu: Locator, status: Locator): Promise<void> {
        return this.selectFromMenu(menu, status);
    }

    async addHoldNumbers(): Promise<void> {
        const randomCdl = get6RandomNumber().join('');
        const randomPhone = getRandom10Number().join('');
        await this.employeesTab.click();
        await this.addNewEmployeeButton.click();
        await this.enterCdl(this.cdlField, randomCdl)
        await this.selectRecruiter(this.recruiterMenu, this.recruiterPetarPetrovicOption);
        await this.enterName(this.nameField, Constants.driverName);
        await this.enterEmail(this.emailField, Constants.testEmail);
        await this.enterPhone(this.phoneField, randomPhone);
        await this.enterCountry(this.countryField, Constants.state);
        await this.enterNote(this.noteField, Constants.noteFirst);
        await this.selectStatus(this.stausMenu, this.holdStatus);
        await this.saveButton.click();
        await this.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    }
}
