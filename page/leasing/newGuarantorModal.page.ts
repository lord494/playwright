import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export type GuarantorCompanyData = {
    name: string;
    mc?: string;
    dot?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    fein?: string;
    riskLevel?: string;
};

export type GuarantorOwnerData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    ssn?: string;
    riskLevel?: string;
};

/**
 * "New guarantor" on /leasing/clients — verified against staging 2026-10-06.
 *   - The button opens a menu: Company / Owner operator.
 *   - Each option opens the New company / New owner form in guarantor mode
 *     (titles are the same as the regular modals). The dialog is therefore
 *     scoped by its "Guarantees for" heading, which only guarantor mode has.
 *   - Save validates client-side first (no request while invalid), then
 *     POST /ms-leasing/company { clientDto: { ..., isGuarantor: true, guaranteedCompanies } } -> 201,
 *     shows the "Guarantor was added successfully" snack and closes the dialog.
 *   - "Guarantees for" searches GET /ms-leasing/company/search?search&searchOwnerOperators=true
 *     and is a multi-select with checkbox options and chips.
 */
export class NewGuarantorModalPage extends BasePage {
    readonly page: Page;

    // ===== Entry point on /leasing/clients =====
    readonly newGuarantorButton: Locator;
    readonly guarantorTypeMenu: Locator;
    readonly companyTypeOption: Locator;
    readonly ownerOperatorTypeOption: Locator;

    // ===== Dialog =====
    readonly dialog: Locator;
    readonly title: Locator;
    readonly companyInfoHeading: Locator;
    readonly ownerInfoHeading: Locator;
    readonly guaranteesForHeading: Locator;
    readonly clientIdInput: Locator;
    readonly riskLevelWrapper: Locator;
    readonly riskLevelSlot: Locator;
    readonly riskLevelSelection: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly validationMessages: Locator;
    readonly successSnack: Locator;

    // ===== Company guarantor fields =====
    readonly nameInput: Locator;
    readonly mcInput: Locator;
    readonly dotInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipInput: Locator;
    readonly feinInput: Locator;
    readonly sisterCompanyWrapper: Locator;

    // ===== Owner operator guarantor fields =====
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly ssnInput: Locator;

    // ===== Guarantees for =====
    readonly guaranteesForWrapper: Locator;
    readonly guaranteesForSlot: Locator;
    readonly guaranteesForInput: Locator;
    readonly guaranteesForChips: Locator;
    readonly guaranteesForMessage: Locator;

    readonly activeMenu: Locator;
    readonly activeMenuOptions: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.newGuarantorButton = page.getByRole('button', { name: Constants.newGuarantorButtonLabel });
        this.activeMenu = page.locator('.menuable__content__active');
        this.activeMenuOptions = this.activeMenu.locator('.v-list-item');
        this.guarantorTypeMenu = this.activeMenu;
        this.companyTypeOption = this.activeMenuOptions.filter({ hasText: this.exactText(Constants.newGuarantorTypeCompany) });
        this.ownerOperatorTypeOption = this.activeMenuOptions.filter({ hasText: this.exactText(Constants.newGuarantorTypeOwnerOperator) });

        this.dialog = page.locator('.v-dialog--active', {
            has: page.locator('h3', { hasText: this.exactText(Constants.newGuarantorSectionGuaranteesFor) }),
        });
        this.title = this.dialog.locator('h2');
        this.companyInfoHeading = this.dialog.locator('h3', { hasText: this.exactText(Constants.newCompanySectionCompanyInfo) });
        this.ownerInfoHeading = this.dialog.locator('h3', { hasText: this.exactText(Constants.newOwnerOperatorSectionOwnerInfo) });
        this.guaranteesForHeading = this.dialog.locator('h3', { hasText: this.exactText(Constants.newGuarantorSectionGuaranteesFor) });
        this.clientIdInput = this.fieldByLabel(Constants.newCompanyLabelClientId);
        this.riskLevelWrapper = this.wrapperByLabel(Constants.newCompanyLabelRiskLevel);
        this.riskLevelSlot = this.riskLevelWrapper.locator('.v-input__slot');
        this.riskLevelSelection = this.riskLevelWrapper.locator('.v-select__selection');
        this.saveButton = this.dialog.getByRole('button', { name: Constants.newOwnerOperatorSaveButton, exact: true });
        this.cancelButton = this.dialog.getByRole('button', { name: Constants.newOwnerOperatorCancelButton, exact: true });
        this.validationMessages = this.dialog.locator('.v-messages__message');
        this.successSnack = page.locator('.v-snack__content');

        this.nameInput = this.dialog.locator('input[name="name"]');
        this.mcInput = this.fieldByLabel(Constants.newCompanyLabelMC);
        this.dotInput = this.fieldByLabel(Constants.newCompanyLabelDOT);
        this.addressInput = this.fieldByLabel(Constants.newCompanyLabelAddress);
        this.cityInput = this.fieldByLabel(Constants.newCompanyLabelCity);
        this.stateInput = this.fieldByLabel(Constants.newCompanyLabelState);
        this.zipInput = this.fieldByLabel(Constants.newCompanyLabelZIP);
        this.feinInput = this.fieldByLabel(Constants.newCompanyLabelFEIN);
        this.sisterCompanyWrapper = this.wrapperByLabel(Constants.newCompanyLabelSisterCompany);

