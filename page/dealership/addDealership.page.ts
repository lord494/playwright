import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddDealership extends BasePage {
    readonly page: Page;
    readonly nameField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly isSpecialCheckbox: Locator;
    readonly addButton: Locator;
    readonly errorMessage: Locator;
    readonly saveButton: Locator;
    readonly typeMenu: Locator;
    readonly truckOption: Locator;
    readonly trailerOption: Locator;
    readonly orderField: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.nameField = page.locator('#name');
        this.isActiveCheckbox = page.getByRole('dialog').getByText('Is active');
        this.isSpecialCheckbox = page.getByRole('dialog').getByText('Is special?');
        this.addButton = page.locator('.v-btn__content', { hasText: 'Add' });
        this.errorMessage = page.locator('.v-messages__message');
        this.saveButton = page.locator('.v-btn__content', { hasText: 'Save' });
        this.typeMenu = page.locator('.v-dialog--active .v-select__selections');
        this.truckOption = page.getByRole('option', { name: 'TRUCK' });
        this.trailerOption = page.getByRole('option', { name: 'TRAILER' });
        this.orderField = page.getByPlaceholder('Order');
    }

    async enterName(field: Locator, name: string): Promise<void> {
        await this.fillInputField(field, name);
    }

    async enterOrder(field: Locator, order: string): Promise<void> {
        await this.fillInputField(field, order);
    }

    async selectType(field: Locator, type: Locator): Promise<void> {
        await this.selectFromMenu(field, type);
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