import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddOwner extends BasePage {
    readonly page: Page;
    readonly nameField: Locator;
    readonly noteField: Locator;
    readonly cdlField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly addButton: Locator;
    readonly errorMessage: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.nameField = page.locator('#name');
        this.noteField = page.locator('#note');
        this.cdlField = page.locator('#cdl');
        this.isActiveCheckbox = page.getByRole('dialog').getByText('Is active');
        this.addButton = page.locator('.v-btn__content', { hasText: 'Add' });
        this.errorMessage = page.locator('.v-messages__message');
        this.saveButton = page.locator('.v-btn__content', { hasText: 'Save' });
    }

    async enterName(field: Locator, name: string): Promise<void> {
        await this.fillInputField(field, name);
    }

    async enterNote(field: Locator, note: string): Promise<void> {
        await this.fillInputField(field, note);
    }

    async enterCdl(field: Locator, dot: string): Promise<void> {
        await this.fillInputField(field, dot);
    }

    async uncheck(checkbox: Locator): Promise<void> {
        if (await checkbox.isChecked()) {
            await checkbox.click();
        }
    }

    async isChecked(checkbox: Locator): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            await checkbox.click();
        }
    }

}