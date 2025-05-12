import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/base";

export class EditFndUser extends BasePage {
    readonly page: Page;
    readonly emailField: Locator;
    readonly nameField: Locator;
    readonly roleField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly fndUserRole: Locator;
    readonly snackMessage: Locator;
    readonly saveButton: Locator;
    readonly updateButton: Locator;
    readonly passwordField: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.emailField = page.getByRole('textbox', { name: 'Email' });
        this.nameField = page.getByRole('textbox', { name: 'Name' });
        this.roleField = page.getByRole('textbox', { name: 'Role', exact: true });
        this.isActiveCheckbox = page.getByText('Is active', { exact: true });
        this.fndUserRole = page.getByRole('option', { name: 'Fnd User' });
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.saveButton = page.locator('.v-btn__content', { hasText: 'Save' });
        this.updateButton = page.locator('.v-btn__content', { hasText: 'Update' });
        this.passwordField = page.getByPlaceholder('Password');
        this.errorMessage = page.locator('.v-messages.theme--light.error--text');
    }

    async enterData(textbox: Locator, text: string): Promise<void> {
        await this.fillInputField(textbox, text)
    }

    async editData(textbox: Locator, text: string): Promise<void> {
        await this.fillInputFieldEdit(textbox, text)
    }

    async selectOptionFromMenu(menu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(menu, optionFromMenu);
    }

    async checkCheckbox(checkbox: Locator): Promise<void> {
        await this.check(checkbox);
    }

    async enterPassword(text: string): Promise<void> {
        await this.passwordField.click();
        await this.passwordField.fill(text);
    }
}