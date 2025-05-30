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
        this.addTruckButton = page.getByRole("button", { name: "Add" });
        this.addTruckOilChangeHistoruButton = page.locator('.v-btn__content').filter({ hasText: 'Add Trucks Oil Change History' });
        this.statsButton = page.locator('.v-btn__content').filter({ hasText: 'Stats' });
        this.editButton = page.locator('.v-btn__content').filter({ hasText: 'Edit' });
        this.exportButton = page.getByRole("button", { name: "Export" });
        this.availableTrucksButton = page.locator('.v-btn__content').filter({ hasText: 'Available Trucks' });
        this.inCompanyRadiobutton = page.getByRole("radio", { name: "In company", exact: true });
        this.allTrucksRadiobutton = page.getByRole("radio", { name: "All", exact: true });
        this.thirpartyradiobutton = page.getByRole("radio", { name: "Third Party", exact: true });
        this.inactiveTrucksRadiobutton = page.getByRole("radio", { name: "Inactive trucks", exact: true });
        this.deletedRadiobutton = page.getByRole("radio", { name: "Deleted", exact: true });
        this.deleteAllFilterButton = page.locator('.v-btn--round.theme--light.v-size--x-small.red .mdi-close.theme--light');
        this.truckColumn = page.locator('tr td:nth-child(2)');
        this.driverColumn = page.locator('tr td:nth-child(3)');
        this.infoColumn = page.locator('tr td:nth-child(4)');
        this.phoneColumn = page.locator('tr td:nth-child(5)');
        this.noteColumn = page.locator('tr td:nth-child(6)');
        this.divisionColumn = page.locator('tr td:nth-child(7)');
        this.makeColumn = page.locator('tr td:nth-child(10)');
        this.modelColumn = page.locator('tr td:nth-child(11)');
        this.colorColumn = page.locator('tr td:nth-child(12)');
        this.yearColumn = page.locator('tr td:nth-child(13)');
        this.vinColumn = page.locator('tr td:nth-child(14)');
        this.plateColumn = page.locator('tr td:nth-child(15)');
        this.engineColumn = page.locator('tr td:nth-child(16)');
        this.transsmissionColumn = page.locator('tr td:nth-child(17)');
        this.mileageColumn = page.locator('tr td:nth-child(18)');
        this.oliChangeColumn = page.locator('tr td:nth-child(19)');
        this.annualDotColumn = page.locator('tr td:nth-child(22)');
        this.repairColumn = page.locator('tr td:nth-child(23)');
        this.searchInput = page.locator('.v-text-field__slot').first();
        this.companyMenu = page.getByRole('button', { name: 'Company' });
        this.testCompanyOption = page.getByRole('option', { name: 'testcompany', exact: true });
        this.rocketCompanyOption = page.getByRole('option', { name: 'Rocket', exact: true });
        this.vinNumberField = page.locator('.v-text-field__slot').last();
        this.filterRadiobutton = page.locator('.TableFilters__fields > div:nth-child(4)');
        this.addHistoryButton = page.getByRole('button', { name: 'Add history', exact: true });
        this.driverField = page.getByRole('textbox', { name: 'Driver', exact: true });
        this.driverOptionFromMenu = page.getByRole('option', { name: 'btest / secondDriver (ALZ Express Ohio LLC)', exact: true });
        this.fromFieldModal = page.getByRole('dialog').locator('div').filter({ hasText: /^From$/ }).nth(1);
        this.currentDate = page.locator('.v-btn.v-date-picker-table__current').first();
        this.toFieldModal = page.locator('.v-input', { hasText: 'To' }).locator('.v-input__control');
        this.addButton = page.getByRole('button', { name: 'Add', exact: true });
        this.dialogBox = page.locator('.v-dialog.v-dialog--active.v-dialog--persistent');
        this.histryList = page.locator('.v-list-item__subtitle.history-text');
        this.pencilIconInHistoryModal = page.locator('.history-actions .mdi-pencil');
        this.noteInHistoryModal = page.getByRole('textbox', { name: 'Note', exact: true });
        this.deleteIconInHistoryModal = page.locator('.history-wraper.small .mdi.mdi-delete');
        this.snackMessage = page.locator('.v-snack__wrapper');
        this.oldState = page.locator('.v-select__slot').first();
        this.newState = page.locator('.v-select__slot').nth(1);
        this.dateOfChanged = page.locator('.v-input', { hasText: 'Date' }).locator('.v-input__control');
        this.companyHistoryList = page.locator('.v-list-item__content.TruckHistory__content');
        this.pencilIconInCompanyHistoryModal = page.locator('.TruckHistory__content .mdi-pencil');
        this.deleteIconInCompanyHistoryModal = page.locator('.TruckHistory__content .mdi-delete');
        this.olyTypeField = page.locator('#oilType');
        this.millageField = page.locator('#millage');
        this.truckOilList = page.locator('.OilChangeHistory__content');
        this.pencilIconInTruckOilList = page.locator('.OilChangeHistory__actions .mdi-pencil');
        this.deleteIconInTruckOilList = page.locator('.OilChangeHistory__actions .mdi-delete');
        this.annualdotInspectionModalCard = page.locator('.TruckDotInspectionList__stuff');
        this.addAnnualDotButton = page.getByRole('button', { name: 'Add Annual DOT inspection', exact: true });
        this.invoiceNumber = page.locator('#invoice_number');
        this.amount = page.locator('#amount');
        this.state = page.locator('#state');
        this.city = page.locator('#city');
        this.shopInfo = page.locator('#shop_info');
        this.addRepairButton = page.getByRole('button', { name: 'Add repair', exact: true });
        this.repairCard = page.locator('.truck-repairs__stuff');
        this.isBrokenColumn = page.locator('tr td:nth-child(24) i');
        this.isDemagedColumn = page.locator('tr td:nth-child(25) i');
        this.totalDemageTitle = page.locator('.total_damaged');
        this.pencilIcon = page.locator('.mdi-pencil');
        this.documentIcon = page.locator('.mdi-file-document-multiple');
        this.uploadDocumentIcon = page.locator('.mdi.mdi-upload');
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
        await this.selectFromMenu(oldState, optionFromMenu);
    }

    async selectNewState(newState: Locator, optionFromMenu: Locator) {
        await this.selectFromMenu(newState, optionFromMenu);
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