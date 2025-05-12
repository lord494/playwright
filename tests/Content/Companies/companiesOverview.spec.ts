import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { CompaniesPage } from '../../../page/Content/companies.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.companiesUrl);
});

test('10 rows per page je prikazano po defaultu', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await expect(companies.rowsPerPageDropdownMenu).toContainText('10');
});

test('Izaberi 15 rows per page', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await companies.selectRowsPerPage(companies.rowsPerPageDropdownMenu, companies.rows15PerPage);
    await expect(companies.rowsPerPageDropdownMenu).toContainText('15');
});

test('Izaberi 25 rows per page', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await companies.selectRowsPerPage(companies.rowsPerPageDropdownMenu, companies.rows25PerPage);
    await expect(companies.rowsPerPageDropdownMenu).toContainText('25');
});

test('Korisnik moze da otvori add user modal', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await companies.clickElement(companies.addCompany);
});

test('Korisnik moze da otvori edit user modal', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await companies.clickElement(companies.pencilIcon.first());
    await expect(companies.addModal).toBeVisible();
});

test('Korisnik moze da otvori upload modal', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await companies.clickElement(companies.uploadIcon.first());
    await expect(companies.insertPermitBookModal).toBeVisible();
});

test('Korisnik moze da otvori document modal', async ({ page }) => {
    const companies = new CompaniesPage(page);
    await companies.clickElement(companies.documentIcon.first());
    await expect(companies.documentModal).toBeVisible();
});

