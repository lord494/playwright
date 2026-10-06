import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

// /leasing/manage-sales — verified against staging DOM + network 2026-10-06.
//   - One card per active SALES user, each wrapped in a .v-lazy that only renders
//     its .v-card once scrolled into view (39 users, ~9-18 rendered at load).
//   - Several users share a name (16x "editTestUser"), so card lookups by name
//     are only reliable for the unique-named sandbox reps in Constants.
//   - "Search sales" is server-side (GET /api/users?search -> grouped-by-representatives).
//   - "Search companies" filters the right-hand pool client-side (no request).
//   - Drag pool -> card: PUT /ms-leasing/company/change-representative
//     Chip X / Untie All: native confirm, then PUT /ms-leasing/company/remove-representative
//     Move All: dialog with required target select, then change-representative
export class LeasingManageSalesPage extends BasePage {
    readonly page: Page;

    readonly wrapper: Locator;
    readonly searchForm: Locator;
    readonly searchSalesInput: Locator;
    readonly searchSalesClearButton: Locator;
    readonly searchSalesButton: Locator;

    readonly cardsContainer: Locator;
    readonly lazyCards: Locator;
    readonly salesCards: Locator;
    readonly salesNames: Locator;
    // One of each per rendered card, so .nth(i) lines up with salesCards.nth(i)
    readonly salesCardMoveAllButtons: Locator;
    readonly salesCardUntieAllButtons: Locator;

    readonly companiesColumn: Locator;
    readonly searchCompaniesInput: Locator;
    readonly searchCompaniesClearButton: Locator;
    readonly unassignedCompaniesPool: Locator;
    readonly unassignedCompanyChips: Locator;

    readonly moveAllDialog: Locator;
    readonly moveAllDialogTitle: Locator;
    readonly moveAllSelect: Locator;
    readonly moveAllSelectSlot: Locator;
    readonly moveAllValidationMessage: Locator;
    readonly moveAllSubmitButton: Locator;
    readonly moveAllCancelButton: Locator;
    readonly moveAllMenu: Locator;
    readonly moveAllMenuOptions: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.wrapper = page.locator('.manage-sales-wrapper');
        this.searchForm = this.wrapper.locator('form');
        this.searchSalesInput = this.searchForm.locator('input[type="text"]');
        this.searchSalesClearButton = this.searchForm.locator('button[aria-label="clear icon"]');
        this.searchSalesButton = this.searchForm.getByRole('button', { name: Constants.manageSalesSearchButtonLabel, exact: true });

        this.cardsContainer = this.wrapper.locator('.manage-sales-container');
        this.lazyCards = this.cardsContainer.locator('.v-lazy');
        this.salesCards = this.cardsContainer.locator('.v-card');
        this.salesNames = this.salesCards.locator('.representative-name');
        this.salesCardMoveAllButtons = this.salesCards.getByRole('button', { name: Constants.manageSalesMoveAllButtonLabel });
        this.salesCardUntieAllButtons = this.salesCards.getByRole('button', { name: Constants.manageSalesUntieAllButtonLabel });

        // NOTE: typo in app — class is "comapnies-without-representative-holder"
        this.unassignedCompaniesPool = this.wrapper.locator('.comapnies-without-representative-holder');
        this.unassignedCompanyChips = this.unassignedCompaniesPool.locator('.my-chip');
        this.companiesColumn = this.wrapper.locator('.col', { has: page.locator('.comapnies-without-representative-holder') });
        this.searchCompaniesInput = this.companiesColumn.locator('.v-text-field input[type="text"]');
        this.searchCompaniesClearButton = this.companiesColumn.locator('button[aria-label="clear icon"]');

