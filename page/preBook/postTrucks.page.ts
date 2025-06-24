import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class PostTrucksPage extends BasePage {
    readonly page: Page;
    readonly pencilIcon: Locator;
    readonly grayDeleteIcon: Locator;
    readonly truckIdColumn: Locator;
    readonly snackMessage: Locator;
    readonly originColumn: Locator;
    readonly addCompnayIcon: Locator;
    readonly availColumn: Locator;
    readonly destinationColumn: Locator;
    readonly noteColumn: Locator;
    readonly trailerTypeColumn: Locator;
    readonly postedByColumn: Locator;
    readonly availField: Locator;
    readonly originField: Locator;
    readonly destinatinField: Locator;
    readonly trailerTypeField: Locator;
    readonly noteField: Locator;
    readonly todayDateInDatepicker: Locator;
    readonly saveButton: Locator;
    readonly originOption: Locator;
    readonly destinationOption: Locator;
    readonly trailerTypeOption: Locator;
    readonly dialogbox: Locator;
    readonly miamiOption: Locator;
    readonly newYorkOption: Locator;
    readonly secondTrailerType: Locator;
    readonly idColumn: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.pencilIcon = page.locator('.mdi-pencil');
        this.grayDeleteIcon = page.locator('.mdi-delete');
        this.truckIdColumn = page.locator('tr td:nth-child(1)');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content').first();
        this.originColumn = page.locator('tr td:nth-child(2)');
        this.addCompnayIcon = page.locator('.mdi.mdi-plus');
        this.availColumn = page.locator('tr td:nth-child(4)');
        this.destinationColumn = page.locator('tr td:nth-child(5)');
        this.noteColumn = page.locator('tr td:nth-child(8)');
        this.trailerTypeColumn = page.locator('tr td:nth-child(9)');
        this.postedByColumn = page.locator('tr td:nth-child(10)');
        this.availField = page.getByRole('button', { name: 'Avail *' });
        this.originField = page.getByRole('textbox', { name: 'Origin *' });
        this.destinatinField = page.getByRole('textbox', { name: 'Destination' });
        this.trailerTypeField = page.getByRole('textbox', { name: 'Trailer type *' });
        this.noteField = page.getByRole('textbox', { name: 'Note' });
        this.todayDateInDatepicker = page.locator('.v-btn.v-date-picker-table__current');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.originOption = page.getByRole('option', { name: 'East Washington, PA', exact: true });
        this.destinationOption = page.getByRole('option', { name: 'East Los Angeles, CA', exact: true });
        this.trailerTypeOption = page.getByRole('option', { name: 'R', exact: true });
        this.dialogbox = page.locator('.v-dialog.v-dialog--active');
        this.miamiOption = page.getByRole('option', { name: 'Miami, FL', exact: true });
        this.newYorkOption = page.getByRole('option', { name: 'New York, NY', exact: true });
        this.secondTrailerType = page.getByRole('option', { name: 'V', exact: true });
        this.idColumn = page.locator('tr td:nth-child(1)');
        this.errorMessage = page.locator('.v-messages__message');
    }

    async fillNote(noteField: Locator, note: string): Promise<void> {
        await this.fillInputField(noteField, note);
    }

    async selectAvail(availField: Locator, date: Locator): Promise<void> {
        await this.selectFromMenu(availField, date);
    }

    async selectOrigin(originMenu: Locator, origin: string, originOption: Locator) {
        await this.fillAndSelectFromMenu(originMenu, origin, originOption);
    }

    async selecDestination(destinationMenu: Locator, destination: string, destinationOption: Locator) {
        await this.fillAndSelectFromMenu(destinationMenu, destination, destinationOption);
    }

    async selectTrailerType(trailerTypeMenu: Locator, trailerType: Locator) {
        await this.selectFromMenu(trailerTypeMenu, trailerType);
    }
}
