import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

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
    readonly empolyedStatus: Locator;
    readonly unemployedStatus: Locator;
    readonly blockedStatus: Locator;
    readonly exDriversStatus: Locator;
    readonly holdStatus: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.cdlField = page.getByRole('textbox', { name: 'CDL' });
        this.recruiterMenu = page.getByRole('textbox', { name: 'Recruiter' });
        this.numberOfDaysField = page.getByText('Number of days');
        this.nameField = page.getByRole('textbox', { name: 'Name*' });
        this.emailField = page.getByRole('textbox', { name: 'Email' });
        this.phoneField = page.getByRole('spinbutton', { name: 'Phone*' });
        this.countryField = page.getByRole('textbox', { name: 'Country*' });
        this.noteField = page.getByRole('textbox', { name: 'Note' });
        this.stausMenu = page.getByRole('textbox', { name: 'Status' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.recruiterOption = page.locator('.v-list-item__title').filter({ hasText: 'Playwright Regruter' });
        this.empolyedStatus = page.getByRole('option', { name: 'Employed', exact: true });
        this.unemployedStatus = page.getByRole('option', { name: 'Unemployed' });
        this.blockedStatus = page.getByRole('option', { name: 'Blocked' });
        this.exDriversStatus = page.getByRole('option', { name: 'EX DRIVERS' });
        this.holdStatus = page.getByRole('option', { name: 'Hold' });
        this.errorMessage = page.locator('.v-messages__message');
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
}
