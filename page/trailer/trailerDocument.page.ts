import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import { InsertPermitBookPage } from "../Content/uploadDocuments.page";
import path from 'path';


export class TrailerDocumentPage extends BasePage {
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
        this.deleteIconsInDocumentModal = page.locator('.v-dialog--active .v-icon--link.mdi.mdi-delete');
        this.confirmButton = page.locator('.v-btn__content', { hasText: 'Confirm' });
        this.changeFileButton = page.locator('.v-btn__content', { hasText: 'Change file' });
        this.emptyLabelInModal = page.locator('.v-data-table__empty-wrapper');
        this.nameColumn = page.locator('.v-dialog__content tr td:nth-child(1)');
        this.dateExpiringColumn = page.locator('.v-dialog__content tr td:nth-child(2)');
        this.statusColumn = page.locator('.v-dialog__content tr td:nth-child(3)');
        this.typeColumn = page.locator('.v-dialog__content tr td:nth-child(4)');
        this.subTypeColumn = page.locator('.v-dialog__content tr td:nth-child(5)');
        this.companyColumn = page.locator('.v-dialog__content tr td:nth-child(6)');
        this.eyeIcon = page.locator('.mdi-eye');
        this.qrCode = page.locator('.mdi-qrcode');
        this.pencilIcon = page.locator('.text-start .mdi-pencil');
        this.titleInModal = page.locator('.v-card__title.headline')
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
        await this.page.setInputFiles('input[type="file"]', require('path').resolve(__dirname, '../../helpers/sc/playwright.png'));
        await this.page.waitForLoadState('networkidle');
    }

    async uploadDocumentOver10MB(): Promise<void> {
        await this.changeFileButton.click();
        await this.page.setInputFiles('input[type="file"]', path.resolve(__dirname, '../../helpers/sc/11mb.pdf'));
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
