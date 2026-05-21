import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';
import { ContactData } from './newOwnerOperatorModal.page';

/**
 * Page object for the "Edit owner" modal on /leasing/clients (pencil icon on
 * an Owner Operator row). Structurally similar to EditCompanyModalPage but:
 *   - Title is "Edit owner".
 *   - Status section is "Owner operator status".
 *   - No President section; the owner IS the president.
 *   - Same Approve / Decline flow + Underwriting section appears after Approve.
 */
export class EditOwnerOperatorModalPage extends BasePage {
    readonly page: Page;

    readonly dialog: Locator;
    readonly title: Locator;

    // ===== Status =====
    readonly statusHeader: Locator;
    readonly statusChip: Locator;
    readonly approveButton: Locator;
    readonly declineButton: Locator;

    // ===== Underwriting =====
    readonly underwritingHeader: Locator;
    readonly underwritingAddNewButton: Locator;
    readonly underwritingTable: Locator;

    // ===== Billing info =====
    readonly billingInfoHeader: Locator;

    // ===== Editable Owner information (First/Last/Middle name rendered disabled on Edit) =====
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipInput: Locator;
    readonly riskLevelWrapper: Locator;
    readonly areTheyMuslimCheckbox: Locator;

    // ===== Cooperation =====
    readonly leasingAndSalesCheckbox: Locator;
    readonly regrutingCheckbox: Locator;
    readonly maintenanceCheckbox: Locator;
    readonly fuelCheckbox: Locator;

