import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

// Wave A1 — transfer modal happy path (6.1) + transfer roundtrip (6.2).

test('Klik na Transfer otvara modal sa naslovom koji sadrzi broj trailera (test 6.1)', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await availableTrailerSetup.openTransferModalForRow(availableTrailerData.number);

    await expect(availableTrailerSetup.transferModal).toBeVisible({ timeout: 10000 });
    await expect(availableTrailerSetup.transferModalTitle).toContainText('Transfer trailer ' + availableTrailerData.number);
    await expect(availableTrailerSetup.transferModalDestinationYard).toBeVisible({ timeout: 5000 });

    await availableTrailerSetup.cancelTransfer();
});

test('Korisnik moze da prebaci trailer u drugu yardu i nazad (test 6.2)', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);

    // 1) Read current yard from the edit modal
    await availableTrailerSetup.openEditModalForRow(availableTrailerData.number);
    const originalYard = await availableTrailerSetup.editModalYardField.inputValue();
    await availableTrailerSetup.editModalCancelButton.click();
    await availableTrailerSetup.editModal.waitFor({ state: 'detached', timeout: 10000 });

    // 2) Open Transfer modal and inspect the destination dropdown
    await availableTrailerSetup.openTransferModalForRow(availableTrailerData.number);
    await availableTrailerSetup.transferModalDestinationYard.click();
    const menu = availableTrailerSetup.page.locator('.v-menu__content.menuable__content__active');
    await menu.waitFor({ state: 'visible', timeout: 10000 });

    // Some trailers have no valid destinations (yard type / business rule constraints).
    // If so, skip the test — this is a real-data limitation, not a regression.
    const noData = menu.locator('.v-list-item', { hasText: 'No data available' });
    if (await noData.isVisible({ timeout: 1000 }).catch(() => false)) {
        await availableTrailerSetup.cancelTransfer();
        test.skip(true, `Trailer ${availableTrailerData.number} (yard "${originalYard}") has no valid transfer destinations on staging.`);
        return;
    }

    const firstYardOption = menu.locator('.v-list-item').first();
    const destinationYard = (await firstYardOption.textContent())?.trim() || '';
    expect(destinationYard).not.toEqual(originalYard);
    await firstYardOption.click();
    await availableTrailerSetup.transferModalTransferButton.click();
    await availableTrailerSetup.transferModal.waitFor({ state: 'detached', timeout: 10000 });

    // 3) Verify yard changed via edit modal
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    await availableTrailerSetup.openEditModalForRow(availableTrailerData.number);
    await expect(availableTrailerSetup.editModalYardField).toHaveValue(destinationYard, { timeout: 10000 });
    await availableTrailerSetup.editModalCancelButton.click();
    await availableTrailerSetup.editModal.waitFor({ state: 'detached', timeout: 10000 });

    // 4) Restore: transfer back to the original yard
    await availableTrailerSetup.openTransferModalForRow(availableTrailerData.number);
    await availableTrailerSetup.transferModalDestinationYard.click();
    await availableTrailerSetup.page.locator('.v-menu__content.menuable__content__active .v-list-item')
        .filter({ hasText: originalYard }).first()
        .click({ timeout: 10000 });
    await availableTrailerSetup.transferModalTransferButton.click();
    await availableTrailerSetup.transferModal.waitFor({ state: 'detached', timeout: 10000 });
});
