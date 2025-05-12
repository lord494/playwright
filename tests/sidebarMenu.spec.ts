import { test, expect, chromium, Page } from '@playwright/test';
import { HeaderPage } from '../page/header.page';
import { SideBarMenu } from '../page/sidebarMenu.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const header = new HeaderPage(page);
    await page.goto('');
    await header.click(header.hamburgerMenu);
});


test('Korisnik moze da otvori dispatch dashboard iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.dispatchDashboardButton);
    await expect(page).toHaveURL(/dashboard/);
});

test('Korisnik moze da otvori eld dashboard iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.eldDashboardButton);
    await expect(page).toHaveURL(/eld-dashboard/);
});

test('Korisnik moze da otvori users iz manage app users menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.userManagementMenu, menu.usersOption);
    await expect(page).toHaveURL(/users/);
});

test('Korisnik moze da otvori roles iz manage app users menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.userManagementMenu, menu.rolesOption);
    await expect(page).toHaveURL(/roles/);
});

test('Korisnik moze da otvori manage app users iz manage app users menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.userManagementMenu, menu.manageAppUsersOption);
    await expect(page).toHaveURL(/users/);
});

test('Korisnik moze da otvori boards iz content menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.contentMenu, menu.boardsOption);
    await expect(page).toHaveURL(/boards/);
});

test('Korisnik moze da otvori companies iz content menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.contentMenu, menu.companiesOption);
    await expect(page).toHaveURL(/companies/);
});

test('Korisnik moze da otvori load-types iz content menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.contentMenu, menu.loadTypesOption);
    await expect(page).toHaveURL(/load-types/);
});

test('Korisnik moze da otvori menage fm iz content menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.contentMenu, menu.manageFMOption);
    await expect(page).toHaveURL(/menage-fm/);
});

test('Korisnik moze da otvori Shifts iz ELD menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.eldMenu, menu.shiftsOption);
    await expect(page).toHaveURL(/shifts/);
});

test('Korisnik moze da otvori DOT inspections iz ELD menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.eldMenu, menu.dotInspectionsOption);
    await expect(page).toHaveURL(/dot-inspections/);
});

test('Korisnik moze da otvori Eld-types iz ELD menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.eldMenu, menu.callTypesOption);
    await expect(page).toHaveURL(/eld-types/);
});

test('Korisnik moze da otvori trailers iz Trailer menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.trailerMenu, menu.trailersOption);
    await expect(page).toHaveURL(/trailers/);
});

test('Korisnik moze da otvori available trailers iz Trailer menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.trailerMenu, menu.availableTrailersOption);
    await expect(page).toHaveURL(/available-trailers/);
});

test('Korisnik moze da otvori AT History iz Trailer menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.trailerMenu, menu.atHistoryOption);
    await expect(page).toHaveURL(/isHistory/);
});

test('Korisnik moze da otvori inactive Drivers iz Trailer menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.trailerMenu, menu.inactiveDriversOption);
    await expect(page).toHaveURL(/trailers-inactive-drivers/);
});

test('Korisnik moze da otvori trailer Makes iz Trailer menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.trailerMenu, menu.trailerMakesOption);
    await expect(page).toHaveURL(/marks/);
});

test('Korisnik moze da otvori trailer types iz Trailer menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.trailerMenu, menu.trailerTypesOption);
    await expect(page).toHaveURL(/types/);
});

test('Korisnik moze da otvori Trucks iz Trucks menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.truckMenu, menu.trucksOption);
    await expect(page).toHaveURL(/trucks/);
});

test('Korisnik moze da otvori Available Trucks iz Trucks menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.truckMenu, menu.availableTruckOption);
    await expect(page).toHaveURL(/available-trucks/);
});

test('Korisnik moze da otvori Trucks Make iz Trucks menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.truckMenu, menu.truckMake);
    await expect(page).toHaveURL(/truck-make/);
});

test('Korisnik moze da otvori Trucks Model iz Trucks menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.truckMenu, menu.truckModel);
    await expect(page).toHaveURL(/truck-model/);
});

