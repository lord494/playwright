import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddShopPage extends BasePage {
    readonly page: Page;
    readonly shopNameField: Locator;
    readonly franchiseMenu: Locator;
    readonly anyTruckFranchiseOption: Locator;
    readonly anyTrailerFranchiseOption: Locator;
    readonly goldCategory: Locator;
    readonly partnerCategory: Locator;
    readonly truckTypeCheckobx: Locator;
    readonly towingTypeCheckbox: Locator;
    readonly mobileShopTypeCheckbox: Locator;
    readonly nationalShopToggle: Locator;
    readonly addressField: Locator;
    readonly websiteField: Locator;
    readonly emailField: Locator;
    readonly phoneNumberField: Locator;
    readonly addShopButton: Locator;
    readonly activeDialogbox: Locator;
    readonly addressOption: Locator;
    readonly addNewShopCard: Locator;
    readonly yesButtonInDialog: Locator;
    readonly backIcon: Locator;
    readonly shopNamePart: Locator;
    readonly shopCategoryPart: Locator;
    readonly franchisePart: Locator;
    readonly addressPart: Locator;
    readonly phoneNumberPart: Locator;
    readonly shopTypePart: Locator;
    readonly websitePart: Locator;
    readonly emailPart: Locator;
    readonly editShopButton: Locator;
    readonly deleteShopButton: Locator;
    readonly deleteButtonInModal: Locator;
    readonly errorMessage: Locator;
    readonly mapIcon: Locator;
    readonly editShopButtonInModal: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.shopNameField = page.getByRole('textbox', { name: 'Shop Name' });
        this.franchiseMenu = page.getByRole('dialog').getByRole('button', { name: 'Franchise' });
        this.anyTruckFranchiseOption = page.getByRole('option', { name: 'Any truck' }).locator('div').first();
        this.anyTrailerFranchiseOption = page.getByRole('option', { name: 'Any trailer' }).locator('div').first();
        this.goldCategory = page.getByRole('dialog').getByText('Gold');
        this.partnerCategory = page.getByRole('dialog').getByText('Partner');
        this.truckTypeCheckobx = page.getByText('Truck', { exact: true });
        this.towingTypeCheckbox = page.getByText('Towing');
        this.mobileShopTypeCheckbox = page.getByText('Mobile Shop');
        this.nationalShopToggle = page.getByText('National Shop');
        //this.addressField = page.getByRole('textbox', { name: 'Address' });
        this.addressField = page.locator('[data-vv-name="address"]');
        this.websiteField = page.getByRole('textbox', { name: 'www.example.com' });
        this.emailField = page.getByRole('textbox', { name: 'example@gmail.com' });
        this.phoneNumberField = page.getByRole('textbox', { name: 'Shop Phone Number' });
        this.addShopButton = page.getByRole('button', { name: 'Add Shop' });
        this.activeDialogbox = page.locator('.v-dialog--active');
        this.addressOption = page.getByRole('option', { name: 'United States, CA, 90804, Long Beach, CA-1' });
        this.addNewShopCard = page.locator('.v-dialog--active .v-card.v-sheet');
        this.yesButtonInDialog = page.locator('.v-btn__content', { hasText: 'Yes' });
        this.backIcon = page.locator('.mdi-arrow-left');
        this.shopNamePart = page.locator('.shop-details-title');
        this.shopCategoryPart = page.locator('.row.pt-4 .v-chip__content');
        this.franchisePart = page.locator('.v-card__text.pl-1.pt-0').first();
        this.addressPart = page.locator('.v-card__text.pl-2.pt-0.pb-0').first();
        this.phoneNumberPart = page.locator('.v-card__text.pl-2.pt-0.pb-0').last();
        this.shopTypePart = page.locator('.pl-0.pt-4.pb-0.mr-3');
        this.websitePart = page.locator('.v-card__text.pl-4.pt-0.pb-3');
        this.emailPart = page.locator('.v-card__text.pl-4.pt-0.pb-0');
        this.editShopButton = page.locator('.v-btn__content', { hasText: 'Edit Shop' });
        this.deleteShopButton = page.locator('.v-btn__content', { hasText: 'Delete shop' });
        this.deleteButtonInModal = page.getByRole('button', { name: 'Delete', exact: true });
        this.errorMessage = page.locator('.v-messages__message');
        this.mapIcon = page.locator('.mdi-map-search');
        this.editShopButtonInModal = page.locator('.v-dialog--active .v-btn__content', { hasText: 'Edit Shop' });
    }

    async selectFranchise(menu: Locator, franchise: Locator): Promise<void> {
        return this.selectFromMenu(menu, franchise);
    }

    async enterShopName(field: Locator, shop: string): Promise<void> {
        return this.fillInputField(field, shop);
    }

    async check(checkbox: Locator): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            await checkbox.click();
        }
    }

    async selectAddress(menu: Locator, address: string, option: Locator): Promise<void> {
        return this.fillAndSelectFromMenu(menu, address, option);
    }

    async enterWebSite(field: Locator, shop: string): Promise<void> {
        return this.fillInputField(field, shop);
    }

    async enterEmail(field: Locator, shop: string): Promise<void> {
        return this.fillInputField(field, shop);
    }

    async enterPhoneNumber(field: Locator, shop: string): Promise<void> {
        return this.fillInputField(field, shop);
    }
}