import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddContactsPage extends BasePage {
    readonly page: Page;
    readonly populatedField: Locator;
    readonly nameField: Locator;
    readonly floydExtField: Locator;
    readonly trytimeExtField: Locator;
    readonly rocketExtField: Locator;
    readonly jordanExtField: Locator;
    readonly phoneNumberField: Locator;
    readonly emailField: Locator;
    readonly companyField: Locator;
    readonly positionField: Locator;
    readonly assistantField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly addButton: Locator;
    readonly assistantOption: Locator;
    readonly errorMessage: Locator;
    readonly saveButton: Locator;
    readonly addContactButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.populatedField = page.getByRole('textbox', { name: 'Populate fileds' });
        this.nameField = page.getByRole('textbox', { name: 'Name' });
        this.floydExtField = page.getByRole('textbox', { name: 'Floyd Ext' });
        this.trytimeExtField = page.getByRole('textbox', { name: 'Trytime ext' });
        this.rocketExtField = page.getByRole('textbox', { name: 'Rocket Ext' });
        this.jordanExtField = page.getByRole('textbox', { name: 'Jordan Ext' });
        this.phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' });
        this.emailField = page.getByRole('textbox', { name: 'Email' });
        this.companyField = page.getByRole('textbox', { name: 'Company' });
        this.positionField = page.getByRole('textbox', { name: 'Position' });
        this.assistantField = page.getByRole('textbox', { name: 'Assistant' });
        this.isActiveCheckbox = page.getByRole('dialog').getByText('Is active');
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.assistantOption = page.getByRole('option', { name: 'Bosko QA Test' });
        this.errorMessage = page.locator('.v-messages__message');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.addContactButton = page.locator('.mdi-plus');
    }

    async selectPopulatedField(field: Locator, text: string, name: Locator): Promise<void> {
        await this.fillAndSelectFromMenu(field, text, name);
    }

    async enterName(field: Locator, name: string): Promise<void> {
        await this.fillInputField(field, name);
    }

    async enterFloydExt(field: Locator, name: string): Promise<void> {
        await this.fillInputField(field, name);
    }

    async enterTrytimeExt(field: Locator, name: string): Promise<void> {
        await this.fillInputField(field, name);
    }

    async enterRocketExt(field: Locator, name: string): Promise<void> {
        await this.fillInputField(field, name);
    }

    async enterJordanExt(field: Locator, name: string): Promise<void> {
        await this.fillInputField(field, name);
    }

    async enterPhoneNumber(field: Locator, phone: string): Promise<void> {
        await this.fillInputField(field, phone);
    }

    async enterEmail(field: Locator, email: string): Promise<void> {
        await this.fillInputField(field, email);
    }

    async enterCompany(field: Locator, company: string): Promise<void> {
        await this.fillInputField(field, company);
    }

    async enterPosition(field: Locator, position: string): Promise<void> {
        await this.fillInputField(field, position);
    }

    async selectAssistant(field: Locator, name: string, assistant: Locator): Promise<void> {
        await this.fillAndSelectFromMenu(field, name, assistant);
    }

    async isCheckedFC(): Promise<void> {
        const isChecked = await this.isActiveCheckbox.isChecked();
        if (!isChecked) {
            await this.isActiveCheckbox.click();
        }
    }

    async uncheck(toggleButton: Locator): Promise<void> {
        if (await toggleButton.isChecked()) {
            await toggleButton.click();
        }
    }
}