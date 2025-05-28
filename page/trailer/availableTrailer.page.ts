import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class AvailableTrailersPage extends BasePage {
    readonly page: Page;
    readonly addButton: Locator;
    readonly exportButton: Locator;
    readonly statsButton: Locator;
    readonly orderIcon: Locator;
    readonly companyFilter: Locator;
    readonly statusFilter: Locator;
    readonly trailerNumberFilter: Locator;
    readonly driverNameFilter: Locator;
    readonly ownerFilter: Locator;
    readonly dealerShipFilter: Locator;
    readonly yardFilter: Locator;
    readonly testCompanyOption: Locator;
    readonly stolenStatusOption: Locator;
    readonly novaYardaOption: Locator;
    readonly trailerNameColumn: Locator;
    readonly trailerTypeColumn: Locator;
    readonly trailerMakeColumn: Locator;
    readonly trailerYearColumn: Locator;
    readonly vinNumberColumn: Locator;
    readonly companyNameColumn: Locator;
    readonly ownerNameColumn: Locator;
    readonly dealershipColumn: Locator;
    readonly yardColumn: Locator;
    readonly statusColumn: Locator;
    readonly driverNameColumn: Locator;
    readonly reloadIconInCompanyColumn: Locator;
    readonly reloadIconInPlateColumn: Locator;
    readonly reloadIconInTempPlateExp: Locator;
    readonly reloadIconInDotColumn: Locator;
    readonly truckColumn: Locator;
    readonly annualDotColumn: Locator;
    readonly repairsColumn: Locator;
    readonly infoColumn: Locator;
    readonly notesColumn: Locator;
    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly uploadIcon: Locator;
    readonly documentIcon: Locator;
    readonly trailerAndTruckHistoryModal: Locator;
    readonly historyModal: Locator;
    readonly annualDotInspectionModal: Locator;
    readonly repairsModal: Locator;
    readonly addRepairButton: Locator;
    readonly infoAndNoteModal: Locator;
    readonly deleteIconInTrailerModal: Locator;
    readonly addHistoryButton: Locator;
    readonly truckFieldInTrailerModal: Locator;
    readonly fromFieldModal: Locator;
    readonly toFieldModal: Locator;
    readonly truckOptionFromMenu: Locator;
    readonly currentDate: Locator;
    readonly okButton: Locator;
    readonly editTrailerButtonInTrailerHistory: Locator;
    readonly oldState: Locator;
    readonly newState: Locator;
    readonly dateOfChanged: Locator;
    readonly addHistoryButtonModal: Locator;
    readonly activeDialogbox: Locator;
    readonly changedCompanyTitle: Locator;
    readonly pencilIconInModal: Locator;
    readonly invoiceNumber: Locator;
    readonly amount: Locator;
    readonly state: Locator;
    readonly city: Locator;
    readonly shopInfo: Locator;
    readonly repairCard: Locator;
    readonly deleteIconInInfoAndNoteModal: Locator;
    readonly cancelButton: Locator;
    readonly commentInput: Locator;
    readonly commentPencilIcon: Locator;
    readonly editButton: Locator;
    readonly commentList: Locator;
    readonly addAnnualDotButton: Locator;
    readonly annualdotInspectionModalCard: Locator;
    readonly rentOrBuyColumn: Locator;
    readonly driverPhoneColumn: Locator;
    readonly plateColumn: Locator;
    readonly availabilityColumn: Locator;
    readonly thirdPartyColumn: Locator;
    readonly reloadIconInTruckColumn: Locator;
    readonly reloadIconOnRentBuyColumn: Locator;
    readonly reloadIconInPhoneColumn: Locator;
    readonly reloadIconInLocationColumn: Locator;
    readonly addButtonInModal: Locator;
    readonly snackbar: Locator;
    readonly allTrailersButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addButton = page.locator('.mdi.mdi-plus');
        this.exportButton = page.getByRole('button', { name: 'Export', exact: true });
        this.statsButton = page.locator('.v-btn__content', { hasText: 'Stats' });
        this.orderIcon = page.locator('.mdi-order-bool-ascending');
        this.companyFilter = page.locator('.v-input', { hasText: 'Company' }).locator('.v-input__control');
        this.statusFilter = page.locator('.v-input', { hasText: 'Status' }).locator('.v-input__control');
        this.trailerNumberFilter = page.locator('.v-text-field__slot').first();
        this.driverNameFilter = page.locator('.v-text-field__slot').nth(1);
        this.ownerFilter = page.locator('.v-text-field__slot').nth(2);
        this.dealerShipFilter = page.locator('.v-text-field__slot').nth(3);
        this.yardFilter = page.locator('.v-input', { hasText: 'Yard' }).locator('.v-input__control');
        this.testCompanyOption = page.getByRole('option', { name: 'testcompany', exact: true });
        this.stolenStatusOption = page.getByRole('option', { name: 'STOLEN', exact: true });
        this.novaYardaOption = page.getByRole('option', { name: 'Nova yarda', exact: true });
        this.trailerNameColumn = page.locator('tr td:nth-child(1)');
        this.trailerTypeColumn = page.locator('tr td:nth-child(10)');
        this.trailerMakeColumn = page.locator('tr td:nth-child(11)');
        this.trailerYearColumn = page.locator('tr td:nth-child(12)');
        this.vinNumberColumn = page.locator('tr td:nth-child(13)');
        this.companyNameColumn = page.locator('tr td:nth-child(7)');
        this.ownerNameColumn = page.locator('tr td:nth-child(9)');
        this.dealershipColumn = page.locator('tr td:nth-child(20)');
        this.yardColumn = page.locator('tr td:nth-child(21)');
        this.statusColumn = page.locator('tr td:nth-child(27)');
        this.driverNameColumn = page.locator('tr td:nth-child(2)');
        this.reloadIconInCompanyColumn = page.locator('tr td:nth-child(7) .v-icon--link.mdi-history');
        this.reloadIconInPlateColumn = page.locator('tr td:nth-child(14) .v-icon--link.mdi-history');
        this.reloadIconInTempPlateExp = page.locator('tr td:nth-child(15) .v-icon--link.mdi-history');
        this.reloadIconInDotColumn = page.locator('tr td:nth-child(20) .v-icon--link.mdi-history');
        this.truckColumn = page.locator('tr td:nth-child(5)');
        this.annualDotColumn = page.locator('tr td:nth-child(21)');
        this.repairsColumn = page.locator('tr td:nth-child(22)');
        this.infoColumn = page.locator('tr td:nth-child(31)');
        this.notesColumn = page.locator('tr td:nth-child(32)');
        this.pencilIcon = page.locator('.mdi.mdi-pencil');
        this.deleteIcon = page.locator('.mdi.mdi-delete');
        this.uploadIcon = page.locator('.mdi.mdi-upload');
        this.documentIcon = page.locator('.mdi-file-document-multiple');
        this.trailerAndTruckHistoryModal = page.locator('.history-wraper.small');
        this.historyModal = page.locator('.field-history-wraper');
        this.annualDotInspectionModal = page.locator('.TrailerDotInspectionList');
        this.repairsModal = page.locator('.trailer-repairs');
        this.addRepairButton = page.getByRole('button', { name: 'Add repair', exact: true });
        this.infoAndNoteModal = page.locator('.v-menu__content.theme--light.menuable__content__active');
        this.deleteIconInTrailerModal = page.locator('.history-wraper.small .mdi.mdi-delete');
        this.addHistoryButton = page.getByRole('button', { name: 'Add history', exact: true });
        this.addHistoryButtonModal = page.getByRole('button', { name: 'Add History', exact: true });
        this.truckFieldInTrailerModal = page.locator('.v-input', { hasText: 'Truck' }).locator('.v-input__control');
        this.fromFieldModal = page.locator('.v-input', { hasText: 'From' }).locator('.v-input__control');
        this.toFieldModal = page.locator('.v-input', { hasText: 'To' }).locator('.v-input__control');
        this.truckOptionFromMenu = page.getByRole('option', { name: '11996', exact: true });
        this.currentDate = page.locator('.v-btn.v-date-picker-table__current');
        this.okButton = page.getByRole('button', { name: 'OK', exact: true });
        this.editTrailerButtonInTrailerHistory = page.getByRole('button', { name: 'Edit Trailer', exact: true });
        this.oldState = page.locator('.v-card__text .v-input__slot').first();
        this.newState = page.locator('.v-card__text .v-input__slot').nth(1);
        this.dateOfChanged = page.locator('.v-input', { hasText: 'Date of Change' }).locator('.v-input__control');
        this.activeDialogbox = page.locator('.v-dialog--active');
        this.changedCompanyTitle = page.locator('.TrailerFieldHistory__change');
        this.pencilIconInModal = page.locator('.field-history-wraper .mdi.mdi-pencil');
        this.invoiceNumber = page.locator('#invoice_number');
        this.amount = page.locator('#amount');
        this.state = page.locator('#state');
        this.city = page.locator('#city');
        this.shopInfo = page.locator('#shop_info');
        this.repairCard = page.locator('.trailer-repairs__stuff');
        this.deleteIconInInfoAndNoteModal = page.locator('.comments-wrapper .mdi.mdi-delete');
        this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
        this.commentInput = page.locator('.comments-wrapper .v-input__slot');
        this.commentPencilIcon = page.locator('.comments-wrapper .mdi.mdi-pencil');
        this.editButton = page.getByRole('button', { name: 'Edit', exact: true });
        this.commentList = page.locator('.comments-wrapper .v-list-item');
        this.addAnnualDotButton = page.getByRole('button', { name: 'Add Annual DOT inspection', exact: true });
        this.annualdotInspectionModalCard = page.locator('.TrailerDotInspectionList__stuff');
        this.rentOrBuyColumn = page.locator('tr td:nth-child(4)');
        this.driverPhoneColumn = page.locator('tr td:nth-child(6)');
        this.plateColumn = page.locator('tr td:nth-child(14)');
        this.availabilityColumn = page.locator('tr td:nth-child(26)');
        this.thirdPartyColumn = page.locator('tr td:nth-child(3)');
        this.reloadIconInTruckColumn = page.locator('tr td:nth-child(5) .v-icon--link.mdi-history');
        this.reloadIconOnRentBuyColumn = page.locator('tr td:nth-child(4) .v-icon--link.mdi-history');
        this.reloadIconInPhoneColumn = page.locator('tr td:nth-child(6) .v-icon--link.mdi-history');
        this.reloadIconInLocationColumn = page.locator('tr td:nth-child(21) .v-icon--link.mdi-history');
        this.snackbar = page.locator('.v-snack__content');
        this.addButtonInModal = page.getByRole('button', { name: 'Add', exact: true });
        this.allTrailersButton = page.locator('.v-btn__content', { hasText: 'All Trailers' });
    }

    async selectCompanyFromMenu(companyMenu: Locator, optionFromCompanyMenu: Locator) {
        await this.selectFromMenu(companyMenu, optionFromCompanyMenu);
    }

    async selectStatusFromStatusMenu(statusMenu: Locator, optionFromStatusMenu: Locator) {
        await this.selectFromMenu(statusMenu, optionFromStatusMenu);
    }

    async selectYardFromStatusMenu(yardMenu: Locator, optionFromYardMenu: Locator) {
        await this.selectFromMenu(yardMenu, optionFromYardMenu);
    }

    async enterTrailerName(trailerNumberFilter: Locator, number: string) {
        await this.fillInputField(trailerNumberFilter, number);
    }

    async enterDriverName(driverNameFilter: Locator, name: string) {
        await this.fillInputField(driverNameFilter, name);
    }

    async enterOwnerrName(ownerNameFilter: Locator, name: string) {
        await this.fillInputField(ownerNameFilter, name);
    }

    async enterDealershiprName(dealershipNameFilter: Locator, name: string) {
        await this.fillInputField(dealershipNameFilter, name);
    }

    async selectTruckInTrailerModal(truckMenu: Locator, truckNumber: string, option: Locator) {
        await this.fillAndSelectFromMenu(truckMenu, truckNumber, option);
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

    async enterOldState(oldState: Locator, text: string) {
        await this.fillInputField(oldState, text);
    }

    async enterNewState(newState: Locator, text: string) {
        await this.fillInputField(newState, text);
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

    async enterNoteInInfoAndNoteModal(note: string) {
        await this.fillInputField(this.commentInput, note);
    }
}
