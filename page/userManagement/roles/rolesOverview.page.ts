import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/base";

export class RolesPage extends BasePage {
    readonly page: Page;
    readonly rowsPerPageDropdownMenu: Locator;
    readonly rows30PerPage: Locator;
    readonly rows50PerPage: Locator;
    readonly rightArrow: Locator;
    readonly leftArrow: Locator;
    readonly pencilIcon: Locator;
    readonly paginationLocator: Locator;
    readonly editAndAddModal: Locator;
    readonly addRoleIcon: Locator;
    readonly accountingEditPermissions: Locator;
    readonly accountingEditPermissionsInCurrentBox: Locator;
    readonly currentItem: Locator;
    readonly currentPermissionsBox: Locator;
    readonly addButton: Locator;
    readonly allRemainingPermissionsBox: Locator;
    readonly saveButton: Locator;
    readonly nameRoleField: Locator;
    readonly snackMessage: Locator;
    readonly secondPermision: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.rowsPerPageDropdownMenu = page.locator('.v-select__selection--comma');
        this.rows30PerPage = page.getByRole('option', { name: '30' });
        this.rows50PerPage = page.getByRole('option', { name: '50' });
        this.rightArrow = page.locator('.v-btn__content .mdi-chevron-right');
        this.leftArrow = page.locator('.v-btn__content .mdi-chevron-left');
        this.pencilIcon = page.locator('.mdi-pencil');
        this.paginationLocator = page.locator('.v-data-footer__pagination');
        this.editAndAddModal = page.locator('.v-dialog.v-dialog--active');
        this.addRoleIcon = page.locator('.mdi.mdi-plus');
        this.accountingEditPermissions = page.locator('.v-chip--label.theme--light.v-size--small.primary').filter({ hasText: 'ACCOUNTING_EDIT' });
        this.secondPermision = page.locator('.v-chip--label.theme--light.v-size--small.primary').nth(1);
        this.accountingEditPermissionsInCurrentBox = page.locator('.theme--light.v-size--small.green.white--text').filter({ hasText: 'ACCOUNTING_EDIT' });
        this.currentItem = page.locator('.theme--light.v-size--small.green.white--text').first();
        this.currentPermissionsBox = page.locator('.permisions-card.v-card .container').first();
        this.allRemainingPermissionsBox = page.locator('.permisions-card.v-card .container').last();
        this.addButton = page.locator('.v-btn__content', { hasText: 'Add' });
        this.saveButton = page.locator('.v-btn__content', { hasText: 'Save' });
        this.nameRoleField = page.locator('#name');
        this.snackMessage = page.locator('.v-snack__content');
        this.errorMessage = page.locator('.v-messages.theme--light.error--text');
    }

    async selectRowsPerPage(rowsPerPageMenu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(rowsPerPageMenu, optionFromMenu);
    }

    async getPaginationText(): Promise<string> {
        const text = await this.paginationLocator.textContent();
        return text ?? '';
    }

    async dragAndDropPermissionToCurrentPermissionsBox(): Promise<void> {
        await this.accountingEditPermissions.dragTo(this.currentItem);
    }

    async dragAndDropPermissionToCurrentPermissionsBoxAddModal(): Promise<void> {
        await this.accountingEditPermissions.dragTo(this.currentPermissionsBox);
    }

    async dragAndDropSecondPermissionToCurrentPermissionsBox(): Promise<void> {
        await this.secondPermision.dragTo(this.currentPermissionsBox);
    }

    async dragAndDropPermissionFromCurrentPermissionsBox(): Promise<void> {
        await this.accountingEditPermissionsInCurrentBox.dragTo(this.allRemainingPermissionsBox);
    }

    async enterRoleName(nameRole: Locator, text: string): Promise<void> {
        await this.fillInputField(nameRole, text)
    }
}

