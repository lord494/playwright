import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class TruckPage extends BasePage {
    readonly page: Page;
    readonly addTruckButton: Locator;
    readonly statsButton: Locator;
    readonly editButton: Locator;
    readonly exportButton: Locator;
    readonly availableTrucksButton: Locator;
    readonly inCompanyRadiobutton: Locator;
    readonly allTrucksRadiobutton: Locator;
    readonly thirpartyradiobutton: Locator;
    readonly inactiveTrucksRadiobutton: Locator;
    readonly deletedRadiobutton: Locator;
    readonly deleteAllFilterButton: Locator;
    readonly truckColumn: Locator;
    readonly driverColumn: Locator;
    readonly infoColumn: Locator;
    readonly phoneColumn: Locator;
    readonly noteColumn: Locator;
    readonly divisionColumn: Locator;
    readonly makeColumn: Locator;
    readonly modelColumn: Locator;
    readonly colorColumn: Locator;
    readonly yearColumn: Locator;
    readonly vinColumn: Locator;
    readonly plateColumn: Locator;
    readonly engineColumn: Locator;
    readonly transsmissionColumn: Locator;
    readonly mileageColumn: Locator;
    readonly oliChangeColumn: Locator;
    readonly annualDotColumn: Locator;
    readonly repairColumn: Locator;
    readonly searchInput: Locator;
    readonly companyMenu: Locator;
    readonly testCompanyOption: Locator;
    readonly vinNumberField: Locator;
    readonly filterRadiobutton: Locator;
    readonly addHistoryButton: Locator;
    readonly driverField: Locator;
    readonly driverOptionFromMenu: Locator;
    readonly fromFieldModal: Locator;
    readonly currentDate: Locator;
    readonly toFieldModal: Locator;
    readonly addButton: Locator;
    readonly dialogBox: Locator;
    readonly histryList: Locator;
    readonly pencilIconInHistoryModal: Locator;
    readonly noteInHistoryModal: Locator;
    readonly deleteIconInHistoryModal: Locator;
    readonly snackMessage: Locator;
    readonly oldState: Locator;
    readonly newState: Locator;
    readonly dateOfChanged: Locator;
    readonly rocketCompanyOption: Locator;
    readonly companyHistoryList: Locator;
    readonly pencilIconInCompanyHistoryModal: Locator;
    readonly deleteIconInCompanyHistoryModal: Locator;
    readonly olyTypeField: Locator;
    readonly millageField: Locator;
    readonly truckOilList: Locator;
    readonly pencilIconInTruckOilList: Locator;
    readonly deleteIconInTruckOilList: Locator;
    readonly addTruckOilChangeHistoruButton: Locator;
    readonly annualdotInspectionModalCard: Locator;
    readonly addAnnualDotButton: Locator;
    readonly invoiceNumber: Locator;
    readonly amount: Locator;
    readonly state: Locator;
    readonly city: Locator;
    readonly shopInfo: Locator;
    readonly addRepairButton: Locator;
    readonly repairCard: Locator;
    readonly isBrokenColumn: Locator;
    readonly isDemagedColumn: Locator;
    readonly totalDemageTitle: Locator;
    readonly pencilIcon: Locator;
    readonly documentIcon: Locator;
    readonly uploadDocumentIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addTruckButton = this.page.getByRole("button", { name: "Add" });
        this.addTruckOilChangeHistoruButton = this.page.locator('.v-btn__content').filter({ hasText: 'Add Trucks Oil Change History' });
        this.statsButton = this.page.locator('.v-btn__content').filter({ hasText: 'Stats' });
        this.editButton = this.page.locator('.v-btn__content').filter({ hasText: 'Edit' });
        this.exportButton = this.page.getByRole("button", { name: "Export" });
        this.availableTrucksButton = this.page.locator('.v-btn__content').filter({ hasText: 'Available Trucks' });
        this.inCompanyRadiobutton = this.page.getByRole("radio", { name: "In company", exact: true });
        this.allTrucksRadiobutton = this.page.getByRole("radio", { name: "All", exact: true });
        this.thirpartyradiobutton = this.page.getByRole("radio", { name: "Third Party", exact: true });
        this.inactiveTrucksRadiobutton = this.page.getByRole("radio", { name: "Inactive trucks", exact: true });
        this.deletedRadiobutton = this.page.getByRole("radio", { name: "Deleted", exact: true });
        this.deleteAllFilterButton = this.page.locator('.v-btn--round.theme--light.v-size--x-small.red .mdi-close.theme--light');
        this.truckColumn = this.page.locator('tr td:nth-child(2)');
        this.driverColumn = this.page.locator('tr td:nth-child(3)');
        this.infoColumn = this.page.locator('tr td:nth-child(4)');
        this.phoneColumn = this.page.locator('tr td:nth-child(5)');
        this.noteColumn = this.page.locator('tr td:nth-child(6)');
        this.divisionColumn = this.page.locator('tr td:nth-child(7)');
        this.makeColumn = this.page.locator('tr td:nth-child(10)');
        this.modelColumn = this.page.locator('tr td:nth-child(11)');
        this.colorColumn = this.page.locator('tr td:nth-child(12)');
        this.yearColumn = this.page.locator('tr td:nth-child(13)');
        this.vinColumn = this.page.locator('tr td:nth-child(14)');
        this.plateColumn = this.page.locator('tr td:nth-child(15)');
        this.engineColumn = this.page.locator('tr td:nth-child(16)');
        this.transsmissionColumn = this.page.locator('tr td:nth-child(17)');
        this.mileageColumn = this.page.locator('tr td:nth-child(18)');
        this.oliChangeColumn = this.page.locator('tr td:nth-child(19)');
        this.annualDotColumn = this.page.locator('tr td:nth-child(22)');
        this.repairColumn = this.page.locator('tr td:nth-child(23)');
        this.searchInput = this.page.locator('.v-text-field__slot').first();
        this.companyMenu = this.page.getByRole('button', { name: 'Company' });
        this.testCompanyOption = this.page.getByRole('option', { name: 'testcompany', exact: true });
        this.rocketCompanyOption = this.page.getByRole('option', { name: 'Rocket', exact: true });
        this.vinNumberField = this.page.locator('.v-text-field__slot').last();
        this.filterRadiobutton = this.page.locator('.TableFilters__fields > div:nth-child(4)');
        this.addHistoryButton = this.page.getByRole('button', { name: 'Add history', exact: true });
        this.driverField = this.page.getByRole('textbox', { name: 'Driver', exact: true });
        this.driverOptionFromMenu = this.page.getByRole('option', { name: 'btest / secondDriver (ALZ Express Ohio LLC)', exact: true });
        this.fromFieldModal = this.page.getByRole('dialog').locator('div').filter({ hasText: /^From$/ }).nth(1);
        this.currentDate = this.page.locator('.v-btn.v-date-picker-table__current').first();
        this.toFieldModal = this.page.locator('.v-input', { hasText: 'To' }).locator('.v-input__control');
        this.addButton = this.page.getByRole('button', { name: 'Add', exact: true });
        this.dialogBox = this.page.locator('.v-dialog.v-dialog--active.v-dialog--persistent');
        this.histryList = this.page.locator('.v-list-item__subtitle.history-text');
        this.pencilIconInHistoryModal = this.page.locator('.history-actions .mdi-pencil');
        this.noteInHistoryModal = this.page.getByRole('textbox', { name: 'Note', exact: true });
        this.deleteIconInHistoryModal = this.page.locator('.history-wraper.small .mdi.mdi-delete');
        this.snackMessage = this.page.locator('.v-snack__wrapper');
        this.oldState = this.page.locator('.v-select__slot').first();
        this.newState = this.page.locator('.v-select__slot').nth(1);
        this.dateOfChanged = this.page.locator('.v-input', { hasText: 'Date' }).locator('.v-input__control');
        this.companyHistoryList = this.page.locator('.v-list-item__content.TruckHistory__content');
        this.pencilIconInCompanyHistoryModal = this.page.locator('.TruckHistory__content .mdi-pencil');
        this.deleteIconInCompanyHistoryModal = this.page.locator('.TruckHistory__content .mdi-delete');
        this.olyTypeField = this.page.locator('#oilType');
        this.millageField = this.page.locator('#millage');
        this.truckOilList = this.page.locator('.OilChangeHistory__content');
        this.pencilIconInTruckOilList = this.page.locator('.OilChangeHistory__actions .mdi-pencil');
        this.deleteIconInTruckOilList = this.page.locator('.OilChangeHistory__actions .mdi-delete');
        this.annualdotInspectionModalCard = this.page.locator('.TruckDotInspectionList__stuff');
        this.addAnnualDotButton = this.page.getByRole('button', { name: 'Add Annual DOT inspection', exact: true });
        this.invoiceNumber = this.page.locator('#invoice_number');
        this.amount = this.page.locator('#amount');
        this.state = this.page.locator('#state');
        this.city = this.page.locator('#city');
        this.shopInfo = this.page.locator('#shop_info');
        this.addRepairButton = this.page.getByRole('button', { name: 'Add repair', exact: true });
        this.repairCard = this.page.locator('.truck-repairs__stuff');
        this.isBrokenColumn = this.page.locator('tr td:nth-child(24) i');
        this.isDemagedColumn = this.page.locator('tr td:nth-child(25) i');
        this.totalDemageTitle = this.page.locator('.total_damaged');
        this.pencilIcon = this.page.locator('.mdi-pencil');
        this.documentIcon = this.page.locator('.mdi-file-document-multiple');
        this.uploadDocumentIcon = this.page.locator('.mdi.mdi-upload');
    }

    async selectCompanyFromMenu(companyMenu: Locator, optionFromMenu: Locator) {
        await this.selectFromMenu(companyMenu, optionFromMenu);
    }

    async enterTruckName(truckNumberFilter: Locator, number: string) {
        await this.fillInputField(truckNumberFilter, number);
    }

    async enterVinNumber(vinNumberField: Locator, number: string) {
        await this.fillInputField(vinNumberField, number);
    }

    async selectTruckInTrailerModal(driverkMenu: Locator, driver: string, option: Locator) {
        await this.fillAndSelectFromMenu(driverkMenu, driver, option);
    }

    async selectExpiringDateInPastMonth(): Promise<string> {
        await this.fromFieldModal.click();
        const dateText = await this.currentDate.textContent();
        const selectedDay = parseInt(dateText?.trim() || '1', 10);
        const prevMonthButton = this.page.locator('.v-date-picker-header .v-icon.notranslate.mdi.mdi-chevron-left');
        await prevMonthButton.click();
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - 1);
        pastDate.setDate(selectedDay);
        const dayToSelect = pastDate.getDate();
        const pastDateButton = this.page.locator(`.v-picker.v-card.v-picker--date .v-btn__content:has-text("${dayToSelect}")`);
        await pastDateButton.first().waitFor({ state: 'visible', timeout: 5000 });
        await pastDateButton.first().click();
        const formattedDate = `${(pastDate.getMonth() + 1).toString().padStart(2, '0')}/` +
            `${pastDate.getDate().toString().padStart(2, '0')}/` +
            `${pastDate.getFullYear()}`;
        return formattedDate;
    }

    async enterNoteInHistoryModal(note: Locator, text: string) {
        await this.fillInputField(note, text);
    }

    async selectOldState(oldState: Locator, optionFromMenu: Locator) {
        await this.page.waitForTimeout(1000);
        await oldState.waitFor({ state: 'visible', timeout: 3000 });
        await oldState.click();
        await this.page.waitForTimeout(1000);
        await optionFromMenu.click();
    }

    async selectNewState(newState: Locator, optionFromMenu: Locator) {
        await this.page.waitForTimeout(1000);
        await newState.waitFor({ state: 'visible', timeout: 3000 });
        await newState.click();
        await this.page.waitForTimeout(1000);
        await optionFromMenu.click();
    }

    async enterOliType(oliTypeField: Locator, oil: string) {
        await this.fillInputField(oliTypeField, oil);
    }

    async enterMillage(millageField: Locator, millage: string) {
        await this.fillInputField(millageField, millage);
    }

    async enterInvoiceNumber(invoiceNumberField: Locator, invoniceNumber: string) {
        await this.fillInputField(invoiceNumberField, invoniceNumber);
    }

    async enterAmount(amountField: Locator, amount: string) {
        await this.fillInputField(amountField, amount);
    }

    async enterState(stateField: Locator, state: string) {
        await this.fillInputField(stateField, state);
    }

    async enterCity(cityField: Locator, city: string) {
        await this.fillInputField(cityField, city);
    }

    async enterShopInfo(shopInfoField: Locator, info: string) {
        await this.fillInputField(shopInfoField, info);
    }
}