        this.moveAllDialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__title', { hasText: Constants.manageSalesMoveAllDialogTitle }),
        });
        this.moveAllDialogTitle = this.moveAllDialog.locator('.v-card__title');
        this.moveAllSelect = this.moveAllDialog.locator('.v-select', {
            has: page.locator('label', { hasText: Constants.manageSalesMoveAllSelectLabel }),
        });
        this.moveAllSelectSlot = this.moveAllSelect.locator('.v-input__slot');
        this.moveAllValidationMessage = this.moveAllSelect.locator('.v-messages__message');
        this.moveAllSubmitButton = this.moveAllDialog.getByRole('button', { name: Constants.manageSalesSubmitButtonLabel, exact: true });
        this.moveAllCancelButton = this.moveAllDialog.getByRole('button', { name: Constants.manageSalesCancelButtonLabel, exact: true });
        this.moveAllMenu = page.locator('.menuable__content__active');
        this.moveAllMenuOptions = this.moveAllMenu.locator('.v-list-item__title');
    }

    // ===== LOAD =====

    async open(): Promise<void> {
        await this.loadPage(() => this.page.goto(Constants.manageSalesUrl));
    }

    // ===== SEARCH SALES (server-side) =====

    async typeSalesSearch(text: string): Promise<void> {
        await this.fillInputField(this.searchSalesInput, text);
    }

    /** Types `text`, clicks Search and waits until one lazy card per matched user exists. Returns that count. */
    async searchSales(text: string): Promise<number> {
        await this.typeSalesSearch(text);
        return this.submitSalesSearch(() => this.clickElement(this.searchSalesButton));
    }

    async searchSalesWithEnter(text: string): Promise<number> {
        await this.typeSalesSearch(text);
        return this.submitSalesSearch(() => this.searchSalesInput.press('Enter'));
    }

    async clearSalesSearch(): Promise<number> {
        return this.submitSalesSearch(() => this.clickElement(this.searchSalesClearButton));
    }

    // ===== SALES CARDS =====

    getSalesCard(salesName: string): Locator {
        return this.salesCards.filter({
            has: this.page.locator('.representative-name').filter({ hasText: this.exactText(salesName) }),
        });
    }

    getSalesCardChips(salesName: string): Locator {
        return this.getSalesCard(salesName).locator('.companies .v-chip');
    }

    getSalesCardChip(salesName: string, companyName: string): Locator {
        return this.getSalesCardChips(salesName).filter({ hasText: this.exactText(companyName) });
    }

    getMoveAllButton(salesName: string): Locator {
        return this.getSalesCard(salesName).locator('button.move-all-btn');
    }

    getUntieAllButton(salesName: string): Locator {
        return this.getSalesCard(salesName).locator('button.untie-all-btn');
    }

    async getChipCountForCardAt(index: number): Promise<number> {
        return this.salesCards.nth(index).locator('.companies .v-chip').count();
    }

    async getSalesCardChipTexts(salesName: string): Promise<string[]> {
        return this.trimmed(await this.getSalesCardChips(salesName).allTextContents());
    }

    /** Scrolls every lazy placeholder into view so each card is rendered, then returns all names. */
    async getAllSalesNames(): Promise<string[]> {
        const total = await this.lazyCards.count();
        for (let i = 0; i < total; i++) {
            const lazy = this.lazyCards.nth(i);
            await lazy.scrollIntoViewIfNeeded();
            await lazy.locator('.v-card').waitFor({ state: 'visible' });
        }
        return this.trimmed(await this.salesNames.allTextContents());
    }

    /** Scrolls lazy placeholders into view one by one until the card of `salesName` is rendered. */
    async revealSalesCard(salesName: string): Promise<void> {
        const card = this.getSalesCard(salesName);
        const total = await this.lazyCards.count();
        for (let i = 0; i < total && (await card.count()) === 0; i++) {
            const lazy = this.lazyCards.nth(i);
            await lazy.scrollIntoViewIfNeeded();
            await lazy.locator('.v-card').waitFor({ state: 'visible' });
        }
        await card.scrollIntoViewIfNeeded();
    }

    // ===== COMPANIES POOL (client-side filter) =====

    getUnassignedCompanyChip(companyName: string): Locator {
        return this.unassignedCompanyChips.filter({ hasText: this.exactText(companyName) });
    }

    async getUnassignedCompanyTexts(): Promise<string[]> {
        return this.trimmed(await this.unassignedCompanyChips.allTextContents());
    }

    async searchCompanies(text: string): Promise<void> {
        await this.waitForPoolChange(() => this.fillInputField(this.searchCompaniesInput, text));
    }

    async clearCompanySearch(): Promise<void> {
        await this.waitForPoolChange(() => this.clickElement(this.searchCompaniesClearButton));
    }

    // ===== ASSIGN / REMOVE =====

    async dragCompanyToSales(companyName: string, salesName: string): Promise<void> {
        const chip = this.getUnassignedCompanyChip(companyName);
        const dropZone = this.getSalesCard(salesName).locator('.companies');
        await chip.waitFor({ state: 'visible' });
        await dropZone.waitFor({ state: 'visible' });
        await Promise.all([
            this.page.waitForResponse(res => this.isMutation(res, '/ms-leasing/company/change-representative')),
            chip.dragTo(dropZone),
        ]);
        await this.getSalesCardChip(salesName, companyName).waitFor({ state: 'visible' });
    }

    /** Clicks the chip X and dismisses the native confirm. Returns the confirm message. */
    async clickRemoveCompanyAndDismiss(salesName: string, companyName: string): Promise<string> {
        return this.handleNextConfirm(false, () => this.clickElement(this.chipCloseButton(salesName, companyName)));
    }

    /** Clicks the chip X, accepts the confirm and waits for the backend + re-render. Returns the confirm message. */
    async removeCompanyFromSales(salesName: string, companyName: string): Promise<string> {
        const chip = this.getSalesCardChip(salesName, companyName);
        const [, message] = await Promise.all([
            this.page.waitForResponse(res => this.isMutation(res, '/ms-leasing/company/remove-representative')),
            this.handleNextConfirm(true, () => this.clickElement(this.chipCloseButton(salesName, companyName))),
        ]);
        await chip.waitFor({ state: 'detached' });
        await this.getUnassignedCompanyChip(companyName).waitFor({ state: 'attached' });
        return message;
    }

    async clickUntieAllAndDismiss(salesName: string): Promise<string> {
        return this.handleNextConfirm(false, () => this.clickElement(this.getUntieAllButton(salesName)));
    }

    /** Accepts the Untie All confirm and waits for both lists to be re-fetched. Returns the confirm message. */
    async untieAllCompanies(salesName: string): Promise<string> {
        const [, , , message] = await Promise.all([
            this.page.waitForResponse(res => this.isMutation(res, '/ms-leasing/company/remove-representative')),
            this.page.waitForResponse(res => this.isGroupedResponse(res)),
            this.page.waitForResponse(res => this.isPoolResponse(res)),
            this.handleNextConfirm(true, () => this.clickElement(this.getUntieAllButton(salesName))),
        ]);
        return message;
    }

    // ===== MOVE ALL DIALOG =====

    async openMoveAllDialog(salesName: string): Promise<void> {
        await this.clickElement(this.getMoveAllButton(salesName));
        await this.moveAllDialog.waitFor({ state: 'visible' });
    }

    async clickMoveAllSubmit(): Promise<void> {
        await this.clickElement(this.moveAllSubmitButton);
    }

    async cancelMoveAllDialog(): Promise<void> {
        await this.clickElement(this.moveAllCancelButton);
        await this.moveAllDialog.waitFor({ state: 'hidden' });
    }

    async getMoveAllTargetOptions(): Promise<string[]> {
        await this.clickElement(this.moveAllSelectSlot);
        await this.moveAllMenuOptions.first().waitFor({ state: 'visible' });
        const options = this.trimmed(await this.moveAllMenuOptions.allTextContents());
        await this.page.keyboard.press('Escape');
        await this.moveAllMenu.waitFor({ state: 'hidden' });
        return options;
    }

    async selectMoveAllTarget(targetName: string): Promise<void> {
        await this.clickElement(this.moveAllSelectSlot);
        await this.clickElement(this.moveAllMenuOptions.filter({ hasText: this.exactText(targetName) }).first());
        await this.moveAllMenu.waitFor({ state: 'hidden' });
    }

    async moveAllCompanies(sourceName: string, targetName: string): Promise<void> {
        await this.openMoveAllDialog(sourceName);
        await this.selectMoveAllTarget(targetName);
        await Promise.all([
            this.page.waitForResponse(res => this.isMutation(res, '/ms-leasing/company/change-representative')),
            this.page.waitForResponse(res => this.isGroupedResponse(res)),
            this.clickMoveAllSubmit(),
        ]);
        await this.moveAllDialog.waitFor({ state: 'hidden' });
    }

    // ===== INTERNALS =====

    private async loadPage(navigate: () => Promise<unknown>): Promise<void> {
        await Promise.all([
            this.page.waitForResponse(res => this.isGroupedResponse(res)),
            this.page.waitForResponse(res => this.isPoolResponse(res)),
            navigate(),
        ]);
        await this.lazyCards.first().locator('.v-card').waitFor({ state: 'visible' });
        await this.unassignedCompanyChips.first().waitFor({ state: 'visible' });
    }

    private async submitSalesSearch(trigger: () => Promise<void>): Promise<number> {
        const [usersResponse] = await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/api/users?') && res.url().includes('role_id=') && res.status() === 200),
            this.page.waitForResponse(res => this.isGroupedResponse(res)),
            trigger(),
        ]);
        const { docs } = await usersResponse.json() as { docs: unknown[] };
        await this.page.waitForFunction(
            ([selector, expected]) => document.querySelectorAll(selector as string).length === expected,
            ['.manage-sales-wrapper .manage-sales-container .v-lazy', docs.length] as const,
        );
        return docs.length;
    }

    // The pool filter runs synchronously on input, but Vue re-renders on the next
    // tick — wait until the chip count actually moves away from its previous value.
    private async waitForPoolChange(action: () => Promise<void>): Promise<void> {
        const selector = '.manage-sales-wrapper .comapnies-without-representative-holder .my-chip';
        const before = await this.unassignedCompanyChips.count();
        await action();
        await this.page.waitForFunction(
            ([sel, previous]) => document.querySelectorAll(sel as string).length !== previous,
            [selector, before] as const,
        );
    }

    private async handleNextConfirm(accept: boolean, action: () => Promise<void>): Promise<string> {
        let message = '';
        this.page.once('dialog', async dialog => {
            message = dialog.message();
            if (accept) await dialog.accept();
            else await dialog.dismiss();
        });
        await action();
        return message;
    }

    private chipCloseButton(salesName: string, companyName: string): Locator {
        return this.getSalesCardChip(salesName, companyName).locator('button[aria-label="Close"]');
    }

    private isGroupedResponse(res: Response): boolean {
        return res.url().includes('/ms-leasing/company/grouped-by-representatives') && res.status() === 200;
    }

    private isPoolResponse(res: Response): boolean {
        return res.url().includes('/ms-leasing/company/without-representative-role') && res.status() === 200;
    }

    private isMutation(res: Response, path: string): boolean {
        return res.url().includes(path) && res.request().method() === 'PUT' && res.status() === 200;
    }

    private exactText(text: string): RegExp {
        const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^\\s*${escaped}\\s*$`);
    }

    private trimmed(texts: string[]): string[] {
        return texts.map(t => t.trim()).filter(Boolean);
    }
}
