import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class OwnersPage extends BasePage {
    readonly page: Page;
    readonly addOwnerButton: Locator;
    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly searchField: Locator;
    readonly nameColumn: Locator;
    readonly cdlColumn: Locator;
    readonly isActiveColumn: Locator;
    readonly dialogBox: Locator;
    readonly snackMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addOwnerButton = page.locator('.mdi-plus');
        this.pencilIcon = page.locator('.mdi-pencil');
        this.deleteIcon = page.locator('.mdi-delete');
        this.searchField = page.locator('.v-input.v-text-field--single-line.v-text-field--is-booted');
        this.nameColumn = page.locator('tr td:nth-child(1)');
        this.cdlColumn = page.locator('tr td:nth-child(5)');
        this.isActiveColumn = page.locator('tr td:nth-child(8)');
        this.dialogBox = page.locator('.v-dialog--active');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content');
    }

    async searchOwner(searchField: Locator, name: string) {
        await this.fillInputField(searchField, name);
        await this.page.waitForTimeout(1000);
    }
}

