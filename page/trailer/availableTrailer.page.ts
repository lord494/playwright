import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../helpers/base";


export class AvailableTrailersPage extends BasePage {
    readonly page: Page;
    trailerNumber: string = '';

    // Top toolbar
    readonly allTrailersLink: Locator;
    readonly statsLink: Locator;
    readonly exportAllButton: Locator;
    readonly exportButton: Locator;
    readonly addButton: Locator;
    readonly globalSearchInput: Locator;

    // Table columns (1-based; verified against rendered headers)
    readonly trailerNumberColumn: Locator;       // 1
    readonly trailerTypeColumn: Locator;          // 2
    readonly trailerYearColumn: Locator;          // 3
    readonly driverThirdPartyColumn: Locator;     // 4
    readonly salesPersonColumn: Locator;          // 5
    readonly truckColumn: Locator;                // 6
    readonly optionColumn: Locator;               // 7
    readonly availabilityColumn: Locator;         // 13
    readonly statusColumn: Locator;               // 14
    readonly brokerageColumn: Locator;            // 16
    readonly infoColumn: Locator;                 // 18
    readonly notesColumn: Locator;                // 19
    readonly towingColumn: Locator;               // 20
    readonly actionsColumn: Locator;              // 24

    // Row-level action icons
    readonly pencilIcon: Locator;
    readonly transferIcon: Locator;
    readonly minusIcon: Locator;

    // Info & Notes popovers
    readonly infoButtonInRow: Locator;
    readonly notesButtonInRow: Locator;
    readonly infoAndNoteModal: Locator;
    readonly commentInput: Locator;
    readonly commentPencilIcon: Locator;
    readonly commentList: Locator;
    readonly editButton: Locator;
    readonly cancelButton: Locator;

    // Edit modal
    readonly editModal: Locator;
    readonly editModalTitle: Locator;
    readonly editModalSaveButton: Locator;
    readonly editModalCancelButton: Locator;
    readonly editModalTrailerNumberInput: Locator;
    readonly editModalYardField: Locator;
    readonly editModalTypeField: Locator;
    readonly editModalYearField: Locator;
    readonly editModalInCompanyCheckbox: Locator;
    readonly editModalOutOfCompanyCheckbox: Locator;
    readonly editModalAvailabilityField: Locator;
    readonly editModalStatusField: Locator;
    readonly editModalBrokerageField: Locator;
    readonly editModalLoadedCheckbox: Locator;
    readonly editModalBrokenCheckbox: Locator;
    readonly editModalTowingCheckbox: Locator;
    readonly editModalSignCheckbox: Locator;
    readonly editModalSalesReadyCheckbox: Locator;
    readonly editModalTowingToggle: Locator;
    readonly editModalInCompanyLabel: Locator;

    // Add Available Trailer modal (opens via the + button)
    readonly addAvailableModal: Locator;
    readonly addAvailableTrailerNumberField: Locator;
    readonly addAvailableYardField: Locator;
    readonly addAvailableSaveButton: Locator;
    readonly addAvailableCancelButton: Locator;
    // Save is blocked client-side (no request, error shown at the top of the modal)
    // unless one of these is checked: 'Either "In company" or "Out of company" must be selected.'
    readonly addAvailableInCompanyCheckbox: Locator;
    readonly addAvailableOutOfCompanyCheckbox: Locator;
    readonly addAvailableInCompanyLabel: Locator;
    // Read-only fields the modal auto-fills from the selected trailer's /trailers record.
    readonly addAvailableTypeSelection: Locator;
    readonly addAvailableYearInput: Locator;
    readonly addAvailableAvailabilitySelection: Locator;
    readonly addAvailableStatusSelection: Locator;
    readonly addAvailablePaymentStatusSelection: Locator;

    // Transfer modal
    readonly transferModal: Locator;
    readonly transferModalTitle: Locator;
    readonly transferModalDestinationYard: Locator;
    readonly transferModalTransferButton: Locator;
    readonly transferModalCancelButton: Locator;

