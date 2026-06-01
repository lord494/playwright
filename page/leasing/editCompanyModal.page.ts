import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';
import { AddPresidentData, ContactData } from './newCompanyModal.page';

/**
 * Page object for the "Edit company" modal on /leasing/clients (opened via the
 * pencil icon on a row). Reuses the New Company modal's underlying layout but
 * exposes the edit-only affordances:
 *   - Company status chip + Approve / Decline buttons in the status section
 *   - Underwriting / Billing info / etc. sections that ONLY render once the
 *     company has been approved
 *
 * Scoped by the `Edit company` headline so the inline Add president / native
 * confirm dialogs don't strict-mode-violate.
 */
export class EditCompanyModalPage extends BasePage {
    readonly page: Page;

    readonly dialog: Locator;
    readonly title: Locator;

    // ===== Status =====
    /** The `Company status` h3 (scoped) and its chip + buttons. */
    readonly statusHeader: Locator;
    /** The currently displayed status chip ("Pending" / "Approved" / "Declined" / "Blacklist" / "Inactive"). */
    readonly statusChip: Locator;
    readonly approveButton: Locator;
    readonly declineButton: Locator;
    /** Sets the status to Blacklist. Visible in Pending/Approved/Decline/Inactive states. */
    readonly blacklistButton: Locator;
    /** Sets the status to Inactive. Visible in Pending/Approved/Decline/Blacklist states. */
    readonly inactiveButton: Locator;
    /** Returns an Inactive client to Pending via a native window.confirm. Visible only in Inactive state. */
    readonly returneeButton: Locator;

    // ===== Underwriting =====
    /** Only rendered when the company has Approved status. */
    readonly underwritingHeader: Locator;
    /** The Add new button immediately after the Underwriting heading. */
    readonly underwritingAddNewButton: Locator;
    /** The Underwriting table (no-data row counts as a valid table). */
    readonly underwritingTable: Locator;

    // ===== Billing info =====
    readonly billingInfoHeader: Locator;

    // ===== Editable Company information (subset — Name is rendered disabled on Edit) =====
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipInput: Locator;
    readonly riskLevelWrapper: Locator;

    // ===== Cooperation =====
    readonly leasingAndSalesCheckbox: Locator;
    readonly regrutingCheckbox: Locator;
    readonly maintenanceCheckbox: Locator;
    readonly fuelCheckbox: Locator;

    // ===== Note =====
    readonly noteTextarea: Locator;

    // ===== President cards (rendered after data load — pencil/minus/trash icons) =====
    readonly presidentCards: Locator;

    // ===== Edit president nested dialog (pencil icon on a card) =====
    readonly editPresidentDialog: Locator;
    readonly editPresidentFirstNameInput: Locator;
    readonly editPresidentMiddleNameInput: Locator;
    readonly editPresidentLastNameInput: Locator;
    readonly editPresidentAddressInput: Locator;
    readonly editPresidentCityInput: Locator;
    readonly editPresidentStateInput: Locator;
    readonly editPresidentZipInput: Locator;
    readonly editPresidentSsnInput: Locator;
    readonly editPresidentSubmitButton: Locator;

    // ===== Unpair / Delete confirm dialogs (raised by minus / trash icons) =====
    readonly unpairPresidentDialog: Locator;
    readonly unpairConfirmButton: Locator;
    readonly deletePresidentDialog: Locator;
    readonly deleteConfirmButton: Locator;

    // ===== Contact cards (rendered after Add contact — pencil/delete icons) =====
    readonly contactCards: Locator;

    // ===== Edit contact nested dialog (pencil icon on a contact card) =====
    readonly editContactDialog: Locator;
    readonly editContactPositionWrapper: Locator;
    readonly editContactNameInput: Locator;
    readonly editContactEmailInput: Locator;
    readonly editContactPhoneInput: Locator;
    readonly editContactInvoicesCheckbox: Locator;
    readonly editContactContractsCheckbox: Locator;
    readonly editContactInsuranceCheckbox: Locator;
    readonly editContactSubmitButton: Locator;

