import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/base";


export class UsersPage extends BasePage {
    readonly page: Page;
    readonly accountIcon: Locator;
    readonly closeIcon: Locator;
    readonly inviteUserIcon: Locator;
    readonly addUserIcon: Locator;
    readonly searchInputField: Locator;
    readonly rowsPerPageDropdownMenu: Locator;
    readonly rows25PerPage: Locator;
    readonly rows10PerPage: Locator;
    readonly rows15PerPage: Locator;
    readonly rightArrow: Locator;
    readonly leftArrow: Locator;
    readonly pencilIcon: Locator;
    readonly keyIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly redDeleteIcon: Locator;
    readonly copyIcon: Locator;
    readonly userNameColumn: Locator;
    readonly emailColumn: Locator;
    readonly paginationLocator: Locator;
    readonly inviteAddUserModal: Locator;
    readonly snackMessage: Locator;
    readonly boardColumn: Locator;
    readonly roleColumn: Locator;
    readonly orderColumn: Locator;
    readonly teamLeadColumn: Locator;
    readonly extColumn: Locator;
    readonly extSecondColumn: Locator;
    readonly extThirdColumn: Locator;
    readonly extFourthColumn: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.accountIcon = page.locator('.mdi-account-circle');
        this.closeIcon = page.locator('.mdi.mdi-close');
        this.inviteUserIcon = page.locator('.mdi.mdi-link');
        this.addUserIcon = page.locator('.mdi-account-plus');
        this.searchInputField = page.locator('.v-input--dense.theme--light.v-text-field').last();
        this.rowsPerPageDropdownMenu = page.locator('.v-select__selection--comma');
        this.rows25PerPage = page.getByRole('option', { name: '25' });
        this.rows10PerPage = page.getByRole('option', { name: '10' });
        this.rows15PerPage = page.getByRole('option', { name: '15' });
        this.rightArrow = page.locator('.v-btn__content .mdi-chevron-right');
        this.leftArrow = page.locator('.v-btn__content .mdi-chevron-left');
        this.pencilIcon = page.locator('.mdi-pencil');
        this.keyIcon = page.locator('.mdi-key-chain');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.redDeleteIcon = page.locator('.mdi-delete-forever');
        this.copyIcon = page.locator('.mdi-content-copy');
        this.userNameColumn = page.locator('tr td:nth-child(1)');
        this.emailColumn = page.locator('tr td:nth-child(4)');
        this.paginationLocator = page.locator('.v-data-footer__pagination');
        this.inviteAddUserModal = page.locator('.v-dialog.v-dialog--active');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.boardColumn = page.locator('tr td:nth-child(2)');
        this.roleColumn = page.locator('tr td:nth-child(3)');
        this.orderColumn = page.locator('tr td:nth-child(5)');
        this.teamLeadColumn = page.locator('tr td:nth-child(6)');
        this.extColumn = page.locator('tr td:nth-child(7)');
        this.extSecondColumn = page.locator('tr td:nth-child(8)');
        this.extThirdColumn = page.locator('tr td:nth-child(9)');
        this.extFourthColumn = page.locator('tr td:nth-child(10)');
    }

    async searchUser(searchInput: Locator, text: string): Promise<void> {
        await this.fillInputField(searchInput, text)
    }

    async selectRowsPerPage(rowsPerPageMenu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(rowsPerPageMenu, optionFromMenu);
    }

    async getPaginationText(): Promise<string> {
        const text = await this.paginationLocator.textContent();
        return text ?? '';
    }
}