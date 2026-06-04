import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import { Constants } from "../../helpers/constants";

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
        this.addTruckIcon = this.page.locator('.mdi-plus');
        this.selectATruckMenu = this.page.getByRole('textbox', { name: 'Select a truck' });
        this.aditionalInfoField = this.page.getByRole('textbox', { name: 'Aditional info' });
        this.divisonMenu = this.page.getByRole('textbox', { name: 'Select division' });
        this.mileageField = this.page.getByRole('textbox', { name: 'Mileage' });
        this.infoField = this.page.getByRole('textbox', { name: 'Info', exact: true });
        this.statusMenu = this.page.getByRole('textbox', { name: 'Status' });
        this.submitButton = this.page.getByRole('button', { name: 'Submit' });
        // Non-exact substring match on the truck's number+make+model+year so a trailing note
        // suffix in the option text doesn't break it. Number is unique, so this resolves to one.
        this.truckOption = this.page.getByRole('option', { name: Constants.availableTruckOptionText });
        this.testCompanyOption = this.page.getByRole('option', { name: 'testcompany', exact: true });
        this.statusColumn = this.page.locator('.status-column');
        this.deleteIconInStatusMenu = this.page.getByText('Delete', { exact: true });
        this.addTruckModal = this.page.locator('.v-dialog--active');
        this.divisionColumn = this.page.locator('.division-column');
        this.mileageColumn = this.page.locator('tr td:nth-child(4)');
        this.availableInfoColumn = this.page.locator('tr td:nth-child(6)');
        this.editTruckIconInStatusMenu = this.page.getByText('Edit truck', { exact: true });
        this.outOfCompanyStatus = this.page.getByRole('option', { name: 'Out of company', exact: true });
        this.transferIconInStatusMenu = this.page.getByText('Transfer', { exact: true });
        this.transferMenu = this.page.locator('.v-input.v-input--hide-details');
        this.transferOption = this.page.locator('.transfer-item');
        this.transferButton = this.page.locator('.v-btn__content').filter({ hasText: 'Transfer' });
        this.yardCard = this.page.locator('.v-data-table.v-data-table--dense');
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

    // Transfers the currently-selected truck to a SPECIFIC destination yard (by its option
    // text in the transfer dropdown), instead of the old fragile positional .nth(2).
    async transferTruck(yardOptionText: string) {
        await this.transferMenu.click();
        await this.transferOption.filter({ hasText: yardOptionText }).first().click();
        await this.transferButton.click();
    }

    // The yard card (header + truck table) for a given yard name. Used to assert a truck
    // landed in a specific yard after a transfer.
    yardCardByName(yardName: string): Locator {
        return this.page.locator('.v-card.v-sheet', { hasText: yardName });
    }

    // Robustly removes a truck (identified by its exact status-column text) from
    // /available-trucks, wherever it currently sits. Yard cards lazy-render, so it scrolls the
    // page to load them all before scanning, then deletes the row via the right-click menu.
    // Best-effort: returns silently if the truck is not currently available.
    // The caller must register a page `dialog` handler (the delete raises a native confirm).
    async removeFromAvailable(targetText: string): Promise<void> {
        for (let i = 0; i < 8; i++) {
            await this.page.mouse.wheel(0, 3000);
            await this.page.waitForTimeout(200);
        }
        const cols = this.statusColumn;
        const count = await cols.count();
        for (let i = 0; i < count; i++) {
            const text = (await cols.nth(i).innerText()).replace(/\s+/g, ' ').trim();
            if (text.includes(targetText)) {
                await cols.nth(i).scrollIntoViewIfNeeded();
                await cols.nth(i).click({ button: 'right' });
                await this.deleteIconInStatusMenu.waitFor({ state: 'visible', timeout: 5000 });
                await this.deleteIconInStatusMenu.click();
                await this.page.waitForTimeout(1000);
                return;
            }
        }
    }
}
