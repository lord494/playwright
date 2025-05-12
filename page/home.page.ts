import { Locator, Page } from "@playwright/test";
import { BasePage } from "../helpers/base";

export class HomePage extends BasePage {
    readonly page: Page;
    readonly dispatchDashboardCard: Locator;
    readonly eldDashboardCard: Locator;
    readonly userManagementCard: Locator;
    readonly usersOption: Locator;
    readonly rolesOption: Locator;
    readonly manageAppUsers: Locator;
    readonly contentCard: Locator;
    readonly boardsOption: Locator;
    readonly companyOption: Locator;
    readonly loadTypesOption: Locator;
    readonly manageFMOption: Locator;
    readonly eldCard: Locator;
    readonly shiftsOption: Locator;
    readonly dotInspections: Locator;
    readonly callTypes: Locator;
    readonly trailerCard: Locator;
    readonly trailersOption: Locator;
    readonly availableTrailers: Locator;
    readonly aTHistoruOption: Locator;
    readonly inactiveDrivers: Locator;
    readonly trailerMakes: Locator;
    readonly trailerTypes: Locator;
    readonly trucksCard: Locator;
    readonly trucksOption: Locator;
    readonly availableTrucks: Locator;
    readonly truckMake: Locator;
    readonly truckModel: Locator;
    readonly truckStatistics: Locator;
    readonly preBookCard: Locator;
    readonly companiesOption: Locator;
    readonly postLoads: Locator;
    readonly postTrucks: Locator;
    readonly postedTrucks: Locator;
    readonly leasingCard: Locator;
    readonly leasingCompaniesOption: Locator;
    readonly leasingUnits: Locator;
    readonly driversCard: Locator;
    readonly inActiveDriversCard: Locator;
    readonly fmBoard: Locator;
    readonly bgBoard: Locator;
    readonly contactsCard: Locator;
    readonly messagesCard: Locator;
    readonly thirdPartyCard: Locator;
    readonly ownersCard: Locator;
    readonly dealershipsCard: Locator;
    readonly yarsCard: Locator;
    readonly recruitmentCard: Locator;
    readonly shopCard: Locator;
    readonly permitBookCard: Locator;
    readonly driverDocumentsCard: Locator;
    readonly accountingCard: Locator;
    readonly banksOption: Locator;
    readonly dealersOption: Locator;
    readonly allUnitsOption: Locator;
    readonly unitsFinanced: Locator;
    readonly unitsPaidWithCash: Locator;
    readonly lease: Locator;
    readonly unitsHistory: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.dispatchDashboardCard = page.getByRole('link', { name: 'Dispatch Dashboard' });
        this.eldDashboardCard = page.getByRole('main').getByRole('link', { name: 'ELD Dashboard' });
        this.userManagementCard = page.getByRole('main').getByText("User management");
        this.usersOption = page.getByRole('menuitem', { name: 'Users', exact: true });
        this.rolesOption = page.getByRole('menuitem', { name: 'Roles', exact: true });
        this.manageAppUsers = page.getByRole('menuitem', { name: 'Manage app users', exact: true });
        this.contentCard = page.getByRole('main').getByText("Content");
        this.boardsOption = page.getByRole('menuitem', { name: 'Boards', exact: true });
        this.companyOption = page.getByRole('menuitem', { name: 'Companies', exact: true });
        this.loadTypesOption = page.getByRole('menuitem', { name: 'Load Types', exact: true });
        this.manageFMOption = page.getByRole('menuitem', { name: 'Manage FM', exact: true });
        this.eldCard = page.locator('div .d-flex .v-icon.mdi-headset');
        this.shiftsOption = page.getByRole('menuitem', { name: 'Shifts', exact: true });
        this.dotInspections = page.getByRole('menuitem', { name: 'DOT inspections', exact: true });
        this.callTypes = page.getByRole('menuitem', { name: 'Call types', exact: true });
        this.trailerCard = page.getByRole('main').getByText("Trailer");
        this.trailersOption = page.getByRole('menuitem', { name: 'Trailers', exact: true });
        this.availableTrailers = page.getByRole('menuitem', { name: 'Available Trailers', exact: true });
        this.aTHistoruOption = page.getByRole('menuitem', { name: 'AT History', exact: true });
        this.inactiveDrivers = page.getByRole('menuitem', { name: 'Inactive Drivers', exact: true });
        this.trailerMakes = page.getByRole('menuitem', { name: 'Trailer Makes', exact: true });
        this.trailerTypes = page.getByRole('menuitem', { name: 'Trailer Types', exact: true });
        this.trucksCard = page.getByRole('main').getByText("Trucks");
        this.trucksOption = page.getByRole('menuitem', { name: 'Trucks', exact: true });
        this.availableTrucks = page.getByRole('menuitem', { name: 'Available Trucks', exact: true });
        this.truckMake = page.getByRole('menuitem', { name: 'Truck Make', exact: true });
        this.truckModel = page.getByRole('menuitem', { name: 'Truck Model', exact: true });
        this.truckStatistics = page.getByRole('menuitem', { name: 'Trucks Statistics', exact: true });
        this.preBookCard = page.getByRole('main').getByText("Pre Book");
        this.companiesOption = page.getByRole('menuitem', { name: 'Companies', exact: true });
        this.postLoads = page.getByRole('menuitem', { name: 'Post loads', exact: true });
        this.postTrucks = page.getByRole('menuitem', { name: 'Post trucks', exact: true });
        this.postedTrucks = page.getByRole('menuitem', { name: 'Posted trucks', exact: true });
        this.leasingCard = page.getByRole('main').getByText("Leasing");
        this.leasingCompaniesOption = page.getByRole('menuitem', { name: 'Leasing Companies', exact: true });
        this.leasingUnits = page.getByRole('menuitem', { name: 'Leasing Units', exact: true });
        this.driversCard = page.getByRole('main').getByText("Drivers").first();
        this.inActiveDriversCard = page.locator("div .nav-card .v-icon.mdi-card-account-details-outline");
        this.fmBoard = page.getByRole('main').getByText("FM board");
        this.bgBoard = page.getByRole('menuitem', { name: 'BG', exact: true });
        this.contactsCard = page.getByRole('main').getByText("Contacts");
        this.messagesCard = page.getByRole('main').getByText("Messages");
        this.thirdPartyCard = page.getByRole('main').getByText("Third party");
        this.ownersCard = page.getByRole('main').getByText("Owners");
        this.dealershipsCard = page.getByRole('main').getByText("Dealerships");
        this.yarsCard = page.getByRole('main').getByText("Yards");
        this.recruitmentCard = page.getByRole('main').getByText("Recruitment");
        this.shopCard = page.getByRole('main').getByText("Shop");
        this.permitBookCard = page.getByRole('main').getByText("Permit books");
        this.driverDocumentsCard = page.getByRole('main').getByText("Driver documents");
        this.accountingCard = page.getByRole('main').getByText("Accounting");
        this.banksOption = page.getByRole('menuitem', { name: 'Banks', exact: true });
        this.dealersOption = page.getByRole('menuitem', { name: 'Dealers', exact: true });
        this.allUnitsOption = page.getByRole('menuitem', { name: 'All Units', exact: true });
        this.unitsFinanced = page.getByRole('menuitem', { name: 'Units (financed)', exact: true });
        this.unitsPaidWithCash = page.getByRole('menuitem', { name: 'Units (paid with cash)', exact: true });
        this.lease = page.getByRole('menuitem', { name: 'Lease', exact: true });
        this.unitsHistory = page.getByRole('menuitem', { name: 'Units History', exact: true });
    }

    async hoverAndClick(mainLocator: Locator, subLocator?: Locator) {
        await mainLocator.waitFor({ state: 'visible', timeout: 3000 });
        await mainLocator.hover();
        await subLocator?.waitFor({ state: 'visible', timeout: 3000 });
        await subLocator?.click();
    }

    async click(card: Locator) {
        await this.clickElement(card);
    }

}