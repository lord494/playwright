import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { EditAndWriteReview } from '../../page/shop/editAndWriteReview.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await page.goto(Constants.shopUrl, { waitUntil: 'networkidle', timeout: 20_000 });
    await review.shopCard.first().click();
    await review.editShopButton.waitFor({ state: 'visible', timeout: 10000 });
});

test('Korisnik moze da otvori write review modal', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await review.writeReviewButton.click();
    await expect(review.activeDialogbox).toBeVisible();
});

test('Korisnik je po defaultu na public view-u', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await expect(review.publicIcon).toBeVisible();
});

test('Korisnik moze da se prebaci na private shop view', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await review.checkPrivateCheckbox();
    await expect(review.privateIcon).toBeVisible();
});

test('Korisnik moze da ostavi private review', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await review.writeReviewButton.click();
    await review.stars.first().waitFor({ state: 'visible', timeout: 10000 })
    await review.selectStars(review.stars.nth(3));
    await review.checkPrivateCheckboxInMOdal();
    await review.writeReview(review.reviewTextbox, Constants.noteFirst);
    await review.postViewButton.click();
    await expect(review.activeDialogbox).toBeVisible();
    await expect(review.activeDialogbox).toContainText(/Your Review.*Successfully posted/);
    await review.okButton.click();
    await review.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await review.checkPrivateCheckboxInMOdal();
    await expect(review.shopReviewCard).toContainText(Constants.noteFirst);
    await expect(review.shopReviewCard).toContainText(Constants.user);
    await expect(review.shopReviewCard.locator(review.activeStars)).toHaveCount(4);
});

test('Korisnik moze da ostavi pubilc review', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await review.writeReviewButton.click();
    await review.stars.first().waitFor({ state: 'visible', timeout: 10000 });
    await review.selectStars(review.stars.nth(3));
    await review.writeReview(review.reviewTextbox, Constants.noteFirst);
    await review.postViewButton.click();
    await expect(review.activeDialogbox).toBeVisible();
    await expect(review.activeDialogbox).toContainText(/Your Review.*Successfully posted/);
    await review.okButton.click();
    await review.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(review.shopReviewCard).toContainText(Constants.noteFirst);
    await expect(review.shopReviewCard).toContainText(Constants.user);
    await expect(review.shopReviewCard.locator(review.activeStars)).toHaveCount(4);
});

test('Review polje je obavezno', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await review.writeReviewButton.click();
    await review.stars.first().waitFor({ state: 'visible', timeout: 10000 });
    await review.selectStars(review.stars.nth(3));
    await review.postViewButton.click();
    await expect(review.snackMessage).toContainText('Form validation failed. Review not submitted.');
});

test('Ocjenjivanje shopa je obavezno', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await review.writeReviewButton.click();
    await review.writeReview(review.reviewTextbox, Constants.noteFirst);
    await review.postViewButton.click();
    await expect(review.errorMessage.last()).toContainText('The rating field is required');
    await expect(review.snackMessage).toContainText('Form validation failed. Review not submitted.');
});

test('Korisnik moze da edituje review', async ({ page }) => {
    const review = new EditAndWriteReview(page);
    await review.writeReviewButton.click();
    await review.stars.first().waitFor({ state: 'visible', timeout: 10000 });
    await review.selectStars(review.stars.nth(3));
    await review.writeReview(review.reviewTextbox, Constants.noteFirst);
    await review.postViewButton.click();
    await review.okButton.click();
    await review.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await review.editIcon.first().click();
    await review.activeDialogbox.locator(review.activeStars.first()).waitFor({ state: 'visible', timeout: 10000 });
    await review.selectStarsInEditReviewModal(review.activeDialogbox.locator(review.activeStars).nth(1));
    await review.reviewTextbox.click();
    await review.reviewTextbox.press('Control+A');
    await review.reviewTextbox.press('Backspace');
    await review.writeReview(review.reviewTextbox, Constants.noteSecond);
    await review.editReviewButton.click();
    await review.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(review.shopReviewCard).toContainText(Constants.user);
    await expect(review.shopReviewCard).toContainText(Constants.noteSecond);
    await expect(review.shopReviewCard.locator(review.activeStars)).toHaveCount(2);
});
