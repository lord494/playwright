import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

test('Trailer dodat na /trailers se pojavljuje u Add Available Trailer autocomplete-u', async ({ availableTrailerWithUiCreatedTrailer }) => {
    await availableTrailerWithUiCreatedTrailer.page.locator('button.v-btn.primary.v-size--small:has(i.mdi-plus)').first().click();
    await expect(availableTrailerWithUiCreatedTrailer.addAvailableModal).toBeVisible({ timeout: 10000 });

    await availableTrailerWithUiCreatedTrailer.addAvailableTrailerNumberField.click();
    await availableTrailerWithUiCreatedTrailer.addAvailableTrailerNumberField.type(availableTrailerWithUiCreatedTrailer.trailerNumber, { delay: 30 });

    const optionsMenu = availableTrailerWithUiCreatedTrailer.page.locator('.v-menu__content.menuable__content__active');
    await expect(optionsMenu.locator('.v-list-item', { hasText: availableTrailerWithUiCreatedTrailer.trailerNumber }).first()).toBeVisible({ timeout: 15000 });

    await availableTrailerWithUiCreatedTrailer.addAvailableCancelButton.click();
    await availableTrailerWithUiCreatedTrailer.addAvailableModal.waitFor({ state: 'detached', timeout: 10000 });
});
