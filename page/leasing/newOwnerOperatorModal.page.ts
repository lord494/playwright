import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export type OwnerInformationData = {
    firstName: string;
    lastName: string;
    middleName?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    ssn?: string;
    riskLevel?: string;
    areTheyMuslim?: boolean;
};

export type CooperationData = {
    leasingAndSales?: boolean;
    regruting?: boolean;
    maintenance?: boolean;
    fuel?: boolean;
};

export type ContactData = {
    position?: string;
    name?: string;
    email?: string;
    phone?: string;
    invoices?: boolean;
    contracts?: boolean;
    insurance?: boolean;
};

export type NewOwnerOperatorData = {
    info: OwnerInformationData;
    cooperation?: CooperationData;
    contact?: ContactData;
    note?: string;
};

/**
 * Page object for the "New Owner Operator" modal that opens from
 * /leasing/clients via the "New Owner Operator" button.
 *
 * Structurally similar to the New Company modal but with key differences:
 *   - The modal title is "New owner".
 *   - The top section is "Owner information" with First name* / Middle name /
 *     Last name* (no company name), plus Address/City/State/ZIP/SSN.
 *   - There is NO President or Sister-company section — the owner operator IS
 *     the president.
 *   - The status section is titled "Owner operator status" and starts as Pending.
 *   - Validation enforces First Name + Last Name (both required).
 */
export class NewOwnerOperatorModalPage extends BasePage {
    readonly page: Page;

    readonly dialog: Locator;
    readonly title: Locator;

    // ===== Owner information =====
    readonly ownerInfoSection: Locator;
    readonly clientIdInput: Locator;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipInput: Locator;
    readonly ssnInput: Locator;
    readonly riskLevelWrapper: Locator;
    readonly riskLevelInput: Locator;
    readonly areTheyMuslimCheckbox: Locator;

    // ===== Cooperation =====
    readonly cooperationSection: Locator;
    readonly cooperationStartDateInput: Locator;
    readonly leasingAndSalesCheckbox: Locator;
    readonly regrutingCheckbox: Locator;
    readonly maintenanceCheckbox: Locator;
    readonly fuelCheckbox: Locator;

    // ===== Status =====
    readonly statusChip: Locator;

    // ===== Contact =====
    readonly contactSection: Locator;
    readonly contactPositionWrapper: Locator;
    readonly contactPositionInput: Locator;
    readonly contactNameInput: Locator;
    readonly contactEmailInput: Locator;
    readonly contactPhoneInput: Locator;
    readonly contactInvoicesCheckbox: Locator;
    readonly contactContractsCheckbox: Locator;
    readonly contactInsuranceCheckbox: Locator;
    readonly addContactButton: Locator;

    // ===== Representatives =====
    readonly representativesSection: Locator;
    readonly salesManagerTrucksWrapper: Locator;
    readonly salesManagerTrucksInput: Locator;
    readonly salesPersTrucksWrapper: Locator;
    readonly salesManagerTrailersWrapper: Locator;
    readonly salesManagerTrailersInput: Locator;
    readonly accTeamLeaderWrapper: Locator;
    readonly accTeamLeaderInput: Locator;
    readonly collectionPersonWrapper: Locator;
    readonly collectionPersonInput: Locator;

    // ===== Note + Comments =====
    readonly noteSection: Locator;
    readonly noteTextarea: Locator;
    readonly commentsSection: Locator;
    readonly addCommentButton: Locator;

    // ===== Footer =====
    readonly cancelButton: Locator;
    readonly saveButton: Locator;

    // ===== Validation =====
    readonly validationMessages: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.dialog = page.locator('.v-dialog--active', {
            has: page.locator('h2.headline', { hasText: Constants.newOwnerOperatorModalTitle }),
        });
        this.title = this.dialog.locator('h2.headline', { hasText: Constants.newOwnerOperatorModalTitle });

        // ===== Owner information =====
        // Scope to the `form[data-vv-scope="owner"]` so Address/City/State/ZIP
        // here don't clash with the (currently absent) contact fields below.
        const ownerForm = this.dialog.locator('form[data-vv-scope="owner"]');

