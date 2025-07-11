import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class YardsPage extends BasePage {
    readonly page: Page;
    readonly addYards: Locator;
    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly nameColumn: Locator;
    readonly typeColumn: Locator;
    readonly isActiveColumn: Locator;
    readonly isSpecialColumn: Locator;
    readonly orderColumn: Locator;
    readonly dialogBox: Locator;
    readonly snackMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addYards = page.locator('.mdi-plus');
        this.pencilIcon = page.locator('.mdi-pencil');
        this.deleteIcon = page.locator('.mdi-delete');
        this.nameColumn = page.locator('tr td:nth-child(1)');
        this.typeColumn = page.locator('tr td:nth-child(3)');
        this.isActiveColumn = page.locator('tr td:nth-child(2)');
        this.isSpecialColumn = page.locator('tr td:nth-child(4)')
        this.orderColumn = page.locator('tr td:nth-child(5)');
        this.dialogBox = page.locator('.v-dialog--active');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content');
    }
}

