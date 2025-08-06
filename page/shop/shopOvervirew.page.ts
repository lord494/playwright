import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class ShopPage extends BasePage {
    readonly page: Page;
    readonly franchiseMenu: Locator;
    readonly postalCodeField: Locator;
    readonly cityMenu: Locator;
    readonly radiusField: Locator;
    readonly typeMenu: Locator;
    readonly allCheckbox: Locator;
    readonly goldCheckBox: Locator;
    readonly platinumCheckbox: Locator;
    readonly silverCheckbox: Locator;
    readonly secondAllCheckbox: Locator;
    readonly blackListCheckbox: Locator;
    readonly addNewShopButton: Locator;
    readonly xButton: Locator;
    readonly truckFranchise: Locator;
    readonly trailerFranchise: Locator;
    readonly parkingFranchise: Locator;
    readonly truckType: Locator;
    readonly mobileShopType: Locator;
    readonly towingType: Locator;
    readonly securedParkingType: Locator;
    readonly shopCardFranchisePart: Locator;
    readonly shopCardLocationPart: Locator;
    readonly miamiOption: Locator;
    readonly newYorkOption: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.franchiseMenu = page.getByRole('textbox', { name: 'Franchise' });
        this.postalCodeField = page.locator('.v-input__slot .v-text-field__slot').first();
        this.cityMenu = page.getByRole('textbox', { name: 'City' });
        this.radiusField = page.getByRole('spinbutton', { name: 'Radius 80mi' });
        this.typeMenu = page.getByRole('textbox', { name: 'Type' });
        this.allCheckbox = page.getByText('All').first();
        this.goldCheckBox = page.getByText('Gold');
        this.platinumCheckbox = page.getByText('Platinum', { exact: true });
        this.silverCheckbox = page.getByText('Silver');
        this.secondAllCheckbox = page.getByText('All').last();
        this.blackListCheckbox = page.getByText('Blacklisted');
        this.addNewShopButton = page.getByRole('button', { name: 'Add new shop' });
        this.xButton = page.locator('.v-btn__content .mdi-close');
        this.truckFranchise = page.getByRole('option', { name: 'Any truck', exact: true });
        this.trailerFranchise = page.getByRole('option', { name: 'Any trailer', exact: true });
        this.parkingFranchise = page.getByRole('option', { name: 'Parking', exact: true });
        this.truckType = page.getByRole('option', { name: 'Truck' }).filter({ has: page.locator('.v-list-item__action') });
        this.mobileShopType = page.getByRole('option', { name: 'Mobile Shop' }).filter({ has: page.locator('.v-list-item__action') });
        this.towingType = page.getByRole('option', { name: 'Towing' }).filter({ has: page.locator('.v-list-item__action') });
        this.securedParkingType = page.getByRole('option', { name: 'Secured Parking' }).filter({ has: page.locator('.v-list-item__action') });
        this.shopCardFranchisePart = page.locator('.font-weight-medium.text-body-1.text-truncate');
        this.shopCardLocationPart = page.locator('.v-card__text.pl-4.pr-4.pt-0.pb-0.font-weight-medium.text-truncate');
        this.miamiOption = page.getByRole('option', { name: 'Miami, FL', exact: true });
        this.newYorkOption = page.getByRole('option', { name: 'New York, NY', exact: true });
    }

    async check(checkbox: Locator): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            await checkbox.click();
        }
    }

    async uncheck(checkbox: Locator): Promise<void> {
        if (await checkbox.isChecked()) {
            await checkbox.click();
        }
    }

    async selectFranchise(menu: Locator, franchise: Locator): Promise<void> {
        return this.selectFranchiseFromMenu(menu, franchise);
    }

    async enterPostalCode(field: Locator, postalCode: string): Promise<void> {
        return this.fillInputField(field, postalCode);
    }

    async selectCity(menu: Locator, city: string, cityOption: Locator): Promise<void> {
        return this.fillAndSelectFromMenu(menu, city, cityOption);
    }

    async enterRadius(field: Locator, radius: string): Promise<void> {
        return this.fillInputField(field, radius);
    }

    async selectType(menu: Locator, type: Locator): Promise<void> {
        return this.selectFromMenu(menu, type);
    }
}