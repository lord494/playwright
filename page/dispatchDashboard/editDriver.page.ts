import { expect, Locator, Page } from "@playwright/test";
import { DispatchDashboardOverview } from "./dispatchDashboardOverview.page";
import { Constants } from "../../helpers/constants";

export class EditDriver {
    readonly page: Page;
    readonly driverName: Locator;
    readonly secondDrverName: Locator;
    readonly owner: Locator;
    readonly board: Locator;
    readonly dispatcher: Locator;
    readonly substituteDispatcher: Locator;
    readonly payroll: Locator;
    readonly trailerManager: Locator;
    readonly dissField: Locator;
    readonly diss2Field: Locator;
    readonly diss3Field: Locator;
    readonly diss4Field: Locator;
    readonly company: Locator;
    readonly phone: Locator;
    readonly ownerPhone: Locator;
    readonly truck: Locator;
    readonly trailer: Locator;
    readonly trailerType: Locator;
    readonly noteBox: Locator;
    readonly fcTogglebuttonOff: Locator;
    readonly fcTogglebuttonOn: Locator;
    readonly isPriorityToggleButton: Locator;
    readonly isNewToggleButton: Locator;
    readonly isCompanyToggleButton: Locator;
    readonly isTimeToggleButton: Locator;
    readonly isActiveCheckbox: Locator;
    readonly noCutCheckbox: Locator;
    readonly hassAnAppAccount: Locator;
    readonly showTrailerHistoryToggleButton: Locator;
    readonly saveButton: Locator;
    readonly ownerOption: Locator;
    readonly secondOwnerOption: Locator;
    readonly b1Board: Locator;
    readonly b2Board: Locator;
    readonly adminDispatcher: Locator;
    readonly testPassDispatcher: Locator;
    readonly adminSubstituteDispatcher: Locator;
    readonly secondSubstituteDsipatcher: Locator;
    readonly adminPayroll: Locator;
    readonly secondPayroll: Locator;
    readonly adminTrailerManager: Locator;
    readonly secondTrailerManager: Locator;
    readonly adminCompany: Locator;
    readonly secondCompany: Locator;
    readonly truckName: Locator;
    readonly secondTruckName: Locator;
    readonly trailerName: Locator;
    readonly secondTrailerName: Locator;
    readonly errorMessage: Locator;
    readonly invalidMessage: Locator;
    readonly trailerHistoryList: Locator;
    readonly pencilIconOnTrailerHistory: Locator;
    readonly confirmIconOnTrailerHistory: Locator;
    readonly noteTexbox: Locator;
    readonly firstHistoryTrailer: Locator;
    readonly firtsDeleteIconOnHistoryTrailer: Locator;
    readonly snackContent: Locator;
    readonly cancelButton: Locator;
    readonly editDriverTitle: Locator;
    readonly editDriverModal: Locator;
    readonly dispeckoDispatcherOption: Locator;

