import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";


export class BoardsPage extends BasePage {
    readonly page: Page;
    readonly rowsPerPageDropdownMenu: Locator;
    readonly rows25PerPage: Locator;
    readonly rows10PerPage: Locator;
    readonly rows15PerPage: Locator;
    readonly pencilIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly userNameColumn: Locator;
    readonly snackMessage: Locator;
    readonly isActiveColumn: Locator;
    readonly orderColumn: Locator;
    readonly addModal: Locator;
    readonly addBoardIcon: Locator;
    readonly orderedIcon: Locator;
    readonly rightArrow: Locator;
    readonly leftArrow: Locator;
    readonly nameBoardField: Locator;
    readonly orderField: Locator;
    readonly isActiveCheckbox: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.rowsPerPageDropdownMenu = page.locator('.v-data-footer .v-select__selection--comma');
        this.rows25PerPage = page.getByRole('option', { name: '25' });
        this.rows10PerPage = page.getByRole('option', { name: '10' });
        this.rows15PerPage = page.getByRole('option', { name: '15' });
        this.pencilIcon = page.locator('.mdi-pencil');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.userNameColumn = page.locator('tr td:nth-child(1)');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.isActiveColumn = page.locator('tr td:nth-child(3)');
        this.orderColumn = page.locator('tr td:nth-child(2)');
        this.addModal = page.locator('.v-dialog__content.v-dialog__content--active');
        this.addBoardIcon = page.locator('.mdi.mdi-plus');
        this.orderedIcon = page.locator('.mdi-order-numeric-ascending');
        this.rightArrow = page.locator('.v-icon.notranslate.mdi.mdi-chevron-right.theme--light');
        this.leftArrow = page.locator('.v-btn__content .mdi-chevron-left');
        this.nameBoardField = page.locator('#name');
        this.orderField = page.locator('#order');
        this.isActiveCheckbox = page.getByRole('checkbox', { name: 'Is active' });
    }

    async selectRowsPerPage(rowsPerPageMenu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(rowsPerPageMenu, optionFromMenu);
    }

    async fillBoardName(board: Locator, name: string): Promise<void> {
        await this.fillInputField(board, name);
    }
}
