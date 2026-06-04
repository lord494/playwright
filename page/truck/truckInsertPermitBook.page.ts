import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import path from 'path';

export class TruckInsertPermitBook extends BasePage {
    readonly page: Page;
    readonly insertDocumentField: Locator;
    readonly documentNameField: Locator;
    readonly expiringDateField: Locator;
    readonly documentSubtypeField: Locator;
    readonly documentTypeField: Locator;
    readonly truckType: Locator;
    readonly trailerType: Locator;
    readonly companyType: Locator;
    readonly driverType: Locator;
    readonly savePermitButton: Locator;
    readonly okButtonInDatePicekr: Locator;
    readonly eldDocumentsSubtype: Locator;
    readonly registrationSubtype: Locator;
    readonly othersSubtype: Locator;
    readonly iftaSubtype: Locator;
    readonly currentDate: Locator;
    readonly loader: Locator;
    readonly xIconInFIelds: Locator;
    readonly errorMessage: Locator;
    readonly documentReferrerMenu: Locator;
    readonly doc: Locator;
    readonly truckNumberFromMenu: Locator;
    readonly secondTruckNumberFromMenu: Locator;
    readonly trailerNumberFromMenu: Locator;
    readonly compnyFromMenu: Locator;
    readonly driverOption: Locator;
    readonly previousMonthButtonInDatePicker: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.insertDocumentField = this.page.locator('.v-text-field--is-booted.v-file-input .v-text-field__slot');
        this.documentNameField = this.page.locator('.v-input.v-input--has-state .v-input__control .v-input__slot');
        this.expiringDateField = this.page.locator('.v-input--is-readonly.theme--light.v-text-field .v-text-field__slot').first();
        this.documentSubtypeField = this.page.locator('.v-select__slot', { hasText: 'Select document subtype' });
        this.documentTypeField = this.page.locator('.v-select__slot', { hasText: 'Select document type' });
        this.truckType = this.page.getByRole('option', { name: 'Truck', exact: true });
        this.trailerType = this.page.getByRole('option', { name: 'Trailer', exact: true });
        this.companyType = this.page.getByRole('option', { name: 'Company', exact: true });
        this.driverType = this.page.getByRole('option', { name: 'Driver', exact: true });
        this.savePermitButton = this.page.locator('.v-btn__content', { hasText: 'Save permit book' });
        this.okButtonInDatePicekr = this.page.getByRole('button', { name: 'OK', exact: true });
        this.eldDocumentsSubtype = this.page.getByRole('option', { name: 'ELD documents', exact: true });
        this.registrationSubtype = this.page.getByRole('option', { name: 'Registration', exact: true });
        this.othersSubtype = this.page.getByRole('option', { name: 'Others', exact: true });
        this.iftaSubtype = this.page.getByRole('option', { name: 'IFTA license', exact: true });
        this.currentDate = this.page.locator('.v-btn.v-date-picker-table__current');
        this.loader = this.page.locator('div[role="dialog"] .v-progress-linear__background.primary');
        this.xIconInFIelds = this.page.locator('.mdi.mdi-close');
        this.errorMessage = this.page.locator('.v-messages__message');
        this.documentReferrerMenu = this.page.locator('.v-input__slot');
        this.doc = this.page.locator('.v-select__slot .v-label.theme--light');
        this.truckNumberFromMenu = this.page.getByRole('option', { name: '11996', exact: true });
        this.secondTruckNumberFromMenu = this.page.getByRole('option', { name: '4721', exact: true });
        this.trailerNumberFromMenu = this.page.getByRole('option', { name: '118185', exact: true });
        this.compnyFromMenu = this.page.getByRole('option', { name: 'testcompany', exact: true });
        this.driverOption = this.page.getByRole('option', { name: 'AppTest (bosko@superegoholding.net)', exact: true });
        this.previousMonthButtonInDatePicker = this.page.locator('.mdi-chevron-left.theme--light');
    }

    async uploadDocument(): Promise<void> {
        await this.page.setInputFiles('input[type="file"]', path.resolve(__dirname, '../../helpers/sc/SCTest.png'));
    }

    async uploadDocumentOver10MB(): Promise<void> {
        await this.page.setInputFiles('input[type="file"]', path.resolve(__dirname, '../../helpers/sc/11mb.pdf'));
    }

    async selectSubtypeFromMenu(menu: Locator, option: Locator): Promise<void> {
        await menu.waitFor({ state: 'visible', timeout: 3000 });
        await menu.click();
        await option.click();
    }

    async selectDocumentType(menu: Locator, option: Locator): Promise<void> {
        await this.selectFromMenu(menu, option);
    }

    async enterTruckNumber(menu: Locator, truckNumber: string, option: Locator): Promise<void> {
        await this.fillAndSelectFromMenu(menu, truckNumber, option);
    }

    // Deterministic date pickers ported from TrailerInsertPermitBookPage — they derive the
    // target day from JS Date math and navigate the Vuetify date-picker by waiting for each
    // element (no page.waitForTimeout), which is what keeps them stable under parallel load.

    async selectPastExpiringDate(): Promise<string> {
        await this.expiringDateField.click();
        const dateText = await this.currentDate.textContent();
        const selectedDay = parseInt(dateText?.trim() || '0', 10);
        const now = new Date();
        const currentDate = new Date(now.getFullYear(), now.getMonth(), selectedDay);
        currentDate.setDate(currentDate.getDate() - 1);
        const pastDay = currentDate.getDate();
        if (pastDay > selectedDay) {
            await this.previousMonthButtonInDatePicker.click();
        }
        const pastDateButton = this.page.locator(
            `.v-picker.v-card.v-picker--date .v-btn__content:has-text("${pastDay}")`
        );
        await pastDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
        await pastDateButton.first().click();
        await this.okButtonInDatePicekr.click();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        return formattedDate;
    }

    async selectExpiringDateMoreThan30Days(): Promise<string> {
        await this.expiringDateField.click();
        const dateText = await this.currentDate.textContent();
        const selectedDay = parseInt(dateText?.trim() || '0', 10);
        const nextMonthButton = this.page.locator(
            '.v-date-picker-header .v-icon.notranslate.mdi.mdi-chevron-right'
        );
        await nextMonthButton.click();
        await nextMonthButton.click();
        const now = new Date();
        const daysInTargetMonth = new Date(now.getFullYear(), now.getMonth() + 3, 0).getDate();
        const safeDay = Math.min(selectedDay, daysInTargetMonth);
        const futureDate = new Date(now.getFullYear(), now.getMonth() + 2, safeDay);
        const futureDateDay = futureDate.getDate();
        const futureDateButton = this.page.locator(`.v-picker.v-card.v-picker--date .v-btn__content:has-text("${futureDateDay}")`);
        await futureDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
        await futureDateButton.first().click();
        await this.okButtonInDatePicekr.click();
        const formattedFutureDate = futureDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        return formattedFutureDate;
    }

    async selectExpiringDateLessThan30Days(): Promise<string> {
        await expect(this.expiringDateField).toBeVisible();
        await this.expiringDateField.click();

        const datePicker = this.page.locator('.v-picker.v-card.v-picker--date');
        await expect(datePicker).toBeVisible();

        const selectedDay = new Date().getDate();

        const nextMonthButton = this.page.locator(
            '.v-date-picker-header .v-icon.mdi-chevron-right'
        );
        await expect(nextMonthButton).toBeVisible();
        await nextMonthButton.click();

        await expect(this.page.locator('.v-date-picker-table')).toBeVisible();

        const now = new Date();
        const daysInNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate();
        const safeDay = Math.min(selectedDay, daysInNextMonth);
        const futureDate = new Date(now.getFullYear(), now.getMonth() + 1, safeDay);
        const dayToSelect = futureDate.getDate();

        const dayButton = this.page.locator(
            `.v-date-picker-table .v-btn:not(.v-btn--disabled) .v-btn__content:has-text("${dayToSelect}")`
        );
        await expect(dayButton.first()).toBeVisible();
        await dayButton.first().click();

        await expect(this.okButtonInDatePicekr).toBeVisible();
        await this.okButtonInDatePicekr.click();

        const formattedDate = futureDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        return formattedDate;
    }
}