        this.ownerInfoSection = this.dialog.locator('h3.title', { hasText: Constants.newOwnerOperatorSectionOwnerInfo });
        this.clientIdInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelClientId);
        this.firstNameInput = ownerForm.locator('input[name="firstName"]');
        this.middleNameInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelMiddleName);
        this.lastNameInput = ownerForm.locator('input[name="lastName"]');
        this.addressInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelAddress);
        this.cityInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelCity);
        this.stateInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelState);
        this.zipInput = this.fieldByLabel(ownerForm, Constants.newOwnerOperatorLabelZIP);
        this.ssnInput = ownerForm.locator('input[name="ownerSsn"]');
        this.riskLevelWrapper = this.inputWrapperByLabel(ownerForm, Constants.newOwnerOperatorLabelRiskLevel);
        this.riskLevelInput = this.riskLevelWrapper.locator('input[type="text"]').first();
        this.areTheyMuslimCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelAreTheyMuslim });

        // ===== Cooperation =====
        this.cooperationSection = this.dialog.locator('h3.title', { hasText: Constants.newOwnerOperatorSectionCooperation });
        this.cooperationStartDateInput = this.fieldByLabel(this.dialog, Constants.newOwnerOperatorLabelCooperationStartDate);
        // Scope checkboxes to the dialog — the underlying /leasing/clients page
        // also exposes identically-named checkboxes (Leasing Sales, Recruiting,
        // Maintenance, Fuel) as table filters.
        this.leasingAndSalesCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelLeasingAndSales });
        this.regrutingCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelRegruting });
        this.maintenanceCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelMaintenance });
        this.fuelCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelFuel });

        // ===== Status =====
        this.statusChip = this.dialog.locator('h3.title', { hasText: Constants.newOwnerOperatorSectionStatus })
            .locator('xpath=following-sibling::*[1]');

        // ===== Contact =====
        const contactForm = this.dialog.locator('form[data-vv-scope="contact"]');
        this.contactSection = this.dialog.locator('h3.title', { hasText: Constants.newOwnerOperatorSectionContact });
        this.contactPositionWrapper = this.inputWrapperByLabel(contactForm, Constants.newOwnerOperatorLabelContactPosition);
        this.contactPositionInput = this.contactPositionWrapper.locator('input[type="text"]').first();
        this.contactNameInput = this.fieldByLabel(contactForm, Constants.newOwnerOperatorLabelContactName);
        this.contactEmailInput = contactForm.locator('input[name="email"]');
        this.contactPhoneInput = this.fieldByLabel(contactForm, Constants.newOwnerOperatorLabelContactPhone);
        this.contactInvoicesCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelInvoices });
        this.contactContractsCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelContracts });
        this.contactInsuranceCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newOwnerOperatorLabelInsurance });
        this.addContactButton = this.dialog.getByRole('button', { name: new RegExp(`\\s*${Constants.newOwnerOperatorAddContactButton}\\s*`, 'i') });

        // ===== Representatives =====
        this.representativesSection = this.dialog.locator('h3.title', { hasText: Constants.newOwnerOperatorSectionRepresentatives });
        this.salesManagerTrucksWrapper = this.inputWrapperByLabel(this.dialog, Constants.newOwnerOperatorLabelSalesManagerTrucks);
        this.salesManagerTrucksInput = this.salesManagerTrucksWrapper.locator('input[type="text"]').first();
        this.salesPersTrucksWrapper = this.inputWrapperByLabel(this.dialog, Constants.newOwnerOperatorLabelSalesPersTrucks);
        this.salesManagerTrailersWrapper = this.inputWrapperByLabel(this.dialog, Constants.newOwnerOperatorLabelSalesManagerTrailers);
        this.salesManagerTrailersInput = this.salesManagerTrailersWrapper.locator('input[type="text"]').first();
        this.accTeamLeaderWrapper = this.inputWrapperByLabel(this.dialog, Constants.newOwnerOperatorLabelAccTeamLeader);
        this.accTeamLeaderInput = this.accTeamLeaderWrapper.locator('input[type="text"]').first();
        this.collectionPersonWrapper = this.inputWrapperByLabel(this.dialog, Constants.newOwnerOperatorLabelCollectionPerson);
        this.collectionPersonInput = this.collectionPersonWrapper.locator('input[type="text"]').first();

        // ===== Note + Comments =====
        this.noteSection = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.newOwnerOperatorSectionNote}\\s*$`) });
        this.noteTextarea = this.dialog.locator('textarea[name="note"]');
        this.commentsSection = this.dialog.locator('h3.title', { hasText: Constants.newOwnerOperatorSectionComments });
        this.addCommentButton = this.dialog.locator('button.v-btn--fab', { has: page.locator('.mdi-plus') });

        // ===== Footer =====
        this.cancelButton = this.dialog.getByRole('button', { name: Constants.newOwnerOperatorCancelButton, exact: true });
        this.saveButton = this.dialog.getByRole('button', { name: Constants.newOwnerOperatorSaveButton, exact: true });

        // ===== Validation =====
        this.validationMessages = this.dialog.locator('.v-messages__message');
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

    // ===== STATE =====

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

    // ===== Owner information =====

    async fillFirstName(text: string): Promise<void> {
        await this.fillInputField(this.firstNameInput, text);
    }

    async fillLastName(text: string): Promise<void> {
        await this.fillInputField(this.lastNameInput, text);
    }

    async fillOwnerInformation(data: OwnerInformationData): Promise<void> {
        await this.fillFirstName(data.firstName);
        if (data.middleName !== undefined) await this.fillInputField(this.middleNameInput, data.middleName);
        await this.fillLastName(data.lastName);
        if (data.address !== undefined) await this.fillInputField(this.addressInput, data.address);
        if (data.city !== undefined) await this.fillInputField(this.cityInput, data.city);
        if (data.state !== undefined) await this.fillInputField(this.stateInput, data.state);
        if (data.zip !== undefined) await this.fillInputField(this.zipInput, data.zip);
        if (data.ssn !== undefined) await this.fillInputField(this.ssnInput, data.ssn);
        if (data.riskLevel) await this.selectRiskLevel(data.riskLevel);
        if (data.areTheyMuslim) await this.check(this.areTheyMuslimCheckbox);
    }

    async selectRiskLevel(level: string): Promise<void> {
        await this.openMenuForWrapper(this.riskLevelWrapper);
        await this.pickExactOption(level);
    }

    /** Returns the currently displayed Risk level value, or '' if none. */
    async getSelectedRiskLevel(): Promise<string> {
        const selection = this.riskLevelWrapper.locator('.v-select__selection');
        if (await selection.count() === 0) return '';
        return (await selection.first().textContent() || '').trim();
    }

    // ===== Cooperation =====

    async setCooperation(data: CooperationData): Promise<void> {
        if (data.leasingAndSales !== undefined) await this.setCheckbox(this.leasingAndSalesCheckbox, data.leasingAndSales);
        if (data.regruting !== undefined) await this.setCheckbox(this.regrutingCheckbox, data.regruting);
        if (data.maintenance !== undefined) await this.setCheckbox(this.maintenanceCheckbox, data.maintenance);
        if (data.fuel !== undefined) await this.setCheckbox(this.fuelCheckbox, data.fuel);
    }

    private async setCheckbox(checkbox: Locator, value: boolean): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (isChecked !== value) await checkbox.click({ force: true });
    }

    // ===== Contact =====

    async selectContactPosition(position: string): Promise<void> {
        await this.openMenuForWrapper(this.contactPositionWrapper);
        await this.pickExactOption(position);
    }

    async fillContact(data: ContactData): Promise<void> {
        if (data.position) await this.selectContactPosition(data.position);
        if (data.name !== undefined) await this.fillInputField(this.contactNameInput, data.name);
        if (data.email !== undefined) await this.fillInputField(this.contactEmailInput, data.email);
        if (data.phone !== undefined) await this.fillInputField(this.contactPhoneInput, data.phone);
        if (data.invoices !== undefined) await this.setCheckbox(this.contactInvoicesCheckbox, data.invoices);
        if (data.contracts !== undefined) await this.setCheckbox(this.contactContractsCheckbox, data.contracts);
        if (data.insurance !== undefined) await this.setCheckbox(this.contactInsuranceCheckbox, data.insurance);
    }

    async clickAddContact(): Promise<void> {
        await this.clickElement(this.addContactButton);
    }

    /**
     * High-level helper: fill the inline contact form and click Add contact.
     * Persists the contact (form collapses into a card under the Contact
     * section). Mirrors `addPresident` on the company modal.
     */
    async addContact(data: ContactData): Promise<void> {
        await this.fillContact(data);
        await this.clickAddContact();
        if (data.name) {
            await this.dialog.locator('.order-7 .v-card', {
                has: this.page.locator('p', { hasText: new RegExp(`Name:\\s*${data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') }),
            }).first().waitFor({ state: 'visible', timeout: 5000 });
        }
    }

    // ===== Note =====

    async fillNote(text: string): Promise<void> {
        await this.fillInputField(this.noteTextarea, text);
    }

    // ===== HIGH-LEVEL CREATE =====

    async createOwnerOperator(data: NewOwnerOperatorData): Promise<void> {
        await this.expectOpen();
        await this.fillOwnerInformation(data.info);
        if (data.cooperation) await this.setCooperation(data.cooperation);
        if (data.contact) await this.fillContact(data.contact);
        if (data.note) await this.fillNote(data.note);
        await this.saveAndExpectClosed();
    }

    // ===== VALIDATION =====

    async getValidationMessages(): Promise<string[]> {
        const texts = await this.validationMessages.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    async expectValidationMessage(message: string): Promise<void> {
        await expect(this.validationMessages.filter({ hasText: message }).first()).toBeVisible({ timeout: 5000 });
    }

    // ===== AUTOCOMPLETE HELPERS =====

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
}
