import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";
import { InsertPermitBookPage } from "../Content/uploadDocuments.page";
import { Constants } from "../../helpers/constants";
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
    readonly uploadedFileName: Locator;
    readonly permitBookSearchField: Locator;
    readonly truckSearchInput: Locator;
    readonly inputWithErrorState: Locator;
    readonly valueRequiredMessage: Locator;

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
        // Filename chip of the file picked in the upload/edit document modal.
        this.uploadedFileName = page.locator('.v-file-input__text');
        // /permit-book: the first text field is the search box.
        this.permitBookSearchField = page.locator('.v-text-field__slot').first();
        // /truck: the only plain text input on the page is the search box.
        this.truckSearchInput = page.locator('.v-text-field input');
        this.inputWithErrorState = page.locator('.v-input.v-input--has-state');
        this.valueRequiredMessage = page.getByText(Constants.valueRequiredMessage);
    }

    // /permit-book row whose Referrer column (3rd) contains `referrerName`.
    getPermitBookRowByReferrer(referrerName: string): Locator {
        return this.page.locator('tr', {
            has: this.page.locator('td:nth-child(3)', { hasText: referrerName })
        });
    }

    // Option of the currently open v-select / autocomplete menu, matched by exact name.
    getMenuOption(name: string): Locator {
        return this.page.getByRole('option', { name, exact: true });
    }

    async searchPermitBook(text: string): Promise<void> {
        await this.permitBookSearchField.click();
        await this.permitBookSearchField.type(text);
    }

    async openPermitBookDocumentPreview(referrerName: string): Promise<void> {
        await this.getPermitBookRowByReferrer(referrerName).locator('.mdi-eye').click();
    }

    async searchTruck(truckName: string): Promise<void> {
        await this.truckSearchInput.fill(truckName);
    }

    // Opens the document modal of the given /trailers row and waits for its permit-book list to
    // finish loading. Opening the modal triggers GET /api/permit-books; waiting for it (rather
    // than racing a fixed eyeIcon timeout) is what keeps these tests stable under 4-worker load.
    // Located by trailer number, never .first(): a trailer created by another worker can show
    // up on top of the table at any moment.
    async openTrailerDocuments(trailerNumber: string): Promise<void> {
        const row = this.page.locator('tbody tr', {
            has: this.page.locator('td:nth-child(2)', { hasText: trailerNumber })
        }).first();
        const docIcon = row.locator('.mdi-file-document-multiple');
        await docIcon.waitFor({ state: 'visible', timeout: 10000 });
        await Promise.all([
            this.page.waitForResponse(
                r => r.url().includes('/api/permit-books') && (r.status() === 200 || r.status() === 304),
                { timeout: 15000 }
            ).catch(() => { }),
            docIcon.click(),
        ]);
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
