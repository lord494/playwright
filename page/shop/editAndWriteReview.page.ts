import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../helpers/base";

export class EditAndWriteReview extends BasePage {
    readonly page: Page;
    readonly writeReviewButton: Locator;
    readonly editShopButton: Locator;
    readonly shopCard: Locator;
    readonly stars: Locator;
    readonly activeStars: Locator;
    readonly activeDialogbox: Locator;
    readonly reviewTextbox: Locator;
    readonly publicCheckboxInModal: Locator;
    readonly publicCheckbox: Locator;
    readonly privateCheckbox: Locator;
    readonly postViewButton: Locator;
    readonly shopReviewCard: Locator;
    readonly okButton: Locator;
    readonly snackMessage: Locator;
    readonly errorMessage: Locator;
    readonly editIcon: Locator;
    readonly editReviewButton: Locator;
    readonly privateIcon: Locator;
    readonly publicIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.writeReviewButton = page.getByRole('button', { name: 'Write Review' });
        this.editShopButton = page.getByRole('button', { name: 'Edit Shop' });
        this.shopCard = page.locator('.shop-card');
        this.stars = page.locator('.v-dialog--active .mdi-star-outline');
        this.activeStars = page.locator('.mdi-star');
        this.activeDialogbox = page.locator('.v-dialog--active');
        this.reviewTextbox = page.locator('.v-dialog--active .v-text-field__slot');
        this.publicCheckboxInModal = page.getByRole('dialog').getByText('Public', { exact: true });
        this.publicCheckbox = page.getByText('Public', { exact: true });
        this.privateCheckbox = page.getByText('Private', { exact: true });
        this.postViewButton = page.locator('.v-btn__content').getByText('Post Review');
        this.shopReviewCard = page.locator('.shop-review').first();
        this.okButton = page.getByRole('button', { name: 'Ok' });
        this.snackMessage = page.locator('.v-snack__content');
        this.errorMessage = page.locator('.red--text');
        this.editIcon = page.locator('.mdi-square-edit-outline');
        this.editReviewButton = page.locator('.v-btn__content').getByText('Edit Review');
        this.privateIcon = page.locator('.mdi-eye-off');
        this.publicIcon = page.locator('.mdi-earth');
    }

    async checkPrivateCheckboxInMOdal(): Promise<void> {
        if (await this.publicCheckboxInModal.isVisible()) {
            await this.publicCheckboxInModal.click();
        }
    }

    async checkPrivateCheckbox(): Promise<void> {
        if (await this.publicCheckbox.isVisible()) {
            await this.publicCheckbox.click();
        }
    }

    async selectStars(star: Locator): Promise<void> {
        const box = await star.boundingBox();
        if (!box) throw new Error('Element boundingBox nije dostupan');
        const x = Math.max(1, Math.floor(box.width * 0.99));
        const y = Math.floor(box.height / 2);
        await star.click({ position: { x, y } });
    }

    async writeReview(field: Locator, review: string): Promise<void> {
        await this.fillInputField(field, review);
    }

    async selectStarsInEditReviewModal(star: Locator): Promise<void> {
        const box = await star.boundingBox();
        if (!box) throw new Error('Element boundingBox nije dostupan');
        const x = Math.max(1, Math.floor(box.width * 1.1));
        const y = Math.floor(box.height / 2);
        await star.click({ position: { x, y } });
    }
}