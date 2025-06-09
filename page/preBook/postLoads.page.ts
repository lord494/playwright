import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class PostLoadsPage extends BasePage {
    readonly page: Page;
    readonly loadIdSearchInputField: Locator;
    readonly idSearchInputField: Locator;
    readonly trailerTypeMenu: Locator;
    readonly originMenu: Locator;
    readonly destinationMenu: Locator;
    readonly dateMenu: Locator;
    readonly newLoadButton: Locator;
    readonly loadListRadiobutton: Locator;
    readonly bookedByMeRadiobutton: Locator;
    readonly postedByMeRadiobutton: Locator;
    readonly searchTrucksButton: Locator;
    readonly loadIdColumn: Locator;
    readonly originColumn: Locator;
    readonly destinationColumn: Locator;
    readonly weightColumn: Locator;
    readonly rateColumn: Locator;
    readonly companyColumn: Locator;
    readonly contactPersonColumn: Locator;
    readonly emailColumn: Locator;
    readonly phoneColumn: Locator;
    readonly suggestedRateColumn: Locator;
    readonly noteIcon: Locator;
    readonly pickUpColumn: Locator;
    readonly deliveryColumn: Locator;
    readonly dedicatedColumn: Locator;
    readonly trailerTypeColumn: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.loadIdSearchInputField = page.locator('xpath=//*[@id="inspire"]/div[1]/main/div/div/div/div[1]/div[1]/div[2]/div[1]/form/div/div[1]');
        this.idSearchInputField = page.getByRole('textbox', { name: 'ID', exact: true });
        this.trailerTypeMenu = page.getByRole('textbox', { name: 'Trailer type' });
        this.originMenu = page.getByRole('textbox', { name: 'Origin' });
        this.destinationMenu = page.getByRole('textbox', { name: 'Destination' });
        this.dateMenu = page.locator('.v-text-field--enclosed.date-time-range');
        this.newLoadButton = page.getByRole('button', { name: '+ New load' });
        this.loadListRadiobutton = page.getByText('Load list');
        this.bookedByMeRadiobutton = page.getByText('Booked by me');
        this.postedByMeRadiobutton = page.getByText('Posted by me');
        this.searchTrucksButton = page.getByRole('link', { name: 'Search Trucks' });
        this.loadIdColumn = page.locator('tr td:nth-child(1)');
        this.originColumn = page.locator('tr td:nth-child(5)');
        this.destinationColumn = page.locator('tr td:nth-child(7)');
        this.weightColumn = page.locator('tr td:nth-child(12)');
        this.rateColumn = page.locator('tr td:nth-child(13)');
        this.companyColumn = page.locator('tr td:nth-child(14)');
        this.contactPersonColumn = page.locator('tr td:nth-child(15)');
        this.emailColumn = page.locator('tr td:nth-child(16)');
        this.phoneColumn = page.locator('tr td:nth-child(17)');
        this.suggestedRateColumn = page.locator('tr td:nth-child(21)');
        this.noteIcon = page.locator('.mdi.mdi-comment-text-outline');
        this.pickUpColumn = page.locator('tr td:nth-child(3)');
        this.deliveryColumn = page.locator('tr td:nth-child(8)');
        this.dedicatedColumn = page.locator('tr td:nth-child(9) i');
        this.trailerTypeColumn = page.locator('tr td:nth-child(11)');
    }

    async enterLoadIdSearchInpu(loadIdField: Locator, loadId: string) {
        await this.fillInputField(loadIdField, loadId);
    }
}