import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class TruckModelPage extends BasePage {
    readonly page: Page;
    readonly pencilIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly modelNameColumn: Locator;
    readonly snackMessage: Locator;
    readonly isActiveColumn: Locator;
    readonly addModelIcon: Locator;
    readonly nameTypeField: Locator;
    readonly isActiveCheckbox: Locator;
    readonly addEditModal: Locator;
    readonly errorMessage: Locator;
    readonly noteField: Locator;
    readonly noteColumn: Locator;
    readonly truckMakeColumn: Locator;
    readonly volvoModelOption: Locator;
    readonly freightlinerOption: Locator;
    readonly makeMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.pencilIcon = page.locator('.mdi-pencil');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.modelNameColumn = page.locator('tr td:nth-child(1)');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.isActiveColumn = page.locator('tr td:nth-child(4)');
        this.addModelIcon = page.locator('.mdi.mdi-plus');
        this.nameTypeField = page.locator('#name');
        this.noteField = page.locator('#note');
        this.isActiveCheckbox = page.locator('.v-label.theme--light', { hasText: 'Is active' });
        this.addEditModal = page.locator('.v-dialog.v-dialog--active.v-dialog--persistent .v-card.v-sheet.theme--light');
        this.errorMessage = page.locator('.v-messages__message');
        this.noteColumn = page.locator('tr td:nth-child(2)');
        this.truckMakeColumn = page.locator('tr td:nth-child(3)');
        this.volvoModelOption = page.getByRole('option', { name: 'VOLVO', exact: true });
        this.freightlinerOption = page.getByRole('option', { name: 'FREIGHTLINER', exact: true });
        this.makeMenu = page.locator('.v-dialog--active .v-card.v-sheet .v-select__slot');
    }

    async selectMake(modelField: Locator, model: Locator): Promise<void> {
        await this.selectFromMenu(modelField, model)
    }

    async fillNote(noteField: Locator, note: string): Promise<void> {
        await this.fillInputField(noteField, note);
    }

    async fillName(nameField: Locator, name: string): Promise<void> {
        await this.fillInputField(nameField, name);
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
