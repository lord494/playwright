import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/base";

export class FndUserPage extends BasePage {
    readonly page: Page;
    readonly accountIcon: Locator;
    readonly closeIcon: Locator;
    readonly addUserIcon: Locator;
    readonly searchInputField: Locator;
    readonly rowsPerPageDropdownMenu: Locator;
    readonly rows25PerPage: Locator;
    readonly rows10PerPage: Locator;
    readonly rows15PerPage: Locator;
    readonly pencilIcon: Locator;
    readonly keyIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly redDeleteIcon: Locator;
    readonly userNameColumn: Locator;
    readonly emailColumn: Locator;
    readonly snackMessage: Locator;
    readonly roleColumn: Locator;
    readonly teamLeadColumn: Locator;
    readonly extColumn: Locator;
    readonly addModal: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.accountIcon = page.locator('.mdi-account-circle');
        this.closeIcon = page.locator('.v-btn__content .mdi-close');
        this.addUserIcon = page.locator('.mdi-account-plus');
        this.searchInputField = page.locator('.v-input--dense.theme--light.v-text-field').last();
        this.rowsPerPageDropdownMenu = page.locator('.v-data-footer .v-select__selection--comma');
        this.rows25PerPage = page.getByRole('option', { name: '25' });
        this.rows10PerPage = page.getByRole('option', { name: '10' });
        this.rows15PerPage = page.getByRole('option', { name: '15' });
        this.pencilIcon = page.locator('.mdi-pencil');
        this.keyIcon = page.locator('.mdi-key-chain');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.redDeleteIcon = page.locator('.mdi-delete-forever');
        this.userNameColumn = page.locator('tr td:nth-child(1)');
        this.emailColumn = page.locator('tr td:nth-child(4)');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.roleColumn = page.locator('tr td:nth-child(3)');
        this.teamLeadColumn = page.locator('tr td:nth-child(6)');
        this.extColumn = page.locator('tr td:nth-child(7)');
        this.addModal = page.locator('.v-dialog__content.v-dialog__content--active');
    }

    async searchUser(searchInput: Locator, text: string): Promise<void> {
        await this.fillInputField(searchInput, text)
    }

    async selectRowsPerPage(rowsPerPageMenu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(rowsPerPageMenu, optionFromMenu);
    }
}