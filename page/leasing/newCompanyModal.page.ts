import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export type CompanyInformationData = {
    name: string;
    mc?: string;
    dot?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    fein?: string;
    sisterCompany?: string;
    riskLevel?: string;
    isMuslim?: boolean;
};

export type CooperationData = {
    leasingAndSales?: boolean;
    regruting?: boolean;
    maintenance?: boolean;
    fuel?: boolean;
};

export type AddPresidentData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    ssn?: string;
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

export type NewCompanyData = {
    info: CompanyInformationData;
    cooperation?: CooperationData;
    president?: AddPresidentData;
    contact?: ContactData;
    note?: string;
};

/**
 * Page object for the "New Company" modal that opens from /leasing/clients via
 * the "New Company" button. Covers the main modal + nested "Add president" modal.
 */
export class NewCompanyModalPage extends BasePage {
    readonly page: Page;

    // Root dialog scoped by its title — this matters because the modal contains
    // nested dialog containers and the page may have other dialogs.
    readonly dialog: Locator;
    readonly title: Locator;

    // ===== Company information =====
    readonly companyInfoSection: Locator;
    readonly clientIdInput: Locator;
    readonly nameInput: Locator;
    readonly mcInput: Locator;
    readonly dotInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipInput: Locator;
    readonly feinInput: Locator;
    readonly sisterCompanyWrapper: Locator;
    readonly sisterCompanyInput: Locator;
    readonly sisterCompanyChips: Locator;
    readonly riskLevelWrapper: Locator;
    readonly riskLevelInput: Locator;
    readonly isMuslimCheckbox: Locator;

    // ===== Cooperation =====
    readonly cooperationSection: Locator;
    readonly cooperationStartDateInput: Locator;
    readonly leasingAndSalesCheckbox: Locator;
    readonly regrutingCheckbox: Locator;
    readonly maintenanceCheckbox: Locator;
    readonly fuelCheckbox: Locator;

    // ===== Company status =====
    readonly statusChip: Locator;

    // ===== President =====
    readonly presidentSection: Locator;
    readonly addPresidentButton: Locator;
    readonly searchPresidentWrapper: Locator;
    readonly searchPresidentInput: Locator;
    /** mdi-link-variant chain icon — appears after picking an existing
     * president that already exists on other companies. */
    readonly presidentLinkIcon: Locator;

    // ===== Connection modal ("Found possible connections") =====
    readonly connectionDialog: Locator;
    readonly connectionDialogTitle: Locator;
    readonly connectionRows: Locator;

    // ===== Add president nested dialog =====
    readonly addPresidentDialog: Locator;
    readonly presidentFirstNameInput: Locator;
    readonly presidentMiddleNameInput: Locator;
    readonly presidentLastNameInput: Locator;
    readonly presidentAddressInput: Locator;
    readonly presidentCityInput: Locator;
    readonly presidentStateInput: Locator;
    readonly presidentZipInput: Locator;
    readonly presidentSsnInput: Locator;
    readonly presidentSubmitButton: Locator;

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

        // Scope by the unique modal title text instead of by .v-dialog--active alone:
        // other dialogs (Add president, native confirms) may also be active.
        this.dialog = page.locator('.v-dialog--active', {
            has: page.locator('h2.headline', { hasText: Constants.newCompanyModalTitle }),
        });
        this.title = this.dialog.locator('h2.headline', { hasText: Constants.newCompanyModalTitle });