    // ===== Delete contact confirm dialog (trash icon on a contact card) =====
    readonly deleteContactDialog: Locator;
    readonly deleteContactConfirmButton: Locator;

    // ===== Footer =====
    readonly saveButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.dialog = page.locator('.v-dialog--active', {
            has: page.locator('h2.headline', { hasText: Constants.editCompanyModalTitle }),
        });
        this.title = this.dialog.locator('h2.headline', { hasText: Constants.editCompanyModalTitle });

        this.statusHeader = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.newCompanySectionStatus}\\s*$`) });
        // The status chip immediately follows the status header; scope to the
        // same parent so the President section chips can't bleed in.
        this.statusChip = this.statusHeader.locator('xpath=following-sibling::*[1]');
        this.approveButton = this.dialog.getByRole('button', { name: Constants.editClientApproveButton, exact: true });
        this.declineButton = this.dialog.getByRole('button', { name: Constants.editClientDeclineButton, exact: true });
        // Blacklist / Inactive / Returnee render with uppercase text in the
        // DOM ("BLACKLIST" / "INACTIVE") while Approve / Decline are
        // title-case. Match case-insensitively so the locators are robust to
        // either casing if the app normalizes them later.
        this.blacklistButton = this.dialog.getByRole('button', { name: new RegExp(`^\\s*${Constants.editClientBlacklistButton}\\s*$`, 'i') });
        this.inactiveButton = this.dialog.getByRole('button', { name: new RegExp(`^\\s*${Constants.editClientInactiveButton}\\s*$`, 'i') });
        this.returneeButton = this.dialog.getByRole('button', { name: new RegExp(`^\\s*${Constants.editClientReturneeButton}\\s*$`, 'i') });

        this.underwritingHeader = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.editClientSectionUnderwriting}\\s*$`) });
        // The Underwriting heading and its Add new button share the same
        // d-flex parent (verified on staging 2026-05-20). Going up one level
        // keeps us inside the section header — the sibling div that holds
        // the data table starts after, and the Billing info heading lives
        // in its own .d-flex below.
        const underwritingHeaderRow = this.underwritingHeader.locator('xpath=parent::div');
        this.underwritingAddNewButton = underwritingHeaderRow
            .getByRole('button', { name: new RegExp(`^\\s*${Constants.editClientAddNewButton}\\s*$`, 'i') });
        // Table for the section lives in the next sibling of the header row.
        this.underwritingTable = underwritingHeaderRow.locator('xpath=following-sibling::*//table').first();

        this.billingInfoHeader = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.editClientSectionBillingInfo}\\s*$`) });

        // ===== Editable Company information =====
        this.addressInput = this.fieldByLabel(Constants.newCompanyLabelAddress).first();
        this.cityInput = this.fieldByLabel(Constants.newCompanyLabelCity).first();
        this.stateInput = this.fieldByLabel(Constants.newCompanyLabelState).first();
        this.zipInput = this.fieldByLabel(Constants.newCompanyLabelZIP).first();
        this.riskLevelWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelRiskLevel);

        // ===== Cooperation =====
        // Scope to the dialog — the /leasing/clients page exposes
        // identically-named checkboxes as table filters; without scoping these
        // would strict-mode-violate.
        this.leasingAndSalesCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelLeasingAndSales });
        this.regrutingCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelRegruting });
        this.maintenanceCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelMaintenance });
        this.fuelCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelFuel });

        // ===== Note =====
        this.noteTextarea = this.dialog.locator('textarea[name="note"]');

        // ===== President cards =====
        // The Edit modal renders a v-card per president inside the order-5
        // row. Each card holds pencil + minus + trash icons (verified on
        // staging 2026-05-21).
        this.presidentCards = this.dialog.locator('.order-5 .v-card');

        // ===== Edit president nested dialog =====
        // Scope by the " Edit president " heading. The submit button label
        // ("Edit president") collides with the parent modal's Add president
        // button — must be addressed through this dialog scope.
        this.editPresidentDialog = page.locator('.v-dialog--active', {
            has: page.locator('h3, .v-card__title, h2', { hasText: new RegExp(`^\\s*${Constants.newCompanyEditPresidentTitle}\\s*$`) }),
        });
        this.editPresidentFirstNameInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelFirstName);
        this.editPresidentMiddleNameInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelMiddleName);
        this.editPresidentLastNameInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelLastName);
        this.editPresidentAddressInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelAddress);
        this.editPresidentCityInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelCity);
        this.editPresidentStateInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelState);
        this.editPresidentZipInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelZIP);
        this.editPresidentSsnInput = this.fieldInDialog(this.editPresidentDialog, Constants.newCompanyPresidentLabelSSN);
        this.editPresidentSubmitButton = this.editPresidentDialog.getByRole('button', { name: Constants.newCompanyEditPresidentButton, exact: true });

        // ===== Unpair / Delete confirm dialogs =====
        // Both share title "Warning"; disambiguate by their body text so we
        // never grab the wrong confirm.
        this.unpairPresidentDialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__text', { hasText: Constants.newCompanyUnpairPresidentText }),
        });
        this.unpairConfirmButton = this.unpairPresidentDialog.getByRole('button', { name: Constants.newCompanyUnpairConfirmButton, exact: true });
        this.deletePresidentDialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__text', { hasText: Constants.newCompanyDeletePresidentText }),
        });
        this.deleteConfirmButton = this.deletePresidentDialog.getByRole('button', { name: Constants.newCompanyDeleteConfirmButton, exact: true });

        // ===== Contact cards =====
        // Contacts (added via the Add contact button in the parent modal) render
        // as v-cards inside the order-7 row, mirroring the order-5 presidents
        // pattern. Each card carries pencil + trash icons (no minus — only
        // 2 actions, not 3 like presidents).
        this.contactCards = this.dialog.locator('.order-7 .v-card');

        // ===== Edit contact nested dialog =====
        this.editContactDialog = page.locator('.v-dialog--active', {
            has: page.locator('h3, .v-card__title, h2', { hasText: new RegExp(`^\\s*${Constants.newCompanyEditContactTitle}\\s*$`) }),
        });
        // The Edit contact dialog only contains the contact form, so scoping
        // by the dialog disambiguates Name/Email/Phone from the parent modal's
        // inline contact form.
        this.editContactPositionWrapper = this.editContactDialog.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newCompanyLabelContactPosition}\\s*$`) }),
        });
        this.editContactNameInput = this.editContactDialog.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newCompanyLabelContactName}\\s*$`) }),
        }).locator('input[type="text"]').first();
        this.editContactEmailInput = this.editContactDialog.locator('input[name="email"]');
        this.editContactPhoneInput = this.editContactDialog.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newCompanyLabelContactPhone}\\s*$`) }),
        }).locator('input[type="text"]').first();
        this.editContactInvoicesCheckbox = this.editContactDialog.getByRole('checkbox', { name: Constants.newCompanyLabelInvoices });
        this.editContactContractsCheckbox = this.editContactDialog.getByRole('checkbox', { name: Constants.newCompanyLabelContracts });
        this.editContactInsuranceCheckbox = this.editContactDialog.getByRole('checkbox', { name: Constants.newCompanyLabelInsurance });
        this.editContactSubmitButton = this.editContactDialog.getByRole('button', { name: Constants.newCompanyEditContactButton, exact: true });

        // ===== Delete contact confirm dialog =====
        // Shares the "Warning" title with the president confirms; scope by body.
        this.deleteContactDialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__text', { hasText: Constants.newCompanyDeleteContactText }),
        });
        this.deleteContactConfirmButton = this.deleteContactDialog.getByRole('button', { name: Constants.newCompanyDeleteConfirmButton, exact: true });

        this.saveButton = this.dialog.getByRole('button', { name: Constants.newCompanySaveButton, exact: true });
        this.cancelButton = this.dialog.getByRole('button', { name: Constants.newCompanyCancelButton, exact: true });
    }

    private fieldInDialog(dialog: Locator, labelText: string): Locator {
        const escaped = labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return dialog.locator('.v-input', {
            has: this.page.locator('label', {
                hasText: new RegExp(`^\\s*${escaped}\\s*$`),
            }),
        }).locator('input,textarea').first();
    }

    private fieldByLabel(labelText: string): Locator {
        return this.inputWrapperByLabel(labelText).locator('input,textarea').first();
    }

    private inputWrapperByLabel(labelText: string): Locator {
        const escaped = labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.dialog.locator('.v-input', {
            has: this.page.locator('label', {
                hasText: new RegExp(`^\\s*${escaped}\\s*$`),
            }),
        });
    }

    private activeAutocompleteMenu(): Locator {
        return this.page.locator('.menuable__content__active').last();
    }

    private async openMenuForWrapper(wrapper: Locator): Promise<void> {
        const slot = wrapper.locator('.v-input__slot').first();
        await slot.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
    }

    private async pickExactOption(optionText: string): Promise<void> {
        const escaped = optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`^\\s*${escaped}\\s*$`);
        const menu = this.activeAutocompleteMenu();
        const option = menu.locator('.v-list-item').filter({ hasText: re }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await menu.waitFor({ state: 'hidden', timeout: 5000 });
    }

    private async setCheckbox(checkbox: Locator, value: boolean): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (isChecked !== value) await checkbox.click({ force: true });
    }

    async expectOpen(): Promise<void> {
        await this.dialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    async expectClosed(): Promise<void> {
        await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async cancel(): Promise<void> {
        await this.clickElement(this.cancelButton);
        await this.expectClosed();
    }

    async save(): Promise<void> {
        await this.clickElement(this.saveButton);
    }

    async saveAndExpectClosed(): Promise<void> {
        await this.save();
        await this.expectClosed();
    }

    /** Returns the current text of the Company status chip ("Pending" / "Approved" / "Declined"). */
    async getStatus(): Promise<string> {
        return ((await this.statusChip.textContent()) ?? '').trim();
    }

    /**
     * Clicks Approve. The server flips the status synchronously on staging —
     * after the click the chip immediately shows "Approved". Waits for that
     * transition so callers can assert with confidence.
     */
    async approve(): Promise<void> {
        await this.clickElement(this.approveButton);
        await expect(this.statusChip).toContainText(Constants.editClientStatusApproved, { timeout: 10000 });
    }

    /**
     * Clicks Decline and waits for the chip to flip to "Declined".
     */
    async decline(): Promise<void> {
        await this.clickElement(this.declineButton);
        await expect(this.statusChip).toContainText(Constants.editClientStatusDeclined, { timeout: 10000 });
    }

    /** Clicks Blacklist and waits for the chip to flip to "Blacklist". */
    async blacklist(): Promise<void> {
        await this.clickElement(this.blacklistButton);
        await expect(this.statusChip).toContainText(Constants.editClientStatusBlacklist, { timeout: 10000 });
    }

    /** Clicks Inactive and waits for the chip to flip to "Inactive". */
    async inactive(): Promise<void> {
        await this.clickElement(this.inactiveButton);
        await expect(this.statusChip).toContainText(Constants.editClientStatusInactive, { timeout: 10000 });
    }

    /**
     * Clicks Returnee on an Inactive client. The app raises a native
     * window.confirm with "Are you sure that you want to return this client
     * to pending status?" — capture the message, accept the dialog, then
     * wait for the status chip to flip to "Pending". Returns the captured
     * confirm-dialog message so the caller can assert the exact wording.
     */
    async returneeAndAcceptConfirm(): Promise<string> {
        let capturedMessage = '';
        const handler = async (dialog: { message(): string; accept(): Promise<void> }) => {
            capturedMessage = dialog.message();
            try { await dialog.accept(); } catch { /* ignore */ }
        };
        this.page.once('dialog', handler);
        await this.clickElement(this.returneeButton);
        await expect(this.statusChip).toContainText(Constants.editClientStatusPending, { timeout: 10000 });
        return capturedMessage;
    }

    /**
     * Asserts that exactly the listed status-action buttons are currently
     * visible in the Company status section, and that every other status
     * button is hidden. Use this after a status change to verify which
     * transitions the UI now offers.
     */
    async expectVisibleStatusButtons(visible: string[]): Promise<void> {
        const buttonsByName: Record<string, Locator> = {
            [Constants.editClientApproveButton]: this.approveButton,
            [Constants.editClientDeclineButton]: this.declineButton,
            [Constants.editClientBlacklistButton]: this.blacklistButton,
            [Constants.editClientInactiveButton]: this.inactiveButton,
            [Constants.editClientReturneeButton]: this.returneeButton,
        };
        for (const [name, locator] of Object.entries(buttonsByName)) {
            if (visible.includes(name)) {
                await expect(locator, `${name} button should be visible`).toBeVisible();
            } else {
                await expect(locator, `${name} button should be hidden`).toBeHidden();
            }
        }
    }

    /** Click the Underwriting section's Add new button. Underwriting modal opens on top. */
    async openAddUnderwritingModal(): Promise<void> {
        await this.underwritingAddNewButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.underwritingAddNewButton.click();
    }

    /**
     * Clear + retype Address / City / State / ZIP. Pass only the fields you
     * want to change — undefined keys are skipped.
     */
    async editAddress(data: { address?: string; city?: string; state?: string; zip?: string }): Promise<void> {
        if (data.address !== undefined) await this.fillInputFieldEdit(this.addressInput, data.address);
        if (data.city !== undefined) await this.fillInputFieldEdit(this.cityInput, data.city);
        if (data.state !== undefined) await this.fillInputFieldEdit(this.stateInput, data.state);
        if (data.zip !== undefined) await this.fillInputFieldEdit(this.zipInput, data.zip);
    }

    async selectRiskLevel(level: string): Promise<void> {
        await this.openMenuForWrapper(this.riskLevelWrapper);
        await this.pickExactOption(level);
    }

    /** Returns the currently displayed Risk level value, or '' if none. */
    async getSelectedRiskLevel(): Promise<string> {
        const selection = this.riskLevelWrapper.locator('.v-select__selection');
        if (await selection.count() === 0) return '';
        return ((await selection.first().textContent()) ?? '').trim();
    }

    /** Set cooperation checkbox state to the boolean values provided. */
    async setCooperation(data: { leasingAndSales?: boolean; regruting?: boolean; maintenance?: boolean; fuel?: boolean }): Promise<void> {
        if (data.leasingAndSales !== undefined) await this.setCheckbox(this.leasingAndSalesCheckbox, data.leasingAndSales);
        if (data.regruting !== undefined) await this.setCheckbox(this.regrutingCheckbox, data.regruting);
        if (data.maintenance !== undefined) await this.setCheckbox(this.maintenanceCheckbox, data.maintenance);
        if (data.fuel !== undefined) await this.setCheckbox(this.fuelCheckbox, data.fuel);
    }

    async fillNote(text: string): Promise<void> {
        await this.fillInputFieldEdit(this.noteTextarea, text);
    }

    // ===== PRESIDENT CARDS =====

    /**
     * Returns the v-card under the President section whose "Full name:" line
     * contains the given name. The card carries pencil / minus / trash
     * affordances (verified on staging 2026-05-21).
     */
    getPresidentCard(fullName: string): Locator {
        const escaped = fullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Allow extra whitespace between name parts — the live DOM renders
        // "First  Last" (double-space) when middleName is empty.
        const re = new RegExp(`Full name:\\s*${escaped.replace(/\s+/g, '\\s+')}`, 'i');
        return this.presidentCards.filter({
            has: this.page.locator('p', { hasText: re }),
        });
    }

    /**
     * Wait for the president card to render AND for its loading state to
     * clear. The card initially renders with `v-card--loading` + an internal
     * progressbar while data hydrates from the server; clicking the (-) /
     * trash popover-trigger buttons before that finishes silently no-ops.
     */
    async expectPresidentCardVisible(fullName: string): Promise<void> {
        const card = this.getPresidentCard(fullName).first();
        await card.waitFor({ state: 'visible', timeout: 10000 });
        await expect.poll(
            async () => (await card.getAttribute('class') ?? '').includes('v-card--loading'),
            { timeout: 10000, intervals: [200, 400, 800] },
        ).toBe(false);
    }

    /** Wait for the president card to disappear (after Unpair / Delete / Edit-rename). */
    async expectPresidentCardHidden(fullName: string): Promise<void> {
        await expect.poll(
            async () => this.getPresidentCard(fullName).count(),
            { timeout: 10000, intervals: [200, 400, 800] },
        ).toBe(0);
    }

    // ===== EDIT PRESIDENT =====

    /** Click the pencil icon on the card for `fullName` and wait for the Edit president dialog. */
    async openEditPresidentDialog(fullName: string): Promise<void> {
        await this.getPresidentCard(fullName).first().locator('.mdi-pencil').click();
        await this.editPresidentDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    /** Clear + retype each Edit president field provided. */
    async fillEditPresidentForm(data: Partial<AddPresidentData>): Promise<void> {
        if (data.firstName !== undefined) await this.fillInputFieldEdit(this.editPresidentFirstNameInput, data.firstName);
        if (data.middleName !== undefined) await this.fillInputFieldEdit(this.editPresidentMiddleNameInput, data.middleName);
        if (data.lastName !== undefined) await this.fillInputFieldEdit(this.editPresidentLastNameInput, data.lastName);
        if (data.address !== undefined) await this.fillInputFieldEdit(this.editPresidentAddressInput, data.address);
        if (data.city !== undefined) await this.fillInputFieldEdit(this.editPresidentCityInput, data.city);
        if (data.state !== undefined) await this.fillInputFieldEdit(this.editPresidentStateInput, data.state);
        if (data.zip !== undefined) await this.fillInputFieldEdit(this.editPresidentZipInput, data.zip);
        if (data.ssn !== undefined) await this.fillInputFieldEdit(this.editPresidentSsnInput, data.ssn);
    }

    /**
     * Submit the Edit president dialog. Surfaces server-side errors (the UI
     * silently swallows them) and waits for the dialog to close.
     */
    async submitEditPresident(): Promise<void> {
        const responsePromise = this.page.waitForResponse(
            r => r.url().includes('/ms-leasing/presidents') && r.request().method() === 'PUT',
            { timeout: 10000 },
        ).catch(() => null);
        await this.clickElement(this.editPresidentSubmitButton);
        const response = await responsePromise;
        if (response && !response.ok()) {
            const body = await response.text().catch(() => '');
            throw new Error(`Edit president failed: ${response.status()} ${body}`);
        }
        await this.editPresidentDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    /** High-level: open Edit president for `fullName`, overwrite fields, submit. */
    async editPresident(fullName: string, data: Partial<AddPresidentData>): Promise<void> {
        await this.openEditPresidentDialog(fullName);
        await this.fillEditPresidentForm(data);
        await this.submitEditPresident();
    }

    /**
     * Click an action icon (.mdi-minus / .mdi-delete) on the president card and
     * wait for its confirm dialog to open. The Vuetify icon button occasionally
     * swallows the click: the card re-renders as its data hydrates and a
     * force-click that lands mid-render has no wired-up handler, so it silently
     * no-ops and the dialog never opens. Under 4-worker CPU contention the JS
     * event loop is busier and that window widens — the root of the flake.
     *
     * A bigger single timeout can't help (the click was lost, not slow), so we
     * poll: re-issue the click each interval until the dialog is visible,
     * bounded by the timeout. Idempotent — once the dialog is up we stop
     * clicking.
     */
    private async openPresidentConfirmDialog(fullName: string, iconClass: string, dialog: Locator): Promise<void> {
        const icon = this.getPresidentCard(fullName).first().locator(iconClass);
        await icon.waitFor({ state: 'visible', timeout: 10000 });
        await expect.poll(async () => {
            if (await dialog.isVisible().catch(() => false)) return true;
            await icon.click({ force: true }).catch(() => { });
            return dialog.isVisible().catch(() => false);
        }, { timeout: 15000, intervals: [300, 500, 800, 1000, 1000] }).toBe(true);
    }

    // ===== UNPAIR (minus icon) =====

    /**
     * Click the minus icon on the president card and confirm the Warning
     * dialog ("Unpair"). Waits for the confirm modal to detach so the parent
     * modal is interactive again.
     */
    async unpairPresident(fullName: string): Promise<void> {
        await this.openPresidentConfirmDialog(fullName, '.mdi-minus', this.unpairPresidentDialog);
        await this.clickElement(this.unpairConfirmButton);
        await this.unpairPresidentDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    // ===== DELETE (trash icon) =====

    /**
     * Click the trash icon on the president card and confirm the Warning
     * dialog ("Delete"). Deletes the president record entirely (different from
     * Unpair, which only removes the link to this company).
     */
    async deletePresident(fullName: string): Promise<void> {
        await this.openPresidentConfirmDialog(fullName, '.mdi-delete', this.deletePresidentDialog);
        await this.clickElement(this.deleteConfirmButton);
        await this.deletePresidentDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    // ===== CONTACT CARDS =====

    /**
     * Returns the v-card under the Contact section whose "Name:" line matches
     * `contactName`. Each card shows Position/Name/Email/Phone + check/close
     * icons for Invoices/Contracts/Insurance, plus pencil + trash action
     * buttons (verified on staging 2026-05-21).
     */
    getContactCard(contactName: string): Locator {
        const escaped = contactName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`Name:\\s*${escaped}`, 'i');
        return this.contactCards.filter({
            has: this.page.locator('p', { hasText: re }),
        });
    }

    /**
     * Wait for the contact card to render AND for its loading state to
     * clear. Mirrors the president-card loading guard — the existing contact
     * card hydrates from the server when the Edit modal opens.
     */
    async expectContactCardVisible(contactName: string): Promise<void> {
        const card = this.getContactCard(contactName).first();
        await card.waitFor({ state: 'visible', timeout: 10000 });
        await expect.poll(
            async () => (await card.getAttribute('class') ?? '').includes('v-card--loading'),
            { timeout: 10000, intervals: [200, 400, 800] },
        ).toBe(false);
    }

    /** Wait for the contact card to disappear (after Delete). */
    async expectContactCardHidden(contactName: string): Promise<void> {
        await expect.poll(
            async () => this.getContactCard(contactName).count(),
            { timeout: 10000, intervals: [200, 400, 800] },
        ).toBe(0);
    }

    /**
     * Asserts the state of one of the boolean checkboxes (Invoices / Contracts
     * / Insurance) on a contact card. The read-only card renders state via an
     * icon next to the label — `.mdi-check-all.green--text` when true,
     * `.mdi-close.red--text` when false. We locate the icon as the immediate
     * sibling of the label `<p>` to avoid matching outer flex containers.
     */
    async expectContactCardCheckbox(
        contactName: string,
        which: 'Invoices' | 'Contracts' | 'Insurance',
        expected: boolean,
    ): Promise<void> {
        const icon = this.getContactCard(contactName).first()
            .locator('p').filter({ hasText: new RegExp(`^\\s*${which}\\s*$`) })
            .first().locator('xpath=following-sibling::i[1]');
        if (expected) {
            await expect(icon).toHaveClass(/mdi-check-all/);
        } else {
            await expect(icon).toHaveClass(/mdi-close/);
        }
    }

    // ===== EDIT CONTACT =====

    /** Click the pencil icon on the contact card and wait for the Edit contact dialog. */
    async openEditContactDialog(contactName: string): Promise<void> {
        await this.getContactCard(contactName).first().locator('.mdi-pencil').click();
        await this.editContactDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    private async openMenuForWrapperLocal(wrapper: Locator): Promise<void> {
        const slot = wrapper.locator('.v-input__slot').first();
        await slot.click();
        await this.page.locator('.menuable__content__active').last().waitFor({ state: 'visible', timeout: 5000 });
    }

    private async pickExactOptionLocal(optionText: string): Promise<void> {
        const escaped = optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`^\\s*${escaped}\\s*$`);
        const menu = this.page.locator('.menuable__content__active').last();
        const option = menu.locator('.v-list-item').filter({ hasText: re }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await menu.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /** Pick a Position option inside the Edit contact dialog. */
    async selectEditContactPosition(position: string): Promise<void> {
        await this.openMenuForWrapperLocal(this.editContactPositionWrapper);
        await this.pickExactOptionLocal(position);
    }

    /**
     * Fill provided fields in the Edit contact dialog. Position is set via
     * the dropdown; text fields use fillInputFieldEdit (clear + retype);
     * checkboxes are toggled to the requested boolean.
     */
    async fillEditContactForm(data: ContactData): Promise<void> {
        if (data.position) await this.selectEditContactPosition(data.position);
        if (data.name !== undefined) await this.fillInputFieldEdit(this.editContactNameInput, data.name);
        if (data.email !== undefined) await this.fillInputFieldEdit(this.editContactEmailInput, data.email);
        if (data.phone !== undefined) await this.fillInputFieldEdit(this.editContactPhoneInput, data.phone);
        if (data.invoices !== undefined) await this.setCheckbox(this.editContactInvoicesCheckbox, data.invoices);
        if (data.contracts !== undefined) await this.setCheckbox(this.editContactContractsCheckbox, data.contracts);
        if (data.insurance !== undefined) await this.setCheckbox(this.editContactInsuranceCheckbox, data.insurance);
    }

    /** Submit the Edit contact dialog and wait for it to close. */
    async submitEditContact(): Promise<void> {
        await this.clickElement(this.editContactSubmitButton);
        await this.editContactDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    /** High-level: open Edit contact for `contactName`, overwrite fields, submit. */
    async editContact(contactName: string, data: ContactData): Promise<void> {
        await this.openEditContactDialog(contactName);
        await this.fillEditContactForm(data);
        await this.submitEditContact();
    }

    // ===== DELETE CONTACT =====

    /**
     * Click the trash icon on the contact card and confirm the Warning dialog.
     * The card disappears once the confirm modal closes.
     */
    async deleteContact(contactName: string): Promise<void> {
        // Plain .click() (no force) — auto-scrolls the card into view, which
        // matters because the modal is tall and the contact card can sit
        // below the fold. Force click skips scroll-into-view and lands at
        // off-screen coords, silently no-op.
        await this.getContactCard(contactName).first().locator('.mdi-delete').click();
        await this.deleteContactDialog.waitFor({ state: 'visible', timeout: 5000 });
        await this.clickElement(this.deleteContactConfirmButton);
        await this.deleteContactDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }
}
