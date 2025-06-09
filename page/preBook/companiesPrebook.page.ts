import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class CompaniesPrebookPage extends BasePage {
    readonly page: Page;
    readonly pencilIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly companyNameColumn: Locator;
    readonly snackMessage: Locator;
    readonly isActiveColumn: Locator;
    readonly addCompnayIcon: Locator;
    readonly companyNameField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly addEditModal: Locator;
    readonly errorMessage: Locator;
    readonly pagination: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.pencilIcon = page.locator('.mdi-pencil');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.companyNameColumn = page.locator('tr td:nth-child(1)');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.isActiveColumn = page.locator('tr td:nth-child(2)');
        this.addCompnayIcon = page.locator('.mdi.mdi-plus');
        this.companyNameField = page.locator('#name');
        this.isActiveCheckbox = page.locator('.v-label.theme--light', { hasText: 'Is active' });
        this.addEditModal = page.locator('.v-dialog.v-dialog--active.v-dialog--persistent .v-card.v-sheet.theme--light');
        this.errorMessage = page.locator('.v-messages__message');
        this.pagination = page.locator('.v-data-footer__pagination');
    }

    async fillCompanyName(nameField: Locator, name: string): Promise<void> {
        await this.fillInputField(nameField, name);
    }

    async check(toggleButton: Locator): Promise<void> {
        const isChecked = await toggleButton.isChecked();
        if (!isChecked) {
            await toggleButton.click();
        }
    }

    async uncheck(toggleButton: Locator): Promise<void> {
        if (await toggleButton.isChecked()) {
            await toggleButton.click();
        }
    }
}
