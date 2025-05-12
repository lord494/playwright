import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class loadTypesPage extends BasePage {
    readonly page: Page;
    readonly pencilIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly typeColumn: Locator;
    readonly snackMessage: Locator;
    readonly isActiveColumn: Locator;
    readonly colorColumn: Locator;
    readonly addTypeIcon: Locator;
    readonly nameTypeField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly addEditModal: Locator;
    readonly errorMessage: Locator;
    readonly sliderThumb: Locator;
    readonly dotColorPicker: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.pencilIcon = page.locator('.mdi-pencil');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.typeColumn = page.locator('tr td:nth-child(1)');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.isActiveColumn = page.locator('tr td:nth-child(3)');
        this.colorColumn = page.locator('tr td:nth-child(2) .v-chip.theme--dark.v-size--default');
        this.addTypeIcon = page.locator('.mdi.mdi-plus');
        this.nameTypeField = page.locator('#name');
        this.isActiveCheckbox = page.locator('.v-label.theme--light', { hasText: 'Is active' });
        this.addEditModal = page.locator('.v-dialog.v-dialog--active.v-dialog--persistent .v-card.v-sheet.theme--light');
        this.errorMessage = page.locator('.v-messages__message');
        this.sliderThumb = page.locator('.v-slider__thumb.grey');
        this.dotColorPicker = page.locator('.v-color-picker__dot');
    }

    async fillBoardName(board: Locator, name: string): Promise<void> {
        await this.fillInputField(board, name);
    }

    async check(toggleButton: Locator): Promise<void> {
        const isChecked = await toggleButton.isChecked();
        if (!isChecked) {
            await toggleButton.click();
        }
    }

    async uncheck(toggleButton: Locator): Promise<void> {
        if (await toggleButton.isChecked()) {
            await toggleButton.click();
        }
    }
}
