import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";


export class EditTrailersPage extends BasePage {
    readonly page: Page;
    readonly yardField: Locator;
    readonly plateField: Locator;
    readonly yardOption: Locator;
    readonly inCompanyCheckbox: Locator;
    readonly outOfCompanyCheckbox: Locator;
    readonly driverMenu: Locator;
    readonly driverOption: Locator;
    readonly truckField: Locator;
    readonly truckOption: Locator;
    readonly rentBuyMenu: Locator;
    readonly rentOption: Locator;
    readonly companyMenu: Locator;
    readonly companyOption: Locator;
    readonly driverPhoneField: Locator;
    readonly pickUpDateField: Locator;
    readonly currentDate: Locator;
    readonly dotField: Locator;
    readonly driverStateMenu: Locator;
    readonly driverStateOption: Locator;
    readonly ownerMenu: Locator;
    readonly ownerOption: Locator;
    readonly statusMenu: Locator;
    readonly statusOption: Locator;
    readonly availabilityMenu: Locator;
    readonly availabilityOption: Locator;
    readonly dialogBox: Locator;
    readonly thirdPartyMenu: Locator;
    readonly thirdPartyOption: Locator;
    readonly startDateField: Locator;
    readonly temproraryThirdParyCheckbox: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.yardField = page.getByRole('dialog').locator('div').filter({ hasText: /^Yard$/ }).nth(1);
        this.plateField = page.locator('input[name="plate"]');
        this.yardOption = page.getByRole('option', { name: 'Nova yarda', exact: true });
        this.inCompanyCheckbox = page.getByText('In company', { exact: true });
        this.outOfCompanyCheckbox = page.getByText('Out of company', { exact: true });
        this.driverMenu = page.getByRole('dialog').locator('div').filter({ hasText: /^Driver$/ }).nth(1);
        this.driverOption = page.getByRole('option', { name: 'btest / secondDriver (ALZ Express Ohio LLC)', exact: true });
        this.truckField = page.locator('input[name="truck"]');
        this.truckOption = page.getByRole('option', { name: ' 11996 - btest / secondDriver (ALZ Express Ohio LLC)', exact: true });
        this.rentBuyMenu = page.getByRole('dialog').locator('div').filter({ hasText: /^Rent\/Buy$/ }).nth(1);
        this.rentOption = page.getByRole('option', { name: 'Rent', exact: true });
        this.companyMenu = page.getByRole('dialog').locator('div').filter({ hasText: /^Company$/ }).nth(1);
        this.companyOption = page.getByRole('option', { name: 'Rocket', exact: true });
        this.driverPhoneField = page.getByRole('textbox', { name: 'Driver\'s Phone' });
        this.pickUpDateField = page.getByRole('button', { name: 'Driver Pick Up Date' });
        this.currentDate = page.locator('.v-btn.v-date-picker-table__current');
        this.dotField = page.getByRole('button', { name: 'DOT' });
        this.driverStateMenu = page.getByRole('textbox', { name: 'Driver State' });
        this.driverStateOption = page.getByRole('option', { name: 'Temporary', exact: true });
        this.ownerMenu = page.getByRole('dialog').locator('div').filter({ hasText: /^Owner$/ }).nth(1);
        this.ownerOption = page.getByRole('option', { name: '4D Production Inc.', exact: true });
        this.statusMenu = page.getByRole('dialog').locator('div').filter({ hasText: /^StatusNEW$/ }).nth(1);
        this.statusOption = page.getByRole('option', { name: 'STOLEN', exact: true });
        this.availabilityMenu = page.getByRole('button', { name: 'Availability' });
        this.availabilityOption = page.getByRole('option', { name: 'available', exact: true });
        this.dialogBox = page.locator('.v-dialog.v-dialog--active');
        this.thirdPartyMenu = page.getByRole('textbox', { name: 'Third Party' });
        this.thirdPartyOption = page.getByRole('option', { name: '4 Aces Logistics.', exact: true });
        this.startDateField = page.getByRole('button', { name: 'Start Date' });
        this.temproraryThirdParyCheckbox = page.getByText('Temporary third party?', { exact: true });
    }

    async fillPlate(plateField: Locator, plateNumber: string) {
        await this.fillInputField(plateField, plateNumber);
    }

    async selectYard(yardMenu: Locator, yard: Locator) {
        await this.selectFromMenu(yardMenu, yard);
    }

    async check(checkbox: Locator): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            await checkbox.click();
        }
    }

    async selectDriver(driverMenu: Locator, driverName: string, driver: Locator) {
        await driverMenu.waitFor();
        await driverMenu.click();
        await driverMenu.type(driverName, { delay: 30 });
        // await this.page.locator('.v-list.v-select-list.v-sheet').waitFor({ state: 'visible', timeout: 3000 });
        await driver.waitFor({ state: 'visible', timeout: 3000 });
        await driver.click();
        await this.page.waitForTimeout(1000);
    }

    async addTruckIfEmpty(truckField: Locator, truckName: string, truckNumber: Locator) {
        const value = await truckField.inputValue();
        if (!value || value.trim() === '') {
            await this.fillAndSelectFromMenu(truckField, truckName, truckNumber);
        }
    }

    async selectRentOrBuy(rentBuyMenu: Locator, rentBuyOption: Locator) {
        await this.selectFromMenu(rentBuyMenu, rentBuyOption);
    }

    async selectCompany(companyField: Locator, company: Locator) {
        await this.selectFromMenu(companyField, company);
    }

    async fillPhoneNumber(phoneField: Locator, phone: string) {
        await phoneField.clear();
        await this.fillInputField(phoneField, phone);
    }

    async selectPickUpDate(pickUpDateField: Locator, date: Locator) {
        await this.clickElement(pickUpDateField);
        await this.selectFromMenu(pickUpDateField, date);
    }

    async selectDot(dotField: Locator, date: Locator) {
        await this.selectFromMenu(dotField, date);
    }

    async selectDriverState(driverStateField: Locator, state: Locator) {
        await this.selectFromMenu(driverStateField, state);
    }

    async selectOwner(ownerField: Locator, owner: Locator) {
        await this.selectFromMenu(ownerField, owner);
    }

    async selectStatus(statusField: Locator, status: Locator) {
        await this.selectFromMenu(statusField, status);
    }

    async selectAvailability(availabilityField: Locator, availability: Locator) {
        await this.selectFromMenu(availabilityField, availability);
    }

    async selectThirdParty(thirdPartyField: Locator, thirdParty: Locator) {
        await this.selectFromMenu(thirdPartyField, thirdParty);
    }
}
