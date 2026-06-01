import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { cleanupOrphanSavedFilters } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da vidi leasing clients stranicu', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.expectOnUrl();
    await expect(leasingClientsOverview.newCompanyButton).toBeVisible();
    await expect(leasingClientsOverview.newOwnerOperatorButton).toBeVisible();
    await expect(leasingClientsOverview.exportButton).toBeVisible();
    await expect(leasingClientsOverview.nameHeader).toBeVisible();
    await expect(leasingClientsOverview.clientTypeHeader).toBeVisible();
    await expect(leasingClientsOverview.clientStatusHeader).toBeVisible();
    await expect(leasingClientsOverview.presidentsHeader).toBeVisible();
    await expect(leasingClientsOverview.trucksHeader).toBeVisible();
    await expect(leasingClientsOverview.trailersHeader).toBeVisible();
    await expect(leasingClientsOverview.truckTakenApprovedHeader).toBeVisible();
    await expect(leasingClientsOverview.trailerTakenApprovedHeader).toBeVisible();
});

test('Korisnik moze da pretrazuje klijente preko Search clients polja', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.searchClients(Constants.leasingClientsTestCompany);
    const names = await leasingClientsOverview.getNameColumnValues();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
        expect(name).toContain(Constants.leasingClientsTestCompany);
    }
});

test('Korisnik moze da prebaci tabelu na Active klijente', async ({ leasingClientsOverview }) => {
    // The Active radio expands to a family of statuses (Active, Active Debtor,
    // Active Lawsuit, Active Repo, Active No Communication, Approved).
    // selectActive() polls the column until it settles, so every visible status
    // must match one of the Active keyword stems.
    await leasingClientsOverview.selectActive();
    const statuses = await leasingClientsOverview.getClientStatusValues();
    expect(statuses.length).toBeGreaterThan(0);
    for (const status of statuses) {
        expect(
            Constants.leasingClientsActiveStatusKeywords.some(k => status.includes(k)),
            `Status "${status}" is not within the Active group`,
        ).toBe(true);
    }
});

test('Korisnik moze da prebaci tabelu na Inactive klijente', async ({ leasingClientsOverview }) => {
    // The Inactive radio expands to a family of statuses (Inactive + its
    // Debtor/Settled/Lawsuit/Repo/No-Communication variants, plus Decline,
    // Pending and Other).
    await leasingClientsOverview.selectInactive();
    const statuses = await leasingClientsOverview.getClientStatusValues();
    expect(statuses.length).toBeGreaterThan(0);
    for (const status of statuses) {
        expect(
            Constants.leasingClientsInactiveStatusKeywords.some(k => status.includes(k)),
            `Status "${status}" is not within the Inactive group`,
        ).toBe(true);
    }
});

test('Korisnik moze da vrati tabelu na All status', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.selectActive();
    const activeTotal = await leasingClientsOverview.getPaginationTotal();
    await leasingClientsOverview.selectAllStatus();
    await expect(leasingClientsOverview.allStatusRadio).toBeChecked();
    const allTotal = await leasingClientsOverview.getPaginationTotal();
    expect(allTotal).toBeGreaterThanOrEqual(activeTotal);
    const statuses = await leasingClientsOverview.getClientStatusValues();
    expect(statuses.length).toBeGreaterThan(0);
});

test('Korisnik moze da uključi Leasing Sales checkbox', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.toggleLeasingSales();
    await expect(leasingClientsOverview.leasingSalesChip).toContainText(Constants.leasingClientsCheckboxChipTrueValue);
});

test('Korisnik moze da uključi Recruiting checkbox', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.toggleRecruiting();
    await expect(leasingClientsOverview.recruitingChip).toContainText(Constants.leasingClientsCheckboxChipTrueValue);
});

test('Korisnik moze da uključi Maintenance checkbox', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.toggleMaintenance();
    await expect(leasingClientsOverview.maintenanceChip).toContainText(Constants.leasingClientsCheckboxChipTrueValue);
});

test('Korisnik moze da uključi Fuel checkbox', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.toggleFuel();
    await expect(leasingClientsOverview.fuelChip).toContainText(Constants.leasingClientsCheckboxChipTrueValue);
});

test('Korisnik moze da otvori New Company modal', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.openNewCompanyModal();
    await expect(leasingClientsOverview.activeDialog).toBeVisible();
});

test('Korisnik moze da otvori New Owner Operator modal', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.openNewOwnerOperatorModal();
    await expect(leasingClientsOverview.activeDialog).toBeVisible();
});

