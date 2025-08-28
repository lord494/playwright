import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class MenageFM extends BasePage {
    readonly page: Page;
    readonly searchFMorTruckNumberField: Locator;
    readonly searchButton: Locator;
    readonly showInactiveRadiobutton: Locator;
    readonly searchDrivers: Locator;
    readonly driverNumberAndDriver: Locator;
    readonly fmNameTitle: Locator;
    readonly driverNumberAndDriversWithoutFM: Locator;
    readonly card: Locator;
    readonly message: Locator;
    readonly inactiveDrivers: Locator;
    readonly counter: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.searchFMorTruckNumberField = page.locator('.d-flex.align-center .v-input__control input');
        this.searchButton = page.locator('.v-btn__content', { hasText: 'Search' });
        this.showInactiveRadiobutton = page.locator('.v-label.theme--light', { hasText: 'Show inactive' });
        this.searchDrivers = page.locator('.v-input__control .v-input__slot').last();
        this.driverNumberAndDriver = page.locator('.drivers .v-chip__content');
        this.fmNameTitle = page.locator('.overline.fm-name');
        this.driverNumberAndDriversWithoutFM = page.locator('.drivers-no-fm .v-chip__content');
        this.card = page.locator('.v-card.v-sheet.v-sheet--outlined');
        this.message = page.locator('.my-0.title');
        this.inactiveDrivers = page.locator('.v-chip--label.v-chip--removable.theme--light.v-size--small.warning');
        this.counter = page.locator('.v-avatar.teal');
    }

    async getDriverNumber(): Promise<string> {
        const text = await this.driverNumberAndDriver.first().textContent();
        const match = text?.match(/\d+/);
        return match ? match[0] : "defaultDriverNumber";  // Uvek vraća string
    }

    async getTruckNumberWithoutFM(): Promise<string> {
        const text = await this.driverNumberAndDriversWithoutFM.first().textContent();
        const match = text?.match(/\d+/);
        return match ? match[0] : "defaultDriverNumber";
    }

    async getDriverNameWithoytFM(): Promise<string> {
        const text = await this.driverNumberAndDriversWithoutFM.first().textContent();
        const match = text?.match(/- (.+)/);
        return match ? match[1].trim() : "defaultDriverNumber";
    }

    async searchTruckNumberAndFM(searchField: Locator, driverName: string): Promise<void> {
        await this.fillInputField(searchField, driverName);
    }

    async check(toggleButton: Locator): Promise<void> {
        const isChecked = await toggleButton.isChecked();
        if (!isChecked) {
            await toggleButton.click();
        }
    }

    async dragAndDrop(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.driverNumberAndDriversWithoutFM.dragTo(this.card.first());
    }
}
