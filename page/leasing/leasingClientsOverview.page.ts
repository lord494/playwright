import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export class LeasingClientsOverviewPage extends BasePage {
    readonly page: Page;

    readonly newCompanyButton: Locator;
    readonly newOwnerOperatorButton: Locator;
    readonly exportButton: Locator;

    readonly searchClientsInput: Locator;

    readonly allStatusRadio: Locator;
    readonly activeRadio: Locator;
    readonly inactiveRadio: Locator;

    readonly leasingSalesCheckbox: Locator;
    readonly recruitingCheckbox: Locator;
    readonly maintenanceCheckbox: Locator;
    readonly fuelCheckbox: Locator;

    readonly leasingSalesChip: Locator;
    readonly recruitingChip: Locator;
    readonly maintenanceChip: Locator;
    readonly fuelChip: Locator;

    readonly nameHeader: Locator;
    readonly clientTypeHeader: Locator;
    readonly clientStatusHeader: Locator;
    readonly presidentsHeader: Locator;
    readonly trucksHeader: Locator;
    readonly trailersHeader: Locator;
    readonly truckTakenApprovedHeader: Locator;
    readonly trailerTakenApprovedHeader: Locator;

    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly activeDialog: Locator;

    readonly nameHeaderFilterIcon: Locator;
    readonly clientTypeHeaderFilterIcon: Locator;
    readonly clientStatusHeaderFilterIcon: Locator;
    readonly presidentsHeaderFilterIcon: Locator;
    readonly filterPopover: Locator;
    readonly filterPopoverValueInput: Locator;
    readonly filterPopoverApplyButton: Locator;

    readonly saveFilterFab: Locator;
    readonly addFilterNameDialog: Locator;
    readonly addFilterNameInput: Locator;
    readonly addFilterNameSaveButton: Locator;
    readonly savedFiltersFab: Locator;
    readonly savedFiltersDialog: Locator;

    readonly paginationText: Locator;
    readonly nextPageButton: Locator;
    readonly prevPageButton: Locator;
    readonly rowsPerPageDropdown: Locator;
    readonly rowsPerPage10Option: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.newCompanyButton = page.getByRole('button', { name: Constants.newCompanyButtonLabel });
        this.newOwnerOperatorButton = page.getByRole('button', { name: Constants.newOwnerOperatorButtonLabel });
        this.exportButton = page.getByRole('button', { name: Constants.exportButtonLabel });

        this.searchClientsInput = page.getByRole('textbox', { name: Constants.leasingClientsSearchPlaceholder });

        this.allStatusRadio = page.getByRole('radio', { name: Constants.leasingClientsAllRadioLabel, exact: true });
        this.activeRadio = page.getByRole('radio', { name: Constants.leasingClientsActiveRadioLabel, exact: true });
        this.inactiveRadio = page.getByRole('radio', { name: Constants.leasingClientsInactiveRadioLabel, exact: true });

        this.leasingSalesCheckbox = page.getByRole('checkbox', { name: Constants.leasingClientsLeasingSalesLabel, exact: true });
        this.recruitingCheckbox = page.getByRole('checkbox', { name: Constants.leasingClientsRecruitingLabel, exact: true });
        this.maintenanceCheckbox = page.getByRole('checkbox', { name: Constants.leasingClientsMaintenanceLabel, exact: true });
        this.fuelCheckbox = page.getByRole('checkbox', { name: Constants.leasingClientsFuelLabel, exact: true });

        this.leasingSalesChip = page.locator('.v-chip', { has: page.locator('strong', { hasText: Constants.leasingClientsLeasingSalesLabel }) });
        this.recruitingChip = page.locator('.v-chip', { has: page.locator('strong', { hasText: Constants.leasingClientsRecruitingLabel }) });
        this.maintenanceChip = page.locator('.v-chip', { has: page.locator('strong', { hasText: Constants.leasingClientsMaintenanceLabel }) });
        this.fuelChip = page.locator('.v-chip', { has: page.locator('strong', { hasText: Constants.leasingClientsFuelLabel }) });

        this.nameHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnName, exact: true });
        this.clientTypeHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnClientType, exact: true });
        this.clientStatusHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnClientStatus, exact: true });
        this.presidentsHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnPresidents, exact: true });
        this.trucksHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnTrucks, exact: true });
        this.trailersHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnTrailers, exact: true });
        this.truckTakenApprovedHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnTruckTakenApproved, exact: true });
        this.trailerTakenApprovedHeader = page.getByRole('columnheader', { name: Constants.leasingClientsColumnTrailerTakenApproved, exact: true });

        this.pencilIcon = page.locator('.mdi-pencil');
        this.deleteIcon = page.locator('.mdi-delete');
        this.activeDialog = page.locator('.v-dialog--active');

        this.nameHeaderFilterIcon = page.locator('th[aria-label="Name"] [data-filter-icon="true"]');
        this.clientTypeHeaderFilterIcon = page.locator('th[aria-label="Client type"] [data-filter-icon="true"]');
        this.clientStatusHeaderFilterIcon = page.locator('th[aria-label="Client status"] [data-filter-icon="true"]');
        this.presidentsHeaderFilterIcon = page.locator('th[aria-label="Presidents"] [data-filter-icon="true"]');
        this.filterPopover = page.locator('.filters-menu-holder');
        this.filterPopoverValueInput = this.filterPopover.locator('input[type="text"]:not([readonly])');
        this.filterPopoverApplyButton = this.filterPopover.getByRole('button', { name: Constants.leasingClientsApplyButtonLabel });

        this.saveFilterFab = page.locator('button.v-btn--fab', { has: page.locator('.mdi-content-save') });
        this.addFilterNameDialog = page.locator('.v-dialog--active', { has: page.locator('h3', { hasText: Constants.leasingClientsAddFilterDialogTitle }) });
        this.addFilterNameInput = this.addFilterNameDialog.locator('input[name="label"]');
        this.addFilterNameSaveButton = this.addFilterNameDialog.getByRole('button', { name: Constants.leasingClientsSaveButtonLabel });
        this.savedFiltersFab = page.locator('button.v-btn--fab', { has: page.locator('.mdi-filter-check') });
        this.savedFiltersDialog = page.locator('.v-dialog--active', { hasText: Constants.leasingClientsSavedFiltersDialogTitle });

        this.paginationText = page.locator('.v-data-footer__pagination');
        this.nextPageButton = page.locator('.v-data-footer [aria-label="Next page"]');
        this.prevPageButton = page.locator('.v-data-footer [aria-label="Previous page"]');
        this.rowsPerPageDropdown = page.locator('.v-data-footer__select .v-select__selection--comma');
        this.rowsPerPage10Option = page.getByRole('option', { name: Constants.leasingClientsRowsPerPage10, exact: true });
    }

    async expectOnUrl(): Promise<void> {
        await this.page.waitForURL(Constants.leasingClientsUrlRegex);
    }

    async searchClients(text: string): Promise<void> {
        await this.fillInputField(this.searchClientsInput, text);
        await this.waitForNameFilterToApply(text);
    }

    private async waitForNameFilterToApply(value: string): Promise<void> {
        const needle = value.toLowerCase();
        await expect.poll(async () => {
            const names = await this.getNameColumnValues();
            return names.length > 0 && names.every(n => n.toLowerCase().includes(needle));
        }, { timeout: 10000, intervals: [200, 400, 800] }).toBeTruthy();
    }

    async selectAllStatus(): Promise<void> {
        await this.changeStatusRadio(this.allStatusRadio);
    }

    async selectActive(): Promise<void> {
        await this.changeStatusRadio(this.activeRadio);
        await this.waitForStatusColumnWithin(Constants.leasingClientsActiveStatusKeywords);
    }

    async selectInactive(): Promise<void> {
        await this.changeStatusRadio(this.inactiveRadio);
        await this.waitForStatusColumnWithin(Constants.leasingClientsInactiveStatusKeywords);
    }

    private async changeStatusRadio(radio: Locator): Promise<void> {
        await radio.click({ force: true });
        await this.page.waitForLoadState('networkidle');
        await this.page.locator('.v-data-table__progress').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        await expect(radio).toBeChecked();
        await expect(this.paginationText).toContainText(/\d+\s*-\s*\d+\s+of\s+\d+/, { timeout: 10000 });
    }

    /**
     * Polls the Client status column until it's non-empty AND every visible
     * value contains one of the `keywords` stems (e.g. "Active" matches both
     * "Active" and "Active Debtor"). The networkidle / progressbar /
     * pagination signals in `changeStatusRadio` fire before the rows actually
     * re-render with the filtered data, so without this poll a status read can
     * still see the previous (unfiltered) rows — the root cause of the flake.
     */
    private async waitForStatusColumnWithin(keywords: string[]): Promise<void> {
        await expect.poll(async () => {
            const statuses = await this.getClientStatusValues();
            return statuses.length > 0 && statuses.every(s => keywords.some(k => s.includes(k)));
        }, { timeout: 10000, intervals: [200, 400, 800] }).toBeTruthy();
    }

    async toggleLeasingSales(): Promise<void> {
        await this.leasingSalesCheckbox.click({ force: true });
        await this.page.waitForLoadState('networkidle');
    }

    async toggleRecruiting(): Promise<void> {
        await this.recruitingCheckbox.click({ force: true });
        await this.page.waitForLoadState('networkidle');
    }

    async toggleMaintenance(): Promise<void> {
        await this.maintenanceCheckbox.click({ force: true });
        await this.page.waitForLoadState('networkidle');
    }

    async toggleFuel(): Promise<void> {
        await this.fuelCheckbox.click({ force: true });
        await this.page.waitForLoadState('networkidle');
    }

    async openNewCompanyModal(): Promise<void> {
        await this.clickElement(this.newCompanyButton);
        await this.activeDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    async openNewOwnerOperatorModal(): Promise<void> {
        await this.clickElement(this.newOwnerOperatorButton);
        await this.activeDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    async openEditClientModalForFirstRow(): Promise<void> {
        await this.clickElement(this.pencilIcon.first());
        await this.activeDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Click the pencil icon on the first row containing `identifier` anywhere
     * in its cells. Tolerates the expandable-subrow layout that Owner Operators
     * with a middle name produce (the subrow has no pencil; pick the main row).
     * Caller is expected to have searched/filtered first.
     */
    async openEditClientModalForRow(identifier: string): Promise<void> {
        const row = this.getMainRowContaining(identifier);
        await row.waitFor({ state: 'visible', timeout: 10000 });
        await row.locator('.mdi-pencil').first().click();
        await this.activeDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    async filterByNameHeader(value: string): Promise<void> {
        await this.filterByHeader(Constants.leasingClientsColumnName, value);
    }

    async filterByHeader(headerLabel: string, value: string): Promise<void> {
        const filterIcon = this.page.locator(`th[aria-label="${headerLabel}"] [data-filter-icon="true"]`);
        await this.clickElement(filterIcon);
        await this.filterPopover.waitFor({ state: 'visible', timeout: 5000 });
        await this.filterPopoverValueInput.fill(value);
        const autocompleteOption = this.page.locator('.v-autocomplete__content .v-list-item').filter({ hasText: value }).first();
        await autocompleteOption.waitFor({ state: 'visible', timeout: 5000 });
        await autocompleteOption.click();
        await this.filterPopoverApplyButton.dispatchEvent('click');
        await this.filterPopover.waitFor({ state: 'hidden', timeout: 5000 });
        await this.waitForColumnFilterToApply(headerLabel, value);
    }

    private async waitForColumnFilterToApply(headerLabel: string, value: string): Promise<void> {
        const needle = value.toLowerCase();
        await expect.poll(async () => {
            const values = await this.getColumnValues(headerLabel);
            return values.length > 0 && values.every(v => v.toLowerCase().includes(needle));
        }, { timeout: 10000, intervals: [200, 400, 800] }).toBeTruthy();
    }

    async filterByClientType(isOwnerOperator: boolean): Promise<void> {
        await this.clickElement(this.clientTypeHeaderFilterIcon);
        await this.filterPopover.waitFor({ state: 'visible', timeout: 5000 });
        if (isOwnerOperator) {
            await this.filterPopover.locator('input[type="checkbox"]').first().click({ force: true });
        }
        await this.filterPopoverApplyButton.dispatchEvent('click');
        await this.filterPopover.waitFor({ state: 'hidden', timeout: 5000 });
        const expectedType = isOwnerOperator ? 'Owner' : Constants.leasingClientsClientTypeCompany;
        await this.waitForColumnFilterToApply(Constants.leasingClientsColumnClientType, expectedType);
    }

    async filterByClientStatus(status: string): Promise<void> {
        await this.clickElement(this.clientStatusHeaderFilterIcon);
        await this.filterPopover.waitFor({ state: 'visible', timeout: 5000 });
        const valueDropdown = this.filterPopover.locator('.v-input.v-select').last();
        await valueDropdown.click();
        const option = this.page.locator('.menuable__content__active').last().locator('.v-list-item').filter({ hasText: status }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.filterPopoverApplyButton.dispatchEvent('click');
        await this.filterPopover.waitFor({ state: 'hidden', timeout: 5000 });
        await this.waitForColumnFilterToApply(Constants.leasingClientsColumnClientStatus, status);
    }

    async saveCurrentFilter(filterName: string): Promise<void> {
        await this.saveFilterFab.click({ force: true });
        await this.addFilterNameDialog.waitFor({ state: 'visible', timeout: 5000 });
        await this.addFilterNameInput.fill(filterName);
        await Promise.all([
            this.page.waitForResponse(
                res => /\/api\//.test(res.url())
                    && ['POST', 'PUT'].includes(res.request().method())
                    && [200, 201, 204].includes(res.status()),
                { timeout: 10000 }
            ).catch(() => { }),
            this.clickElement(this.addFilterNameSaveButton),
        ]);
        await this.addFilterNameDialog.waitFor({ state: 'hidden', timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
    }

    getSavedFilterRow(filterName: string): Locator {
        return this.savedFiltersDialog.locator('tr', { has: this.page.locator('td', { hasText: filterName }) });
    }

    async restoreSavedFilter(filterName: string): Promise<void> {
        await this.openSavedFiltersDialog();
        const row = this.getSavedFilterRow(filterName);
        await row.waitFor({ state: 'visible', timeout: 5000 });
        await row.locator('.mdi-cached').click({ force: true });
        await this.savedFiltersDialog.waitFor({ state: 'hidden', timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
    }

    async deleteSavedFilter(filterName: string): Promise<void> {
        await this.openSavedFiltersDialog();
        const row = this.getSavedFilterRow(filterName);
        await row.waitFor({ state: 'visible', timeout: 5000 });
        this.page.once('dialog', async (dialog) => { await dialog.accept(); });
        await row.locator('.mdi-delete').click({ force: true });
        await row.waitFor({ state: 'detached', timeout: 5000 });
    }

    async openSavedFiltersDialog(): Promise<void> {
        await this.savedFiltersFab.click({ force: true });
        await this.savedFiltersDialog.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
        await expect.poll(
            async () => this.savedFiltersDialog.locator('tbody tr').count(),
            { timeout: 10000, intervals: [200, 400, 800] }
        ).toBeGreaterThan(0);
    }

    async setRowsPerPage10(): Promise<void> {
        await this.rowsPerPageDropdown.click({ force: true });
        const option = this.page.locator('.menuable__content__active').last().locator('.v-list-item').filter({ hasText: Constants.leasingClientsRowsPerPage10 }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.page.waitForLoadState('networkidle');
    }

    async goToNextPage(): Promise<void> {
        await this.nextPageButton.dispatchEvent('click');
        await this.page.waitForLoadState('networkidle');
    }

    async goToPrevPage(): Promise<void> {
        await this.prevPageButton.dispatchEvent('click');
        await this.page.waitForLoadState('networkidle');
    }

    async getPaginationText(): Promise<string> {
        await expect(this.paginationText).toContainText(/\d+\s*-\s*\d+\s+of\s+\d+/, { timeout: 10000 });
        return (await this.paginationText.textContent()) ?? '';
    }

    async getPaginationTotal(): Promise<number> {
        const text = await this.getPaginationText();
        const m = text.match(/of\s+(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
    }

    /**
     * Returns just the current page range portion of the footer (e.g. "1-15"
     * from "1-15 of 170"), WITHOUT the trailing "of <total>". The total is a
     * global count of all leasing clients and drifts whenever a concurrent
     * worker creates/deletes a client, so it must not be part of a navigation
     * assertion. The range alone reflects which page we're on and is stable
     * under parallel execution.
     */
    async getPaginationRange(): Promise<string> {
        const text = await this.getPaginationText();
        const m = text.match(/(\d+\s*-\s*\d+)/);
        return m ? m[1] : '';
    }

    getRowByName(name: string): Locator {
        return this.page.locator('tr', { has: this.page.getByText(name, { exact: true }) });
    }

    /**
     * Returns the first MAIN data row (not expanded subrow) that contains the
     * given text anywhere in its cells. Useful when the displayed name spans
     * multiple text nodes (e.g., owner operators with First + Middle + Last
     * names) so `getRowByName` exact-text matching can't find it.
     */
    getMainRowContaining(text: string): Locator {
        return this.page.locator('tbody tr:not(.v-data-table__expanded-content)', { hasText: text }).first();
    }

    async getColumnValues(headerLabel: string): Promise<string[]> {
        const headerTexts = await this.page.locator('thead th[role="columnheader"]').allTextContents();
        const headerIdx = headerTexts.findIndex(t => t.trim() === headerLabel);
        if (headerIdx < 0) return [];
        const dataRow = this.page.locator('tbody tr:not(.v-data-table__expanded-content)').first();
        const dataCellCount = await dataRow.locator('td').count();
        const offset = dataCellCount > headerTexts.length ? 1 : 0;
        const bodyColumn = headerIdx + offset + 1;
        const cells = this.page.locator(`tbody tr:not(.v-data-table__expanded-content) td:nth-child(${bodyColumn})`);
        const texts = await cells.allTextContents();
        return texts.map(s => s.trim()).filter(Boolean);
    }

    async getClientStatusValues(): Promise<string[]> {
        return this.getColumnValues(Constants.leasingClientsColumnClientStatus);
    }

    async collectStatusValuesUntilFound(targetStatuses: string[], maxPages = 6): Promise<string[]> {
        const collected: string[] = [];
        const found = new Set<string>();
        for (let i = 0; i < maxPages; i++) {
            const statuses = await this.getClientStatusValues();
            for (const s of statuses) {
                collected.push(s);
                if (targetStatuses.includes(s)) found.add(s);
            }
            if (targetStatuses.every(t => found.has(t))) return collected;
            if (await this.nextPageButton.isDisabled().catch(() => true)) break;
            await this.goToNextPage();
        }
        return collected;
    }

    async getNameColumnValues(): Promise<string[]> {
        return this.getColumnValues(Constants.leasingClientsColumnName);
    }

    /**
     * Like `searchClients`, but tolerates rows that auto-expand a
     * "Related Companies" subrow (which happens when the row has a Sister
     * company, a Same-President connection, or a multi-part name like
     * Owner Operators with a middle name). Plain `searchClients` polls
     * `getNameColumnValues` and trips on the subrow contents — this variant
     * just types into the input and waits for any main row to contain the
     * search text.
     */
    async searchClientsForExpandableRow(text: string): Promise<void> {
        await this.fillInputField(this.searchClientsInput, text);
        await this.getMainRowContaining(text).waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Deterministic search: clears the search input (whatever was previously
     * filtered), sets it to exactly `text`, asserts the input now holds that
     * exact value, waits for the table API call to finish, and waits for a
     * main data row that contains `text`. Returns the matched row locator.
     *
     * Prefer this over `searchClients` / `searchClientsForExpandableRow`
     * whenever a previous search has already populated the input — the older
     * helpers use `.type()` which APPENDS to the existing value, producing a
     * concatenated query and a false-positive result.
     */
    async clearSearchAndExpectRow(text: string): Promise<Locator> {
        await this.searchClientsInput.click();
        await this.searchClientsInput.fill('');
        await this.searchClientsInput.fill(text);
        await expect(this.searchClientsInput).toHaveValue(text);
        // Wait for the leasing-clients table refresh. We tolerate cache-only
        // responses (304) and a timeout: not every keystroke triggers a
        // network call when the result set is fully cached.
        await this.page.waitForResponse(
            r => r.url().includes('/ms-leasing') && (r.status() === 200 || r.status() === 304),
            { timeout: 5000 },
        ).catch(() => { /* fine — fall through to row visibility check */ });
        const row = this.getMainRowContaining(text);
        await row.waitFor({ state: 'visible', timeout: 10000 });
        return row;
    }

    /**
     * Returns the Name of the first row whose Client type cell reads
     * "Owner Operator" (rendered as just "Owner" on staging 2026-05-18).
     *
     * Strategy: scan the current page first (fast happy path). If no owner is
     * visible — staging now has enough Companies that an Owner Operator can
     * sit beyond page 1 — fall back to the Client type column filter, which
     * narrows the table to Owner rows in one round-trip. After reading the
     * name we reload `/leasing/clients` so downstream test steps see an
     * unfiltered table (the filter would otherwise hide newly created
     * Company-type rows).
     */
    async getFirstOwnerOperatorName(): Promise<string> {
        // Skip ephemeral, worker-owned test entities (PWNewCo* / PWOwn*, both
        // PW-prefixed). Returning one of those is the root of the 4-worker
        // flake: a concurrent worker's afterEach deletes the owner between us
        // reading its name and the president autocomplete searching for it, so
        // the option never renders. Only a STABLE staging owner — which no test
        // creates or deletes — is safe to attach as an existing president.
        const isTestEntity = (name: string) => name.startsWith(Constants.leasingTestEntityPrefix);

        const scanCurrentPage = async (): Promise<string | null> => {
            const rows = this.page.locator('tbody tr:not(.v-data-table__expanded-content)');
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const tds = await rows.nth(i).locator('td').allTextContents();
                const trimmed = tds.map(s => s.trim());
                const isOwner = trimmed.some(c => /^Owner(\s*Operator)?$/i.test(c));
                if (isOwner && trimmed[0] && !isTestEntity(trimmed[0])) return trimmed[0];
            }
            return null;
        };

        const fastPath = await scanCurrentPage();
        if (fastPath) return fastPath;

        await this.filterByClientType(true);
        const filtered = await scanCurrentPage();
        // Reload so the test's later searchClients(...) for a Company-type row
        // isn't filtered out by the Owner filter we just applied.
        await this.page.goto(Constants.leasingClientsUrl, { waitUntil: 'networkidle' });

        if (filtered) return filtered;
        throw new Error('No stable (non-test) Owner Operator row found on /leasing/clients (page 1 scan and Client type filter both empty)');
    }

    /** Click the eye icon in the row for the given company name; navigates to /leasing/client/{id}. */
    async openOverviewForRow(companyName: string): Promise<void> {
        const row = this.getRowByName(companyName);
        await row.waitFor({ state: 'visible', timeout: 5000 });
        await row.locator('button:has(.mdi-eye)').first().click();
        await this.page.waitForURL(/\/leasing\/client\/\d+/, { timeout: 10000 });
    }
}
