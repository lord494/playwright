import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class DispatchInfoPage extends BasePage {
    readonly page: Page;
    readonly deleteButton: Locator;
    readonly editButton: Locator;
    readonly searchInput: Locator;
    readonly addNewBrokerButton: Locator;
    readonly brokerNameInput: Locator;
    readonly descriptionInput: Locator;
    readonly mcInput: Locator;
    readonly saveButton: Locator;
    readonly mc1Option: Locator;
    readonly mc14Option: Locator;
    readonly dialogBox: Locator;
    readonly brokerCard: Locator;
    readonly brokerName: Locator;
    readonly description: Locator;
    readonly mc: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.deleteButton = page.locator('.v-btn__content', { hasText: 'Delete' });
        this.editButton = page.locator('.v-btn__content', { hasText: 'Edit' });
        this.searchInput = page.locator('.v-text-field__slot input');
        this.addNewBrokerButton = page.locator('.v-btn__content', { hasText: 'Add new broker' });
        this.brokerNameInput = page.getByRole('dialog').locator('div').filter({ hasText: /^Broker name$/ }).locator('input');
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
        this.mcInput = page.getByRole('textbox', { name: 'MC#' });
        this.saveButton = page.locator('.v-dialog--active .v-btn__content', { hasText: 'Save' });
        this.mc1Option = page.getByRole('option', { name: 'MC-1', exact: true });
        this.mc14Option = page.getByRole('option', { name: 'MC-14', exact: true });
        this.dialogBox = page.locator('.v-dialog--active');
        this.brokerCard = page.locator('.v-card v-sheet');
        this.brokerName = page.locator('.headline-broker');
        this.description = page.locator('.broker-description');
        this.mc = page.locator('.v-card.v-sheet .v-list-item');
    }

    async enterBrokerName(menu: Locator, name: string): Promise<void> {
        await this.fillInputField(menu, name);
    }

    async enterDescription(menu: Locator, description: string): Promise<void> {
        await this.fillInputField(menu, description);
    }

    async selectMC(menu: Locator, name: string, mc: Locator): Promise<void> {
        await this.fillAndSelectFromMenu(menu, name, mc);
    }
}