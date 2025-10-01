import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtures';

test('10 rows per page je prikazano po defaultu', async ({ companiesPageSetup }) => {
    await expect(companiesPageSetup.rowsPerPageDropdownMenu).toContainText('10');
});

test('Izaberi 15 rows per page', async ({ companiesPageSetup }) => {
    await companiesPageSetup.selectRowsPerPage(companiesPageSetup.rowsPerPageDropdownMenu, companiesPageSetup.rows15PerPage);
    await expect(companiesPageSetup.rowsPerPageDropdownMenu).toContainText('15');
});

test('Izaberi 25 rows per page', async ({ companiesPageSetup }) => {
    await companiesPageSetup.selectRowsPerPage(companiesPageSetup.rowsPerPageDropdownMenu, companiesPageSetup.rows25PerPage);
    await expect(companiesPageSetup.rowsPerPageDropdownMenu).toContainText('25');
});

test('Korisnik moze da otvori add user modal', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.addCompany);
});

test('Korisnik moze da otvori edit user modal', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.pencilIcon.first());
    await expect(companiesPageSetup.addModal).toBeVisible();
});

test('Korisnik moze da otvori upload modal', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.uploadIcon.first());
    await expect(companiesPageSetup.insertPermitBookModal).toBeVisible();
});

test('Korisnik moze da otvori document modal', async ({ companiesPageSetup }) => {
    await companiesPageSetup.clickElement(companiesPageSetup.documentIcon.first());
    await expect(companiesPageSetup.documentModal).toBeVisible();
});
