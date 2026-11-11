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
    readonly roleRows: Locator;

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
        this.roleRows = page.locator('tbody tr');
    }

    /**
     * Opens the Edit modal of the role with the given name and waits until the
     * "All remaining permissions" box is populated. It fills in AFTER networkidle
     * (from /api/roles/permissions) — dragging before that, as the old
     * pencilIcon.nth(8) + networkidle flow did, raced the re-render on CI.
     */
    async openEditRoleModal(roleName: string): Promise<void> {
        const pencil = this.roleRows
            .filter({ has: this.page.locator('td:nth-child(2)', { hasText: new RegExp(`^\\s*${roleName}\\s*$`, 'i') }) })
            .locator('.mdi-pencil');
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/api/roles/permissions') &&
                (res.status() === 200 || res.status() === 304)
            ),
            this.clickElement(pencil),
        ]);
        await this.editAndAddModal.waitFor({ state: 'visible' });
        await this.allRemainingPermissionsBox.locator('.v-chip').first().waitFor({ state: 'visible' });
    }

    /** Clicks Save and waits for the PUT /api/roles response + modal close. */
    async saveRole(): Promise<void> {
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/api/roles') &&
                res.request().method() === 'PUT' &&
                res.status() === 200
            ),
            this.clickElement(this.saveButton),
        ]);
        await this.editAndAddModal.waitFor({ state: 'detached', timeout: 5000 });
    }

    async selectRowsPerPage(rowsPerPageMenu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(rowsPerPageMenu, optionFromMenu);
    }

    async getPaginationText(): Promise<string> {
        const text = await this.paginationLocator.textContent();
        return text ?? '';
    }

    async dragAndDropPermissionToCurrentPermissionsBox(): Promise<void> {
        // Drop onto an existing chip: once the modal is fully loaded the box is ~350px tall and its
        // center is empty space outside the sortable list, so a drop there is ignored.
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