    constructor(page: Page) {
        this.page = page;
        this.driverName = page.locator('#name');
        this.secondDrverName = page.locator('#second_driver');
        this.owner = page.getByRole('textbox', { name: 'Owner', exact: true });
        this.board = page.getByRole('textbox', { name: 'Board' });
        this.dispatcher = page.getByRole('textbox', { name: 'Dispatcher', exact: true });
        this.substituteDispatcher = page.getByRole('textbox', { name: 'Substitute Dispatcher' });
        this.payroll = page.getByRole('textbox', { name: 'Payroll' });
        this.trailerManager = page.getByRole('textbox', { name: 'Trailer manager' });
        this.dissField = page.locator('#dispatcher_ext');
        this.diss2Field = page.locator('#dispatcher_ext_second');
        this.diss3Field = page.locator('#dispatcher_ext_third');
        this.diss4Field = page.locator('#dispatcher_ext_fourth');
        this.company = page.locator('#company');
        this.phone = page.locator('#phone');
        this.ownerPhone = page.locator('#owner_phone');
        this.truck = page.locator('#truck');
        this.trailer = page.locator('#trailer');
        this.trailerType = page.locator('#type_trailer');
        this.noteBox = page.locator('#note');
        this.fcTogglebuttonOff = page.getByText('FC OFF', { exact: true }).locator('..');
        this.fcTogglebuttonOn = page.getByText('FC ON', { exact: true }).locator('..');
        this.isPriorityToggleButton = page.getByText('Is priority', { exact: true });
        this.isNewToggleButton = page.getByText('Is new', { exact: true });
        this.isCompanyToggleButton = page.getByText('Is company', { exact: true });
        this.isTimeToggleButton = page.getByText('Is time', { exact: true });
        this.isActiveCheckbox = page.getByText('Is active', { exact: true });
        this.noCutCheckbox = page.getByText('NO CUT', { exact: true });
        this.hassAnAppAccount = page.getByText('Has an app account?', { exact: true });
        this.showTrailerHistoryToggleButton = page.getByText('Show trailer history', { exact: true });
        this.saveButton = page.locator('.v-btn__content', { hasText: 'Save' });
        this.ownerOption = page.getByRole('option', { name: 'ALZ Express Ohio LLC Third' });
        this.secondOwnerOption = page.getByRole('option', { name: 'Ace Trans Inc.' });
        this.b1Board = page.getByRole('option', { name: 'B1' });
        this.b2Board = page.getByRole('option', { name: 'B2' });
        this.adminDispatcher = page.getByRole('option', { name: 'Ray' });
        this.testPassDispatcher = page.getByRole('option', { name: 'Pex' });
        this.adminSubstituteDispatcher = page.getByRole('option', { name: 'QA Test' });
        this.dispeckoDispatcherOption = page.getByRole('option', { name: 'Dispecko' });
        this.secondSubstituteDsipatcher = page.getByRole('option', { name: 'Simonovic' });
        this.adminPayroll = page.getByRole('option', { name: 'Pejrol' });
        this.secondPayroll = page.getByRole('option', { name: 'PayrollTest' });
        this.adminTrailerManager = page.getByRole('option', { name: 'trailer manager' });
        this.secondTrailerManager = page.getByRole('option', { name: 'smeker2trailer' });
        this.adminCompany = page.getByRole('option', { name: 'TC7' });
        this.secondCompany = page.getByRole('option', { name: 'FY' });
        this.truckName = page.getByRole('option', { name: '11996' });
        this.secondTruckName = page.getByRole('option', { name: '4721' });
        this.trailerName = page.getByRole('option', { name: '118185' });
        this.secondTrailerName = page.getByRole('option', { name: '243648' });
        this.errorMessage = page.locator('.v-text-field__details .v-messages.error--text');
        this.invalidMessage = page.locator('.v-messages__message');
        this.trailerHistoryList = page.locator('.v-list.trailer-history');
        this.pencilIconOnTrailerHistory = page.locator('.v-icon--link.mdi.mdi-pencil');
        this.confirmIconOnTrailerHistory = page.locator('.mdi-checkbox-marked-circle');
        this.noteTexbox = page.locator('.history-wraper .v-text-field__slot');
        this.firstHistoryTrailer = page.locator(".bottom-history").first();
        this.firtsDeleteIconOnHistoryTrailer = page.locator('.v-icon--link.mdi.mdi-delete').first();
        this.snackContent = page.locator('.v-snack__content');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.editDriverTitle = page.locator('.v-card__title');
        this.editDriverModal = page.locator('.v-dialog.v-dialog--active');
    }

    async selectFromMenu(menu: Locator, optionFromMenu: Locator) {
        await menu.waitFor({ state: 'visible', timeout: 3000 });
        await menu.click();
        await this.page.waitForLoadState('networkidle');
        await optionFromMenu.click();
    }

    async fillInputField(locator: Locator, text: string): Promise<void> {
        await locator.click();
        await locator.clear();
        await locator.type(text, { delay: 30 });
    }

    async enterComment(locator: Locator, text: string, textbox: Locator, confirmIcon: Locator): Promise<void> {
        await locator.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await textbox.type(text, { delay: 30 });
        await confirmIcon.click();
    }

