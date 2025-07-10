import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddThirdParty extends BasePage {
    readonly page: Page;
    readonly nameField: Locator;
    readonly noteField: Locator;
    readonly dotField: Locator;
    readonly phoneField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly temporaryCheckbox: Locator;
    readonly addButton: Locator;
    readonly errorMessage: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.nameField = page.locator('#name');
        this.noteField = page.locator('#note');
        this.dotField = page.locator('#dot');
        this.phoneField = page.locator('#phone');
        this.isActiveCheckbox = page.getByRole('dialog').getByText('Is active');
        this.temporaryCheckbox = page.getByRole('dialog').getByText('Temporary');
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

    async enterDot(field: Locator, dot: string): Promise<void> {
        await this.fillInputField(field, dot);
    }

    async enterPhone(field: Locator, phone: string): Promise<void> {
        await this.fillInputField(field, phone);
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