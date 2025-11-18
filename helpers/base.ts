import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;
    private generatedEmail: string;

    constructor(page: Page) {
        this.page = page;
        this.generatedEmail = '';
    }

    async clickElement(locator: Locator) {
        await locator.waitFor();
        await locator.click();
    }

    async fillInputField(locator: Locator, text: string): Promise<void> {
        await locator.waitFor();
        await locator.click();
        await locator.type(text);
    }

    async fillAndSelectFromMenu(locator: Locator, text: string, locator2: Locator): Promise<void> {
        await locator.waitFor();
        await locator.click();
        await locator.type(text, { delay: 30 });
        await locator2.click();
    }

    async fillAndSelectDriver(locator: Locator, text: string, locator2: Locator, timeout: number = 2000): Promise<void> {
        await locator.waitFor();
        await locator.click();
        await locator.type(text, { delay: 30, timeout });
        await locator2.waitFor({ state: 'visible', timeout: 3000 });
        await locator2.click();
    }

    async fillInputFieldEdit(locator: Locator, text: string): Promise<void> {
        await locator.waitFor();
        await locator.click();
        await locator.clear();
        await locator.type(text, { delay: 30 });
    }

    async selectFromMenu(menu: Locator, optionFromMenu: Locator) {
        await menu.waitFor({ state: 'visible', timeout: 3000 });
        await menu.click();
        //await this.page.waitForLoadState('networkidle');
        await optionFromMenu.click();
    }

    async selectRecruiterFromMenu(menu: Locator, optionFromMenu: Locator) {
        await menu.waitFor({ state: 'visible', timeout: 3000 });
        await menu.click();
        await this.page.waitForTimeout(500);
        await optionFromMenu.click();
    }

    async uncheck(toggleButton: Locator): Promise<void> {
        if (await toggleButton.isChecked()) {
            await toggleButton.click();
        }
    }

    async check(toggleButton: Locator): Promise<void> {
        const isChecked = await toggleButton.isChecked();
        if (!isChecked) {
            await toggleButton.click();
        }
    }

    generateUniqueEmail(): string {
        const timestamp = Date.now();
        this.generatedEmail = `playwrightTest${timestamp}@gm.com`;
        return this.generatedEmail;
    }

    // === Global buttons that appear across many pages ===

    async clickSaveButton(): Promise<void> {
        const saveButton = this.page.locator('.v-btn__content', { hasText: 'Save' });
        await this.clickElement(saveButton);
    }

    async clickAddButton(): Promise<void> {
        const addButton = this.page.locator('.v-btn__content', { hasText: 'Add' });
        await this.clickElement(addButton);
    }
}