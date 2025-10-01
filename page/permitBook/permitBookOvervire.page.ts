import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class PermitBookPage extends BasePage {
    readonly page: Page;


    constructor(page: Page) {
        super(page);
        this.page = page;

    }
}

