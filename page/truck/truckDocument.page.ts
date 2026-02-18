import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import { InsertPermitBookPage } from "../Content/uploadDocuments.page";

export class TruckDocumentPage extends BasePage {
    readonly page: Page;
    readonly deleteIconsInDocumentModal: Locator;
    readonly confirmButton: Locator;
    readonly changeFileButton: Locator;
    readonly emptyLabelInModal: Locator;
    readonly nameColumn: Locator;
    readonly dateExpiringColumn: Locator;
    readonly statusColumn: Locator;
    readonly typeColumn: Locator;
    readonly subTypeColumn: Locator;
    readonly companyColumn: Locator;
    readonly eyeIcon: Locator;
    readonly qrCode: Locator;
    readonly pencilIcon: Locator;
    readonly titleInModal: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.deleteIconsInDocumentModal = this.page.locator('.v-dialog--active .v-icon--link.mdi.mdi-delete');
        this.confirmButton = this.page.locator('.v-btn__content', { hasText: 'Confirm' });
        this.changeFileButton = this.page.locator('.v-btn__content', { hasText: 'Change file' });
        this.emptyLabelInModal = this.page.locator('.v-data-table__empty-wrapper');
        this.nameColumn = this.page.locator('.v-dialog__content tr td:nth-child(1)');
        this.dateExpiringColumn = this.page.locator('.v-dialog__content tr td:nth-child(2)');
        this.statusColumn = this.page.locator('.v-dialog__content tr td:nth-child(3)');
        this.typeColumn = this.page.locator('.v-dialog__content tr td:nth-child(4)');
        this.subTypeColumn = this.page.locator('.v-dialog__content tr td:nth-child(5)');
        this.companyColumn = this.page.locator('.v-dialog__content tr td:nth-child(6)');
        this.eyeIcon = this.page.locator('.mdi-eye');
        this.qrCode = this.page.locator('.mdi-qrcode');
        this.pencilIcon = this.page.locator('.text-start .mdi-pencil');
        this.titleInModal = this.page.locator('.v-card__title.headline');
    }

    async deleteAllItemsWithDeleteIcon(): Promise<void> {
        const upload = new InsertPermitBookPage(this.page);
        await upload.loader.waitFor({ state: 'hidden', timeout: 5000 });
        const deleteIcons = this.deleteIconsInDocumentModal;
        let count = await deleteIcons.count();
        if (count === 0) {
            await this.page.mouse.click(10, 10);
            return;
        }
        while (count > 0) {
            const deleteIcon = deleteIcons.nth(0);
            await deleteIcon.click();
            await this.confirmButton.click();
            await this.page.waitForFunction(
                async (expectedCount) => {
                    const elements = document.querySelectorAll('.v-dialog--active .v-icon--link.mdi.mdi-delete');
                    return elements.length === expectedCount;
                },
                count - 1
            );
            await upload.loader.waitFor({ state: 'hidden', timeout: 5000 });
            let newCount = await deleteIcons.count();
            while (newCount === count) {
                await upload.loader.waitFor({ state: 'hidden', timeout: 10000 });
                newCount = await deleteIcons.count();
            }
            count = newCount;
        }
        await this.page.mouse.click(10, 10);
    }

    async uploadNewDocument(): Promise<void> {
        await this.changeFileButton.click();
        await this.page.setInputFiles('input[type="file"]', 'C:/Users/Korisnik/Desktop/Super Ego Holding/Screenshots/playwright.png');
        await this.page.waitForLoadState('networkidle');
    }

    async uploadDocumentOver10MB(): Promise<void> {
        await this.changeFileButton.click();
        await this.page.setInputFiles('input[type="file"]', 'C:/Users/Korisnik/Desktop/Super Ego Holding/Screenshots/11mb.pdf');
        await this.page.waitForLoadState('networkidle');
    }

    async deleteAllItemsWithDeleteIconForDrivers(): Promise<void> {
        const upload = new InsertPermitBookPage(this.page);
        await upload.loader.first().waitFor({ state: 'hidden', timeout: 5000 });
        const deleteIcons = this.deleteIconsInDocumentModal;
        let count = await deleteIcons.count();
        if (count === 0) {
            await this.page.mouse.click(10, 10);
            return;
        }
        while (count > 0) {
            const deleteIcon = deleteIcons.nth(0);
            await deleteIcon.click();
            await this.confirmButton.click();
            await this.page.waitForFunction(
                async (expectedCount) => {
                    const elements = document.querySelectorAll('.v-dialog--active .v-icon--link.mdi.mdi-delete');
                    return elements.length === expectedCount;
                },
                count - 1
            );
            await upload.loader.first().waitFor({ state: 'hidden', timeout: 5000 });
            let newCount = await deleteIcons.count();
            while (newCount === count) {
                await upload.loader.first().waitFor({ state: 'hidden', timeout: 10000 });
                await upload.loader.first().waitFor({ state: 'hidden', timeout: 10000 });
                newCount = await deleteIcons.count();
            }
            count = newCount;
        }
        await this.page.mouse.click(10, 10);
    }
}
