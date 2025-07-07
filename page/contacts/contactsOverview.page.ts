import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class ContactsPage extends BasePage {
    readonly page: Page;
    readonly addContactButton: Locator;
    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly searchField: Locator;
    readonly nameColumn: Locator;
    readonly floydExtColumn: Locator;
    readonly trytimeExtColumn: Locator;
    readonly rocketExtColumn: Locator;
    readonly jordanExtColumn: Locator;
    readonly phoneNumberColumn: Locator;
    readonly emailColumn: Locator;
    readonly positionColumn: Locator;
    readonly companyColumn: Locator;
    readonly isActiveColumn: Locator;
    readonly dialogbox: Locator;
    readonly snackMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addContactButton = page.locator('.mdi-plus');
        this.pencilIcon = page.locator('.mdi-pencil');
        this.deleteIcon = page.locator('.mdi-delete');
        this.searchField = page.locator('.v-input.v-input--hide-details.v-input--dense');
        this.nameColumn = page.locator('tr td:nth-child(1)');
        this.floydExtColumn = page.locator('tr td:nth-child(2)');
        this.trytimeExtColumn = page.locator('tr td:nth-child(3)');
        this.rocketExtColumn = page.locator('tr td:nth-child(4)');
        this.jordanExtColumn = page.locator('tr td:nth-child(5)');
        this.phoneNumberColumn = page.locator('tr td:nth-child(6)');
        this.emailColumn = page.locator('tr td:nth-child(7)');
        this.positionColumn = page.locator('tr td:nth-child(8)');
        this.companyColumn = page.locator('tr td:nth-child(9)');
        this.isActiveColumn = page.locator('tr td:nth-child(10)');
        this.dialogbox = page.locator('.v-dialog.v-dialog--active');
        this.snackMessage = page.locator('.v-snack__wrapper');
    }

    async searchContact(searchField: Locator, email: string): Promise<void> {
        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/api/contacts')
            ),
            await this.fillInputField(searchField, email)
        ]);
        expect([200, 304]).toContain(response.status());
    }
}
