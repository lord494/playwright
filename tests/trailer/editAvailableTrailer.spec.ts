import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

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
    await availableTrailerSetup.openEditModalForRow(availableTrailerData.number);
    const initiallyChecked = await availableTrailerSetup.editModalTowingCheckbox.isChecked();
    await availableTrailerSetup.editModalTowingToggle.click();
    await expect(availableTrailerSetup.editModalTowingCheckbox).toBeChecked({ checked: !initiallyChecked, timeout: 5000 });
    await availableTrailerSetup.saveEditModal();
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await availableTrailerSetup.openEditModalForRow(availableTrailerData.number);
    await expect(availableTrailerSetup.editModalTowingCheckbox).toBeChecked({ checked: !initiallyChecked, timeout: 10000 });
    await availableTrailerSetup.editModalTowingToggle.click();
    await availableTrailerSetup.saveEditModal();
});
