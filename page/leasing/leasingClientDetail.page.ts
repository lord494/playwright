import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';

/**
 * Page object for the Leasing Client detail/overview page at
 * `/leasing/client/{id}`. Reached by clicking the eye icon on a row in
 * `/leasing/clients`. Currently covers only what the New Company tests need
 * (Presidents section verification).
 */
export class LeasingClientDetailPage extends BasePage {
    readonly page: Page;

    readonly presidentsHeader: Locator;
    /** Block containing the Presidents header + its associated content. */
    readonly presidentsSection: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.presidentsHeader = page.locator('h1,h2,h3,h4,h5,.title').filter({ hasText: /^\s*Presidents\s*$/ });
        // Pick the closest enclosing block — the Presidents card/section sits
        // immediately around the header.
        this.presidentsSection = this.presidentsHeader.locator('xpath=ancestor::div[contains(@class,"v-card") or contains(@class,"col") or contains(@class,"row")][1]');
    }

    async expectOnDetailUrl(): Promise<void> {
        await this.page.waitForURL(/\/leasing\/client\/\d+/, { timeout: 10000 });
    }

    async expectPresidentVisible(fullName: string): Promise<void> {
        await this.presidentsHeader.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.presidentsSection).toContainText(fullName, { timeout: 10000 });
    }
}
