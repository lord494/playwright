import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";


export class AddTrailersPage extends BasePage {
    readonly page: Page;
    readonly trailerNumber: Locator;
    readonly trailertype: Locator;
    readonly trailerYear: Locator;
    readonly trailerMake: Locator;
    readonly pickUpDate: Locator;
    readonly dealership: Locator;
    readonly vinNumber: Locator;
    readonly saveButton: Locator;
    readonly dryVanType: Locator;
    readonly year2002: Locator;
    readonly currentDate: Locator;
    readonly kemonipexDealreship: Locator;
    readonly trailerMakeOption: Locator;
    readonly dialogBox: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.trailerNumber = page.locator('input[name="number"]');
        this.trailertype = page.getByLabel('Type', { exact: true });
        this.trailerYear = page.getByLabel('Year*', { exact: true });
        this.trailerMake = page.getByLabel('Make', { exact: true });
        this.pickUpDate = page.getByLabel('Pick Up Date', { exact: true });
        this.dealership = page.locator('.v-dialog.v-dialog--active').getByLabel('Dealership', { exact: true });
        this.vinNumber = page.locator('input[name="vin_number"]');
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
        this.dryVanType = page.getByRole('option', { name: 'Dry van', exact: true });
        this.year2002 = page.getByRole('option', { name: '2002', exact: true });
        this.currentDate = page.locator('.v-btn.v-date-picker-table__current');
        this.kemonipexDealreship = page.getByRole('option', { name: 'KEMOINPEX', exact: true });
        this.trailerMakeOption = page.getByRole('option', { name: 'HYUNDAI', exact: true });
        this.dialogBox = page.locator('.v-dialog.v-dialog--active');
        this.errorMessage = page.locator('.v-messages__message')
    }

    async fillTrailerNumber(field: Locator, trailerNumber: string) {
        await this.fillInputField(field, trailerNumber);
    }

    async selectTrailerType(trailerTypeMenu: Locator, type: Locator) {
        await this.selectFromMenu(trailerTypeMenu, type);
    }

    async selectTrailerYear(yearField: Locator, year: Locator) {
        await this.selectFromMenu(yearField, year);
    }

    async selectTrailerMake(makeField: Locator, make: Locator) {
        await this.selectFromMenu(makeField, make);
    }

    async selectPickUpDate(pickUpDateField: Locator, date: Locator) {
        await this.selectFromMenu(pickUpDateField, date);
    }

    async selectDealerhip(dealershipField: Locator, delareship: Locator) {
        await this.selectFromMenu(dealershipField, delareship);
    }

    async fillVinNumber(vinNumberField: Locator, vinNumber: string) {
        await this.fillInputField(vinNumberField, vinNumber);
    }
}
