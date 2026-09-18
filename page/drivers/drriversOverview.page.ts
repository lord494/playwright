import { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class DriverOverviewPage extends BasePage {
    readonly page: Page;
    readonly addDriverButton: Locator;
    readonly driversWithNoTruckOrTrailerFilter: Locator;
    readonly searchInputField: Locator;
    readonly employmentHistoryIcon: Locator;
    readonly pencilIcon: Locator;
    readonly deleteIcon: Locator;
    readonly driverNameColumn: Locator;
    readonly userColumn: Locator;
    readonly boardColumn: Locator;
    readonly trailerTypeColumn: Locator;
    readonly dispExtColumn: Locator;
    readonly companyColumn: Locator;
    readonly truckColumn: Locator;
    readonly truckColumnLinks: Locator;
    readonly trailerColumn: Locator;
    readonly phoneColumn: Locator;
    readonly lbColumn: Locator;
    readonly safetyColumn: Locator;
    readonly hasApp: Locator;
    readonly isActiveColumn: Locator;
    readonly drivertsWithNoTruckOption: Locator;
    readonly driversWithNoTrailerOption: Locator;
    readonly noDataAvailableLocator: Locator;
    readonly deleteIconInModal: Locator;
    readonly editIconInModal: Locator;
    readonly addEmploymentHistoryButton: Locator;
    readonly terminatedDate: Locator;
    readonly currentDataInModal: Locator;
    readonly addButtonInModal: Locator;
    readonly dialogbox: Locator;
    readonly historyList: Locator;
    readonly editButtonInModal: Locator;
    readonly noHistoryLocator: Locator;
    readonly snackMessage: Locator;
    readonly tableProgressBar: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addDriverButton = page.locator('.mdi.mdi-plus');
        this.driversWithNoTruckOrTrailerFilter = page.locator('//*[@id="inspire"]/div[1]/main/div/div/div/div[1]/div[1]/div[2]');
        this.searchInputField = page.locator('//*[@id="inspire"]/div[1]/main/div/div/div/div[1]/div[1]/div[3]');
        this.employmentHistoryIcon = page.locator('.mdi-history');
        this.pencilIcon = page.locator('.mdi-pencil');
        this.deleteIcon = page.locator('.mdi-delete');
        this.driverNameColumn = page.locator('tr td:nth-child(1)');
        this.userColumn = page.locator('tr td:nth-child(2)');
        this.boardColumn = page.locator('tr td:nth-child(3)');
        this.trailerTypeColumn = page.locator('tr td:nth-child(4)');
        this.dispExtColumn = page.locator('tr td:nth-child(5)');
        this.companyColumn = page.locator('tr td:nth-child(7)');
        this.truckColumn = page.locator('tr td:nth-child(8)');
        this.truckColumnLinks = this.truckColumn.locator('a.table-link');
        this.trailerColumn = page.locator('tr td:nth-child(9)');
        this.phoneColumn = page.locator('tr td:nth-child(10)');
        this.lbColumn = page.locator('tr td:nth-child(11)');
        this.safetyColumn = page.locator('tr td:nth-child(12)');
        this.hasApp = page.locator('tr td:nth-child(13)');
        this.isActiveColumn = page.locator('tr td:nth-child(13)');
        this.drivertsWithNoTruckOption = page.getByRole('option', { name: 'Drivers with no truck', exact: true });
        this.driversWithNoTrailerOption = page.getByRole('option', { name: 'Drivers with no trailer', exact: true });
        this.noDataAvailableLocator = page.locator('.v-data-table__empty-wrapper');
        this.deleteIconInModal = page.locator('.v-menu__content .mdi-delete');
        this.editIconInModal = page.locator('.v-menu__content .mdi-pencil');
        this.addEmploymentHistoryButton = page.getByRole('button', { name: 'Add Employment History', exact: true });
        this.terminatedDate = page.locator('.v-dialog__content--active .v-input__slot').last();
        this.currentDataInModal = page.locator('.v-btn.v-date-picker-table__current');
        this.addButtonInModal = page.getByRole('button', { name: 'Add', exact: true });
        this.dialogbox = page.locator('.v-dialog__content--active');
        this.historyList = page.locator('.EmploymentHistoriesList__item-content');
        this.editButtonInModal = page.getByRole('button', { name: 'Edit', exact: true });
        this.noHistoryLocator = page.locator('.no-history');
        this.snackMessage = page.locator('.v-snack__wrapper.v-sheet .v-snack__content');
        this.tableProgressBar = page.locator('.v-data-table__progress');
    }

    async waitForTableLoads(): Promise<void> {
        await this.tableProgressBar.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }
    async openFirstTruckFromTruckColumn(): Promise<string> {
        await this.waitForTableLoads();
        const firstTruckLink = this.truckColumnLinks.first();
        await firstTruckLink.waitFor({ state: 'visible', timeout: 10000 });
        const truckNumber = (await firstTruckLink.innerText()).trim();
        await firstTruckLink.click();
        return truckNumber;
    }

    private extractDriverName(cellText: string): string {
        return cellText.replace(/\(NEW\)/gi, '').split('/')[0].split('(')[0].replace(/\*/g, '').trim();
    }

    async getFirstDriverName(): Promise<string> {
        await this.waitForTableLoads();
        const firstNameCell = this.driverNameColumn.first();
        await firstNameCell.waitFor({ state: 'visible', timeout: 10000 });
        return this.extractDriverName(await firstNameCell.innerText());
    }

    async getDriverNameColumnValues(): Promise<string[]> {
        return (await this.driverNameColumn.allInnerTexts()).map(text => text.trim());
    }

    async searchDriverByName(name: string): Promise<Response> {
        await this.searchInputField.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Delete');
        const [response] = await Promise.all([
            this.page.waitForResponse(res =>
                res.url().includes('/api/drivers') &&
                new URL(res.url()).searchParams.get('search') === name,
                { timeout: 15000 }),
            this.page.keyboard.type(name, { delay: 30 }),
        ]);
        await this.waitForTableLoads();
        return response;
    }

    async selectOptionFromSearchMenu(menu: Locator, option: Locator): Promise<void> {
        await this.selectFromMenu(menu, option);
    }

    async enterDriverNameInSearchField(menu: Locator, name: string): Promise<void> {
        await this.fillInputField(menu, name);
    }

    async selectDateFromDatapicker(menu: Locator, date: Locator): Promise<void> {
        await this.selectFromMenu(menu, date);
    }
}
