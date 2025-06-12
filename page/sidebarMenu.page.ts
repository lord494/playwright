import { Locator, Page } from "@playwright/test";
import { BasePage } from "../helpers/base";

export class SideBarMenu extends BasePage {
    readonly page: Page;
    readonly dispatchDashboardButton;
    readonly eldDashboardButton;
    readonly userManagementMenu;
    readonly usersOption;
    readonly rolesOption;
    readonly manageAppUsersOption;
    readonly contentMenu;
    readonly boardsOption;
    readonly companiesOption;
    readonly loadTypesOption;
    readonly manageFMOption;
    readonly eldMenu;
    readonly shiftsOption;
    readonly dotInspectionsOption;
    readonly callTypesOption;
    readonly trailerMenu;
    readonly trailersOption;
    readonly availableTrailersOption;
    readonly atHistoryOption;
    readonly inactiveDriversOption;
    readonly trailerMakesOption;
    readonly trailerTypesOption;
    readonly truckMenu;
    readonly trucksOption;
    readonly availableTruckOption;
    readonly truckMake;
    readonly truckModel;
    readonly truckStatistics;
    readonly preBookMenu;
    readonly companiesOptionFromPreBook;
    readonly postLoadsOption;
    readonly postTrucksOption;
    readonly postedTruckOption;
    readonly leasingMenu;
    readonly leasingCompaniesOption;
    readonly leasingUnitsOptionl;
    readonly driversButton;
    readonly inactiveDriversButton;
    readonly fmBoardMenu;
    readonly bgBoard;
    readonly contactsButton;
    readonly messagesButton;
    readonly thirdPartyButton;
    readonly ownersButton;
    readonly dealershipsButton;
    readonly yardsButton;
    readonly recruitmentButton;
    readonly shopButton;
    readonly permitBooksButton;
    readonly driverDocumentsButton;
    readonly accountingMenu;
    readonly banksOption;
    readonly dealersOption;
    readonly unitsFinancedOption;
    readonly unitsPaidWithCashOption;
    readonly leaseOption;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.dispatchDashboardButton = page.getByRole('navigation').getByRole('link', { name: 'Dispatch Dashboard' });
        this.eldDashboardButton = page.getByRole('navigation').getByRole('link', { name: 'ELD Dashboard' });
        this.userManagementMenu = page.getByRole('button', { name: 'User management' });
        this.usersOption = page.getByRole('navigation').getByRole('link', { name: 'Users', exact: true });
        this.rolesOption = page.getByRole('navigation').getByRole('link', { name: 'Roles' });
        this.manageAppUsersOption = page.getByRole('navigation').getByRole('link', { name: 'Manage app users' });
        this.contentMenu = page.getByRole('button', { name: 'Content' });
        this.boardsOption = page.getByRole('navigation').getByRole('link', { name: 'Boards' });
        this.companiesOption = page.getByRole('navigation').getByRole('link', { name: 'Companies', exact: true });
        this.loadTypesOption = page.getByRole('navigation').getByRole('link', { name: 'Load Types' });
        this.manageFMOption = page.getByRole('navigation').getByRole('link', { name: 'Manage FM' });
        this.eldMenu = page.getByRole('button', { name: 'ELD' });
        this.shiftsOption = page.getByRole('navigation').getByRole('link', { name: 'Shifts' });
        this.dotInspectionsOption = page.getByRole('navigation').getByRole('link', { name: 'DOT inspections' });
        this.callTypesOption = page.getByRole('navigation').getByRole('link', { name: 'Call types' });
        this.trailerMenu = page.getByRole('button', { name: 'Trailer' });
        this.trailersOption = page.getByRole('navigation').getByRole('link', { name: 'Trailers', exact: true });
        this.availableTrailersOption = page.getByRole('navigation').getByRole('link', { name: 'Available Trailers' });
        this.atHistoryOption = page.getByRole('navigation').getByRole('link', { name: 'AT History' });
        this.inactiveDriversOption = page.getByRole('navigation').getByRole('link', { name: 'Inactive Drivers' }).first();
        this.trailerMakesOption = page.getByRole('navigation').getByRole('link', { name: 'Trailer Makes' });
        this.trailerTypesOption = page.getByRole('navigation').getByRole('link', { name: 'Trailer Types' });
        this.truckMenu = page.getByRole('button', { name: 'Trucks' });
        this.trucksOption = page.getByRole('navigation').getByRole('link', { name: 'Trucks', exact: true });
        this.availableTruckOption = page.getByRole('navigation').getByRole('link', { name: 'Available Trucks', exact: true });
        this.truckMake = page.getByRole('navigation').getByRole('link', { name: 'Truck Make' });
        this.truckModel = page.getByRole('navigation').getByRole('link', { name: 'Truck Model' });
        this.truckStatistics = page.getByRole('navigation').getByRole('link', { name: 'Trucks Statistics' });
        this.preBookMenu = page.getByRole('button', { name: 'Pre Book' });
        this.companiesOptionFromPreBook = page.getByRole('navigation').getByRole('link', { name: 'Companies', exact: true });
        this.postLoadsOption = page.getByRole('navigation').getByRole('link', { name: 'Post loads' });
        this.postTrucksOption = page.getByRole('navigation').getByRole('link', { name: 'Post trucks' });
        this.postedTruckOption = page.getByRole('navigation').getByRole('link', { name: 'Posted trucks' });
        this.leasingMenu = page.getByRole('button', { name: 'Leasing' });
        this.leasingCompaniesOption = page.getByRole('navigation').getByRole('link', { name: 'Leasing Companies' });
        this.leasingUnitsOptionl = page.getByRole('navigation').getByRole('link', { name: 'Leasing Units' });
        this.driversButton = page.getByRole('navigation').getByRole('link', { name: 'Drivers', exact: true });
        this.inactiveDriversButton = page.getByRole('navigation').getByRole('link', { name: 'Inactive Drivers' });
        this.fmBoardMenu = page.getByRole('button', { name: 'FM board' });
        this.bgBoard = page.getByRole('navigation').getByRole('link', { name: 'BG', exact: true });
        this.contactsButton = page.getByRole('navigation').getByRole('link', { name: 'Contacts' });
        this.messagesButton = page.getByRole('navigation').getByRole('link', { name: 'Messages' });
        this.thirdPartyButton = page.getByRole('navigation').getByRole('link', { name: 'Third party' });
        this.ownersButton = page.getByRole('navigation').getByRole('link', { name: 'Owners' });
        this.dealershipsButton = page.getByRole('navigation').getByRole('link', { name: 'Dealerships' });
        this.yardsButton = page.getByRole('navigation').getByRole('link', { name: 'Yards' });
        this.recruitmentButton = page.getByRole('navigation').getByRole('link', { name: 'Recruitment' });
        this.shopButton = page.getByRole('navigation').getByRole('link', { name: 'Shop' });
        this.permitBooksButton = page.getByRole('navigation').getByRole('link', { name: 'Permit books' });
        this.driverDocumentsButton = page.getByRole('navigation').getByRole('link', { name: 'Driver documents' });
        this.accountingMenu = page.getByRole('button', { name: 'Accounting' });
        this.banksOption = page.getByRole('navigation').getByRole('link', { name: 'Banks' });
        this.dealersOption = page.getByRole('navigation').getByRole('link', { name: 'Dealers', exact: true });
        this.unitsFinancedOption = page.getByRole('navigation').getByRole('link', { name: 'Units (financed)' });
        this.unitsPaidWithCashOption = page.getByRole('navigation').getByRole('link', { name: 'Units (paid with cash)' });
        this.leaseOption = page.getByRole('navigation').getByRole('link', { name: 'Lease' });
    }

    async click(card: Locator) {
        await this.clickElement(card);
    }


    async selectFromMenu(mainLocator: Locator, subLocator?: Locator) {
        await mainLocator.waitFor({ state: 'visible', timeout: 3000 });
        await mainLocator.click();
        await subLocator?.waitFor({ state: 'visible', timeout: 3000 });
        await subLocator?.click();
    }
}