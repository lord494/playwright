import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { safeDeleteLeasingClient, uniqueCompanyName } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test.describe('New Company modal', () => {
    let createdCompanyName: string | null = null;

    test.afterEach(async ({ loggedPage }) => {
        if (createdCompanyName) {
            await safeDeleteLeasingClient(loggedPage, createdCompanyName);
            createdCompanyName = null;
        }
    });

    test('Korisnik moze da otvori New Company modal', async ({ openNewCompanyModal }) => {
        await expect(openNewCompanyModal.title).toBeVisible();
        await expect(openNewCompanyModal.saveButton).toBeVisible();
        await expect(openNewCompanyModal.cancelButton).toBeVisible();
    });

    test('Korisnik moze da zatvori New Company modal preko Cancel dugmeta', async ({ openNewCompanyModal }) => {
        await openNewCompanyModal.cancel();
        await expect(openNewCompanyModal.dialog).toBeHidden();
    });

    test('Korisnik moze da vidi sva polja u modalu', async ({ openNewCompanyModal }) => {
        await expect(openNewCompanyModal.nameInput).toBeVisible();
        await expect(openNewCompanyModal.mcInput).toBeVisible();
        await expect(openNewCompanyModal.dotInput).toBeVisible();
        await expect(openNewCompanyModal.addressInput).toBeVisible();
        await expect(openNewCompanyModal.cityInput).toBeVisible();
        await expect(openNewCompanyModal.stateInput).toBeVisible();
        await expect(openNewCompanyModal.zipInput).toBeVisible();
        await expect(openNewCompanyModal.feinInput).toBeVisible();
        await expect(openNewCompanyModal.sisterCompanyWrapper).toBeVisible();
        await expect(openNewCompanyModal.riskLevelWrapper).toBeVisible();
        await expect(openNewCompanyModal.cooperationStartDateInput).toBeVisible();
        await expect(openNewCompanyModal.leasingAndSalesCheckbox).toBeVisible();
        await expect(openNewCompanyModal.regrutingCheckbox).toBeVisible();
        await expect(openNewCompanyModal.maintenanceCheckbox).toBeVisible();
        await expect(openNewCompanyModal.fuelCheckbox).toBeVisible();
        await expect(openNewCompanyModal.addPresidentButton).toBeVisible();
        await expect(openNewCompanyModal.contactNameInput).toBeVisible();
        await expect(openNewCompanyModal.contactEmailInput).toBeVisible();
        await expect(openNewCompanyModal.contactPhoneInput).toBeVisible();
        await expect(openNewCompanyModal.addContactButton).toBeVisible();
        await expect(openNewCompanyModal.noteTextarea).toBeVisible();
        await expect(openNewCompanyModal.addCommentButton).toBeVisible();
    });

    test('Korisnik vidi validaciju kada pokusa da sacuva bez Name polja', async ({ openNewCompanyModal }) => {
        await openNewCompanyModal.save();
        await openNewCompanyModal.expectValidationMessage(Constants.newCompanyValidationNameRequired);
        await expect(openNewCompanyModal.dialog).toBeVisible();
    });

    test('Korisnik moze da kreira kompaniju samo sa obaveznim Name poljem', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });
        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
    });

    test('Korisnik moze da kreira kompaniju sa svim Company information poljima', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;

        await openNewCompanyModal.createCompany({
            info: {
                name,
                mc: '123456',
                dot: '7891011',
                address: '123 Test St',
                city: 'Belgrade',
                state: 'RS',
                zip: '11000',
                fein: '11-2233445',
                riskLevel: Constants.newCompanyRiskLevelA,
                isMuslim: false,
            },
            cooperation: {
                leasingAndSales: true,
                regruting: true,
                maintenance: true,
                fuel: true,
            },
            note: 'Created by Playwright automation',
        });

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
        await expect(row).toContainText(Constants.newCompanyDefaultStatus);
        await expect(row).toContainText(Constants.leasingClientsClientTypeCompany);
    });

    test('Korisnik moze da kreira kompaniju sa President informacijama', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        const presidentFirst = `Pera${Date.now()}`;
        const presidentLast = 'Peric';

        await openNewCompanyModal.createCompany({
            info: { name },
            president: {
                firstName: presidentFirst,
                lastName: presidentLast,
                address: '12 President Ave',
                city: 'Beograd',
                state: 'RS',
                zip: '11000',
            },
        });

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
        await expect(row).toContainText(`${presidentFirst} ${presidentLast}`);
    });

    test('Korisnik moze da kreira kompaniju sa Contact informacijama', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;

        await openNewCompanyModal.createCompany({
            info: { name },
            contact: {
                position: Constants.newCompanyPositionOffice,
                name: 'Marko Markovic',
                email: 'marko@example.com',
                phone: '+381111222333',
                invoices: true,
                contracts: true,
                insurance: true,
            },
        });

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
    });

    test('Korisnik moze da kreira kompaniju sa adresnim/lokacijskim poljima', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;

        await openNewCompanyModal.createCompany({
            info: {
                name,
                address: '500 Main St',
                city: 'Chicago',
                state: 'IL',
                zip: '60601',
            },
        });

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
    });

    test('Korisnik moze da kreira kompaniju sa MC/DOT/FEIN identifikatorima', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;

        await openNewCompanyModal.createCompany({
            info: {
                name,
                mc: 'MC987654',
                dot: 'DOT123456',
                fein: '99-8877665',
            },
        });

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
    });

    test('Korisnik moze da kreira kompaniju sa Cooperation cekboksovima', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.expectOpen();
        await openNewCompanyModal.fillName(name);
        await openNewCompanyModal.setCooperation({ maintenance: true, fuel: true, regruting: false });
        await expect(openNewCompanyModal.maintenanceCheckbox).toBeChecked();
        await expect(openNewCompanyModal.fuelCheckbox).toBeChecked();
        await expect(openNewCompanyModal.regrutingCheckbox).not.toBeChecked();
        await openNewCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
    });

    test('Korisnik moze da odabere Risk level u modalu', async ({ openNewCompanyModal }) => {
        await openNewCompanyModal.selectRiskLevel(Constants.newCompanyRiskLevelB);
        expect(await openNewCompanyModal.getSelectedRiskLevel()).toBe(Constants.newCompanyRiskLevelB);
    });

    test('Korisnik moze da doda Sister company u modalu', async ({ openNewCompanyModal }) => {
        await openNewCompanyModal.addSisterCompany(Constants.newCompanySampleSisterCompany);
        await expect(openNewCompanyModal.sisterCompanyChips.filter({ hasText: Constants.newCompanySampleSisterCompany })).toBeVisible();
    });

    test('Korisnik vidi Pending status u Company status sekciji za novu kompaniju', async ({ openNewCompanyModal }) => {
        await expect(openNewCompanyModal.statusChip).toContainText(Constants.newCompanyDefaultStatus);
    });

    test('Korisnik moze da otvori i zatvori Add president nested modal', async ({ openNewCompanyModal }) => {
        await openNewCompanyModal.openAddPresidentDialog();
        await expect(openNewCompanyModal.addPresidentDialog).toBeVisible();
        await expect(openNewCompanyModal.presidentFirstNameInput).toBeVisible();
        await expect(openNewCompanyModal.presidentLastNameInput).toBeVisible();
        await expect(openNewCompanyModal.presidentSsnInput).toBeVisible();
        await openNewCompanyModal.page.keyboard.press('Escape');
        await openNewCompanyModal.addPresidentDialog.waitFor({ state: 'hidden', timeout: 5000 });
    });

    test('Korisnik moze da klikne Add contact dugme bez greske', async ({ openNewCompanyModal }) => {
        await expect(openNewCompanyModal.addContactButton).toBeEnabled();
        await openNewCompanyModal.clickAddContact();
        await expect(openNewCompanyModal.dialog).toBeVisible();
    });

    test('Korisnik moze da kreira kompaniju sa svim dostupnim sekcijama', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        const presidentFirst = `AllFields${Date.now()}`;
        const presidentLast = 'President';

        await openNewCompanyModal.createCompany({
            info: {
                name,
                mc: '111222',
                dot: '333444',
                address: '1 Combo Lane',
                city: 'Belgrade',
                state: 'RS',
                zip: '11000',
                fein: '11-1111111',
                riskLevel: Constants.newCompanyRiskLevelC,
                isMuslim: false,
            },
            cooperation: {
                leasingAndSales: true,
                regruting: true,
                maintenance: true,
                fuel: false,
            },
            president: {
                firstName: presidentFirst,
                lastName: presidentLast,
                // SSN omitted — see SSN note in the President informacijama test.
            },
            contact: {
                position: Constants.newCompanyPositionManager,
                name: 'Combo Contact',
                email: 'combo@example.com',
                phone: '5551234567',
                invoices: true,
                contracts: true,
                insurance: true,
            },
            note: 'Combined-fields test',
        });

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
        await expect(row).toContainText(Constants.newCompanyDefaultStatus);
        await expect(row).toContainText(`${presidentFirst} ${presidentLast}`);
    });

    test('Duplikat kompanije sa istim Name poljem se prihvata bez greske', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        await openNewCompanyModal.createCompany({ info: { name } });
        await leasingClientsOverview.searchClients(name);
        const firstRow = leasingClientsOverview.getRowByName(name).first();
        await expect(firstRow).toBeVisible();
        await expect(firstRow).toContainText(name);
        await leasingClientsOverview.openNewCompanyModal();
        await openNewCompanyModal.createCompany({ info: { name } });
        await leasingClientsOverview.searchClients(name);
        const rowCount = await leasingClientsOverview.getRowByName(name).count();
        expect(rowCount).toBeGreaterThanOrEqual(2);
        // Every duplicate row must show the same company name.
        const allRows = leasingClientsOverview.getRowByName(name);
        for (let i = 0; i < rowCount; i++) {
            await expect(allRows.nth(i)).toContainText(name);
        }
        for (let i = 0; i < rowCount; i++) {
            await safeDeleteLeasingClient(openNewCompanyModal.page, name);
        }
        createdCompanyName = null;
    });

    test('Email i Phone se prihvataju sa proizvoljnim formatom (nema klijentske validacije)', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;

        await openNewCompanyModal.fillName(name);
        await openNewCompanyModal.fillContact({
            email: 'not-an-email',
            phone: 'abc',
        });
        await openNewCompanyModal.saveAndExpectClosed();

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
    });

    test('Korisnik moze da poveze novu kompaniju sa postojecim Owner Operatorom kao Presidentom', async ({ leasingClientsOverview, newCompanyModal, leasingClientDetail }) => {
        const ownerName = await leasingClientsOverview.getFirstOwnerOperatorName();
        expect(ownerName.length).toBeGreaterThan(0);
        const name = uniqueCompanyName();
        createdCompanyName = name;

        await leasingClientsOverview.openNewCompanyModal();
        await newCompanyModal.expectOpen();
        await newCompanyModal.fillName(name);
        await newCompanyModal.attachExistingPresidentWithConnection(ownerName);
        await newCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClientsForExpandableRow(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(name);
        const ownerFirst = ownerName.split(/\s+/)[0];
        const ownerLast = ownerName.split(/\s+/).slice(-1)[0];
        await expect(row).toContainText(ownerFirst);
        await expect(row).toContainText(ownerLast);
        await leasingClientsOverview.openOverviewForRow(name);
        await leasingClientDetail.expectOnDetailUrl();
        await leasingClientDetail.expectPresidentVisible(ownerName);
    });

    test('Sacuvana kompanija se prikazuje sa ispravnim podacima u Leasing Clients listi', async ({ openNewCompanyModal, leasingClientsOverview }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;

        const presidentFirst = `Display${Date.now()}`;
        const presidentLast = 'Check';
        await openNewCompanyModal.createCompany({
            info: { name, riskLevel: Constants.newCompanyRiskLevelD },
            president: { firstName: presidentFirst, lastName: presidentLast },
        });

        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        // Name column shows exact name; client type is Company; status is Pending.
        await expect(row).toContainText(name);
        await expect(row).toContainText(Constants.leasingClientsClientTypeCompany);
        await expect(row).toContainText(Constants.newCompanyDefaultStatus);
        await expect(row).toContainText(`${presidentFirst} ${presidentLast}`);
    });
});
