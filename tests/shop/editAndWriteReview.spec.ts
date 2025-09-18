import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da otvori write review modal', async ({ reviewPage }) => {
    await reviewPage.writeReviewButton.click();
    await expect(reviewPage.activeDialogbox).toBeVisible();
});

test('Korisnik je po defaultu na public view-u', async ({ reviewPage }) => {
    await expect(reviewPage.publicIcon).toBeVisible();
});

test('Korisnik moze da se prebaci na private shop view', async ({ reviewPage }) => {
    await reviewPage.checkPrivateCheckbox();
    await expect(reviewPage.privateIcon).toBeVisible();
});

test('Korisnik moze da ostavi private review', async ({ reviewPage }) => {
    await reviewPage.writeReviewButton.click();
    await reviewPage.stars.first().waitFor({ state: 'visible', timeout: 10000 })
    await reviewPage.selectStars(reviewPage.stars.nth(3));
    await reviewPage.checkPrivateCheckboxInMOdal();
    await reviewPage.writeReview(reviewPage.reviewTextbox, Constants.noteFirst);
    await reviewPage.postViewButton.click();
    await expect(reviewPage.activeDialogbox).toBeVisible();
    await expect(reviewPage.activeDialogbox).toContainText(/Your Review.*Successfully posted/);
    await reviewPage.okButton.click();
    await reviewPage.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await reviewPage.checkPrivateCheckboxInMOdal();
    await expect(reviewPage.shopReviewCard).toContainText(Constants.noteFirst);
    await expect(reviewPage.shopReviewCard).toContainText(Constants.user);
    await expect(reviewPage.shopReviewCard.locator(reviewPage.activeStars)).toHaveCount(4);
});

test('Korisnik moze da ostavi pubilc review', async ({ reviewPage }) => {
    await reviewPage.writeReviewButton.click();
    await reviewPage.stars.first().waitFor({ state: 'visible', timeout: 10000 });
    await reviewPage.selectStars(reviewPage.stars.nth(3));
    await reviewPage.writeReview(reviewPage.reviewTextbox, Constants.noteFirst);
    await reviewPage.postViewButton.click();
    await expect(reviewPage.activeDialogbox).toBeVisible();
    await expect(reviewPage.activeDialogbox).toContainText(/Your Review.*Successfully posted/);
    await reviewPage.okButton.click();
    await reviewPage.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(reviewPage.shopReviewCard).toContainText(Constants.noteFirst);
    await expect(reviewPage.shopReviewCard).toContainText(Constants.user);
    await expect(reviewPage.shopReviewCard.locator(reviewPage.activeStars)).toHaveCount(4);
});

test('Review polje je obavezno', async ({ reviewPage }) => {
    await reviewPage.writeReviewButton.click();
    await reviewPage.stars.first().waitFor({ state: 'visible', timeout: 10000 });
    await reviewPage.selectStars(reviewPage.stars.nth(3));
    await reviewPage.postViewButton.click();
    await expect(reviewPage.snackMessage).toContainText('Form validation failed. Review not submitted.');
});

test('Ocjenjivanje shopa je obavezno', async ({ reviewPage }) => {
    await reviewPage.writeReviewButton.click();
    await reviewPage.writeReview(reviewPage.reviewTextbox, Constants.noteFirst);
    await reviewPage.postViewButton.click();
    await expect(reviewPage.errorMessage.last()).toContainText('The rating field is required');
    await expect(reviewPage.snackMessage).toContainText('Form validation failed. Review not submitted.');
});

test('Korisnik moze da edituje review', async ({ reviewPage }) => {
    await reviewPage.writeReviewButton.click();
    await reviewPage.stars.first().waitFor({ state: 'visible', timeout: 10000 });
    await reviewPage.selectStars(reviewPage.stars.nth(3));
    await reviewPage.writeReview(reviewPage.reviewTextbox, Constants.noteFirst);
    await reviewPage.postViewButton.click();
    await reviewPage.okButton.click();
    await reviewPage.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await reviewPage.editIcon.first().click();
    await reviewPage.activeDialogbox.locator(reviewPage.activeStars.first()).waitFor({ state: 'visible', timeout: 10000 });
    await reviewPage.selectStarsInEditReviewModal(reviewPage.activeDialogbox.locator(reviewPage.activeStars).nth(1));
    await reviewPage.reviewTextbox.click();
    await reviewPage.reviewTextbox.press('Control+A');
    await reviewPage.reviewTextbox.press('Backspace');
    await reviewPage.writeReview(reviewPage.reviewTextbox, Constants.noteSecond);
    await reviewPage.editReviewButton.click();
    await reviewPage.activeDialogbox.waitFor({ state: 'hidden', timeout: 10000 });
    await expect(reviewPage.shopReviewCard).toContainText(Constants.user);
    await expect(reviewPage.shopReviewCard).toContainText(Constants.noteSecond);
    await expect(reviewPage.shopReviewCard.locator(reviewPage.activeStars)).toHaveCount(2);
});