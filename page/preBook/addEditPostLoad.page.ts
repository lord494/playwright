import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddEditPostLoadPage extends BasePage {
    readonly page: Page;
    readonly loadId: Locator;
    readonly originMenu: Locator;
    readonly destinatinMenu: Locator;
    readonly pickupDateField: Locator;
    readonly deliveryDateField: Locator;
    readonly companyField: Locator;
    readonly brokerNameField: Locator;
    readonly brokerEmailField: Locator;
    readonly brokerPhoneField: Locator;
    readonly trailerTypeMenu: Locator;
    readonly weightField: Locator;
    readonly rateField: Locator;
    readonly suggestedRateField: Locator;
    readonly dedicaterCheckbox: Locator;
    readonly noteField: Locator;
    readonly saveButton: Locator;
    readonly originOption: Locator;
    readonly destinationOption: Locator;
    readonly companyOption: Locator;
    readonly addEditDialogbox: Locator;
    readonly todayDate: Locator;
    readonly miamiOption: Locator;
    readonly newYorkOption: Locator;
    readonly editTestCompanyOption: Locator;
    readonly pickupTimeField: Locator;
    readonly hours: Locator;
    readonly secondHours: Locator;
    readonly minutes: Locator;
    readonly secondMinutes: Locator;
    readonly toPickupTimeField: Locator;
    readonly deliveryTimeField: Locator;
    readonly toDilevryTimeField: Locator;
    readonly trailerTypeOption: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.loadId = page.getByRole('textbox', { name: 'Load id *' });
        this.originMenu = page.getByRole('textbox', { name: 'Origin *' });
        this.destinatinMenu = page.getByRole('textbox', { name: 'Destination *' });
        this.pickupDateField = page.getByRole('button', { name: 'Pickup Date *' });
        this.deliveryDateField = page.getByRole('button', { name: 'Delivery Date *' });
        this.companyField = page.getByRole('textbox', { name: 'Company *' });
        this.brokerNameField = page.getByRole('textbox', { name: 'Name *' });
        this.brokerEmailField = page.getByRole('textbox', { name: 'Email *' });
        this.brokerPhoneField = page.getByRole('textbox', { name: 'Phone' });
        this.trailerTypeMenu = page.getByRole('textbox', { name: 'Trailer type *' });
        this.weightField = page.getByRole('spinbutton', { name: 'Weight *' });
        this.rateField = page.getByRole('spinbutton', { name: 'Rate *' });
        this.suggestedRateField = page.getByRole('spinbutton', { name: 'Suggested Rate' });
        this.dedicaterCheckbox = page.getByRole('dialog').getByText('Dedicated');
        this.noteField = page.getByRole('textbox', { name: 'Note' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.originOption = page.getByRole('option', { name: 'East Washington, PA', exact: true });
        this.destinationOption = page.getByRole('option', { name: 'East Los Angeles, CA', exact: true });
        this.companyOption = page.getByRole('option', { name: '11 Test kompanija', exact: true });
        this.addEditDialogbox = page.locator('.v-dialog.v-dialog--active');
        this.todayDate = page.locator('.v-date-picker-table__current.v-btn--rounded');
        this.miamiOption = page.getByRole('option', { name: 'Miami, FL', exact: true });
        this.newYorkOption = page.getByRole('option', { name: 'New York, NY', exact: true });
        this.editTestCompanyOption = page.getByRole('option', { name: '99 FREIGHT INC', exact: true });
        this.pickupTimeField = page.getByRole('button', { name: 'P. Time *' });
        this.deliveryTimeField = page.getByRole('button', { name: 'D. Time *' });
        this.hours = page.locator('.v-time-picker-clock__item', { hasText: '3' });
        this.secondHours = page.locator('.v-time-picker-clock__item', { hasText: '15' });
        this.secondMinutes = page.locator('.v-time-picker-clock__item').filter({ hasText: '30' });
        this.minutes = page.locator('.v-time-picker-clock__item').filter({ hasText: '40' });
        this.toPickupTimeField = page.locator('div:nth-child(6) > .v-input');
        this.toDilevryTimeField = page.locator('div:nth-child(9) > .v-input');
        this.trailerTypeOption = page.getByRole('option', { name: 'R', exact: true });
    }

    async enterLoadId(loadIdField: Locator, loadId: string) {
        await this.fillInputField(loadIdField, loadId);
    }

    async selectOrigin(originMenu: Locator, origin: string, originOption: Locator) {
        await this.fillAndSelectFromMenu(originMenu, origin, originOption);
    }

    async selecDestination(destinationMenu: Locator, destination: string, destinationOption: Locator) {
        await this.fillAndSelectFromMenu(destinationMenu, destination, destinationOption);
    }

    async selectCompany(companyMenu: Locator, optionFromMenu: Locator) {
        await this.selectFromMenu(companyMenu, optionFromMenu);
    }

    async enterBrokerName(brokerNameField: Locator, name: string) {
        await this.fillInputField(brokerNameField, name);
    }

    async enterBrokerEmail(brokerEmailField: Locator, email: string) {
        await this.fillInputField(brokerEmailField, email);
    }

    async enterBrokerPhone(brokerPhoneField: Locator, phone: string) {
        await this.fillInputField(brokerPhoneField, phone);
    }

    async selectTrailerType(trailerTypeMenu: Locator, trailerType: Locator) {
        await this.selectFromMenu(trailerTypeMenu, trailerType);
    }

    async enterNote(noteField: Locator, note: string) {
        await this.fillInputField(noteField, note);
    }

    async enterWeight(weightField: Locator, weight: string) {
        await this.fillInputField(weightField, weight);
    }

    async enterRate(rateField: Locator, rate: string) {
        await this.fillInputField(rateField, rate);
    }

    async enterSyggestedRate(rateField: Locator, rate: string) {
        await this.fillInputField(rateField, rate);
    }

    async check(radiobutton: Locator): Promise<void> {
        const isChecked = await radiobutton.isChecked();
        if (!isChecked) {
            await radiobutton.click();
        }
    }

    async selectTodayDate(dateField: Locator, date: Locator) {
        await dateField.click();
        await date.click();
    }

    async selectTime(timeField: Locator, hours: Locator, minutes: Locator) {
        await timeField.click();
        await hours.first().click();
        await minutes.first().click();
    }
}