        // ===== Company information =====
        this.companyInfoSection = this.dialog.locator('h3.title', { hasText: Constants.newCompanySectionCompanyInfo });
        this.clientIdInput = this.fieldByLabel(Constants.newCompanyLabelClientId);
        this.nameInput = this.dialog.locator('input[name="name"]');
        this.mcInput = this.fieldByLabel(Constants.newCompanyLabelMC);
        this.dotInput = this.fieldByLabel(Constants.newCompanyLabelDOT);
        this.addressInput = this.fieldByLabel(Constants.newCompanyLabelAddress).first();
        this.cityInput = this.fieldByLabel(Constants.newCompanyLabelCity).first();
        this.stateInput = this.fieldByLabel(Constants.newCompanyLabelState).first();
        this.zipInput = this.fieldByLabel(Constants.newCompanyLabelZIP).first();
        this.feinInput = this.fieldByLabel(Constants.newCompanyLabelFEIN);
        this.sisterCompanyWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelSisterCompany);
        this.sisterCompanyInput = this.sisterCompanyWrapper.locator('input[type="text"]').first();
        // Selected items in this multi-autocomplete are rendered as
        // `.v-select__selection` (not `.v-chip`) inside the selections area.
        this.sisterCompanyChips = this.sisterCompanyWrapper.locator('.v-select__selection, .v-chip');
        this.riskLevelWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelRiskLevel);
        this.riskLevelInput = this.riskLevelWrapper.locator('input[type="text"]').first();
        this.isMuslimCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelIsMuslim });

        // ===== Cooperation =====
        this.cooperationSection = this.dialog.locator('h3.title', { hasText: Constants.newCompanySectionCooperation });
        this.cooperationStartDateInput = this.fieldByLabel(Constants.newCompanyLabelCooperationStartDate);
        // Scope to the dialog — the Leasing Clients page also exposes
        // identically-named checkboxes (Leasing Sales, Recruiting, Maintenance,
        // Fuel) as table filters; without scoping these strict-mode-violate.
        this.leasingAndSalesCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelLeasingAndSales });
        this.regrutingCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelRegruting });
        this.maintenanceCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelMaintenance });
        this.fuelCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelFuel });

        // ===== Company status =====
        this.statusChip = this.dialog.locator('h3.title', { hasText: Constants.newCompanySectionStatus })
            .locator('xpath=following-sibling::*[1]');

        // ===== President =====
        this.presidentSection = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.newCompanySectionPresident}\\s*$`) });
        this.addPresidentButton = this.dialog.getByRole('button', { name: Constants.newCompanyAddPresidentButton, exact: true });
        this.searchPresidentWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelSearchPresident);
        this.searchPresidentInput = this.searchPresidentWrapper.locator('input[type="text"]').first();
        // The link-variant icon only renders after a president that exists on
        // other companies is picked. It lives inside the parent modal, near
        // the search-president row.
        this.presidentLinkIcon = this.dialog.locator('.mdi-link-variant');

        // ===== Connection modal =====
        this.connectionDialog = page.locator('.v-dialog--active', {
            has: page.locator('h3, h2, .v-card__title', { hasText: Constants.newCompanyConnectionModalTitle }),
        });
        this.connectionDialogTitle = this.connectionDialog.locator('h3, h2, .v-card__title')
            .filter({ hasText: Constants.newCompanyConnectionModalTitle });
        this.connectionRows = this.connectionDialog.locator('.row.align-center');

        // ===== Add president nested dialog =====
        this.addPresidentDialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__title, h2, h3', { hasText: Constants.newCompanyAddPresidentTitle }),
        });
        this.presidentFirstNameInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelFirstName);
        this.presidentMiddleNameInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelMiddleName);
        this.presidentLastNameInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelLastName);
        this.presidentAddressInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelAddress);
        this.presidentCityInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelCity);
        this.presidentStateInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelState);
        this.presidentZipInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelZIP);
        this.presidentSsnInput = this.fieldInDialog(this.addPresidentDialog, Constants.newCompanyPresidentLabelSSN);
        this.presidentSubmitButton = this.addPresidentDialog.getByRole('button', { name: Constants.newCompanyAddPresidentButton, exact: true });

        // ===== Contact =====
        this.contactSection = this.dialog.locator('h3.title', { hasText: Constants.newCompanySectionContact });
        // Contact form is scoped by `form[data-vv-scope="contact"]` — the Name/Email/Phone labels
        // collide with the President section without scoping.
        const contactForm = this.dialog.locator('form[data-vv-scope="contact"]');
        this.contactPositionWrapper = contactForm.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newCompanyLabelContactPosition}\\s*$`) }),
        });
        this.contactPositionInput = this.contactPositionWrapper.locator('input[type="text"]').first();
        this.contactNameInput = contactForm.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newCompanyLabelContactName}\\s*$`) }),
        }).locator('input[type="text"]').first();
        this.contactEmailInput = contactForm.locator('input[name="email"]');
        this.contactPhoneInput = contactForm.locator('.v-input', {
            has: page.locator('label', { hasText: new RegExp(`^\\s*${Constants.newCompanyLabelContactPhone}\\s*$`) }),
        }).locator('input[type="text"]').first();
        this.contactInvoicesCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelInvoices });
        this.contactContractsCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelContracts });
        this.contactInsuranceCheckbox = this.dialog.getByRole('checkbox', { name: Constants.newCompanyLabelInsurance });
        this.addContactButton = this.dialog.getByRole('button', { name: new RegExp(`\\s*${Constants.newCompanyAddContactButton}\\s*`, 'i') });

        // ===== Representatives =====
        this.representativesSection = this.dialog.locator('h3.title', { hasText: Constants.newCompanySectionRepresentatives });
        this.salesManagerTrucksWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelSalesManagerTrucks);
        this.salesManagerTrucksInput = this.salesManagerTrucksWrapper.locator('input[type="text"]').first();
        this.salesPersTrucksWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelSalesPersTrucks);
        this.salesManagerTrailersWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelSalesManagerTrailers);
        this.salesManagerTrailersInput = this.salesManagerTrailersWrapper.locator('input[type="text"]').first();
        this.accTeamLeaderWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelAccTeamLeader);
        this.accTeamLeaderInput = this.accTeamLeaderWrapper.locator('input[type="text"]').first();
        this.collectionPersonWrapper = this.inputWrapperByLabel(Constants.newCompanyLabelCollectionPerson);
        this.collectionPersonInput = this.collectionPersonWrapper.locator('input[type="text"]').first();

        // ===== Note + Comments =====
        this.noteSection = this.dialog.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.newCompanySectionNote}\\s*$`) });
        this.noteTextarea = this.dialog.locator('textarea[name="note"]');
        this.commentsSection = this.dialog.locator('h3.title', { hasText: Constants.newCompanySectionComments });
        this.addCommentButton = this.dialog.locator('button.v-btn--fab', { has: page.locator('.mdi-plus') });

        // ===== Footer =====
        this.cancelButton = this.dialog.getByRole('button', { name: Constants.newCompanyCancelButton, exact: true });
        this.saveButton = this.dialog.getByRole('button', { name: Constants.newCompanySaveButton, exact: true });

        // ===== Validation =====
        this.validationMessages = this.dialog.locator('.v-messages__message');
    }

    private fieldByLabel(labelText: string): Locator {
        return this.inputWrapperByLabel(labelText).locator('input,textarea').first();
    }

    private inputWrapperByLabel(labelText: string): Locator {
        return this.dialog.locator('.v-input', {
            has: this.page.locator('label', {
                hasText: new RegExp(`^\\s*${labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`),
            }),
        });
    }

    private fieldInDialog(dialog: Locator, labelText: string): Locator {
        return dialog.locator('.v-input', {
            has: this.page.locator('label', {
                hasText: new RegExp(`^\\s*${labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`),
            }),
        }).locator('input,textarea').first();
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

    // ===== Company information =====

    async fillName(name: string): Promise<void> {
        await this.fillInputField(this.nameInput, name);
    }

    async fillCompanyInformation(data: CompanyInformationData): Promise<void> {
        await this.fillName(data.name);
        if (data.mc !== undefined) await this.fillInputField(this.mcInput, data.mc);
        if (data.dot !== undefined) await this.fillInputField(this.dotInput, data.dot);
        if (data.address !== undefined) await this.fillInputField(this.addressInput, data.address);
        if (data.city !== undefined) await this.fillInputField(this.cityInput, data.city);
        if (data.state !== undefined) await this.fillInputField(this.stateInput, data.state);
        if (data.zip !== undefined) await this.fillInputField(this.zipInput, data.zip);
        if (data.fein !== undefined) await this.fillInputField(this.feinInput, data.fein);
        if (data.sisterCompany) await this.addSisterCompany(data.sisterCompany);
        if (data.riskLevel) await this.selectRiskLevel(data.riskLevel);
        if (data.isMuslim) await this.check(this.isMuslimCheckbox);
    }

    async addSisterCompany(sisterCompanyName: string): Promise<void> {
        // v-autocomplete: typing into the input is what opens the menu — clicking
        // the slot alone may not surface options. Focus the input first, then
        // type a substring to filter.
        await this.sisterCompanyInput.click();
        await this.sisterCompanyInput.type(sisterCompanyName, { delay: 30 });
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
        await this.pickFilteredOption(sisterCompanyName);
        await this.page.keyboard.press('Escape');
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

    // ===== President =====

    async openAddPresidentDialog(): Promise<void> {
        await this.clickElement(this.addPresidentButton);
        await this.addPresidentDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    async fillPresidentForm(data: AddPresidentData): Promise<void> {
        await this.fillInputField(this.presidentFirstNameInput, data.firstName);
        if (data.middleName) await this.fillInputField(this.presidentMiddleNameInput, data.middleName);
        await this.fillInputField(this.presidentLastNameInput, data.lastName);
        if (data.address) await this.fillInputField(this.presidentAddressInput, data.address);
        if (data.city) await this.fillInputField(this.presidentCityInput, data.city);
        if (data.state) await this.fillInputField(this.presidentStateInput, data.state);
        if (data.zip) await this.fillInputField(this.presidentZipInput, data.zip);
        if (data.ssn) await this.fillInputField(this.presidentSsnInput, data.ssn);
    }

    async submitAddPresident(): Promise<void> {
        // The /ms-leasing/presidents endpoint may reject duplicate full names
        // with 400 — the UI swallows that error and keeps the dialog open. Wait
        // for either the success path (dialog closes) or surface the 400 with
        // a clear message so the test fails fast.
        const responsePromise = this.page.waitForResponse(
            r => r.url().includes('/ms-leasing/presidents') && r.request().method() === 'POST',
            { timeout: 10000 },
        ).catch(() => null);
        await this.clickElement(this.presidentSubmitButton);
        const response = await responsePromise;
        if (response && !response.ok()) {
            const body = await response.text().catch(() => '');
            throw new Error(`Add president failed: ${response.status()} ${body}`);
        }
        await this.addPresidentDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async addPresident(data: AddPresidentData): Promise<void> {
        await this.openAddPresidentDialog();
        await this.fillPresidentForm(data);
        await this.submitAddPresident();
    }

    /** Returns the chip/row in the President section that displays the given name. */
    getPresidentChip(fullName: string): Locator {
        return this.dialog.locator('.v-chip', { hasText: fullName });
    }

    /**
     * Type into the "Search president" autocomplete and pick an existing
     * president whose full name matches exactly. Used to attach an existing
     * Owner Operator (whose name is reused as a president full name) to the
     * company being created.
     */
    async searchAndSelectExistingPresident(fullName: string): Promise<void> {
        await this.searchPresidentInput.click();
        // Type the first 6 chars — enough to filter to a small set; full string
        // can include diacritics or spaces that Vuetify autocomplete sometimes
        // mishandles when typed in one shot.
        const query = fullName.slice(0, Math.min(6, fullName.length));
        await this.searchPresidentInput.type(query, { delay: 40 });
        const menu = this.activeAutocompleteMenu();
        await menu.waitFor({ state: 'visible', timeout: 5000 });
        const escaped = fullName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        const option = menu.locator('.v-list-item').filter({ hasText: exactRe }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await menu.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
    }

    /**
     * Waits for the .mdi-link-variant icon to appear next to the picked
     * existing president. The icon is the affordance to open the "Found
     * possible connections" modal.
     */
    async expectPresidentLinkIconVisible(): Promise<void> {
        await this.presidentLinkIcon.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    /** Click .mdi-link-variant → opens the "Found possible connections" modal. */
    async openConnectionModal(): Promise<void> {
        await this.expectPresidentLinkIconVisible();
        await this.presidentLinkIcon.first().click();
        await this.connectionDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    /** Returns the row inside the connection modal that displays the given company name. */
    getConnectionRowFor(companyName: string): Locator {
        return this.connectionRows.filter({ has: this.page.locator('p', { hasText: companyName }) });
    }

    /**
     * Clicks "Connect" next to the given company name in the connection modal.
     * The modal does NOT auto-close on staging 2026-05-18 — the row's button
     * toggles from "Connect" to "Disconnect" to indicate the connection was
     * established. We assert that toggle, then close the modal explicitly via
     * Escape so the rest of the flow can continue.
     */
    async connectToCompany(companyName: string): Promise<void> {
        const row = this.getConnectionRowFor(companyName);
        await row.waitFor({ state: 'visible', timeout: 5000 });
        await row.getByRole('button', { name: Constants.newCompanyConnectButton, exact: true }).click();
        await expect(
            row.getByRole('button', { name: Constants.newCompanyDisconnectButton, exact: true }),
        ).toBeVisible({ timeout: 10000 });
        await this.closeConnectionModal();
    }

    /**
     * Close the "Found possible connections" modal. The dialog has no Close
     * button on staging 2026-05-18. Locator-based scrim click and Escape both
     * fail (Escape navigates the parent away). Clicking outside both modals
     * via `page.mouse.click(5, 5)` dismisses only the non-persistent
     * connection modal — the parent New Company modal is `persistent` so it
     * stays open.
     */
    async closeConnectionModal(): Promise<void> {
        await this.page.mouse.click(5, 5);
        await this.connectionDialog.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * High-level helper: type the existing-president full name into Search
     * president, wait for the link icon, open the connection modal, and click
     * Connect for the row whose company name is `connectTo` (defaults to the
     * same value when the Owner Operator's company name equals its
     * president's full name — which is the staging convention).
     */
    async attachExistingPresidentWithConnection(presidentFullName: string, connectTo: string = presidentFullName): Promise<void> {
        await this.searchAndSelectExistingPresident(presidentFullName);
        await this.openConnectionModal();
        await this.connectToCompany(connectTo);
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
     * Unlike `fillContact` alone, this actually persists the contact (the
     * inline form gets converted into a card under the Contact section).
     */
    async addContact(data: ContactData): Promise<void> {
        await this.fillContact(data);
        await this.clickAddContact();
        // The Add contact button collapses the inline form into a card; wait
        // for the card to materialize when the contact has a Name.
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

    /**
     * Convenience: fills the modal with the provided data and clicks Save.
     * Does not assert the dialog closed — callers can chain `expectClosed()`
     * or `saveAndExpectClosed()` when needed.
     */
    async createCompany(data: NewCompanyData): Promise<void> {
        await this.expectOpen();
        await this.fillCompanyInformation(data.info);
        if (data.cooperation) await this.setCooperation(data.cooperation);
        if (data.president) await this.addPresident(data.president);
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

    /**
     * Vuetify v-select / v-autocomplete: clicking the `.v-input__slot`
     * (the element with role="button" and aria-haspopup="listbox") is what
     * opens the menu. Clicking the wrapper `.v-input` sometimes lands in
     * empty padding and the menu doesn't open — hence this helper.
     */
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

    private async pickFilteredOption(searchText: string): Promise<void> {
        const menu = this.activeAutocompleteMenu();
        const option = menu.locator('.v-list-item').filter({ hasText: searchText }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }
}
