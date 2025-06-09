import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AvailableTruckPage extends BasePage {
    readonly page: Page;
    readonly addTruckIcon: Locator;
    readonly selectATruckMenu: Locator;
    readonly aditionalInfoField: Locator;
    readonly divisonMenu: Locator;
    readonly mileageField: Locator;
    readonly infoField: Locator;
    readonly statusMenu: Locator;
    readonly submitButton: Locator;
    readonly truckOption: Locator;
    readonly testCompanyOption: Locator;
    readonly statusColumn: Locator;
    readonly deleteIconInStatusMenu: Locator;
    readonly addTruckModal: Locator;
    readonly divisionColumn: Locator;
    readonly mileageColumn: Locator;
    readonly availableInfoColumn: Locator;
    readonly editTruckIconInStatusMenu: Locator;
    readonly outOfCompanyStatus: Locator;
    readonly transferIconInStatusMenu: Locator;
    readonly transferMenu: Locator;
    readonly transferOption: Locator;
    readonly transferButton: Locator;
    readonly yardCard: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addTruckIcon = page.locator('.mdi-plus');
        this.selectATruckMenu = page.getByRole('textbox', { name: 'Select a truck' });
        this.aditionalInfoField = page.getByRole('textbox', { name: 'Aditional info' });
        this.divisonMenu = page.getByRole('textbox', { name: 'Select division' });
        this.mileageField = page.getByRole('textbox', { name: 'Mileage' });
        this.infoField = page.getByRole('textbox', { name: 'Info', exact: true });
        this.statusMenu = page.getByRole('textbox', { name: 'Status' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.truckOption = page.getByRole('option', { name: '11996 - FREIGHTLINER / CASCADIA / 2025', exact: true });
        this.testCompanyOption = page.getByRole('option', { name: 'testcompany', exact: true });
        this.statusColumn = page.locator('.status-column');
        this.deleteIconInStatusMenu = page.getByText('Delete', { exact: true });
        this.addTruckModal = page.locator('.v-dialog--active');
        this.divisionColumn = page.locator('.division-column');
        this.mileageColumn = page.locator('tr td:nth-child(4)');
        this.availableInfoColumn = page.locator('tr td:nth-child(6)');
        this.editTruckIconInStatusMenu = page.getByText('Edit truck', { exact: true });
        this.outOfCompanyStatus = page.getByRole('option', { name: 'Out of company', exact: true });
        this.transferIconInStatusMenu = page.getByText('Transfer', { exact: true });
        this.transferMenu = page.locator('.v-input.v-input--hide-details');
        this.transferOption = page.locator('.transfer-item');
        this.transferButton = page.locator('.v-btn__content').filter({ hasText: 'Transfer' });
        this.yardCard = page.locator('.v-data-table.v-data-table--dense');
    }

    async selectCompanyFromMenu(companyMenu: Locator, optionFromMenu: Locator) {
        await this.selectFromMenu(companyMenu, optionFromMenu);
    }

    async enterAdditionalInfo(aditionalInfoField: Locator, info: string) {
        await this.fillInputField(aditionalInfoField, info);
    }

    async selectTruck(truckMenu: Locator, truck: string, option: Locator) {
        await this.fillAndSelectFromMenu(truckMenu, truck, option);
    }

    async enterInfo(infoField: Locator, info: string) {
        await this.fillInputField(infoField, info);
    }

    async selectStatus(statusField: Locator, status: Locator) {
        await this.selectFromMenu(statusField, status);
    }

    async enterMileage(mileageField: Locator, mileage: string) {
        await mileageField.clear();
        await this.fillInputField(mileageField, mileage);
    }

    async transferTruck() {
        await this.transferMenu.click();
        await this.transferOption.nth(2).click();
        await this.transferButton.click();
    }
}
