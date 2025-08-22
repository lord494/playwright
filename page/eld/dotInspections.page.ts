import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class DotInspectionsPage extends BasePage {
    readonly page: Page;
    readonly addDotInspections: Locator;
    readonly editIcon: Locator;
    readonly deleteIcon: Locator;
    readonly truckMenu: Locator;
    readonly truckOption: Locator;
    readonly timezoneMenu: Locator;
    readonly timeZoneMenuEdit: Locator;
    readonly centralTimezoneOption: Locator;
    readonly pacificTimeZone: Locator;
    readonly inspectionDate: Locator;
    readonly startTimeButton: Locator;
    readonly endTimeButton: Locator;
    readonly noteField: Locator;
    readonly originField: Locator;
    readonly destinationField: Locator;
    readonly locationField: Locator;
    readonly minutesInClockPicker: Locator;
    readonly addButtonInModal: Locator;
    readonly truckNumberColumn: Locator;
    readonly timeZoneColumn: Locator;
    readonly dotInspectionDate: Locator;
    readonly startTimeColumn: Locator;
    readonly endDateColumn: Locator;
    readonly originColumn: Locator;
    readonly destinationColumn: Locator;
    readonly locationColumn: Locator;
    readonly noteColumn: Locator;
    readonly dailogBox: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.addDotInspections = page.locator('.mdi-plus');
        this.editIcon = page.locator('.mdi-pencil');
        this.deleteIcon = page.locator('.mdi-delete');
        this.truckMenu = page.getByRole('textbox', { name: 'Truck*' });
        this.truckOption = page.getByRole('option').getByText('11996 - btest / secondDriver (ALZ Express Ohio LLC)');
        this.timezoneMenu = page.getByRole('textbox', { name: 'Select Timezone' });
        this.timeZoneMenuEdit = page.locator('.v-dialog--active .v-select__selection--comma');
        this.centralTimezoneOption = page.getByRole('option').getByText('Central');
        this.pacificTimeZone = page.getByRole('option').getByText('Pacific');
        this.inspectionDate = page.getByRole('button', { name: 'Inspection date' });
        this.startTimeButton = page.getByRole('button', { name: 'Start time' });
        this.endTimeButton = page.getByRole('button', { name: 'End time' });
        this.noteField = page.getByRole('textbox', { name: 'Note' });
        this.originField = page.getByRole('textbox', { name: 'Origin' });
        this.locationField = page.getByRole('textbox', { name: 'Location' });
        this.destinationField = page.getByRole('textbox', { name: 'Destination' });
        this.minutesInClockPicker = page.locator('.v-menu__content--fixed.menuable__content__active .v-time-picker-clock__item');
        this.addButtonInModal = page.getByRole('button', { name: 'Add' });
        this.truckNumberColumn = page.locator('tr td:nth-child(1)');
        this.timeZoneColumn = page.locator('tr td:nth-child(3)');
        this.dotInspectionDate = page.locator('tr td:nth-child(4)');
        this.startTimeColumn = page.locator('tr td:nth-child(5)');
        this.endDateColumn = page.locator('tr td:nth-child(6)');
        this.originColumn = page.locator('tr td:nth-child(7)');
        this.destinationColumn = page.locator('tr td:nth-child(8)');
        this.locationColumn = page.locator('tr td:nth-child(9)');
        this.noteColumn = page.locator('tr td:nth-child(11)');
        this.dailogBox = page.locator('.v-dialog--active');
    }

    async selectTruck(menu: Locator, truckNumber: string, truck: Locator): Promise<void> {
        await this.fillAndSelectFromMenu(menu, truckNumber, truck);
    }

    async selectTimezone(menu: Locator, zone: Locator): Promise<void> {
        await this.selectFromMenu(menu, zone);
    }
    async selectTime(menu: Locator, hour: Locator, minutes: Locator): Promise<void> {
        await menu.click();
        await hour.click();
        await minutes.click();
    }

    async enterNote(menu: Locator, note: string): Promise<void> {
        await this.fillInputField(menu, note);
    }

    async enterOrigin(menu: Locator, origin: string): Promise<void> {
        await this.fillInputField(menu, origin);
    }

    async enterDestination(menu: Locator, destination: string): Promise<void> {
        await this.fillInputField(menu, destination);
    }

    async enterLocation(menu: Locator, location: string): Promise<void> {
        await this.fillInputField(menu, location);
    }
}

