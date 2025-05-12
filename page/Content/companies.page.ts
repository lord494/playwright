import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";


export class CompaniesPage extends BasePage {
    readonly page: Page;
    readonly rowsPerPageDropdownMenu: Locator;
    readonly rows25PerPage: Locator;
    readonly rows10PerPage: Locator;
    readonly rows15PerPage: Locator;
    readonly pencilIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly companyNameColumn: Locator;
    readonly snackMessage: Locator;
    readonly isActiveColumn: Locator;
    readonly shortNameColumn: Locator;
    readonly addModal: Locator;
    readonly addCompany: Locator;
    readonly rightArrow: Locator;
    readonly leftArrow: Locator;
    readonly nameCompanyField: Locator;
    readonly shortNameField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly uploadIcon: Locator;
    readonly documentIcon: Locator;
    readonly insertPermitBookModal: Locator;
    readonly documentModal: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.rowsPerPageDropdownMenu = page.locator('.v-data-footer .v-select__selection--comma');
        this.rows25PerPage = page.getByRole('option', { name: '25' });
        this.rows10PerPage = page.getByRole('option', { name: '10' });
        this.rows15PerPage = page.getByRole('option', { name: '15' });
        this.pencilIcon = page.locator('.mdi-pencil');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.companyNameColumn = page.locator('tr td:nth-child(1)');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.isActiveColumn = page.locator('tr td:nth-child(3)');
        this.shortNameColumn = page.locator('tr td:nth-child(2)');
        this.addModal = page.locator('.v-dialog__content.v-dialog__content--active');
        this.addCompany = page.locator('.mdi.mdi-plus');
        this.rightArrow = page.locator('.v-icon.notranslate.mdi.mdi-chevron-right.theme--light');
        this.leftArrow = page.locator('.v-icon.notranslate.mdi.mdi-chevron-left.theme--light');
        this.nameCompanyField = page.locator('#name');
        this.shortNameField = page.locator('#short_name');
        this.isActiveCheckbox = page.getByText('Is active', { exact: true });
        this.uploadIcon = page.locator('.mdi.mdi-upload');
        this.documentIcon = page.locator('.mdi.mdi-file-document-multiple');
        this.insertPermitBookModal = page.locator('.v-dialog.v-dialog--active .v-card.v-sheet.theme--light');
        this.documentModal = page.locator('.v-dialog.v-dialog--active');
        this.errorMessage = page.locator('.v-text-field__details .v-messages__wrapper');
    }

    async selectRowsPerPage(rowsPerPageMenu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(rowsPerPageMenu, optionFromMenu);
    }

    async fillCompanyName(board: Locator, name: string): Promise<void> {
        await this.fillInputField(board, name);
    }

    async fillShortName(board: Locator, name: string): Promise<void> {
        await this.fillInputField(board, name);
    }
}
