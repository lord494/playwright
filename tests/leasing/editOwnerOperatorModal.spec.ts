import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { safeDeleteLeasingClient, uniqueOwnerOperatorName } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

// Tests for the Edit Owner Operator modal on /leasing/clients (pencil icon on
// an owner-operator row) and the Add Underwriting nested modal that becomes
// available once the owner has been Approved.
//
// Cleanup key is `firstName` (timestamp-unique) rather than the full name —
// owner-operator rows whose Name column spans multiple text nodes don't
// substring-match the full-name string reliably.

test.describe('Edit Owner Operator modal', () => {
    let cleanupKey: string | null = null;

    test.afterEach(async ({ loggedPage }) => {
        if (cleanupKey) {
            await safeDeleteLeasingClient(loggedPage, cleanupKey);
            cleanupKey = null;
        }
    });

    test('Korisnik moze da otvori Edit owner modal preko pencil ikonice', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await editOwnerOperatorModal.expectOpen();
        await expect(editOwnerOperatorModal.title).toBeVisible();
        await expect(editOwnerOperatorModal.statusChip).toBeVisible();
        await expect(editOwnerOperatorModal.approveButton).toBeVisible();
        await expect(editOwnerOperatorModal.declineButton).toBeVisible();
        await expect(editOwnerOperatorModal.saveButton).toBeVisible();
        await expect(editOwnerOperatorModal.cancelButton).toBeVisible();
    });

    test('Korisnik vidi Pending kao podrazumevani status novog owner operatora u Edit modalu', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusPending);
        await expect(editOwnerOperatorModal.underwritingHeader).toBeHidden();
    });

    test('Korisnik moze da promeni status owner operatora iz Pending u Approved', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editOwnerOperatorModal.approve();
        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusApproved);

        await editOwnerOperatorModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusApproved);
    });

    test('Korisnik moze da promeni status owner operatora iz Pending u Declined', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editOwnerOperatorModal.decline();
        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusDeclined);

        await editOwnerOperatorModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusDeclined);
    });

    test('Underwriting sekcija za owner operatora postaje dostupna tek nakon Approve statusa', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await expect(editOwnerOperatorModal.underwritingHeader).toBeHidden();
        await editOwnerOperatorModal.approve();
        await expect(editOwnerOperatorModal.underwritingHeader).toBeVisible();
        await expect(editOwnerOperatorModal.underwritingAddNewButton).toBeVisible();
        await expect(editOwnerOperatorModal.billingInfoHeader).toBeVisible();

        // Verify persistence: close + reopen and the Underwriting section
        // should still be visible.
        await editOwnerOperatorModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.expectOpen();
        await expect(editOwnerOperatorModal.underwritingHeader).toBeVisible();
        await expect(editOwnerOperatorModal.underwritingAddNewButton).toBeVisible();
    });

    test('Korisnik moze da kreira Approved units Underwriting za Truck i vidi 0/20 u tabeli', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal, underwritingModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.approve();
        await editOwnerOperatorModal.openAddUnderwritingModal();

        await underwritingModal.create({
            status: Constants.underwritingStatusApprovedUnits,
            units: 20,
            unitsType: Constants.underwritingUnitsTypeTruck,
            approvedBy: Constants.underwritingApprovedByUnderwriting,
            note: 'PW owner underwriting',
        });

        await editOwnerOperatorModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(fullName);
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(/0\s*\/\s*20/);
    });

    test('Korisnik moze da edituje address, cooperation, risk level i note i sve promene se cuvaju nakon reopen-a', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;

        await openNewOwnerOperatorModal.createOwnerOperator({
            info: {
                firstName,
                lastName,
                address: '111 Initial St',
                city: 'Belgrade',
                state: 'RS',
                zip: '11000',
                riskLevel: Constants.newOwnerOperatorRiskLevelA,
            },
            cooperation: {
                leasingAndSales: true,
                regruting: false,
                maintenance: false,
                fuel: false,
            },
            note: 'Initial note',
        });

        const newAddress = '999 Edited Ave';
        const newCity = 'Chicago';
        const newState = 'IL';
        const newZip = '60601';
        const newRiskLevel = Constants.newOwnerOperatorRiskLevelC;
        const newNote = 'Updated note after edit';

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await editOwnerOperatorModal.editAddress({ address: newAddress, city: newCity, state: newState, zip: newZip });
        await editOwnerOperatorModal.selectRiskLevel(newRiskLevel);
        await editOwnerOperatorModal.setCooperation({
            leasingAndSales: false,
            regruting: true,
            maintenance: true,
            fuel: true,
        });
        await editOwnerOperatorModal.fillNote(newNote);

        await editOwnerOperatorModal.saveAndExpectClosed();

        // Reopen and verify every change persisted.
        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.expectOpen();

        await expect(editOwnerOperatorModal.addressInput).toHaveValue(newAddress);
        await expect(editOwnerOperatorModal.cityInput).toHaveValue(newCity);
        await expect(editOwnerOperatorModal.stateInput).toHaveValue(newState);
        await expect(editOwnerOperatorModal.zipInput).toHaveValue(newZip);
        expect(await editOwnerOperatorModal.getSelectedRiskLevel()).toBe(newRiskLevel);
        await expect(editOwnerOperatorModal.leasingAndSalesCheckbox).not.toBeChecked();
        await expect(editOwnerOperatorModal.regrutingCheckbox).toBeChecked();
        await expect(editOwnerOperatorModal.maintenanceCheckbox).toBeChecked();
        await expect(editOwnerOperatorModal.fuelCheckbox).toBeChecked();
        await expect(editOwnerOperatorModal.noteTextarea).toHaveValue(newNote);
    });

    test('Korisnik moze da edituje postojeci Contact (Position + checkbox-ovi) i promene se cuvaju nakon reopen-a', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        const contactName = `Cont${Date.now()}`;

        // Create owner WITH a persisted contact.
        await openNewOwnerOperatorModal.expectOpen();
        await openNewOwnerOperatorModal.fillFirstName(firstName);
        await openNewOwnerOperatorModal.fillLastName(lastName);
        await openNewOwnerOperatorModal.addContact({
            position: Constants.newOwnerOperatorPositionOffice,
            name: contactName,
            email: 'c@example.com',
            phone: Date.now().toString().slice(-10),
            invoices: true,
            contracts: false,
            insurance: true,
        });
        await openNewOwnerOperatorModal.saveAndExpectClosed();

        // Open Edit modal.
        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.expectContactCardVisible(contactName);

        const card = editOwnerOperatorModal.getContactCard(contactName).first();
        await expect(card).toContainText(Constants.newOwnerOperatorPositionOffice);
        await editOwnerOperatorModal.expectContactCardCheckbox(contactName, 'Invoices', true);
        await editOwnerOperatorModal.expectContactCardCheckbox(contactName, 'Contracts', false);
        await editOwnerOperatorModal.expectContactCardCheckbox(contactName, 'Insurance', true);

        // Edit: change Position + flip all three checkboxes.
        await editOwnerOperatorModal.editContact(contactName, {
            position: Constants.newOwnerOperatorPositionManager,
            invoices: false,
            contracts: true,
            insurance: false,
        });

        // Same-session sanity check.
        await expect(card).toContainText(Constants.newOwnerOperatorPositionManager);

        // Persist + reopen.
        await editOwnerOperatorModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.expectOpen();
        await editOwnerOperatorModal.expectContactCardVisible(contactName);

        const reopenedCard = editOwnerOperatorModal.getContactCard(contactName).first();
        await expect(reopenedCard).toContainText(Constants.newOwnerOperatorPositionManager);
        await editOwnerOperatorModal.expectContactCardCheckbox(contactName, 'Invoices', false);
        await editOwnerOperatorModal.expectContactCardCheckbox(contactName, 'Contracts', true);
        await editOwnerOperatorModal.expectContactCardCheckbox(contactName, 'Insurance', false);
    });

    test('Korisnik moze da obrise Contact preko trash ikonice i promena se cuva nakon reopen-a', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        const contactName = `Cont${Date.now()}`;

        await openNewOwnerOperatorModal.expectOpen();
        await openNewOwnerOperatorModal.fillFirstName(firstName);
        await openNewOwnerOperatorModal.fillLastName(lastName);
        await openNewOwnerOperatorModal.addContact({
            position: Constants.newOwnerOperatorPositionOffice,
            name: contactName,
            email: 'c@example.com',
            phone: Date.now().toString().slice(-10),
            invoices: true,
            contracts: true,
            insurance: true,
        });
        await openNewOwnerOperatorModal.saveAndExpectClosed();

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.expectContactCardVisible(contactName);

        // Delete → Warning confirm → card disappears.
        await editOwnerOperatorModal.deleteContact(contactName);
        await editOwnerOperatorModal.expectContactCardHidden(contactName);

        // Persist + reopen.
        await editOwnerOperatorModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.expectOpen();
        await editOwnerOperatorModal.expectContactCardHidden(contactName);
    });

    test('Korisnik moze da promeni status owner operatora iz Pending u Blacklist i vidi dostupne Inactive/Approve/Decline opcije', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editOwnerOperatorModal.blacklist();
        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusBlacklist);

        await editOwnerOperatorModal.expectVisibleStatusButtons([
            Constants.editClientInactiveButton,
            Constants.editClientApproveButton,
            Constants.editClientDeclineButton,
        ]);

        // Verify the Client status column flipped in the All clients table.
        // The search filter is still applied after the modal closes, so
        // there's no need to re-search.
        await editOwnerOperatorModal.saveAndExpectClosed();
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusBlacklist);
    });

    test('Korisnik moze da promeni status owner operatora iz Pending u Inactive i vidi dostupne Blacklist/Returnee opcije', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editOwnerOperatorModal.inactive();
        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusInactive);

        await editOwnerOperatorModal.expectVisibleStatusButtons([
            Constants.editClientBlacklistButton,
            Constants.editClientReturneeButton,
        ]);

        // Verify the Client status column shows Inactive in the table.
        await editOwnerOperatorModal.saveAndExpectClosed();
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusInactive);
    });

    test('Korisnik moze da vrati Approved owner operatora u Pending preko Inactive -> Returnee i sve status opcije ponovo postaju dostupne', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        // Approve first and persist so the test starts from a saved Approved
        // row. Confirm the Client status column flipped to Approved before
        // reopening (and skip the redundant re-search — the filter survived).
        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await editOwnerOperatorModal.approve();
        await editOwnerOperatorModal.saveAndExpectClosed();
        const rowAfterApprove = leasingClientsOverview.getRowByName(fullName);
        await expect(rowAfterApprove).toContainText(Constants.editClientStatusApproved);

        // Reopen + flip Approved -> Inactive; Returnee should appear.
        await leasingClientsOverview.openEditClientModalForRow(firstName);
        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusApproved);
        await editOwnerOperatorModal.inactive();
        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusInactive);
        await expect(editOwnerOperatorModal.returneeButton).toBeVisible();

        // Returnee -> accept native confirm -> chip flips back to Pending.
        const confirmMessage = await editOwnerOperatorModal.returneeAndAcceptConfirm();
        expect(confirmMessage).toBe(Constants.editClientReturneeConfirmText);

        await expect(editOwnerOperatorModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editOwnerOperatorModal.expectVisibleStatusButtons([
            Constants.editClientApproveButton,
            Constants.editClientDeclineButton,
            Constants.editClientBlacklistButton,
            Constants.editClientInactiveButton,
        ]);

        // Verify the Client status column flipped back to Pending in the table.
        await editOwnerOperatorModal.saveAndExpectClosed();
        const row = leasingClientsOverview.getRowByName(fullName);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusPending);
    });

    test('Korisnik moze da edituje First name, Middle name i Last name owner operatora i promene se cuvaju nakon reopen-a', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        // Sanity check on starting values.
        await expect(editOwnerOperatorModal.firstNameInput).toHaveValue(firstName);
        await expect(editOwnerOperatorModal.lastNameInput).toHaveValue(lastName);

        // Edit all three name fields. The new firstName keeps the same prefix
        // so the cleanup helper (which searches by firstName) can still find
        // and delete the row after the test.
        const newFirstName = `${firstName}Edit`;
        const newMiddleName = `Mid${Date.now()}`;
        const newLastName = `${lastName}Edit`;
        cleanupKey = newFirstName;

        await editOwnerOperatorModal.editName({
            firstName: newFirstName,
            middleName: newMiddleName,
            lastName: newLastName,
        });
        await editOwnerOperatorModal.saveAndExpectClosed();

        // After saving the new name, the original search filter (the OLD
        // fullName) is still in the input and doesn't match the new row.
        // Use `clearSearchAndExpectRow` so the input is fully cleared and
        // re-filled with the exact new value — without it, the previous
        // helpers (`searchClients` / `searchClientsForExpandableRow`) use
        // `.type()` which appends, producing a corrupted search string that
        // happens to match by substring and masks the real lookup.
        const newFullName = `${newFirstName} ${newMiddleName} ${newLastName}`;
        const row = await leasingClientsOverview.clearSearchAndExpectRow(newFullName);
        await expect(row).toContainText(newFirstName);
        await expect(row).toContainText(newMiddleName);
        await expect(row).toContainText(newLastName);

        await row.locator('.mdi-pencil').first().click();
        await editOwnerOperatorModal.expectOpen();
        await expect(editOwnerOperatorModal.firstNameInput).toHaveValue(newFirstName);
        await expect(editOwnerOperatorModal.middleNameInput).toHaveValue(newMiddleName);
        await expect(editOwnerOperatorModal.lastNameInput).toHaveValue(newLastName);
    });

    test('Korisnik ne moze da sacuva owner operatora sa SSN manjim od 9 cifara', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        // 8 digits — below the required 9.
        await editOwnerOperatorModal.editSsn('12345678');
        await editOwnerOperatorModal.save();

        // Client-side validation must block the save: the modal stays open and
        // at least one SSN message is shown under the field.
        await expect(editOwnerOperatorModal.dialog).toBeVisible();
        await editOwnerOperatorModal.expectValidationMessage(/SSN/i);
    });

    test('Korisnik ne moze da sacuva owner operatora sa SSN vecim od 9 cifara', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        // 10 digits — above the required 9.
        await editOwnerOperatorModal.editSsn('1234567890');
        await editOwnerOperatorModal.save();

        await expect(editOwnerOperatorModal.dialog).toBeVisible();
        await editOwnerOperatorModal.expectValidationMessage(/SSN/i);
    });

    test('Korisnik moze da zatvori Edit owner modal preko Cancel dugmeta', async ({ openNewOwnerOperatorModal, leasingClientsOverview, editOwnerOperatorModal }) => {
        const { firstName, lastName, fullName } = uniqueOwnerOperatorName();
        cleanupKey = firstName;
        await openNewOwnerOperatorModal.createOwnerOperator({ info: { firstName, lastName } });

        await leasingClientsOverview.searchClients(fullName);
        await leasingClientsOverview.openEditClientModalForRow(firstName);

        await editOwnerOperatorModal.cancel();
        await expect(editOwnerOperatorModal.dialog).toBeHidden();
    });
});
