import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

// Wave A1 — edit modal lifecycle (5.1) + persisted change (5.4).
// Save verified to dispatch PUT /api/trailers/available/{id} (200) on staging.

test('Klik na pencil otvara edit modal sa pravim trailerom (test 5.1)', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await availableTrailerSetup.openEditModalForRow(availableTrailerData.number);

    await expect(availableTrailerSetup.editModal).toBeVisible({ timeout: 10000 });
    await expect(availableTrailerSetup.editModalTitle).toContainText('Edit Available Trailer');
    await expect(availableTrailerSetup.editModalTrailerNumberInput).toHaveValue(availableTrailerData.number);

    await availableTrailerSetup.editModalCancelButton.click();
    await availableTrailerSetup.editModal.waitFor({ state: 'detached', timeout: 10000 });
});

test('Korisnik moze da toggluje Towing polje preko edit modala i promena se persistira (test 5.4)', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);

    // Capture the initial Towing state so we can restore it.
    await availableTrailerSetup.openEditModalForRow(availableTrailerData.number);
    const initiallyChecked = await availableTrailerSetup.editModalTowingCheckbox.isChecked();

    // Vuetify v-checkbox toggle: click the v-input--checkbox wrapper, not the hidden input.
    const towingWrapper = availableTrailerSetup.editModal.locator('.v-input--checkbox').filter({ hasText: 'Towing' });
    await towingWrapper.click();
    await expect(availableTrailerSetup.editModalTowingCheckbox).toBeChecked({ checked: !initiallyChecked, timeout: 5000 });

    await availableTrailerSetup.editModalSaveButton.click();
    await availableTrailerSetup.editModal.waitFor({ state: 'detached', timeout: 10000 });

    // Verify persisted across reload: re-open the edit modal
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await availableTrailerSetup.openEditModalForRow(availableTrailerData.number);
    await expect(availableTrailerSetup.editModalTowingCheckbox).toBeChecked({ checked: !initiallyChecked, timeout: 10000 });

    // Restore to original
    await availableTrailerSetup.editModal.locator('.v-input--checkbox').filter({ hasText: 'Towing' }).click();
    await availableTrailerSetup.editModalSaveButton.click();
    await availableTrailerSetup.editModal.waitFor({ state: 'detached', timeout: 10000 });
});
