import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class ShopPage extends BasePage {
    readonly page: Page;
    readonly franchiseMenu: Locator;
    readonly postalCodeField: Locator;
    readonly cityMenu: Locator;
    readonly radiusField: Locator;
    readonly typeMenu: Locator;
    readonly allCheckbox: Locator;
    readonly partnerCheckbox: Locator;
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
    readonly mobileShopIcon: Locator;
    readonly truckIcon: Locator;
    readonly towingIcon: Locator;
    readonly securedParkingIcon: Locator;
    readonly franchisePlaceholder: Locator;
    readonly postalCodePlaceholder: Locator;
    readonly cityPlaceholder: Locator;
    readonly typePlaceholder: Locator;
    readonly shopBadge: Locator;
    readonly snackMessage: Locator;
    readonly leftArrowIcon: Locator;
    readonly card: Locator;
    readonly loader: Locator;
    readonly cards: Locator;
    readonly noShopMessage: Locator;
    readonly selectSelections: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.franchiseMenu = page.getByRole('textbox', { name: 'Franchise' });
        this.postalCodeField = page.locator('.v-input__slot .v-text-field__slot').first();
        this.cityMenu = page.getByRole('textbox', { name: 'City' });
        this.radiusField = page.getByRole('spinbutton', { name: 'Radius 80mi' });
        this.typeMenu = page.getByRole('textbox', { name: 'Type' });
        this.allCheckbox = page.getByText('All').first();
        this.partnerCheckbox = page.getByText('Partner', { exact: true });
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
        this.truckType = page.getByRole('option', { name: 'Truck', exact: true })
        this.mobileShopType = page.getByRole('option', { name: 'Mobile Shop' }).filter({ has: page.locator('.v-list-item__action') });
        this.towingType = page.getByRole('option', { name: 'Towing' }).filter({ has: page.locator('.v-list-item__action') });
        this.securedParkingType = page.getByRole('option', { name: 'Secured Parking' }).filter({ has: page.locator('.v-list-item__action') });
        this.shopCardFranchisePart = page.locator('.font-weight-medium.text-body-1.text-truncate');
        this.shopCardLocationPart = page.locator('.v-card__text.pl-4.pr-4.pt-0.pb-0.font-weight-medium.text-truncate');
        this.miamiOption = page.getByRole('option', { name: 'Miami, FL', exact: true });
        this.newYorkOption = page.getByRole('option', { name: 'New York, NY', exact: true });
        this.mobileShopIcon = page.locator('.mdi-account-wrench');
        this.truckIcon = page.locator('.mdi-truck');
        this.towingIcon = page.locator('.mdi-tow-truck');
        this.securedParkingIcon = page.locator('.mdi-parking');
        this.franchisePlaceholder = page.getByRole('textbox', { name: 'Franchise' });
        this.postalCodePlaceholder = page.getByRole('textbox', { name: 'Postal Code' });
        this.cityPlaceholder = page.getByRole('textbox', { name: 'City' });
        this.typePlaceholder = page.getByRole('textbox', { name: 'Type' });
        this.shopBadge = page.locator('.v-chip__content');
        this.snackMessage = page.locator('.v-snack__content');
        this.leftArrowIcon = page.locator('.mdi-arrow-left');
        this.card = page.locator('.shop-card-data');
        this.loader = page.locator('.v-progress-linear__buffer');
        this.cards = page.locator('.shop-card-data');
        this.noShopMessage = page.getByText('No shops match the applied filters.');
        this.selectSelections = page.locator('.v-select__selection');
    }

    async waitForShopLoads(action: () => Promise<void>) {
        await Promise.all([
            this.page.waitForResponse(
                response =>
                    response.url().includes('/ms-shop/shop') &&
                    (response.status() === 200 || response.status() === 304),
                { timeout: 20_000 }
            ),
            action()
        ]);
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

    async selectFranchise(franchise: Locator): Promise<void> {
        await this.franchiseMenu.waitFor({ state: 'visible', timeout: 15000 });
        await this.waitForShopLoads(async () => {
            await this.selectFromMenu(this.franchiseMenu, franchise);
        });
    }

    async enterPostalCode(postalCode: string): Promise<void> {
        await this.waitForShopLoads(async () => {
            await this.fillInputField(this.postalCodeField, postalCode);
        });
    }

    async selectCity(city: string, cityOption: Locator): Promise<void> {
        await this.cityMenu.waitFor({ state: 'visible', timeout: 15000 });
        await this.waitForShopLoads(async () => {
            await this.cityMenu.click();
            await this.cityMenu.type(city, { delay: 30 });
            await cityOption.waitFor({ state: 'visible', timeout: 10000 });
            await cityOption.click();
        });
    }

    async enterRadius(field: Locator, radius: string): Promise<void> {
        return this.fillInputField(field, radius);
    }

    async selectType(menu: Locator, type: Locator): Promise<void> {
        return this.selectFromMenu(menu, type);
    }
    async expectEveryFranchiseCardToContain(expectedText: string): Promise<void> {
        await expect.poll(async () => {
            const texts = await this.shopCardFranchisePart.allTextContents();
            return texts.length > 0 && texts.every(t => t.includes(expectedText));
        }, {
            timeout: 20000,
            intervals: [200, 400, 800, 1200],
            message: `Expected every shop card franchise to contain "${expectedText}"`,
        }).toBeTruthy();
    }

    async expectEveryLocationCardToContain(expectedText: string): Promise<void> {
        await expect.poll(async () => {
            const texts = await this.shopCardLocationPart.allTextContents();
            return texts.length > 0 && texts.every(t => t.includes(expectedText));
        }, {
            timeout: 20000,
            intervals: [200, 400, 800, 1200],
            message: `Expected every shop card location to contain "${expectedText}"`,
        }).toBeTruthy();
    }

    async resetFilters(): Promise<void> {
        await this.page.keyboard.press('Escape');
        await this.xButton.click();
        await expect(this.selectSelections).toHaveCount(0, { timeout: 10000 });
    }

    async expectFiltersCleared(): Promise<void> {
        await expect(this.selectSelections).toHaveCount(0);
        await expect(this.postalCodePlaceholder).toHaveValue('');
        await expect(this.cityPlaceholder).toHaveValue('');
        await expect(this.typePlaceholder).toHaveValue('');
    }
}