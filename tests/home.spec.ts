import { test, expect, chromium, Page } from '@playwright/test';
import { HomePage } from '../page/home.page';

test.use({ storageState: 'auth.json' });
test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test('Korisnik moze da otvori Dispatch dashboard klikom na Dispatch dashboard karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.dispatchDashboardCard);
  await expect(page).toHaveURL(/dashboard/);
});

test('Korisnik moze da otvori ELD dashboard klikom na ELD  dashboard karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.eldDashboardCard);
  await expect(page).toHaveURL(/eld/);
});

test('Korisnik moze da otvori Users iz User Managment kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.userManagementCard, home.usersOption);
  await expect(page).toHaveURL(/users/);
});

test('Korisnik moze da otvori Manage app iz User Managment kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.userManagementCard, home.manageAppUsers);
  await expect(page).toHaveURL(/manage-app-users/);
});

test('Korisnik moze da otvori Roles iz User Managment kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.userManagementCard, home.rolesOption);
  await expect(page).toHaveURL(/roles/);
});

test('Korisnik moze da otvori Boards iz Content kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.contentCard, home.boardsOption);
  await expect(page).toHaveURL(/boards/);
});

test('Korisnik moze da otvori Companies iz Content kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.contentCard, home.companyOption);
  await expect(page).toHaveURL(/companies/);
});

test('Korisnik moze da otvori Load Types iz Content kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.contentCard, home.loadTypesOption);
  await expect(page).toHaveURL(/load-types/);
});

test('Korisnik moze da otvori ManageFM iz Content kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.contentCard, home.manageFMOption);
  await expect(page).toHaveURL(/menage-fm/);
});

test('Korisnik moze da otvori Shifts iz ELD kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.eldCard, home.shiftsOption);
  await expect(page).toHaveURL(/shifts/);
});

test('Korisnik moze da otvori DOT Inspections iz ELD kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.eldCard, home.dotInspections);
  await expect(page).toHaveURL(/dot-inspections/);
});

test('Korisnik moze da otvori Call types iz ELD kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.eldCard, home.callTypes);
  await expect(page).toHaveURL(/eld-types/);
});

test('Korisnik moze da otvori Trailers iz Trailers kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trailerCard, home.trailersOption);
  await expect(page).toHaveURL(/trailers/);
});

test('Korisnik moze da otvori available-trailers iz Trailers kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trailerCard, home.availableTrailers);
  await expect(page).toHaveURL(/available-trailers/);
});

test('Korisnik moze da otvori at history iz Trailers kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trailerCard, home.aTHistoruOption);
  await expect(page).toHaveURL(/available-trailers/);
});

test('Korisnik moze da otvori inactive drivers iz Trailers kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trailerCard, home.inactiveDrivers);
  await expect(page).toHaveURL(/trailers-inactive-drivers/);
});

test('Korisnik moze da otvori trailer makes iz Trailers kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trailerCard, home.trailerMakes);
  await expect(page).toHaveURL(/marks/);
});

test('Korisnik moze da otvori trailer types iz Trailers kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trailerCard, home.trailerTypes);
  await expect(page).toHaveURL(/types/);
});

test('Korisnik moze da otvori trucks iz Trucks kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trucksCard, home.trucksOption);
  await expect(page).toHaveURL(/trucks/);
});

test('Korisnik moze da otvori available trucks iz Trucks kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trucksCard, home.availableTrucks);
  await expect(page).toHaveURL(/available-trucks/);
});

test('Korisnik moze da otvori trucks Make iz Trucks kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trucksCard, home.truckMake);
  await expect(page).toHaveURL(/truck-make/);
});

test('Korisnik moze da otvori trucks Model iz Trucks kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trucksCard, home.truckModel);
  await expect(page).toHaveURL(/truck-model/);
});

test('Korisnik moze da otvori trucks statistics iz Trucks kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.trucksCard, home.truckStatistics);
  await expect(page).toHaveURL(/statistics/);
});

