import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

// Wave A1 — page load, layout, Actions column, top buttons, global search.

test('Korisnik moze da otvori Available Trailers stranicu', async ({ availableTrailerSetup }) => {
    await expect(availableTrailerSetup.page).toHaveURL(/available-trailers/);
    await expect(availableTrailerSetup.globalSearchInput).toBeVisible({ timeout: 10000 });
});

test('Korisnik vidi sve glavne dugmice (Trailers link, Stats link, Export All, globalno search polje)', async ({ availableTrailerSetup }) => {
    await expect(availableTrailerSetup.allTrailersLink).toBeVisible({ timeout: 10000 });
    await expect(availableTrailerSetup.statsLink).toBeVisible({ timeout: 10000 });
    await expect(availableTrailerSetup.exportAllButton).toBeVisible({ timeout: 10000 });
    await expect(availableTrailerSetup.globalSearchInput).toBeVisible({ timeout: 10000 });
});

test('Korisnik vidi glavne kolone tabele', async ({ availableTrailerSetup }) => {
    // Header-text based assertions are stable across column-position reshuffles.
    const headers = ['Trailer *', 'Type', 'Year', 'Driver/Third party', 'Truck', 'Availability', 'Status', 'Brokerage', 'Actions'];
    for (const header of headers) {
        await expect(availableTrailerSetup.page.locator('thead th', { hasText: header }).first()).toBeVisible({ timeout: 10000 });
    }
});

test('Tabela ucitava redove bez progressbar-a', async ({ availableTrailerSetup }) => {
    await expect(availableTrailerSetup.progressBar).toBeHidden({ timeout: 10000 });
});

test('Actions kolona prikazuje pencil, transfer i minus ikone na svakom redu', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    const row = availableTrailerSetup.getRowByTrailerNumber(availableTrailerData.number).first();
    await expect(row.locator('button.mdi-pencil')).toBeVisible({ timeout: 10000 });
    await expect(row.locator('button.mdi-transfer')).toBeVisible({ timeout: 10000 });
    await expect(row.locator('button.mdi-minus-box-outline')).toBeVisible({ timeout: 10000 });
});

test('Korisnik moze da pretrazuje trailer po broju trailera preko globalnog search-a', async ({ availableTrailerSetup, availableTrailerData }) => {
    await availableTrailerSetup.searchTrailer(availableTrailerData.number);
    // Every visible row's trailer-number column must contain the searched value.
    const count = await availableTrailerSetup.page.locator('tbody tr').count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
        const text = (await availableTrailerSetup.page.locator('tbody tr').nth(i).locator('td:nth-child(1)').textContent())?.trim() ?? '';
        expect(text).toContain(availableTrailerData.number);
    }
});
