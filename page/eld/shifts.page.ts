import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class EldShiftsPage extends BasePage {
    readonly page: Page;
    readonly cardConent: Locator;
    readonly shiftCard: Locator;
    readonly availableUsers: Locator;
    readonly usersFromShiftCard: Locator;
    readonly addShiftButton: Locator;
    readonly editShiftIcon: Locator;
    readonly removeAllUsersButton: Locator;
    readonly xIcon: Locator;
    readonly dayMenu: Locator;
    readonly searchField: Locator;
    readonly selectedUser: Locator;
    readonly addButtonInModal: Locator;
    readonly deleteButtonInModal: Locator;
    readonly activeDialogbox: Locator;
    readonly loader: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.cardConent = page.locator('.users');
        this.shiftCard = page.locator('.row.cards .v-card');
        this.availableUsers = page.locator('.row.users-eld .v-chip__content');
        this.usersFromShiftCard = page.locator('.users .v-chip__content');
        this.addShiftButton = page.locator('.mdi-plus');
        this.editShiftIcon = page.locator('.mdi-pencil');
        this.removeAllUsersButton = page.locator('.mdi-account-multiple-remove-outline');
        this.xIcon = page.locator('.mdi-close-circle');
        this.dayMenu = page.locator('.v-select__selection--comma');
        this.searchField = page.locator('.row.users-eld .v-input__slot');
        this.selectedUser = page.locator('.theme--light.v-size--default.info .v-chip__content');
        this.addButtonInModal = page.locator('.v-btn__content', { hasText: 'Add' });
        this.deleteButtonInModal = page.locator('.v-btn__content', { hasText: 'Delete' });
        this.activeDialogbox = page.locator('.v-dialog--active');
        this.loader = page.getByRole('banner').getByRole('progressbar').locator('div').nth(1);
    }

    async removeUserFromShift(userName: string) {
        const count = await this.usersFromShiftCard.count();
        for (let i = 0; i < count; i++) {
            const chip = this.usersFromShiftCard.nth(i);
            const text = (await chip.textContent())?.trim();
            if (text === userName) {
                await chip.locator(this.xIcon).click();
                break;
            }
        }
    }

    async addUserToShift(userName: string, shift: Locator) {
        const count = await this.availableUsers.count();
        for (let i = 0; i < count; i++) {
            const chip = this.availableUsers.nth(i);
            const text = (await chip.textContent())?.trim();
            if (text === userName) {
                await chip.dragTo(shift);
                break;
            }
        }
    }

    async searchUsers(searchField: Locator, userName: string) {
        await this.fillInputField(searchField, userName);
    };

    async addShift(): Promise<void> {
        await this.addShiftButton.click();
        await this.addButtonInModal.waitFor({ state: 'visible', timeout: 2000 });
        const response = await Promise.all([
            this.page.waitForResponse(response =>
                response.url().includes('api/shifts') &&
                (response.status() === 200 || response.status() === 304)
            ),
            await this.addButtonInModal.click()
        ]).then(([response]) => response);

    }

    async deleteShift(): Promise<void> {
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await this.editShiftIcon.last().click();
        await this.deleteButtonInModal.waitFor({ state: 'visible', timeout: 2000 });
        const response = await Promise.all([
            this.page.waitForResponse(response =>
                response.url().includes('api/shifts') &&
                (response.status() === 200 || response.status() === 304)
            ),
            await this.deleteButtonInModal.click()
        ]).then(([response]) => response);

    }
}
