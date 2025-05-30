import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AddTruckPage extends BasePage {
    readonly page: Page;
    readonly truckNumberField: Locator;
    readonly driverField: Locator;
    readonly driverOption: Locator;
    readonly infoField: Locator;
    readonly phoneField: Locator;
    readonly divisionMenu: Locator;
    readonly testCompanyDivisionOption: Locator;
    readonly makeMenu: Locator;
    readonly volvoMakeOption: Locator;
    readonly modelMenu: Locator;
    readonly VNL760ModleOption: Locator;
    readonly truckColorField: Locator;
    readonly yearMenu: Locator;
    readonly year2002: Locator;
    readonly vinNumberField: Locator;
    readonly plateField: Locator;
    readonly truckEngineMenu: Locator;
    readonly cumminsTruckEngine: Locator;
    readonly transmissionMenu: Locator;
    readonly automaticTransmissionOption: Locator;
    readonly truckMileageMenu: Locator;
    readonly rentedRadioButton: Locator;
    readonly brokenTruckRadioButton: Locator;
    readonly totalDemage: Locator;
    readonly thirdPartyRadioButton: Locator;
    readonly addButtonInModal: Locator;
    readonly dialogBox: Locator;
    readonly thirtPartyOption: Locator;
    readonly thirdPartyMenu: Locator;
    readonly deleteButton: Locator;
    readonly inactiveButton: Locator;
    readonly cancelButton: Locator;
    readonly driverTest: Locator;
    readonly rocketDivision: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.truckNumberField = page.locator('#number');
        this.driverField = page.getByRole('textbox', { name: 'Driver' });
        this.driverOption = page.getByRole('option', { name: 'driver playwright', exact: true });
        this.infoField = page.locator('#info');
        this.phoneField = page.locator('#phone');
        this.divisionMenu = page.locator('#company');
        this.testCompanyDivisionOption = page.getByRole('option', { name: 'testcompany', exact: true });
        this.makeMenu = page.locator('#make');
        this.volvoMakeOption = page.getByRole('option', { name: 'VOLVO', exact: true });
        this.modelMenu = page.locator('#model');
        this.VNL760ModleOption = page.getByRole('option', { name: 'VNL 760', exact: true });
        this.truckColorField = page.locator('#color');
        this.yearMenu = page.locator('#year');
        this.year2002 = page.getByRole('option', { name: '2022', exact: true });
        this.vinNumberField = page.locator('#vin_number');
        this.plateField = page.locator('#plate');
        this.truckEngineMenu = page.locator('#engine');
        this.cumminsTruckEngine = page.getByRole('option', { name: 'Cummins', exact: true });
        this.transmissionMenu = page.locator('.v-select__slot', { hasText: 'Select transmission' });
        this.automaticTransmissionOption = page.getByRole('option', { name: 'Automatic', exact: true });
        this.truckMileageMenu = page.locator('#mileage');
        this.rentedRadioButton = page.getByRole('dialog').getByText('Rented')
        this.brokenTruckRadioButton = page.getByRole('dialog').getByText('Broken truck')
        this.totalDemage = page.getByRole('dialog').getByText('Total damage')
        this.thirdPartyRadioButton = page.getByRole('dialog').getByText('Third party')
        this.addButtonInModal = page.getByRole('dialog').getByRole('button', { name: 'Add' })
        this.dialogBox = page.locator('.v-dialog--active');
        this.thirtPartyOption = page.getByRole('option', { name: '4 Aces Logistics.', exact: true });
        this.thirdPartyMenu = page.locator('.v-select__slot', { hasText: 'Third party' });
        this.deleteButton = page.locator('.v-btn__content').filter({ hasText: 'Delete' });
        this.inactiveButton = page.locator('.v-btn__content').filter({ hasText: 'INACTIVE' });
        this.cancelButton = page.locator('.v-btn__content').filter({ hasText: 'Cancel' });
        this.driverTest = page.getByRole('option', { name: 'driverTest', exact: true });
        this.rocketDivision = page.getByRole('option', { name: 'Rocket', exact: true });
    }
    async enterTruckNumber(truckNumberField: Locator, number: string) {
        await this.fillInputField(truckNumberField, number);
    }

    async selectDriver(locator: Locator, text: string, locator2: Locator) {
        await this.fillAndSelectDriver(locator, text, locator2);
    }

    async enterInfo(infoField: Locator, info: string) {
        await this.fillInputField(infoField, info);
    }

    async enterPhone(phoneField: Locator, phone: string) {
        await this.fillInputField(phoneField, phone);
    }

    async selectDivision(divisionMenu: Locator, division: Locator) {
        await this.selectFromMenu(divisionMenu, division);
    }

    async selectThirdParty(thirdPartyMenu: Locator, thirdParty: Locator) {
        await this.selectFromMenu(thirdPartyMenu, thirdParty);
    }

    async selectMake(makeField: Locator, make: Locator) {
        await this.selectFromMenu(makeField, make);
    }

    async selectModel(modelField: Locator, model: Locator) {
        await this.selectFromMenu(modelField, model);
    }

    async enterColor(colorField: Locator, color: string) {
        await this.fillInputField(colorField, color);
    }

    async selectYear(yearField: Locator, year: Locator) {
        await this.selectFromMenu(yearField, year);
    }

    async enterVinNumber(vinNumberField: Locator, vinNumber: string) {
        await this.fillInputField(vinNumberField, vinNumber);
    }

    async enterPlate(plateField: Locator, plate: string) {
        await this.fillInputField(plateField, plate);
    }

    async selectTruckEngine(truckEngineMenu: Locator, truckEngine: Locator) {
        await this.selectFromMenu(truckEngineMenu, truckEngine);
    }

    async selectTransmission(transsmisionMenu: Locator, transsmision: Locator) {
        await this.selectFromMenu(transsmisionMenu, transsmision);
    }

    async enterMileage(mileageField: Locator, mileage: string) {
        await this.fillInputField(mileageField, mileage);
    }

    async check(radiobutton: Locator): Promise<void> {
        const isChecked = await radiobutton.isChecked();
        if (!isChecked) {
            await radiobutton.click();
        }
    }

    async uncheck(toggleButton: Locator): Promise<void> {
        if (await toggleButton.isChecked()) {
            await toggleButton.click();
        }
    }
}