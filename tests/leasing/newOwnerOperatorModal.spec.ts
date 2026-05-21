import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { safeDeleteLeasingClient, uniqueOwnerOperatorName } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

// Tests for the "New Owner Operator" modal on /leasing/clients.
//
// Conventions:
//   - Every test that saves an owner uses uniqueOwnerOperatorName() so the
//     name is unique per worker+timestamp. The cleanup `afterEach` deletes
//     the created row from /leasing/clients via the UI.
//   - Cleanup key is the `firstName` (timestamp-unique) rather than the
//     full name. The displayed Name cell can include a middle name we
//     didn't track, so the cleanup helper relies on substring match against
//     the firstName to find the row reliably.
//   - Validation: only First name* and Last name* are enforced client-side
//     (verified on staging 2026-05-19). Email/Phone are accepted in any
//     format — that's an app behavior, not a test bug.

test.describe('New Owner Operator modal', () => {
    let cleanupKey: string | null = null;

    test.afterEach(async ({ loggedPage }) => {
        if (cleanupKey) {
            await safeDeleteLeasingClient(loggedPage, cleanupKey);
            cleanupKey = null;
        }
    });

    test('Korisnik moze da otvori New Owner Operator modal', async ({ openNewOwnerOperatorModal }) => {
        await expect(openNewOwnerOperatorModal.title).toBeVisible();
        await expect(openNewOwnerOperatorModal.saveButton).toBeVisible();
        await expect(openNewOwnerOperatorModal.cancelButton).toBeVisible();
    });

    test('Korisnik moze da zatvori New Owner Operator modal preko Cancel dugmeta', async ({ openNewOwnerOperatorModal }) => {
        await openNewOwnerOperatorModal.cancel();
        await expect(openNewOwnerOperatorModal.dialog).toBeHidden();
    });

    test('Korisnik moze da vidi sva polja u modalu', async ({ openNewOwnerOperatorModal }) => {
        // Owner information
        await expect(openNewOwnerOperatorModal.firstNameInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.middleNameInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.lastNameInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.addressInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.cityInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.stateInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.zipInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.ssnInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.riskLevelWrapper).toBeVisible();
        await expect(openNewOwnerOperatorModal.areTheyMuslimCheckbox).toBeVisible();
        // Cooperation
        await expect(openNewOwnerOperatorModal.cooperationStartDateInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.leasingAndSalesCheckbox).toBeVisible();
        await expect(openNewOwnerOperatorModal.regrutingCheckbox).toBeVisible();
        await expect(openNewOwnerOperatorModal.maintenanceCheckbox).toBeVisible();
        await expect(openNewOwnerOperatorModal.fuelCheckbox).toBeVisible();
        // Contact
        await expect(openNewOwnerOperatorModal.contactPositionWrapper).toBeVisible();
        await expect(openNewOwnerOperatorModal.contactNameInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.contactEmailInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.contactPhoneInput).toBeVisible();
        await expect(openNewOwnerOperatorModal.addContactButton).toBeVisible();
        // Note + Comments
        await expect(openNewOwnerOperatorModal.noteTextarea).toBeVisible();
        await expect(openNewOwnerOperatorModal.addCommentButton).toBeVisible();
    });

    test('Korisnik vidi validaciju kada pokusa da sacuva bez First i Last name polja', async ({ openNewOwnerOperatorModal }) => {
        await openNewOwnerOperatorModal.save();
        await openNewOwnerOperatorModal.expectValidationMessage(Constants.newOwnerOperatorValidationFirstNameRequired);
        await openNewOwnerOperatorModal.expectValidationMessage(Constants.newOwnerOperatorValidationLastNameRequired);
        // Modal must stay open while required fields are invalid.
        await expect(openNewOwnerOperatorModal.dialog).toBeVisible();
    });

    test('Korisnik moze da kreira owner operatora samo sa obaveznim First i Last name poljima', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.createOwnerOperator({
            info: { firstName, lastName },
        });

        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(fullName);
        await expect(row).toContainText(Constants.newOwnerOperatorClientType);
        await expect(row).toContainText(Constants.newOwnerOperatorDefaultStatus);
    });

    test('Korisnik moze da kreira owner operatora sa svim Owner information poljima', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.createOwnerOperator({
            info: {
                firstName,
                lastName,
                middleName: 'Middy',
                address: '123 Owner St',
                city: 'Belgrade',
                state: 'RS',
                zip: '11000',
                // SSN omitted intentionally — the same digit-only-coercion
                // backend rule observed on the New Company /ms-leasing/presidents
                // endpoint likely applies here. See TODO in the dedicated SSN test.
                riskLevel: Constants.newOwnerOperatorRiskLevelA,
                areTheyMuslim: false,
            },
            cooperation: {
                leasingAndSales: true,
                regruting: true,
                maintenance: true,
                fuel: true,
            },
            note: 'Created by Playwright automation',
        });

        // Owner-operator rows that have a middle name auto-expand a "No
        // related companies" subrow which breaks the standard searchClients
        // waiter. Search by firstName (timestamp-unique) and locate the row
        // via getMainRowContaining (filters out expanded subrows).
        await leasingClientsOverview.searchClientsForExpandableRow(firstName);
        const row = leasingClientsOverview.getMainRowContaining(firstName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(firstName);
        await expect(row).toContainText('Middy');
        await expect(row).toContainText(lastName);
        await expect(row).toContainText(Constants.newOwnerOperatorClientType);
        await expect(row).toContainText(Constants.newOwnerOperatorDefaultStatus);
    });

    test('Korisnik moze da kreira owner operatora sa Contact informacijama', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.createOwnerOperator({
            info: { firstName, lastName },
            contact: {
                position: Constants.newOwnerOperatorPositionOffice,
                name: 'Marko Markovic',
                email: 'marko@example.com',
                phone: '+381111222333',
                invoices: true,
                contracts: true,
                insurance: true,
            },
        });

        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(fullName);
    });

    test('Korisnik moze da kreira owner operatora sa adresnim/lokacijskim poljima', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.createOwnerOperator({
            info: {
                firstName,
                lastName,
                address: '500 Main St',
                city: 'Chicago',
                state: 'IL',
                zip: '60601',
            },
        });

        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(fullName);
    });

    test('Korisnik moze da kreira owner operatora sa Cooperation cekboksovima', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.expectOpen();
        await openNewOwnerOperatorModal.fillFirstName(firstName);
        await openNewOwnerOperatorModal.fillLastName(lastName);
        // Leasing and sales is pre-checked — verify, then toggle Maintenance + Fuel on.
        await expect(openNewOwnerOperatorModal.leasingAndSalesCheckbox).toBeChecked();
        await openNewOwnerOperatorModal.setCooperation({ maintenance: true, fuel: true, regruting: false });
        await expect(openNewOwnerOperatorModal.maintenanceCheckbox).toBeChecked();
        await expect(openNewOwnerOperatorModal.fuelCheckbox).toBeChecked();
        await expect(openNewOwnerOperatorModal.regrutingCheckbox).not.toBeChecked();
        await openNewOwnerOperatorModal.saveAndExpectClosed();

        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(fullName);
    });

    test('Korisnik moze da odabere Risk level u modalu', async ({ openNewOwnerOperatorModal }) => {
        await openNewOwnerOperatorModal.selectRiskLevel(Constants.newOwnerOperatorRiskLevelB);
        // Vuetify v-select shows the chosen option in `.v-select__selection`,
        // not as an input value (the input is a hidden trigger).
        expect(await openNewOwnerOperatorModal.getSelectedRiskLevel()).toBe(Constants.newOwnerOperatorRiskLevelB);
    });

    test('Korisnik vidi Pending status u Owner operator status sekciji za novog ownera', async ({ openNewOwnerOperatorModal }) => {
        await expect(openNewOwnerOperatorModal.statusChip).toContainText(Constants.newOwnerOperatorDefaultStatus);
    });

    test('Korisnik moze da klikne Add contact dugme bez greske', async ({ openNewOwnerOperatorModal }) => {
        // TODO: Confirm the intended behavior of "Add contact" with empty fields.
        // Observed on staging 2026-05-19: same as the New Company modal —
        // clicking with an empty inline contact form does not visibly append
        // another contact row. The button may require the inline form to be
        // filled first, or the multi-contact UX may live elsewhere.
        await expect(openNewOwnerOperatorModal.addContactButton).toBeEnabled();
        await openNewOwnerOperatorModal.clickAddContact();
        await expect(openNewOwnerOperatorModal.dialog).toBeVisible();
    });

    test('Korisnik moze da kreira owner operatora sa svim dostupnim sekcijama', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.createOwnerOperator({
            info: {
                firstName,
                lastName,
                middleName: 'Mid',
                address: '1 Combo Lane',
                city: 'Belgrade',
                state: 'RS',
                zip: '11000',
                riskLevel: Constants.newOwnerOperatorRiskLevelC,
                areTheyMuslim: false,
            },
            cooperation: {
                leasingAndSales: true,
                regruting: true,
                maintenance: true,
                fuel: false,
            },
            contact: {
                position: Constants.newOwnerOperatorPositionManager,
                name: 'Combo Contact',
                email: 'combo@example.com',
                phone: '5551234567',
                invoices: true,
                contracts: true,
                insurance: true,
            },
            note: 'Combined-fields test',
        });

        // Middle name triggers row expansion — use the expandable-row-aware
        // search + getMainRowContaining.
        await leasingClientsOverview.searchClientsForExpandableRow(firstName);
        const row = leasingClientsOverview.getMainRowContaining(firstName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(firstName);
        await expect(row).toContainText('Mid');
        await expect(row).toContainText(lastName);
        await expect(row).toContainText(Constants.newOwnerOperatorClientType);
        await expect(row).toContainText(Constants.newOwnerOperatorDefaultStatus);
    });

    test('Duplikat owner operatora sa istim First i Last name biva odbijen tiho na drugom save-u', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        // Pins observed staging behavior 2026-05-19: owner operators are
        // persisted as Presidents server-side, so the second save with the
        // same full name hits the /ms-leasing/presidents 400 "President with
        // the same full name already exists". The UI swallows the error and
        // keeps the modal open. Exactly one row should appear in the list.
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        // First create succeeds.
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });
        await leasingClientsOverview.searchClients(fullName);
        await expect(leasingClientsOverview.getRowByName(fullName).first()).toBeVisible();
        const firstCount = await leasingClientsOverview.getRowByName(fullName).count();
        expect(firstCount).toBe(1);

        // Second create with the same full name: modal stays open and the row
        // count in the list does not grow.
        await leasingClientsOverview.openNewOwnerOperatorModal();
        await openNewOwnerOperatorModal.expectOpen();
        await openNewOwnerOperatorModal.fillFirstName(firstName);
        await openNewOwnerOperatorModal.fillLastName(lastName);
        await openNewOwnerOperatorModal.save();
        // Give the silent 400 time to land; modal should still be visible.
        await expect(openNewOwnerOperatorModal.dialog).toBeVisible();
        // Close the still-open modal so cleanup can navigate freely.
        await openNewOwnerOperatorModal.cancel();

        await leasingClientsOverview.searchClients(fullName);
        const finalCount = await leasingClientsOverview.getRowByName(fullName).count();
        expect(finalCount).toBe(1);
    });

    test('Email i Phone se prihvataju sa proizvoljnim formatom (nema klijentske validacije)', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        // TODO: Verify with product whether Email/Phone should validate format.
        // Observed on staging 2026-05-19: an obviously invalid email
        // ('not-an-email') and phone ('abc') do NOT block Save. This test
        // pins the current behavior so a regression toward stricter validation
        // surfaces here.
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.fillFirstName(firstName);
        await openNewOwnerOperatorModal.fillLastName(lastName);
        await openNewOwnerOperatorModal.fillContact({
            email: 'not-an-email',
            phone: 'abc',
        });
        await openNewOwnerOperatorModal.saveAndExpectClosed();

        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(fullName);
    });

    test('Sacuvan owner operator se prikazuje sa ispravnim podacima u Leasing Clients listi', async ({ openNewOwnerOperatorModal, leasingClientsOverview }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.createOwnerOperator({
            info: { firstName, lastName, riskLevel: Constants.newOwnerOperatorRiskLevelD },
        });

        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        // Name column shows "<firstName> <lastName>"; type is Owner; status is Pending.
        await expect(row).toContainText(fullName);
        await expect(row).toContainText(Constants.newOwnerOperatorClientType);
        await expect(row).toContainText(Constants.newOwnerOperatorDefaultStatus);
    });
});
