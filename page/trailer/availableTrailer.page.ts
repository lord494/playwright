import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../helpers/base";

// All selectors verified against the live staging.vrlz.app DOM on 2026-05-11.
//
// Table layout (24 columns):
//   1=Trailer, 2=Type, 3=Year, 4=Driver/Third party, 5=Sales person, 6=Truck, 7=Option,
//   8=GPS, 9=GPS APP, 10=Sign, 11=Loaded, 12=Broken, 13=Availability, 14=Status,
//   15=Location GPS, 16=Brokerage, 17=Assign Date, 18=Info, 19=Note, 20=Towing,
//   21=Payment Start Date, 22=Payment Status, 23=Sales Ready, 24=Actions
//
// Yard is NOT a visible column — trailers are grouped via the API endpoint
// `/api/trailers/available-trailers-by-yard?search=...`.
//
// Delete is a NATIVE BROWSER CONFIRM, not a Vuetify dialog.

export class AvailableTrailersPage extends BasePage {
    readonly page: Page;

    // Trailer number associated with this page-object instance, populated by fixtures
    // (e.g. availableTrailerWithUiCreatedTrailer) for tests that operate on a specific trailer.
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

    // Add Available Trailer modal (opens via the + button)
    readonly addAvailableModal: Locator;
    readonly addAvailableTrailerNumberField: Locator;
    readonly addAvailableYardField: Locator;
    readonly addAvailableSaveButton: Locator;
    readonly addAvailableCancelButton: Locator;
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

        // Top toolbar — verified: links navigate to /trailers and /available-trailers-statistics
        this.allTrailersLink = page.getByRole('link', { name: 'Trailers', exact: true });
        this.statsLink = page.getByRole('link', { name: 'Stats', exact: true });
        this.exportAllButton = page.getByRole('button', { name: 'Export All', exact: true });
        this.exportButton = page.getByRole('button', { name: 'Export', exact: true });
        // Add button is icon-only (mdi-plus) at the right side of the search bar
        this.addButton = page.locator('button.v-btn.primary.v-size--small').locator('i.mdi-plus').or(page.locator('button:has(i.mdi-plus)')).first();
        // Verified: single input on the page lives inside .TableFilters__field
        this.globalSearchInput = page.locator('.TableFilters__field input').first();

        // Table columns
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

        // Row-level action icons — verified: <button> elements with mdi-* classes
        this.pencilIcon = page.locator('tbody tr button.mdi-pencil');
        this.transferIcon = page.locator('tbody tr button.mdi-transfer');
        this.minusIcon = page.locator('tbody tr button.mdi-minus-box-outline');

