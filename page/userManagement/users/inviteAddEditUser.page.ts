import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/base";

export class InviteAddEditModalPage extends BasePage {
    readonly page: Page;
    readonly emailField: Locator;
    readonly nameField: Locator;
    readonly phoneField: Locator;
    readonly roleField: Locator;
    readonly boardField: Locator;
    readonly extField: Locator;
    readonly extSecond: Locator;
    readonly extThird: Locator;
    readonly extFourth: Locator;
    readonly orderField: Locator;
    readonly teamLeadCheckbox: Locator;
    readonly isActiveCheckbox: Locator;
    readonly infoIcon: Locator;
    readonly dispatcherRole: Locator;
    readonly recruitingRole: Locator;
    readonly safetyRole: Locator;
    readonly b1Board: Locator;
    readonly snackMessage: Locator;
    readonly inviteButton: Locator;
    readonly permissionItem: Locator;
    readonly currentPermissionsBox: Locator;
    readonly errorMessage: Locator;
    readonly fmMenu: Locator;
    readonly fleetManager: Locator;
    readonly tooltip: Locator;
    readonly saveButton: Locator;
    readonly updateButton: Locator;
    readonly passwordField: Locator;
    readonly roleAndPasswordErrorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.emailField = page.getByRole('textbox', { name: 'Email' });
        this.nameField = page.getByRole('textbox', { name: 'Name' });
        this.phoneField = page.getByRole('textbox', { name: 'Phone number' });
        this.roleField = page.getByRole('textbox', { name: 'Role', exact: true });
        this.fmMenu = page.getByRole('textbox', { name: 'FM city' });
        this.boardField = page.getByRole('textbox', { name: 'Board' });
        this.extField = page.getByRole('textbox', { name: 'Ext', exact: true });
        this.extSecond = page.getByRole('textbox', { name: 'Ext second' });
        this.extThird = page.getByRole('textbox', { name: 'Ext third' });
        this.extFourth = page.getByRole('textbox', { name: 'Ext fourth' });
        this.orderField = page.getByPlaceholder('Order');
        this.teamLeadCheckbox = page.getByRole('dialog').getByText('Team lead');
        this.isActiveCheckbox = page.getByText('Is active', { exact: true });
        this.infoIcon = page.locator('.permisions-card .mdi.mdi-information-outline');
        this.dispatcherRole = page.getByRole('option', { name: 'Dispatcher' });
        this.recruitingRole = page.getByRole('option', { name: 'Recruiting' });
        this.fleetManager = page.getByRole('option', { name: 'Fleet Manager' });
        this.safetyRole = page.getByRole('option', { name: 'Safety' });
        this.b1Board = page.getByRole('option', { name: 'B1' });
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.inviteButton = page.locator('.v-btn__content', { hasText: 'Invite' });
        this.saveButton = page.locator('.v-btn__content', { hasText: 'Save' });
        this.updateButton = page.locator('.v-btn__content', { hasText: 'Update' });
        this.permissionItem = page.locator('.v-chip--label.theme--light.v-size--small.primary').first();
        this.currentPermissionsBox = page.locator('.permisions-card.v-card .container').first();
        this.errorMessage = page.locator('.v-messages.theme--light.error--text');
        this.tooltip = page.locator('.v-tooltip__content.menuable__content__active');
        this.passwordField = page.getByPlaceholder('Password');
        this.roleAndPasswordErrorMessage = page.getByText('User validation failed:');
    }

    async enterData(textbox: Locator, text: string): Promise<void> {
        await this.fillInputField(textbox, text)
    }

    async editData(textbox: Locator, text: string): Promise<void> {
        await this.fillInputFieldEdit(textbox, text)
    }

    async selectOptionFromMenu(menu: Locator, optionFromMenu: Locator): Promise<void> {
        await this.selectFromMenu(menu, optionFromMenu);
    }

    async checkCheckbox(checkbox: Locator): Promise<void> {
        await this.check(checkbox);
    }

    async enterOrder(textbox: Locator, text: string): Promise<void> {
        await this.orderField.clear();
        await this.fillInputField(textbox, text)
    }

    async dragAndDrop(): Promise<void> {
        await this.permissionItem.dragTo(this.currentPermissionsBox);
    }

    async enterPassword(text: string): Promise<void> {
        await this.passwordField.click();
        await this.passwordField.fill(text);
    }
}