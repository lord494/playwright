import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class TruckMakePage extends BasePage {
    readonly page: Page;
    readonly pencilIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly makeNameColumn: Locator;
    readonly snackMessage: Locator;
    readonly isActiveColumn: Locator;
    readonly addMakeIcon: Locator;
    readonly nameMakeField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly addEditModal: Locator;
    readonly errorMessage: Locator;
    readonly noteField: Locator;
    readonly noteColumn: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.pencilIcon = this.page.locator('.mdi-pencil');
        this.grayDeleteIcon = this.page.locator('.mdi-delete');
        this.makeNameColumn = this.page.locator('tr td:nth-child(1)');
        this.snackMessage = this.page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.isActiveColumn = this.page.locator('tr td:nth-child(3)');
        this.addMakeIcon = this.page.locator('.mdi.mdi-plus');
        this.nameMakeField = this.page.locator('#name');
        this.noteField = this.page.locator('#note');
        this.isActiveCheckbox = this.page.locator('.v-label.theme--light', { hasText: 'Is active' });
        this.addEditModal = this.page.locator('.v-dialog.v-dialog--active.v-dialog--persistent .v-card.v-sheet.theme--light');
        this.errorMessage = this.page.locator('.v-messages__message');
        this.noteColumn = this.page.locator('tr td:nth-child(2)');
    }

    async fillMakeName(make: Locator, name: string): Promise<void> {
        await this.fillInputField(make, name);
    }

    async fillNote(noteField: Locator, note: string): Promise<void> {
        await this.fillInputField(noteField, note);
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
