import { Locator, Page } from "@playwright/test";
import { BasePage } from "../helpers/base";

export class HeaderPage extends BasePage {
    readonly page: Page;
    readonly hamburgerMenu: Locator;
    readonly superEgoLabel: Locator;
    readonly boardsTab: Locator;
    readonly dailyTab: Locator;
    readonly weeklyTab: Locator;
    readonly contactsTab: Locator;
    readonly shiftTab: Locator;
    readonly safetyButton: Locator;
    readonly eldFromSafety: Locator;
    readonly BOBTAILINSURANCE: Locator;
    readonly cargoClaimsFromSafety: Locator;
    readonly newDriversFromSafety: Locator;
    readonly truckIcon: Locator;
    readonly trailerIcon: Locator;
    readonly infoIcon: Locator;
    readonly alertIcon: Locator;
    readonly emailIcon: Locator;
    readonly connectionStatus: Locator;
    readonly rightArrowInHeader: Locator;
    readonly dispatchInfo: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.hamburgerMenu = page.locator(".v-toolbar__title .v-btn");
        this.superEgoLabel = page.getByText('Super Ego Holding');
        this.boardsTab = page.locator('.tabs-holder .v-tab');
        this.dailyTab = page.locator('.tabs-holder .v-tab', { hasText: 'Daily' });
        this.weeklyTab = page.locator('.tabs-holder .v-tab', { hasText: 'Weekly' });
        this.contactsTab = page.locator('.tabs-holder .v-tab', { hasText: 'Contacts' });
        this.shiftTab = page.locator('.v-btn.v-btn--text.v-size--small');
        this.safetyButton = page.locator('.v-btn.v-btn--text.v-size--small', { hasText: 'SAFETY' });
        this.eldFromSafety = page.getByRole('menuitem', { name: 'ELD' });
        this.BOBTAILINSURANCE = page.locator('[href="/claims/BOBTAIL_INSURANCE"]');
        this.cargoClaimsFromSafety = page.getByRole('menuitem', { name: 'CARGO CLAIMS' });
        this.newDriversFromSafety = page.getByRole('menuitem', { name: 'NEW DRIVERS' });
        this.truckIcon = page.locator('.v-icon.mdi-truck.theme--dark');
        this.trailerIcon = page.locator('.v-icon.mdi-truck-trailer.theme--dark');
        this.infoIcon = page.locator('.v-icon.mdi-information-outline');
        this.alertIcon = page.locator('.v-icon.mdi-alert-outline');
        this.emailIcon = page.locator('.v-icon.mdi-email');
        this.connectionStatus = page.locator('.socket-connection.connected');
        this.rightArrowInHeader = page.locator('.tabs-holder.dispatch-info-holder .mdi-chevron-right');
        this.dispatchInfo = page.locator('.tabs-holder .v-tab', { hasText: 'Dispatch Info' });
    }


    async click(card: Locator) {
        await this.clickElement(card);
    }

    async hoverAndClick(mainLocator: Locator, subLocator?: Locator) {
        await mainLocator.waitFor({ state: 'visible', timeout: 3000 });
        await mainLocator.hover();
        await subLocator?.waitFor({ state: 'visible', timeout: 3000 });
        await subLocator?.click();
    }
}