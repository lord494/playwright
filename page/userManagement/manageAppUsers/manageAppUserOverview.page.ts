import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../helpers/base";

export class ManageAppUserPage extends BasePage {
    readonly page: Page;
    readonly nameOrEmailSearchInputField: Locator;
    readonly phoneNumberSearchInputField: Locator;
    readonly statusDropdown: Locator;
    readonly searchDispatcherInputField: Locator;
    readonly connectDriverIcon: Locator;
    readonly forbidSelfDispatch: Locator;
    readonly allowSelfDispatch: Locator;
    readonly verifyIconIcon: Locator;
    readonly unverifyIcon: Locator;
    readonly notVerifiedOption: Locator;
    readonly card: Locator;
    readonly cardTitle: Locator;
    readonly emailOnDispatcherCard: Locator;
    readonly nameOnDispatcherCard: Locator;
    readonly xIcon: Locator;
    readonly driverTestOption: Locator;
    readonly testUserOption: Locator;
    readonly driverMenu: Locator;
    readonly saveButton: Locator;
    readonly connectDriverModal: Locator;
    readonly snackMessage: Locator;
    readonly dispathersInCard: Locator;
    readonly xIconOnDispatherField: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.nameOrEmailSearchInputField = page.locator('.TableFilters__field.v-input--hide-details.v-input--dense.theme--light').first();
        this.phoneNumberSearchInputField = page.locator('.TableFilters__field.v-input--hide-details.v-input--dense.theme--light').nth(1);
        this.statusDropdown = page.locator('.v-select__selections');
        this.searchDispatcherInputField = page.locator('.dispatchers-search');
        this.connectDriverIcon = page.locator('.mdi-account-multiple-plus');
        this.forbidSelfDispatch = page.locator('.mdi-radiobox-blank');
        this.allowSelfDispatch = page.locator('.mdi-checkbox-marked-circle-outline');;
        this.verifyIconIcon = page.locator('.v-btn--round.theme--light.v-size--small.warning');
        this.unverifyIcon = page.locator('.v-btn--round.theme--light.v-size--small.success').first();
        this.notVerifiedOption = page.getByRole('option', { name: 'Not verified', exact: true });
        this.card = page.locator('.v-card.v-sheet.v-sheet--outlined');
        this.cardTitle = page.locator('.v-card__title');
        this.emailOnDispatcherCard = page.locator('.disp-chip-email');
        this.nameOnDispatcherCard = page.locator('.mt-2.dispatchers-box .disp-chip-name');
        this.xIcon = page.locator('.mdi-close');
        this.driverTestOption = page.getByRole('option', { name: 'driverTest', exact: true });
        this.testUserOption = page.getByRole('option', { name: 'TestUser', exact: true });
        this.driverMenu = page.locator('.v-select__slot').last();
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.connectDriverModal = page.locator('.v-dialog--active.v-dialog--persistent');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.dispathersInCard = page.locator('.dispatchers .v-chip__content');
        this.xIconOnDispatherField = page.locator('.mdi.mdi-close-circle');
    }

    async fillNameOrEmailSearchField(locator: Locator, nameOrEmail: string): Promise<void> {
        await this.fillInputField(locator, nameOrEmail);
    }

    async fillPhoneNumberInSearchField(locator: Locator, phoneNumber: string): Promise<void> {
        await this.fillInputField(locator, phoneNumber);
    }

    async selectStatusFromMenu(locator: Locator, option: Locator): Promise<void> {
        await this.selectFromMenu(locator, option);
    }

    async fillDispatcherNameInDispatcherField(locator: Locator, nameOrEmail: string): Promise<void> {
        await this.fillInputField(locator, nameOrEmail);
    }

    async selectDriverFromMenu(locator: Locator, nameOrEmail: string, locator2: Locator): Promise<void> {
        await this.clickElement(this.connectDriverIcon);
        await this.fillAndSelectDriver(locator, nameOrEmail, locator2);
    }
}