test('Korisnik moze da otvori Edit Client modal klikom na olovku', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.openEditClientModalForFirstRow();
    await expect(leasingClientsOverview.activeDialog).toBeVisible();
});

test('Korisnik moze da otvori delete potvrdu klikom na delete ikonu', async ({ leasingClientsOverview }) => {
    let dialogShown = false;
    leasingClientsOverview.page.once('dialog', async (dialog) => {
        dialogShown = true;
        await dialog.dismiss();
    });
    await leasingClientsOverview.deleteIcon.first().click();
    expect(dialogShown).toBeTruthy();
});

test('Korisnik moze da filtrira tabelu preko header filtera u Name koloni', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.filterByNameHeader(Constants.leasingClientsTestCompany);
    const names = await leasingClientsOverview.getNameColumnValues();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
        expect(name).toContain(Constants.leasingClientsTestCompany);
    }
});

test('Korisnik moze da otvori Saved Filters dialog klikom na filter-check fab', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.openSavedFiltersDialog();
    await expect(leasingClientsOverview.savedFiltersDialog).toBeVisible();
    await expect(leasingClientsOverview.savedFiltersDialog).toContainText(Constants.leasingClientsSavedFiltersDialogTitle);
});

test('Korisnik moze da promijeni broj redova po stranici', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.setRowsPerPage10();
    await expect(leasingClientsOverview.rowsPerPageDropdown).toContainText(Constants.leasingClientsRowsPerPage10);
});

test('Korisnik moze da pređe na sljedecu pa da se vrati na prethodnu stranicu', async ({ leasingClientsOverview }) => {
    // Assert on the page RANGE ("1-15"), not the full footer string. The full
    // string carries the global "of <total>" count, which other workers mutate
    // by creating/deleting clients — comparing it makes this navigation test
    // flaky under 4 workers. The range alone proves next→prev returned us to
    // the original page.
    const initial = await leasingClientsOverview.getPaginationRange();
    await leasingClientsOverview.goToNextPage();
    const next = await leasingClientsOverview.getPaginationRange();
    expect(next).not.toBe(initial);
    await leasingClientsOverview.goToPrevPage();
    const back = await leasingClientsOverview.getPaginationRange();
    expect(back).toBe(initial);
});

test('Korisnik moze da filtrira tabelu preko header filtera u Client type koloni', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.filterByClientType(false);
    const types = await leasingClientsOverview.getColumnValues(Constants.leasingClientsColumnClientType);
    expect(types.length).toBeGreaterThan(0);
    for (const t of types) {
        expect(t).toContain(Constants.leasingClientsClientTypeCompany);
    }
});

test('Korisnik moze da filtrira tabelu preko header filtera u Client status koloni', async ({ leasingClientsOverview }) => {
    await leasingClientsOverview.filterByClientStatus(Constants.leasingClientsStatusApproved);
    const statuses = await leasingClientsOverview.getColumnValues(Constants.leasingClientsColumnClientStatus);
    expect(statuses.length).toBeGreaterThan(0);
    for (const s of statuses) {
        expect(s).toContain(Constants.leasingClientsStatusApproved);
    }
});

test('Korisnik moze da sacuva filter, pronadje ga u Saved Filters modalu i ponovo ga primijeni klikom na cached ikonu', async ({ leasingClientsOverview, loggedPage }) => {
    // Purge PW_Test_* orphans from previous runs so the newly-saved filter
    // lands on page 1 of the (10-rows-per-page, server-paginated) dialog.
    await cleanupOrphanSavedFilters(loggedPage, Constants.leasingClientsSavedFiltersTableKey);

    const filterName = `PW_Test_${Date.now()}`;
    try {
        await leasingClientsOverview.filterByNameHeader(Constants.leasingClientsTestCompany);
        await leasingClientsOverview.saveCurrentFilter(filterName);

        // Reload so the saved-filters dialog fetches fresh data from the backend
        // rather than the in-memory cache populated when the page first loaded.
        await loggedPage.reload({ waitUntil: 'networkidle' });

        await leasingClientsOverview.openSavedFiltersDialog();
        await expect(leasingClientsOverview.getSavedFilterRow(filterName)).toBeVisible({ timeout: 10000 });
        await loggedPage.keyboard.press('Escape');

        await leasingClientsOverview.restoreSavedFilter(filterName);
        const names = await leasingClientsOverview.getNameColumnValues();
        expect(names.length).toBeGreaterThan(0);
        for (const name of names) {
            expect(name).toContain(Constants.leasingClientsTestCompany);
        }
    } finally {
        await leasingClientsOverview.deleteSavedFilter(filterName).catch(() => { });
    }
});
