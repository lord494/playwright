import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddMessagePage extends BasePage {
    readonly page: Page;
    readonly titleField: Locator;
    readonly contentField: Locator;
    readonly dailyReportCheckbox: Locator;
    readonly weeklyReportCheckbox: Locator;
    readonly roleField: Locator;
    readonly userRole: Locator;
    readonly sendButton: Locator;
    readonly superadminRole: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.titleField = page.locator('#name');
        this.contentField = page.locator('#inspire #content');
        this.dailyReportCheckbox = page.getByText('Daily report for market updates?', { exact: true });
        this.weeklyReportCheckbox = page.getByText('Weekly report for market updates?', { exact: true });
        this.roleField = page.locator('.v-dialog--active .v-select__selections');
        this.userRole = page.getByText('USER', { exact: true })
        this.sendButton = page.locator('.v-btn__content', { hasText: 'Send' });
        this.superadminRole = page.getByText('SUPERADMIN', { exact: true })
        //.v-dialog--active .v-select__selection--disabled
    }

    async enterTitle(field: Locator, title: string): Promise<void> {
        await this.fillInputField(field, title);
    }

    async enterMessageContent(field: Locator, content: string): Promise<void> {
        await this.fillInputField(field, content);
    }

    async uncheck(checkbox: Locator): Promise<void> {
        if (await checkbox.isChecked()) {
            await checkbox.click();
        }
    }

    async isChecked(checkbox: Locator): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            await checkbox.click();
        }
    }

    async selectRole(roleMenu: Locator, role: Locator): Promise<void> {
        await roleMenu.click();
        await role.click();
    }
}