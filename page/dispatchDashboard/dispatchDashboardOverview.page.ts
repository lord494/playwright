import { Locator, Page } from "@playwright/test";

export class DispatchDashboardOverview {
    readonly page: Page;
    readonly refreshIcon: Locator;
    readonly pdfIcon: Locator;
    readonly todayLabel: Locator;
    readonly dateLabel: Locator;
    readonly selectedDate: Locator;
    readonly todayDate: Locator;
    readonly monthOryearLabelInDatePicker: Locator;
    readonly yearInPastInDatePicker: Locator;
    readonly yearInFutureInDatePicker: Locator;
    readonly monthInDatePicker: Locator;
    readonly prevButton: Locator;
    readonly nextButton: Locator;
    readonly nameSearchInput: Locator;
    readonly truckSeachInput: Locator;
    readonly trailerSearchInput: Locator;
    readonly driveNameColumn: Locator;
    readonly truckNameColumn: Locator;
    readonly trailerNameColumn: Locator;
    readonly leftArrowInDatepicker: Locator;
    readonly rightArrowInDatepicker: Locator;
    readonly dateRange: Locator;
    readonly xIconInInputField: Locator;
    readonly driverNameColumn: Locator;
    readonly typeColumn: Locator;
    readonly extColumn: Locator;
    readonly tryTimeExtColumn: Locator;
    readonly rocketExtColumn: Locator;
    readonly jordanExt: Locator;
    readonly truckColumn: Locator;
    readonly trailerColumn: Locator;
    readonly phoneColumn: Locator;
    readonly payrollColumn: Locator;
    readonly boardColumn: Locator;
    readonly companyColumn: Locator;
    readonly noteIcon: Locator;
    readonly fcColumn: Locator;
    readonly loadColumn: Locator;
    readonly dedicatedIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.refreshIcon = page.locator(".mr-2.v-btn.v-btn--icon.v-btn--round").first();
        this.pdfIcon = page.locator(".mr-2.v-btn.v-btn--icon.v-btn--round").last();
        this.todayLabel = page.getByRole('button', { name: 'Today' });
        this.dateLabel = page.locator('.date-picker-text');
        this.selectedDate = page.locator('.v-btn--active.v-btn--rounded .v-btn__content')
        this.todayDate = page.locator('.v-btn.v-date-picker-table__current.v-btn--active.v-btn--text.v-btn--rounded .v-btn__content');
        this.monthOryearLabelInDatePicker = page.locator(".v-date-picker-header__value").first();
        this.yearInPastInDatePicker = page.locator(("//li[contains(text(), '2023')]"));
        this.yearInFutureInDatePicker = page.locator(("//li[contains(text(), '2030')]"));
        this.monthInDatePicker = page.getByRole('button', { name: 'Jan' });
        this.prevButton = page.locator('.v-icon--left.mdi-arrow-left');
        this.nextButton = page.locator('.v-icon--right.mdi-arrow-right');
        this.nameSearchInput = page.getByRole('textbox', { name: 'by name' });
        this.truckSeachInput = page.getByRole('textbox', { name: 'by truck' });
        this.trailerSearchInput = page.getByRole('textbox', { name: 'by trailer' });
        this.driveNameColumn = page.locator('#stay-table tr td:nth-child(2)');
        this.truckNameColumn = page.locator('#stay-table tr td:nth-child(8)');
        this.trailerNameColumn = page.locator('#stay-table tr td:nth-child(9)');
        this.leftArrowInDatepicker = page.locator('.mdi-chevron-left.theme--light');
        this.rightArrowInDatepicker = page.locator('.mdi-chevron-right.theme--light');
        this.dateRange = page.locator('.date-from-to.subtitle-2');
        this.xIconInInputField = page.locator('.v-input__icon--clear');
        this.driverNameColumn = page.locator('#stay-table tr td:nth-child(2) .driver-name');
        this.typeColumn = page.locator('#stay-table tr td:nth-child(3)');
        this.extColumn = page.locator('#stay-table tr td:nth-child(4)');
        this.tryTimeExtColumn = page.locator('#stay-table tr td:nth-child(5)');
        this.rocketExtColumn = page.locator('#stay-table tr td:nth-child(6)');
        this.jordanExt = page.locator('#stay-table tr td:nth-child(7)');
        this.truckColumn = page.locator('#stay-table tr td:nth-child(8)');
        this.trailerColumn = page.locator('#stay-table tr td:nth-child(9)');
        this.phoneColumn = page.locator('#stay-table tr td:nth-child(10)');
        this.fcColumn = page.locator('#stay-table tr td:nth-child(11)');
        this.payrollColumn = page.locator('#stay-table tr td:nth-child(13)');
        this.boardColumn = page.locator('#stay-table tr td:nth-child(15)');
        this.companyColumn = page.locator('#stay-table tr td:nth-child(1)');
        this.noteIcon = page.locator('.v-icon.note-icon');
        this.loadColumn = page.locator('.load-cell');
        this.dedicatedIcon = page.locator('.v-icon.notranslate.dedicated-icon');
    }

    async fillInputField(locator: Locator, text: string): Promise<void> {
        await locator.waitFor({ state: "visible" });
        await locator.fill(text);
        await this.page.waitForLoadState("networkidle");
    }

    async changeDate(): Promise<void> {
        await this.dateLabel.click();
        await this.page.click('.v-btn__content:text("13")');
    }

    async selectDateInPastAndBackOnToday(): Promise<void> {
        await this.dateLabel.click();
        await this.leftArrowInDatepicker.click({ clickCount: 3 });
        await this.page.click('.v-btn__content:text("13")');
        await this.page.waitForLoadState('networkidle');
        await this.todayLabel.click();
    }

    async selectDateInFutureAndBackOnToday(): Promise<void> {
        await this.dateLabel.click();
        await this.rightArrowInDatepicker.click({ clickCount: 3 });
        await this.page.click('.v-btn__content:text("13")');
        await this.page.waitForLoadState('networkidle');
        await this.todayLabel.click();
    }

    async selectYearInPast(): Promise<void> {
        await this.dateLabel.click();
        await this.monthOryearLabelInDatePicker.click();
        await this.dateLabel.click();
        await this.monthOryearLabelInDatePicker.click();
        await this.dateLabel.click();
        await this.yearInPastInDatePicker.click();
    }

    async selectYearInFuture(): Promise<void> {
        await this.dateLabel.click();
        await this.monthOryearLabelInDatePicker.click();
        await this.dateLabel.click();
        await this.monthOryearLabelInDatePicker.click();
        await this.dateLabel.click();
        await this.yearInFutureInDatePicker.click();
    }

    async selectDateInPast(): Promise<void> {
        await this.dateLabel.click();
        await this.monthOryearLabelInDatePicker.click();
        await this.dateLabel.click();
        await this.monthOryearLabelInDatePicker.click();
        await this.dateLabel.click();
        await this.yearInPastInDatePicker.click();
        await this.dateLabel.click();
        await this.monthInDatePicker.click();
        await this.dateLabel.click();
        await this.page.click('.v-btn__content:text("13")');
    }
}