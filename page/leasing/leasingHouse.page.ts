import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../helpers/base';

type LeasingHouseData = {
    name: string;
    email: string;
    emailDomain?: string;
    phone: string;
    address: string;
    bank: string;
    logoPath: string;
};

export class LeasingHousePage extends BasePage {
    readonly page: Page;
    readonly newLeasingHouseButton: Locator;
    readonly nameColumn: Locator;
    readonly emailColumn: Locator;
    readonly emailDomainColumn: Locator;
    readonly phoneColumn: Locator;
    readonly addressColumn: Locator;
    readonly bankColumn: Locator;
    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly dialogBox: Locator;
    readonly nameField: Locator;
    readonly emailField: Locator;
    readonly emailDomainField: Locator;
    readonly phoneField: Locator;
    readonly addressField: Locator;
    readonly bankField: Locator;
    readonly logoInput: Locator;
    readonly saveButton: Locator;
    readonly validationMessages: Locator;
    readonly snackMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.newLeasingHouseButton = this.page.getByRole('button', { name: /new leasing house/i });
        this.nameColumn = this.page.locator('tr td:nth-child(1)');
        this.emailColumn = this.page.locator('tr td:nth-child(2)');
        this.emailDomainColumn = this.page.locator('tr td:nth-child(3)');
        this.phoneColumn = this.page.locator('tr td:nth-child(4)');
        this.addressColumn = this.page.locator('tr td:nth-child(5)');
        this.bankColumn = this.page.locator('tr td:nth-child(6)');
        this.pencilIcon = this.page.locator('.mdi-pencil');
        this.deleteIcon = this.page.locator('.mdi-delete');
        this.dialogBox = this.page.locator('.v-dialog__content--active');
        this.nameField = this.dialogBox.locator('input[type="text"]').nth(0);
        this.emailField = this.dialogBox.locator('input[type="text"]').nth(1);
        this.emailDomainField = this.dialogBox.locator('input[type="text"]').nth(2);
        this.phoneField = this.dialogBox.locator('input[type="text"]').nth(3);
        this.addressField = this.dialogBox.locator('input[type="text"]').nth(4);
        this.bankField = this.dialogBox.locator('input[type="text"]').nth(5);
        this.logoInput = this.dialogBox.locator('input[type="file"]');
        this.saveButton = this.dialogBox.getByRole('button', { name: /^save$/i });
        this.validationMessages = this.dialogBox.locator('.v-messages__message');
        this.snackMessage = this.page.locator('.v-snack__wrapper.v-sheet .v-snack__content');
    }

    async openNewLeasingHouseModal(): Promise<void> {
        await this.clickElement(this.newLeasingHouseButton);
        await this.dialogBox.waitFor({ state: 'visible', timeout: 10000 });
    }

    async fillName(name: string): Promise<void> {
        await this.fillInputField(this.nameField, name);
    }

    async fillEmail(email: string): Promise<void> {
        await this.fillInputField(this.emailField, email);
    }

    async fillEmailDomain(emailDomain: string): Promise<void> {
        await this.fillInputField(this.emailDomainField, emailDomain);
    }

    async fillPhone(phone: string): Promise<void> {
        await this.fillInputField(this.phoneField, phone);
    }

    async fillAddress(address: string): Promise<void> {
        await this.fillInputField(this.addressField, address);
    }

    async selectBank(bank: string): Promise<void> {
        await this.bankField.click();
        await this.page.getByRole('option', { name: bank }).click();
    }

    async uploadLogo(logoPath: string): Promise<void> {
        await this.logoInput.setInputFiles(logoPath);
        await this.page.waitForTimeout(500);
    }

    async save(): Promise<void> {
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click();
    }

    async createLeasingHouse(data: LeasingHouseData): Promise<void> {
        await this.openNewLeasingHouseModal();
        await this.fillName(data.name);
        await this.fillEmail(data.email);
        if (data.emailDomain) {
            await this.fillEmailDomain(data.emailDomain);
        }
        await this.fillPhone(data.phone);
        await this.fillAddress(data.address);
        await this.selectBank(data.bank);
        await this.uploadLogo(data.logoPath);
        await this.save();
        await this.dialogBox.waitFor({ state: 'hidden', timeout: 30000 });
    }

    async openEditLeasingHouseModal(name: string): Promise<void> {
        const row = this.getRowByName(name);
        await row.waitFor({ state: 'visible', timeout: 10000 });
        await row.locator('.mdi-pencil').click();
        await this.dialogBox.waitFor({ state: 'visible', timeout: 10000 });
    }

    async editLeasingHouse(currentName: string, data: LeasingHouseData): Promise<void> {
        await this.openEditLeasingHouseModal(currentName);
        await this.nameField.clear();
        await this.fillName(data.name);
        await this.emailField.clear();
        await this.fillEmail(data.email);
        await this.emailDomainField.clear();
        if (data.emailDomain) {
            await this.fillEmailDomain(data.emailDomain);
        }
        await this.phoneField.clear();
        await this.fillPhone(data.phone);
        await this.addressField.clear();
        await this.fillAddress(data.address);
        await this.selectBank(data.bank);
        await this.uploadLogo(data.logoPath);
        await this.save();
        try {
            await this.dialogBox.waitFor({ state: 'hidden', timeout: 5000 });
        } catch {
            await this.saveButton.click({ force: true });
            await this.dialogBox.waitFor({ state: 'hidden', timeout: 30000 });
        }
    }

    getRowByName(name: string): Locator {
        return this.page.locator('tr', { has: this.page.getByText(name, { exact: true }) });
    }

    async deleteLeasingHouseByName(name: string): Promise<void> {
        const row = this.getRowByName(name);
        await row.waitFor({ state: 'visible', timeout: 10000 });
        await row.locator('.mdi-delete').click();
    }
}