    // Misc
    readonly snackbar: Locator;
    readonly progressBar: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.allTrailersLink = page.getByRole('link', { name: 'Trailers', exact: true });
        this.statsLink = page.getByRole('link', { name: 'Stats', exact: true });
        this.exportAllButton = page.getByRole('button', { name: 'Export All', exact: true });
        this.exportButton = page.getByRole('button', { name: 'Export', exact: true });
        this.addButton = page.locator('button.v-btn.primary.v-size--small').locator('i.mdi-plus').or(page.locator('button:has(i.mdi-plus)')).first();
        this.globalSearchInput = page.locator('.TableFilters__field input').first();
        this.trailerNumberColumn = page.locator('tbody tr td:nth-child(1)');
        this.trailerTypeColumn = page.locator('tbody tr td:nth-child(2)');
        this.trailerYearColumn = page.locator('tbody tr td:nth-child(3)');
        this.driverThirdPartyColumn = page.locator('tbody tr td:nth-child(4)');
        this.salesPersonColumn = page.locator('tbody tr td:nth-child(5)');
        this.truckColumn = page.locator('tbody tr td:nth-child(6)');
        this.optionColumn = page.locator('tbody tr td:nth-child(7)');
        this.availabilityColumn = page.locator('tbody tr td:nth-child(13)');
        this.statusColumn = page.locator('tbody tr td:nth-child(14)');
        this.brokerageColumn = page.locator('tbody tr td:nth-child(16)');
        this.infoColumn = page.locator('tbody tr td:nth-child(18)');
        this.notesColumn = page.locator('tbody tr td:nth-child(19)');
        this.towingColumn = page.locator('tbody tr td:nth-child(20)');
        this.actionsColumn = page.locator('tbody tr td:nth-child(24)');
        this.pencilIcon = page.locator('tbody tr button.mdi-pencil');
        this.transferIcon = page.locator('tbody tr button.mdi-transfer');
        this.minusIcon = page.locator('tbody tr button.mdi-minus-box-outline');
        this.infoButtonInRow = page.locator('tbody tr td:nth-child(18) button', { hasText: "Info's" });
        this.notesButtonInRow = page.locator('tbody tr td:nth-child(19) button', { hasText: 'Notes' });
        this.infoAndNoteModal = page.locator('.v-menu__content.menuable__content__active');
        this.commentInput = page.locator('.comments-wrapper .v-input__slot');
        this.commentPencilIcon = page.locator('.comments-wrapper .mdi.mdi-pencil');
        this.commentList = page.locator('.comments-wrapper .v-list-item');
        this.editButton = page.getByRole('button', { name: 'Edit', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
        this.editModal = page.locator('.v-dialog--active').filter({ hasText: 'Edit Available Trailer' });
        this.editModalTitle = this.editModal.locator('.v-card__title');
        this.editModalSaveButton = this.editModal.getByRole('button', { name: 'Save', exact: true });
        this.editModalCancelButton = this.editModal.getByRole('button', { name: 'Cancel', exact: true });
        this.editModalTrailerNumberInput = this.editModal.locator('input[name="trailer_number"][type="text"]');
        this.editModalYardField = this.editModal.getByLabel('Yard *', { exact: true });
        this.editModalTypeField = this.editModal.getByLabel('Type', { exact: true });
        this.editModalYearField = this.editModal.getByLabel('Year*', { exact: true });
        this.editModalInCompanyCheckbox = this.editModal.getByLabel('In company', { exact: true });
        this.editModalOutOfCompanyCheckbox = this.editModal.getByLabel('Out of company', { exact: true });
        this.editModalAvailabilityField = this.editModal.getByLabel('Availability', { exact: true });
        this.editModalStatusField = this.editModal.getByLabel('Status', { exact: true });
        this.editModalBrokerageField = this.editModal.getByLabel('Brokerage', { exact: true });
        this.editModalLoadedCheckbox = this.editModal.getByLabel('Loaded', { exact: true });
        this.editModalBrokenCheckbox = this.editModal.getByLabel('Broken', { exact: true });
        this.editModalTowingCheckbox = this.editModal.getByLabel('Towing', { exact: true });
        this.editModalSignCheckbox = this.editModal.getByLabel('Sign', { exact: true });
        this.editModalSalesReadyCheckbox = this.editModal.getByLabel('Sales Ready', { exact: true });
        // Vuetify v-checkbox toggle: click the v-input--checkbox wrapper, not the hidden input.
        this.editModalTowingToggle = this.editModal.locator('.v-input--checkbox').filter({ hasText: 'Towing' });
        this.editModalInCompanyLabel = this.editModal.locator('label', { hasText: /^\s*In company\s*$/ });
        this.addAvailableModal = page.locator('.v-dialog--active').filter({ hasText: 'Add Available Trailer' });
        this.addAvailableTrailerNumberField = this.addAvailableModal.getByLabel('Trailer Number *', { exact: true });
        this.addAvailableYardField = this.addAvailableModal.getByLabel('Yard *', { exact: true });
        this.addAvailableSaveButton = this.addAvailableModal.getByRole('button', { name: 'Save', exact: true });
        this.addAvailableCancelButton = this.addAvailableModal.getByRole('button', { name: 'Cancel', exact: true });
        this.addAvailableInCompanyCheckbox = this.addAvailableModal.getByLabel('In company', { exact: true });
        this.addAvailableOutOfCompanyCheckbox = this.addAvailableModal.getByLabel('Out of company', { exact: true });
        this.addAvailableInCompanyLabel = this.addAvailableModal.locator('label', { hasText: /^\s*In company\s*$/ });
        const addModalSelectionByLabel = (label: RegExp): Locator =>
            this.addAvailableModal.locator('.v-select__slot')
                .filter({ has: page.locator('label', { hasText: label }) })
                .locator('.v-select__selection--comma');
        this.addAvailableTypeSelection = addModalSelectionByLabel(/^Type$/);
        this.addAvailableYearInput = this.addAvailableModal.locator('input[name="production_year"]');
        this.addAvailableAvailabilitySelection = addModalSelectionByLabel(/^Availability$/);
        this.addAvailableStatusSelection = addModalSelectionByLabel(/^Status$/);
        this.addAvailablePaymentStatusSelection = addModalSelectionByLabel(/^Payment Status$/);
        this.transferModal = page.locator('.v-dialog--active').filter({ hasText: 'Transfer trailer' });
        this.transferModalTitle = this.transferModal.locator('.v-card__title');
        this.transferModalDestinationYard = this.transferModal.getByLabel('Select target yard', { exact: true });
        this.transferModalTransferButton = this.transferModal.getByRole('button', { name: 'Transfer', exact: true });
        this.transferModalCancelButton = this.transferModal.getByRole('button', { name: 'Cancel', exact: true });

        this.snackbar = page.locator('.v-snack__content');
        this.progressBar = page.locator('.v-data-table__progress');
    }

    getRowByTrailerNumber(trailerNumber: string): Locator {
        return this.page.locator('tbody tr', {
            has: this.page.locator('td:nth-child(1)', { hasText: trailerNumber })
        });
    }

    availableRowTrailerNumberCell(trailerNumber: string): Locator {
        return this.getRowByTrailerNumber(trailerNumber).first().locator('td:nth-child(1)');
    }

    availableRowTypeCell(trailerNumber: string): Locator {
        return this.getRowByTrailerNumber(trailerNumber).first().locator('td:nth-child(2)');
    }

    availableRowYearCell(trailerNumber: string): Locator {
        return this.getRowByTrailerNumber(trailerNumber).first().locator('td:nth-child(3)');
    }

    async waitForTableLoaded(): Promise<void> {
        await this.progressBar.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
        // Either the table has at least one row, or it shows an empty state — both are fine.
        await this.page.waitForFunction(() => {
            const rows = document.querySelectorAll('tbody tr');
            const empty = document.querySelector('.v-data-table__empty-wrapper');
            return rows.length > 0 || !!empty;
        }, { timeout: 15000 });
    }

    async searchTrailer(query: string): Promise<void> {
        await this.globalSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.globalSearchInput.click();
        await this.globalSearchInput.fill('');
        await Promise.all([
            this.page.waitForResponse(
                res => res.url().includes('/api/trailers') &&
                    (res.status() === 200 || res.status() === 304),
                { timeout: 15000 }
            ).catch(() => { }),
            this.globalSearchInput.type(query, { delay: 30 })
        ]);
        await this.progressBar.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }

    async clearSearch(): Promise<void> {
        await this.globalSearchInput.click();
        await this.globalSearchInput.fill('');
        await this.page.waitForResponse(
            res => res.url().includes('/api/trailers') &&
                (res.status() === 200 || res.status() === 304),
            { timeout: 15000 }
        ).catch(() => { });
        await this.progressBar.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }
    async addToAvailable(trailerNumber: string): Promise<void> {
        await this.page.locator('button.v-btn.primary.v-size--small:has(i.mdi-plus)').first().click();
        await this.addAvailableModal.waitFor({ state: 'visible', timeout: 10000 });
        const optionsMenu = this.page.locator('.v-menu__content.menuable__content__active');
        const option = optionsMenu.locator('.v-list-item', { hasText: trailerNumber }).first();
        let optionShown = false;
        for (let attempt = 0; attempt < 3 && !optionShown; attempt++) {
            await this.addAvailableTrailerNumberField.click();
            await this.addAvailableTrailerNumberField.fill('');
            await this.addAvailableTrailerNumberField.type(trailerNumber, { delay: 30 });
            await optionsMenu.waitFor({ state: 'visible', timeout: 8000 }).catch(() => { });
            optionShown = await option.isVisible().catch(() => false);
            if (!optionShown) await this.page.waitForTimeout(1000);
        }
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();

        await this.saveAddAvailable();
    }

    /**
     * The modal pre-fills In company / Out of company from the trailer record. When the
     * record has neither, Save silently does nothing — check "In company", as a user would.
     */
    async ensureInOrOutOfCompanySelected(): Promise<void> {
        await this.ensureCompanyFlag(
            this.addAvailableInCompanyCheckbox, this.addAvailableOutOfCompanyCheckbox, this.addAvailableInCompanyLabel);
    }

    private async ensureCompanyFlag(inCompanyCheckbox: Locator, outOfCompanyCheckbox: Locator, inCompanyLabel: Locator): Promise<void> {
        const inCompany = await inCompanyCheckbox.isChecked();
        const outOfCompany = await outOfCompanyCheckbox.isChecked();
        if (!inCompany && !outOfCompany) {
            await this.clickElement(inCompanyLabel);
        }
    }

    // Edit modal has the same client-side In/Out company rule as the Add modal: with neither
    // checked, Save shows an off-screen error and sends nothing. Other tests that move the
    // shared candidate trailers out of / back into Available can leave both flags cleared.
    async saveEditModal(): Promise<void> {
        await this.ensureCompanyFlag(
            this.editModalInCompanyCheckbox, this.editModalOutOfCompanyCheckbox, this.editModalInCompanyLabel);
        await Promise.all([
            this.page.waitForResponse(
                r => r.request().method() === 'PUT' && r.url().includes('/api/trailers/available/') && r.status() === 200,
                { timeout: 15000 }
            ),
            this.editModalSaveButton.click()
        ]);
        await this.editModal.waitFor({ state: 'detached', timeout: 10000 });
    }

    // Clicks Save and waits for the PUT /api/trailers/available/{id} it must dispatch.
    // No .catch: if Save is blocked, fail here with the real cause instead of a
    // "dialog still open" timeout later.
    private async saveAddAvailable(): Promise<void> {
        await this.ensureInOrOutOfCompanySelected();
        await Promise.all([
            this.page.waitForResponse(
                r => r.request().method() === 'PUT' && r.url().includes('/api/trailers/available/') && r.status() === 200,
                { timeout: 15000 }
            ),
            this.addAvailableSaveButton.click()
        ]);
        await this.addAvailableModal.waitFor({ state: 'detached', timeout: 10000 });
        await this.progressBar.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }

    async openAddModalAndSelectTrailer(trailerNumber: string): Promise<void> {
        await this.page.locator('button.v-btn.primary.v-size--small:has(i.mdi-plus)').first().click();
        await this.addAvailableModal.waitFor({ state: 'visible', timeout: 10000 });

        await this.addAvailableTrailerNumberField.click();
        await this.addAvailableTrailerNumberField.type(trailerNumber, { delay: 30 });
        const optionsMenu = this.page.locator('.v-menu__content.menuable__content__active');
        await optionsMenu.waitFor({ state: 'visible', timeout: 10000 });
        const option = optionsMenu.locator('.v-list-item', { hasText: trailerNumber }).first();
        await option.waitFor({ state: 'visible', timeout: 15000 });
        await option.click();

        await this.addAvailableTypeSelection.waitFor({ state: 'visible', timeout: 10000 });
    }

    async confirmAddAvailable(): Promise<void> {
        await this.saveAddAvailable();
    }

    async cancelAddAvailable(): Promise<void> {
        await this.addAvailableCancelButton.click();
        await this.addAvailableModal.waitFor({ state: 'detached', timeout: 10000 });
    }

    async openEditModalForRow(trailerNumber: string): Promise<void> {
        const row = this.getRowByTrailerNumber(trailerNumber).first();
        await row.waitFor({ state: 'visible', timeout: 10000 });
        await row.locator('button.mdi-pencil').click();
        await this.editModal.waitFor({ state: 'visible', timeout: 10000 });
    }

    async openTransferModalForRow(trailerNumber: string): Promise<void> {
        const row = this.getRowByTrailerNumber(trailerNumber).first();
        await row.waitFor({ state: 'visible', timeout: 10000 });
        await row.locator('button.mdi-transfer').click();
        await this.transferModal.waitFor({ state: 'visible', timeout: 10000 });
    }

    async cancelTransfer(): Promise<void> {
        await this.transferModalCancelButton.click();
        await this.transferModal.waitFor({ state: 'detached', timeout: 10000 });
    }

    async transferTrailer(trailerNumber: string, destinationYard: string): Promise<void> {
        await this.openTransferModalForRow(trailerNumber);
        await this.transferModalDestinationYard.click();
        // The v-menu__content for v-select opens outside the dialog
        await this.page.locator('.v-menu__content.menuable__content__active')
            .locator('.v-list-item', { hasText: destinationYard }).first()
            .click();
        await Promise.all([
            this.page.waitForResponse(
                res => res.url().includes('/api/trailers') &&
                    (res.status() === 200 || res.status() === 304),
                { timeout: 15000 }
            ).catch(() => { }),
            this.transferModalTransferButton.click()
        ]);
        await this.transferModal.waitFor({ state: 'detached', timeout: 10000 });
    }

    async deleteTrailerAccept(trailerNumber: string): Promise<void> {
        const row = this.getRowByTrailerNumber(trailerNumber).first();
        await row.waitFor({ state: 'visible', timeout: 10000 });
        const minus = row.locator('button.mdi-minus-box-outline');
        // Native confirm — accept on next dialog event
        this.page.once('dialog', async (d) => { await d.accept(); });
        await Promise.all([
            this.page.waitForResponse(
                res => res.url().includes('/api/trailers') &&
                    (res.status() === 200 || res.status() === 304),
                { timeout: 15000 }
            ).catch(() => { }),
            minus.click()
        ]);
    }

    async deleteTrailerDismissAndCapture(trailerNumber: string): Promise<{ message: string }> {
        const row = this.getRowByTrailerNumber(trailerNumber).first();
        await row.waitFor({ state: 'visible', timeout: 10000 });
        let captured = '';
        const handler = async (d: any) => { captured = d.message(); await d.dismiss(); };
        this.page.once('dialog', handler);
        await row.locator('button.mdi-minus-box-outline').click();
        // wait briefly for the dialog event to fire
        await expect.poll(() => captured, { timeout: 5000 }).not.toEqual('');
        return { message: captured };
    }

}