        this.firstNameInput = this.dialog.locator('input[name="firstName"]');
        this.middleNameInput = this.fieldByLabel(Constants.newOwnerOperatorLabelMiddleName);
        this.lastNameInput = this.dialog.locator('input[name="lastName"]');
        this.ssnInput = this.dialog.locator('input[name="ownerSsn"]');

        this.guaranteesForWrapper = this.wrapperByLabel(Constants.newGuarantorLabelGuaranteesFor);
        this.guaranteesForSlot = this.guaranteesForWrapper.locator('.v-input__slot');
        this.guaranteesForInput = this.guaranteesForWrapper.locator('input[type="text"]');
        this.guaranteesForChips = this.guaranteesForWrapper.locator('.v-chip');
        this.guaranteesForMessage = this.guaranteesForWrapper.locator('.v-messages__message');
    }

    // ===== OPEN / CLOSE =====

    async openGuarantorTypeMenu(): Promise<void> {
        await this.clickElement(this.newGuarantorButton);
        await this.companyTypeOption.waitFor({ state: 'visible' });
    }

    async openCompanyGuarantorModal(): Promise<void> {
        await this.openGuarantorTypeMenu();
        await this.clickElement(this.companyTypeOption);
        await this.companyInfoHeading.waitFor({ state: 'visible' });
    }

    async openOwnerOperatorGuarantorModal(): Promise<void> {
        await this.openGuarantorTypeMenu();
        await this.clickElement(this.ownerOperatorTypeOption);
        await this.ownerInfoHeading.waitFor({ state: 'visible' });
    }

    async cancel(): Promise<void> {
        await this.clickElement(this.cancelButton);
        await this.dialog.waitFor({ state: 'hidden' });
    }

    // ===== FORM =====

    async fillCompanyInformation(data: GuarantorCompanyData): Promise<void> {
        await this.fillInputField(this.nameInput, data.name);
        if (data.mc) await this.fillInputField(this.mcInput, data.mc);
        if (data.dot) await this.fillInputField(this.dotInput, data.dot);
        if (data.address) await this.fillInputField(this.addressInput, data.address);
        if (data.city) await this.fillInputField(this.cityInput, data.city);
        if (data.state) await this.fillInputField(this.stateInput, data.state);
        if (data.zip) await this.fillInputField(this.zipInput, data.zip);
        if (data.fein) await this.fillInputField(this.feinInput, data.fein);
        if (data.riskLevel) await this.selectRiskLevel(data.riskLevel);
    }

    async fillOwnerInformation(data: GuarantorOwnerData): Promise<void> {
        await this.fillInputField(this.firstNameInput, data.firstName);
        if (data.middleName) await this.fillInputField(this.middleNameInput, data.middleName);
        await this.fillInputField(this.lastNameInput, data.lastName);
        if (data.address) await this.fillInputField(this.addressInput, data.address);
        if (data.city) await this.fillInputField(this.cityInput, data.city);
        if (data.state) await this.fillInputField(this.stateInput, data.state);
        if (data.zip) await this.fillInputField(this.zipInput, data.zip);
        if (data.ssn) await this.fillInputField(this.ssnInput, data.ssn);
        if (data.riskLevel) await this.selectRiskLevel(data.riskLevel);
    }

    async selectRiskLevel(level: string): Promise<void> {
        await this.clickElement(this.riskLevelSlot);
        await this.clickElement(this.activeMenuOptions.filter({ hasText: this.exactText(level) }).first());
        await this.activeMenu.waitFor({ state: 'hidden' });
    }

    /** Searches "Guarantees for" for `companyName`, ticks its option and closes the menu. */
    async addGuaranteedCompany(companyName: string): Promise<void> {
        await this.clickElement(this.guaranteesForSlot);
        await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/ms-leasing/company/search') && res.status() === 200),
            this.fillInputField(this.guaranteesForInput, companyName),
        ]);
        await this.clickElement(this.activeMenuOptions.filter({ hasText: this.exactText(companyName) }).first());
        await this.page.keyboard.press('Escape');
        await this.activeMenu.waitFor({ state: 'hidden' });
        await this.getGuaranteedCompanyChip(companyName).waitFor({ state: 'visible' });
    }

    getGuaranteedCompanyChip(companyName: string): Locator {
        return this.guaranteesForChips.filter({ hasText: this.exactText(companyName) });
    }

    // ===== SAVE =====

    /** Clicks Save without waiting for a request — for validation scenarios. */
    async clickSave(): Promise<void> {
        await this.clickElement(this.saveButton);
    }

    /** Saves a valid form and returns the id of the created guarantor once the dialog has closed. */
    async save(): Promise<number> {
        const [response] = await Promise.all([
            this.page.waitForResponse(res => this.isCreateClientResponse(res)),
            this.clickElement(this.saveButton),
        ]);
        const created = await response.json() as { id: number };
        await this.dialog.waitFor({ state: 'hidden' });
        return created.id;
    }

    async getValidationMessages(): Promise<string[]> {
        const texts = await this.validationMessages.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    // ===== INTERNALS =====

    private isCreateClientResponse(res: Response): boolean {
        return res.request().method() === 'POST'
            && new URL(res.url()).pathname === '/ms-leasing/company'
            && res.status() === 201;
    }

    private wrapperByLabel(labelText: string): Locator {
        return this.dialog.locator('.v-input', {
            has: this.page.locator('label', { hasText: this.exactText(labelText) }),
        });
    }

    private fieldByLabel(labelText: string): Locator {
        return this.wrapperByLabel(labelText).locator('input').first();
    }

    private exactText(text: string): RegExp {
        const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^\\s*${escaped}\\s*$`);
    }
}