    // ===== Note =====
    readonly noteTextarea: Locator;

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
            has: page.locator('h2.headline', { hasText: Constants.editOwnerOperatorModalTitle }),
        });
        this.title = this.dialog.locator('h2.headline', { hasText: Constants.editOwnerOperatorModalTitle });

        this.statusHeader = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.newOwnerOperatorSectionStatus}\\s*$`) });
        this.statusChip = this.statusHeader.locator('xpath=following-sibling::*[1]');
        this.approveButton = this.dialog.getByRole('button', { name: Constants.editClientApproveButton, exact: true });
        this.declineButton = this.dialog.getByRole('button', { name: Constants.editClientDeclineButton, exact: true });

        this.underwritingHeader = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.editClientSectionUnderwriting}\\s*$`) });
        const underwritingHeaderRow = this.underwritingHeader.locator('xpath=parent::div');
        this.underwritingAddNewButton = underwritingHeaderRow
            .getByRole('button', { name: new RegExp(`^\\s*${Constants.editClientAddNewButton}\\s*$`, 'i') });
        this.underwritingTable = underwritingHeaderRow.locator('xpath=following-sibling::*//table').first();

        this.billingInfoHeader = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.editClientSectionBillingInfo}\\s*$`) });

        // ===== Editable Owner information =====
        // Owner info lives in `form[data-vv-scope="owner"]` — scope to that so
        // Address/City/State/ZIP don't clash with same-named contact fields.
        const ownerForm = this.dialog.locator('form[data-vv-scope="owner"]');
        this.addressInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelAddress);
        this.cityInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelCity);
        this.stateInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelState);
        this.zipInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelZIP);
        this.riskLevelWrapper = this.inputWrapperByLabel(ownerForm, Constants.newOwnerOperatorLabelRiskLevel);
        this.areTheyMuslimCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelAreTheyMuslim });

        // ===== Cooperation =====
        this.leasingAndSalesCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelLeasingAndSales });
        this.regrutingCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelRegruting });
        this.maintenanceCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelMaintenance });
        this.fuelCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelFuel });

        // ===== Note =====
        this.noteTextarea = this.dialog.locator('textarea[name="note"]');

        // ===== Contact cards =====
        // Contacts added via the Add contact button render as v-cards inside
        // order-7, identical to the company modal layout (verified 2026-05-21).
        this.contactCards = this.dialog.locator('.order-7 .v-card');

        // ===== Edit contact nested dialog =====
        this.editContactDialog = page.locator('.v-dialog--active', {
            has: page.locator('h3, .v-card__title, h2', { hasText: new RegExp(`^\\s*${Constants.newCompanyEditContactTitle}\\s*$`) }),
        });
        // The Edit contact dialog only contains the contact form, so scoping
        // by the dialog disambiguates Name/Email/Phone from the parent modal's
        // inline contact form (and owner-info fields).
        this.editContactPositionWrapper = this.editContactDialog.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newOwnerOperatorLabelContactPosition}\\s*$`) }),
        });
        this.editContactNameInput = this.editContactDialog.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newOwnerOperatorLabelContactName}\\s*$`) }),
        }).locator('input[type="text"]').first();
        this.editContactEmailInput = this.editContactDialog.locator('input[name="email"]');
        this.editContactPhoneInput = this.editContactDialog.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newOwnerOperatorLabelContactPhone}\\s*$`) }),
        }).locator('input[type="text"]').first();
        this.editContactInvoicesCheckbox = this.editContactDialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelInvoices });
        this.editContactContractsCheckbox = this.editContactDialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelContracts });
        this.editContactInsuranceCheckbox = this.editContactDialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelInsurance });
        this.editContactSubmitButton = this.editContactDialog.getByRole('button', { name: Constants.newCompanyEditContactButton, exact: true });

        // ===== Delete contact confirm dialog =====
        this.deleteContactDialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__text', { hasText: Constants.newCompanyDeleteContactText }),
        });
        this.deleteContactConfirmButton = this.deleteContactDialog.getByRole('button', { name: Constants.newCompanyDeleteConfirmButton, exact: true });

        this.saveButton = this.dialog.getByRole('button', { name: Constants.newOwnerOperatorSaveButton, exact: true });
        this.cancelButton = this.dialog.getByRole('button', { name: Constants.newOwnerOperatorCancelButton, exact: true });
    }

    private inputWrapperByLabel(root: Locator, labelText: string): Locator {
        const escaped = labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return root.locator('.v-input', {
            has: this.page.locator('label', { hasText: new RegExp(`^\\s*${escaped}\\s*$`) }),
        });
    }

    private fieldByLabel(root: Locator, labelText: string): Locator {
        return this.inputWrapperByLabel(root, labelText).locator('input,textarea').first();
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

    async getStatus(): Promise<string> {
        return ((await this.statusChip.textContent()) ?? '').trim();
    }

    async approve(): Promise<void> {
        await this.clickElement(this.approveButton);
        await expect(this.statusChip).toContainText(Constants.editClientStatusApproved, { timeout: 10000 });
    }

    async decline(): Promise<void> {
        await this.clickElement(this.declineButton);
        await expect(this.statusChip).toContainText(Constants.editClientStatusDeclined, { timeout: 10000 });
    }

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

    // ===== CONTACT CARDS =====

    /**
     * Returns the v-card under the Contact section whose "Name:" line matches
     * `contactName`. Carries pencil + trash action buttons (verified on
     * staging 2026-05-21).
     */
    getContactCard(contactName: string): Locator {
        const escaped = contactName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`Name:\\s*${escaped}`, 'i');
        return this.contactCards.filter({
            has: this.page.locator('p', { hasText: re }),
        });
    }

    /**
     * Wait for the contact card to render AND for its loading state to clear.
     * The card hydrates from the server when the Edit modal opens; clicking
     * popover-trigger buttons during loading silently no-ops.
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
     * / Insurance) on a contact card. Mirrors the company variant — locates
     * the icon as the immediate sibling of the label `<p>` to avoid matching
     * outer flex containers.
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

    async selectEditContactPosition(position: string): Promise<void> {
        await this.openMenuForWrapperLocal(this.editContactPositionWrapper);
        await this.pickExactOptionLocal(position);
    }

    async fillEditContactForm(data: ContactData): Promise<void> {
        if (data.position) await this.selectEditContactPosition(data.position);
        if (data.name !== undefined) await this.fillInputFieldEdit(this.editContactNameInput, data.name);
        if (data.email !== undefined) await this.fillInputFieldEdit(this.editContactEmailInput, data.email);
        if (data.phone !== undefined) await this.fillInputFieldEdit(this.editContactPhoneInput, data.phone);
        if (data.invoices !== undefined) await this.setCheckbox(this.editContactInvoicesCheckbox, data.invoices);
        if (data.contracts !== undefined) await this.setCheckbox(this.editContactContractsCheckbox, data.contracts);
        if (data.insurance !== undefined) await this.setCheckbox(this.editContactInsuranceCheckbox, data.insurance);
    }

    async submitEditContact(): Promise<void> {
        await this.clickElement(this.editContactSubmitButton);
        await this.editContactDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async editContact(contactName: string, data: ContactData): Promise<void> {
        await this.openEditContactDialog(contactName);
        await this.fillEditContactForm(data);
        await this.submitEditContact();
    }

    // ===== DELETE CONTACT =====

    async deleteContact(contactName: string): Promise<void> {
        // Plain .click() (no force) auto-scrolls the card into view — the
        // modal is tall and the contact card can be below the fold.
        await this.getContactCard(contactName).first().locator('.mdi-delete').click();
        await this.deleteContactDialog.waitFor({ state: 'visible', timeout: 5000 });
        await this.clickElement(this.deleteContactConfirmButton);
        await this.deleteContactDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }
}
