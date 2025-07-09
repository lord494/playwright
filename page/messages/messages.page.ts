import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class MessagePage extends BasePage {
    readonly page: Page;
    readonly addMessageButton: Locator;
    readonly eyeIcon: Locator;
    readonly nameColumn: Locator;
    readonly contentColumn: Locator;
    readonly dialogBox: Locator;
    readonly okButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addMessageButton = page.locator('.mdi-plus');
        this.eyeIcon = page.locator('.mdi-eye');
        this.nameColumn = page.locator('tr td:nth-child(1)');
        this.contentColumn = page.locator('tr td:nth-child(2)');
        this.dialogBox = page.locator('.v-dialog.v-dialog--active ');
        this.okButton = page.locator('.v-btn__content', { hasText: 'OK' });
    }
}