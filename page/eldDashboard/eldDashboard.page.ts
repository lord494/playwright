import { Locator, Page } from "@playwright/test";
import { Constants } from '../../helpers/constants';
import { BasePage } from "../../helpers/base";

export class EldDashboardPage extends BasePage {
    readonly page: Page;
    readonly firstCell: Locator;
    readonly allCells: Locator;
    readonly lockedTrucks: Locator;
    readonly truckMenu: Locator;
    readonly callTypeMenu: Locator;
    readonly commentInput: Locator;
    readonly startButton: Locator;
    readonly addCommentButton: Locator;
    readonly deleteButton: Locator;
    readonly editButton: Locator;
    readonly problemCallTypeOption: Locator;
    readonly finishedCallTypeOption: Locator;
    readonly truckNumberFromMenu: Locator;
    readonly secondTruckNumberFromMenu: Locator;
    readonly snackMessage: Locator;
    readonly dialogBox: Locator;
    readonly truckMenuEdit: Locator;
    readonly callTypeFieldEdit: Locator;
    readonly firstCellEdit: Locator;
    readonly commentContent: Locator;
    readonly editCommentIcon: Locator;
    readonly deleteIconOnLockedChip: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.firstCell = page.locator('tr:nth-child(1) td:nth-child(4)');
        this.allCells = page.locator('.table-container-eld tr td');
        this.lockedTrucks = page.locator('.v-chip--removable.theme--light.v-size--small');
        this.truckMenu = page.getByRole('textbox', { name: 'Truck*' });
        this.callTypeMenu = page.getByRole('textbox', { name: 'Call type*' });
        this.commentInput = page.locator('.v-dialog--active .v-text-field__slot');
        this.startButton = page.locator('.v-btn__content', { hasText: 'Start' });
        this.addCommentButton = page.locator('.v-btn__content', { hasText: 'Add comment' });
        this.deleteButton = page.locator('.v-btn__content', { hasText: 'Delete' });
        this.editButton = page.locator('.v-btn__content', { hasText: 'Edit' });
        this.problemCallTypeOption = page.getByRole('option', { name: 'PROBLEM' });
        this.finishedCallTypeOption = page.getByRole('option', { name: 'FINISHED' });
        // Match by truck number only: the label also shows the truck's CURRENT driver, which other
        // features (drivers, dispatch dashboard, inactive drivers) reassign — e.g. '11996 - Wayne Jones / ...'.
        this.truckNumberFromMenu = page.getByRole('option', { name: new RegExp(`^${Constants.truckName} - `) });
        this.secondTruckNumberFromMenu = page.getByRole('option', { name: new RegExp(`^${Constants.secondTruckName} - `) });
        this.snackMessage = page.locator('.v-snack__content');
        this.dialogBox = page.locator('.v-dialog--active');
        this.truckMenuEdit = page.locator('.v-text-field.v-text-field--is-booted.v-select.v-autocomplete').first();
        this.callTypeFieldEdit = page.locator('.v-text-field.v-text-field--is-booted.v-select.v-autocomplete').last();
        this.firstCellEdit = page.locator('.table-container-eld tr:nth-child(1) td:nth-child(5)');
        this.commentContent = page.locator('.comment-text');
        this.editCommentIcon = page.locator('.mdi-pencil');
        this.deleteIconOnLockedChip = page.locator('.mdi-delete');
    }

    async handleTruckNumber(): Promise<void> {
        this.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        const cellTexts = await this.allCells.allTextContents();
        const has11996 = cellTexts.some(text => text.includes('11996'));
        if (has11996) {
            const cellWith11996 = this.page.locator('.table-container-eld td', { hasText: '11996' });
            await cellWith11996.click({ button: 'right' });
            await this.deleteButton.click();
            await this.dialogBox.waitFor({ state: 'hidden' });
        }
        if (await this.firstCell.isVisible()) {
            await this.firstCell.click({ button: 'right' });
        } else {
            await this.firstCellEdit.click({ button: 'right' });
            await this.deleteButton.click();
            await this.dialogBox.waitFor({ state: 'hidden' });
            await this.firstCell.click({ button: 'right' });
        }
    }

    async handleTruckNumber4721(): Promise<void> {
        this.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        const cellTexts = await this.allCells.allTextContents();
        const has4721 = cellTexts.some(text => text.includes('4721'));
        if (has4721) {
            const cellWith11996 = this.page.locator('.table-container-eld td', { hasText: '4721' });
            await cellWith11996.click({ button: 'right' });
            await this.deleteButton.click();
            await this.dialogBox.waitFor({ state: 'hidden' });
        }
        // No else-branch: it used to open the Edit-call modal itself, and the test's own
        // right-click on the same cell was then blocked by that modal's overlay.
    }

    async handleTruckNumberLocked(): Promise<void> {
        const lockedTruckTexts = await this.lockedTrucks.allTextContents();
        const has4721Locked = lockedTruckTexts.some(text => text.includes('4721'));
        if (has4721Locked) {
            const cellWith4721 = this.page.locator('.v-chip__content', { hasText: '4721' });
            await cellWith4721.locator(this.deleteIconOnLockedChip).click();
        }
    }

    async selectTruck(menu: Locator, truckNumber: string, truck: Locator): Promise<void> {
        await this.fillAndSelectFromMenu(menu, truckNumber, truck);
    }

    /** Edit-call modal: the truck field is prefilled with the current truck, so clear it before typing. */
    async changeTruck(menu: Locator, truckNumber: string, truck: Locator): Promise<void> {
        // menu is the Vuetify autocomplete wrapper — clear/type into its <input>.
        await this.fillInputFieldEdit(menu.locator('input[type="text"]'), truckNumber);
        await truck.click();
    }

    async selectCallType(menu: Locator, type: Locator): Promise<void> {
        await this.selectFromMenu(menu, type);
    }

    async enterComment(field: Locator, comment: string): Promise<void> {
        await this.fillInputField(field, comment);
        await this.addCommentButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}