test('Korisnik moze da otvori companies iz PreBook kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.preBookCard, home.companiesOption);
  await expect(page).toHaveURL(/companies/);
});

test('Korisnik moze da otvori post Loads iz PreBook kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.preBookCard, home.postLoads);
  await expect(page).toHaveURL(/post-loads/);
});

test('Korisnik moze da otvori post Trucks iz PreBook kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.preBookCard, home.postTrucks);
  await expect(page).toHaveURL(/post-trucks/);
});

test('Korisnik moze da otvori posted trucks iz PreBook kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.preBookCard, home.postedTrucks);
  await expect(page).toHaveURL(/posted-trucks/);
});

test('Korisnik moze da otvori leasing companies iz Leasing kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.leasingCard, home.leasingCompaniesOption);
  await expect(page).toHaveURL(/companies/);
});

test('Korisnik moze da otvori leasing units iz Leasing kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.leasingCard, home.leasingUnits);
  await expect(page).toHaveURL(/units/);
});

test('Korisnik moze da otvori Drivers stranicu klikom na Drivers karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.driversCard);
  await expect(page).toHaveURL(/drivers/);
});

test('Korisnik moze da otvori Inactive Drivers stranicu klikom na Drivers karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.inActiveDriversCard);
  await expect(page).toHaveURL(/drivers/);
});

test('Korisnik moze da otvori BG board iz FM Board karice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.fmBoard, home.bgBoard);
  await expect(page).toHaveURL(/fm-board/);
});

test('Korisnik moze da otvori Contacts stranicu klikom na Contacts karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.contactsCard);
  await expect(page).toHaveURL(/contacts/);
});

test('Korisnik moze da otvori Messages stranicu klikom na Messages karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.messagesCard);
  await expect(page).toHaveURL(/messages/);
});

test('Korisnik moze da otvori Third party stranicu klikom na Third party karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.thirdPartyCard);
  await expect(page).toHaveURL(/third/);
});

test('Korisnik moze da otvori Owners stranicu klikom na Owners karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.ownersCard);
  await expect(page).toHaveURL(/owner/);
});

test('Korisnik moze da otvori dealerships stranicu klikom na dealerships karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.dealershipsCard);
  await expect(page).toHaveURL(/dealerships/);
});

test('Korisnik moze da otvori Yards stranicu klikom na yards karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.yarsCard);
  await expect(page).toHaveURL(/yards/);
});

test('Korisnik moze da otvori recruitment stranicu klikom na recruitment karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.recruitmentCard);
  await expect(page).toHaveURL(/recruitment/);
});

test('Korisnik moze da otvori Permit book stranicu klikom na Permit book karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.permitBookCard);
  await expect(page).toHaveURL(/permit-books/);
});

test('Korisnik moze da otvori driver documents stranicu klikom na driver-documents karticu ', async ({ page }) => {
  const home = new HomePage(page);
  await home.click(home.driverDocumentsCard);
  await expect(page).toHaveURL(/driver-documents/);
});

test('Korisnik moze da otvori banks iz Accounting kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.accountingCard, home.banksOption);
  await expect(page).toHaveURL(/banks/);
});

test('Korisnik moze da otvori Dealers iz Accounting kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.accountingCard, home.dealersOption);
  await expect(page).toHaveURL(/Dealer/);
});

test('Korisnik moze da otvori units (Financed) iz Accounting kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.accountingCard, home.unitsFinanced);
  await expect(page).toHaveURL(/accounting/);
});

test('Korisnik moze da otvori units (paid with cash) iz Accounting kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.accountingCard, home.unitsPaidWithCash);
  await expect(page).toHaveURL(/paidWithCash/);
});

test('Korisnik moze da otvori Lease iz Accounting kartice', async ({ page }) => {
  const home = new HomePage(page);
  await home.hoverAndClick(home.accountingCard, home.lease);
  await expect(page).toHaveURL(/lease/);
});