    async enterCommentWithCTRLandE(locator: Locator, text: string, textbox: Locator): Promise<void> {
        await locator.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await textbox.type(text, { delay: 30 });
        await this.page.keyboard.press('Control+Enter');
    }

    async fillAndSelectOption(locator: Locator, text: string, locator2: Locator): Promise<void> {
        await locator.click();
        await locator.clear();
        await locator.type(text, { delay: 30 });
        await locator2.waitFor({ state: 'visible', timeout: 3000 });
        await locator2.click();
    }

    async uncheck(toggleButton: Locator): Promise<void> {
        if (await toggleButton.isChecked()) {
            await toggleButton.click();
        }
    }

    async check(toggleButton: Locator): Promise<void> {
        const isChecked = await toggleButton.isChecked();
        if (!isChecked) {
            await toggleButton.click();
        }
    }

    async isCheckedFC(): Promise<void> {
        const isChecked = await this.fcTogglebuttonOff.isChecked();
        if (!isChecked) {
            await this.fcTogglebuttonOff.click();
        }
    }

    async unCheckFC(): Promise<void> {
        if (await this.fcTogglebuttonOff.isVisible()) {
            await this.fcTogglebuttonOff.click();
        }
    }

    async returnOnPreviousState(): Promise<void> {
        const dashboard = new DispatchDashboardOverview(this.page);
        const edit = new EditDriver(this.page);
        await this.page.goto(Constants.dashboardUrl);
        await this.page.waitForLoadState('networkidle');
        await dashboard.fillInputField(dashboard.nameSearchInput, Constants.secondDriverName);
        const imeZaPretragu = Constants.secondDriverName;
        await dashboard.driverNameColumn.locator(`text=${imeZaPretragu}`).waitFor({ state: 'visible' });
        const secondDriverName = await dashboard.driverNameColumn.first().textContent();
        expect(secondDriverName?.trim()).toContain(imeZaPretragu);
        const nameText = dashboard.driverNameColumn.filter({ hasText: Constants.secondDriverName });
        await nameText.waitFor({ state: 'visible', timeout: 5000 });
        await dashboard.driveNameColumn.first().click({ button: "right" });
        await this.driverName.waitFor({ state: 'visible', timeout: 3000 });
        await this.fillInputField(this.driverName, Constants.driverName);
        await this.fillInputField(this.secondDrverName, Constants.secondDriver);
        await this.selectFromMenu(this.owner, this.ownerOption);
        await this.selectFromMenu(this.board, this.b1Board);
        await this.page.waitForTimeout(1000);
        await this.selectFromMenu(this.dispatcher, this.adminDispatcher);
        await this.fillAndSelectOption(this.substituteDispatcher, Constants.dispatcherDispecko, this.dispeckoDispatcherOption);
        await this.selectFromMenu(this.payroll, this.adminPayroll);
        await this.selectFromMenu(this.trailerManager, this.adminTrailerManager);
        await this.fillInputField(this.dissField, Constants.diss);
        await this.fillInputField(this.diss2Field, Constants.diss);
        await this.fillInputField(this.diss3Field, Constants.diss);
        await this.fillInputField(this.diss4Field, Constants.diss);
        await this.selectFromMenu(this.company, this.adminCompany);
        await this.fillInputField(this.phone, Constants.adminPhone);
        await this.fillInputField(this.ownerPhone, Constants.ownerPhone);
        await this.fillAndSelectOption(this.truck, Constants.truckName, this.truckName);
        await this.fillAndSelectOption(this.trailer, Constants.trailerTest, this.trailerName);
        await this.fillInputField(this.trailerType, Constants.firstTrailerType);
        await this.fillInputField(this.noteBox, Constants.noteFirst);
        await this.unCheckFC();
        await this.uncheck(this.isPriorityToggleButton);
        await this.uncheck(this.isNewToggleButton);
        await this.uncheck(this.isCompanyToggleButton);
        await this.uncheck(this.isTimeToggleButton);
        await this.saveButton.click();
        await edit.editDriverModal.waitFor({ state: 'detached', timeout: 5000 });
    }
}