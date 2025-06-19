import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import path from 'path';



export class InsertPermitBookPage extends BasePage {
    readonly page: Page;
    readonly insertDocumentField: Locator;
    readonly documentNameField: Locator;
    readonly expiringDateField: Locator;
    readonly documentSubtypeField: Locator;
    readonly documentTypeField: Locator;
    readonly truckType: Locator;
    readonly companyType: Locator;
    readonly trailerType: Locator;
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
    readonly trailerNumberFromMenu: Locator;
    readonly secondTrailerNumberFromMenu: Locator;
    readonly compnyFromMenu: Locator;
    readonly driverOption: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.insertDocumentField = page.locator('.v-text-field--is-booted.v-file-input .v-text-field__slot');
        this.documentNameField = page.locator('.v-input.v-input--has-state .v-input__control .v-input__slot');
        this.expiringDateField = page.locator('.v-input--is-readonly.theme--light.v-text-field .v-text-field__slot');
        this.documentSubtypeField = page.locator('.v-select__slot', { hasText: 'Select document subtype' });
        this.documentTypeField = page.locator('.v-select__slot', { hasText: 'Select document type' });
        this.truckType = page.getByRole('option', { name: 'Truck', exact: true });
        this.companyType = page.getByRole('option', { name: 'Company', exact: true });
        this.trailerType = page.getByRole('option', { name: 'Trailer', exact: true });
        this.driverType = page.getByRole('option', { name: 'Driver', exact: true });
        this.savePermitButton = page.locator('.v-btn__content', { hasText: 'Save permit book' });
        this.okButtonInDatePicekr = page.getByRole('button', { name: 'OK', exact: true });
        this.eldDocumentsSubtype = page.getByRole('option', { name: 'ELD documents', exact: true });
        this.registrationSubtype = page.getByRole('option', { name: 'Registration', exact: true });
        this.othersSubtype = page.getByRole('option', { name: 'Others', exact: true });
        this.iftaSubtype = page.getByRole('option', { name: 'IFTA license', exact: true });
        this.currentDate = page.locator('.v-btn.v-date-picker-table__current');
        this.loader = page.locator('div[role="dialog"] .v-progress-linear__background.primary');
        this.xIconInFIelds = page.locator('.mdi.mdi-close');
        this.errorMessage = page.locator('.v-messages__message');
        //this.documentReferrerMenu = page.locator('.v-input.v-select.v-select--is-menu-active .v-select__slot');
        this.documentReferrerMenu = page.locator('.v-input__slot');
        this.doc = page.locator('.v-select__slot .v-label.theme--light');
        this.truckNumberFromMenu = page.getByRole('option', { name: '11996', exact: true });
        this.trailerNumberFromMenu = page.getByRole('option', { name: '118185', exact: true });
        this.secondTrailerNumberFromMenu = page.getByRole('option', { name: '243648', exact: true });
        this.compnyFromMenu = page.getByRole('option', { name: 'testcompany', exact: true });
        this.driverOption = page.getByRole('option', { name: 'AppTest (bosko@superegoholding.net)', exact: true });
    }

    async uploadDocument(): Promise<void> {
        await this.page.setInputFiles('input[type="file"]', path.resolve(__dirname, '../../helpers/sc/SCTest.png'));
        await this.page.waitForLoadState('networkidle');
    }

    async uploadDocumentOver10MB(): Promise<void> {
        await this.page.setInputFiles('input[type="file"]', path.resolve(__dirname, '../../helpers/sc/11mb.pdf'));
        await this.page.waitForLoadState('networkidle');
    }

    async selectSubtypeFromMenu(menu: Locator, option: Locator): Promise<void> {
        await this.selectFromMenu(menu, option);
        await this.othersSubtype.waitFor({ state: 'hidden', timeout: 5000 });
    }

    async selectDocumentType(menu: Locator, option: Locator): Promise<void> {
        await menu.waitFor({ state: 'visible', timeout: 3000 });
        await menu.click();
        await this.page.waitForTimeout(1000);
        await option.click();
        await this.page.waitForTimeout(1000);
    }

    async enterTruckNumber(menu: Locator, truckNumber: string, option: Locator): Promise<void> {
        await this.fillAndSelectFromMenu(menu, truckNumber, option);
    }

    async enterSecondTruckNumber(menu: Locator, truckNumber: string, option: Locator): Promise<void> {
        await menu.waitFor();
        await menu.click();
        await menu.type(truckNumber, { delay: 30 });
        await this.page.waitForTimeout(1000);
        await option.click();
        await this.page.waitForTimeout(1000);
    }

    async selectPastExpiringDate(): Promise<string> {
        await this.expiringDateField.click();
        const dateText = await this.currentDate.textContent();
        const selectedDay = parseInt(dateText?.trim() || '0', 10);
        const pastDay = selectedDay > 1 ? selectedDay - 1 : 1;
        const pastDateButton = this.page.locator(`.v-picker.v-card.v-picker--date .v-btn__content:has-text("${pastDay}")`);
        await pastDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
        await pastDateButton.first().click();
        await this.okButtonInDatePicekr.click();
        const expectedDate = new Date();
        expectedDate.setDate(pastDay);
        const formattedDate = expectedDate.toLocaleDateString('en-US', {
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
        const nextMonthButton = this.page.locator('.v-date-picker-header .v-icon.notranslate.mdi.mdi-chevron-right');
        await nextMonthButton.click();
        await nextMonthButton.click();
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 2);
        futureDate.setDate(selectedDay);
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

    // async selectExpiringDateLessThan30Days(): Promise<string> {
    //     await this.expiringDateField.click();
    //     const dateText = await this.currentDate.textContent();
    //     const selectedDay = parseInt(dateText?.trim() || '0', 10);
    //     const nextMonthButton = this.page.locator('.v-date-picker-header .v-icon.notranslate.mdi.mdi-chevron-right');
    //     await nextMonthButton.click();
    //     const futureDate = new Date();
    //     const newDay = selectedDay + futureDate.getMonth() + 2;
    //     futureDate.setDate(selectedDay + newDay);
    //     const futureDateDay = futureDate.getDate();
    //     const futureDateButton = this.page.locator(`.v-picker.v-card.v-picker--date .v-btn__content:has-text("${futureDateDay}")`);
    //     await futureDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
    //     await futureDateButton.first().click();
    //     await this.okButtonInDatePicekr.click();
    //     const formattedDate = futureDate.toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //     });
    //     return formattedDate;
    // }

    async selectExpiringDateLessThan30Days(): Promise<string> {
        await this.page.waitForLoadState('networkidle');
        await this.expiringDateField.click();
        await this.page.waitForTimeout(1000);
        const dateText = await this.currentDate.textContent();
        const selectedDay = parseInt(dateText?.trim() || '0', 10);
        const nextMonthButton = this.page.locator('.v-date-picker-header .v-icon.notranslate.mdi.mdi-chevron-right');
        await nextMonthButton.click();
        await this.page.waitForTimeout(1000);
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 1);
        futureDate.setDate(selectedDay);
        const dayToSelect = futureDate.getDate();
        const futureDateButton = this.page.locator(`.v-picker.v-card.v-picker--date .v-btn__content:has-text("${dayToSelect}")`);
        await futureDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
        await futureDateButton.first().click();
        await this.page.waitForTimeout(1000);
        await this.okButtonInDatePicekr.click();
        const formattedDate = futureDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        return formattedDate;
    }

}