        // Info & Notes (column 18/19 has a button with text)
        this.infoButtonInRow = page.locator('tbody tr td:nth-child(18) button', { hasText: "Info's" });
        this.notesButtonInRow = page.locator('tbody tr td:nth-child(19) button', { hasText: 'Notes' });
        this.infoAndNoteModal = page.locator('.v-menu__content.menuable__content__active');
        this.commentInput = page.locator('.comments-wrapper .v-input__slot');
        this.commentPencilIcon = page.locator('.comments-wrapper .mdi.mdi-pencil');
        this.commentList = page.locator('.comments-wrapper .v-list-item');
        this.editButton = page.getByRole('button', { name: 'Edit', exact: true });
        this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });

        // Edit modal — verified labels
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

        // Add Available Trailer modal — verified: title "Add Available Trailer"
        this.addAvailableModal = page.locator('.v-dialog--active').filter({ hasText: 'Add Available Trailer' });
        this.addAvailableTrailerNumberField = this.addAvailableModal.getByLabel('Trailer Number *', { exact: true });
        this.addAvailableYardField = this.addAvailableModal.getByLabel('Yard *', { exact: true });
        this.addAvailableSaveButton = this.addAvailableModal.getByRole('button', { name: 'Save', exact: true });
        this.addAvailableCancelButton = this.addAvailableModal.getByRole('button', { name: 'Cancel', exact: true });
        // After a trailer is selected the modal auto-fills these read-only fields from that
        // trailer's /trailers record. Type/Availability/Status/Payment Status render as a
        // v-select selection (text); Year is held in the hidden production_year input.
        // Verified against staging.vrlz.app DOM (2026-06-03).
        const addModalSelectionByLabel = (label: RegExp): Locator =>
            this.addAvailableModal.locator('.v-select__slot')
                .filter({ has: page.locator('label', { hasText: label }) })
                .locator('.v-select__selection--comma');
        this.addAvailableTypeSelection = addModalSelectionByLabel(/^Type$/);
        this.addAvailableYearInput = this.addAvailableModal.locator('input[name="production_year"]');
        this.addAvailableAvailabilitySelection = addModalSelectionByLabel(/^Availability$/);
        this.addAvailableStatusSelection = addModalSelectionByLabel(/^Status$/);
        this.addAvailablePaymentStatusSelection = addModalSelectionByLabel(/^Payment Status$/);

        // Transfer modal — verified: title contains "Transfer trailer ... from ... to"
        this.transferModal = page.locator('.v-dialog--active').filter({ hasText: 'Transfer trailer' });
        this.transferModalTitle = this.transferModal.locator('.v-card__title');
        this.transferModalDestinationYard = this.transferModal.getByLabel('Select target yard', { exact: true });
        this.transferModalTransferButton = this.transferModal.getByRole('button', { name: 'Transfer', exact: true });
        this.transferModalCancelButton = this.transferModal.getByRole('button', { name: 'Cancel', exact: true });

        // Misc
        this.snackbar = page.locator('.v-snack__content');
        this.progressBar = page.locator('.v-data-table__progress');
    }

    getRowByTrailerNumber(trailerNumber: string): Locator {
        return this.page.locator('tbody tr', {
            has: this.page.locator('td:nth-child(1)', { hasText: trailerNumber })
        });
    }

    // Table cell accessors for a given trailer's row (columns: 1=Trailer, 2=Type, 3=Year).
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

    // Opens the "+" Add modal, picks the trailer from the autocomplete, and saves.
    // The Yard field in this modal is disabled and pre-filled with a default — the user
    // cannot change it here; transfer between yards is done via the Transfer action.
    // Trailer must already exist on /trailers.
    async addToAvailable(trailerNumber: string): Promise<void> {
        await this.page.locator('button.v-btn.primary.v-size--small:has(i.mdi-plus)').first().click();
        await this.addAvailableModal.waitFor({ state: 'visible', timeout: 10000 });

        // Trailer Number is a v-autocomplete — type to filter, then click the matching option.
        // The async option fetch can be slow/miss under parallel load, so re-type and re-wait
        // a couple of times before giving up.
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

        await Promise.all([
            this.page.waitForResponse(
                r => r.url().includes('/api/trailers') && (r.status() === 200 || r.status() === 304),
                { timeout: 15000 }
            ).catch(() => { }),
            this.addAvailableSaveButton.click()
        ]);
        await this.addAvailableModal.waitFor({ state: 'detached', timeout: 10000 });
        await this.progressBar.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }

    // Opens the "+" Add modal and picks the trailer from the autocomplete, leaving the modal
    // OPEN so callers can assert the auto-filled fields and then either save or cancel.
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

        // The dependent fields (Type/Year/Availability/Status) populate once the selection resolves.
        await this.addAvailableTypeSelection.waitFor({ state: 'visible', timeout: 10000 });
    }

    // Confirms the Add modal (Save) — dispatches PUT /api/trailers/available/{id}.
    async confirmAddAvailable(): Promise<void> {
        await Promise.all([
            this.page.waitForResponse(
                r => r.url().includes('/api/trailers') && (r.status() === 200 || r.status() === 304),
                { timeout: 15000 }
            ).catch(() => { }),
            this.addAvailableSaveButton.click()
        ]);
        await this.addAvailableModal.waitFor({ state: 'detached', timeout: 10000 });
        await this.progressBar.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
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

    // Delete uses native browser confirm. Caller must use deleteTrailerAccept / deleteTrailerDismiss
    // which set up the dialog handler before clicking.

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

    async assertEveryRowMatches(predicate: (row: Locator, index: number) => Promise<boolean>): Promise<void> {
        const count = await this.page.locator('tbody tr').count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const row = this.page.locator('tbody tr').nth(i);
            const ok = await predicate(row, i);
            if (!ok) throw new Error(`Row ${i} failed predicate (text="${(await row.textContent())?.slice(0, 200)}")`);
        }
    }
}