test('Korisnik moze da otvori Trucks Statistics iz Trucks menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.truckMenu, menu.truckStatistics);
    await expect(page).toHaveURL(/statistics/);
});

test('Korisnik moze da otvori Companies iz Pre book menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.preBookMenu, menu.companiesOptionFromPreBook);
    await expect(page).toHaveURL(/companies/);
});

test('Korisnik moze da otvori post loads iz Pre book menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.preBookMenu, menu.postLoadsOption);
    await expect(page).toHaveURL(/post-loads/);
});

test('Korisnik moze da otvori post trucks iz Pre book menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.preBookMenu, menu.postTrucksOption);
    await expect(page).toHaveURL(/post-trucks/);
});

test('Korisnik moze da otvori posted trucks iz Pre book menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.preBookMenu, menu.postedTruckOption);
    await expect(page).toHaveURL(/posted-trucks/);
});

test('Korisnik moze da otvori leasing Companies iz Leasing menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.leasingMenu, menu.leasingCompaniesOption);
    await expect(page).toHaveURL(/companies/);
});

test('Korisnik moze da otvori leasing Units iz Leasing menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.leasingMenu, menu.leasingUnitsOptionl);
    await expect(page).toHaveURL(/units/);
});

test('Korisnik moze da otvori drivers stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.driversButton);
    await expect(page).toHaveURL(/drivers/);
});

test('Korisnik moze da otvori inactive drivers stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.inactiveDriversButton);
    await expect(page).toHaveURL(/drivers/);
});

test('Korisnik moze da otvori BG Boards iz Boards menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.fmBoardMenu, menu.bgBoard);
    await expect(page).toHaveURL(/fm-board/);
});

test('Korisnik moze da otvori contacts stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.contactsButton);
    await expect(page).toHaveURL(/contacts/);
});

test('Korisnik moze da otvori messges stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.messagesButton);
    await expect(page).toHaveURL(/messages/);
});

test('Korisnik moze da otvori third party stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.thirdPartyButton);
    await expect(page).toHaveURL(/third/);
});

test('Korisnik moze da otvori owner stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.ownersButton);
    await expect(page).toHaveURL(/owner/);
});

test('Korisnik moze da otvori dealerships stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.dealershipsButton);
    await expect(page).toHaveURL(/dealerships/);
});

test('Korisnik moze da otvori yards stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.yardsButton);
    await expect(page).toHaveURL(/yards/);
});

test('Korisnik moze da otvori recruitment stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.recruitmentButton);
    await expect(page).toHaveURL(/recruitment/);
});

test('Korisnik moze da otvori shop stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.shopButton);
    await expect(page).toHaveURL(/shop/);
});

test('Korisnik moze da otvori permit-books stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.permitBooksButton);
    await expect(page).toHaveURL(/permit-books/);
});

test('Korisnik moze da otvori driver-documents stranicu iz side menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.click(menu.driverDocumentsButton);
    await expect(page).toHaveURL(/driver-documents/);
});

test('Korisnik moze da otvori banks iz Accounting menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.accountingMenu, menu.banksOption);
    await expect(page).toHaveURL(/banks/);
});

test('Korisnik moze da otvori Dealer iz Accounting menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.accountingMenu, menu.dealersOption);
    await expect(page).toHaveURL(/isDealer/);
});

test('Korisnik moze da otvori units financed iz Accounting menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.accountingMenu, menu.unitsFinancedOption);
    await expect(page).toHaveURL(/units/);
});

test('Korisnik moze da otvori units paid cash iz Accounting menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.accountingMenu, menu.unitsPaidWithCashOption);
    await expect(page).toHaveURL(/paidWithCash/);
});

test('Korisnik moze da otvori Lease iz Accounting menija ', async ({ page }) => {
    const menu = new SideBarMenu(page);
    await menu.selectFromMenu(menu.accountingMenu, menu.leaseOption);
    await expect(page).toHaveURL(/lease/);
});