import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { safeDeleteLeasingClient, uniqueCompanyName } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

// Tests for the Edit Company modal on /leasing/clients (pencil icon on a row)
// and the Add Underwriting nested modal that becomes available once the
// company has been Approved.
//
// Conventions (per project CLAUDE.md):
//   - Test names in Serbian: "Korisnik moze da ..." / "Korisnik ne moze ..."
//   - Each test creates its own company with `uniqueCompanyName()` so it can
//     run in parallel against staging.
//   - `afterEach` cleans up via `safeDeleteLeasingClient` so the row doesn't
//     pollute the environment.
//   - Locators live on page objects — specs never touch `page.getByRole(...)`.

test.describe('Edit Company modal', () => {
    let createdCompanyName: string | null = null;

    test.afterEach(async ({ loggedPage }) => {
        if (createdCompanyName) {
            await safeDeleteLeasingClient(loggedPage, createdCompanyName);
            createdCompanyName = null;
        }
    });

    test('Korisnik moze da otvori Edit company modal preko pencil ikonice', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await editCompanyModal.expectOpen();
        await expect(editCompanyModal.title).toBeVisible();
        await expect(editCompanyModal.statusChip).toBeVisible();
        await expect(editCompanyModal.approveButton).toBeVisible();
        await expect(editCompanyModal.declineButton).toBeVisible();
        await expect(editCompanyModal.saveButton).toBeVisible();
        await expect(editCompanyModal.cancelButton).toBeVisible();
    });

    test('Korisnik vidi Pending kao podrazumevani status nove kompanije u Edit modalu', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusPending);
        // Underwriting section should NOT be visible while status is Pending.
        await expect(editCompanyModal.underwritingHeader).toBeHidden();
    });

    test('Korisnik moze da promeni status kompanije iz Pending u Approved', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editCompanyModal.approve();
        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusApproved);

        // Persist and verify in the table.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusApproved);
    });

    test('Korisnik moze da promeni status kompanije iz Pending u Declined', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editCompanyModal.decline();
        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusDeclined);

        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusDeclined);
    });

    test('Underwriting sekcija postaje dostupna tek nakon Approve statusa', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        // Hidden while Pending.
        await expect(editCompanyModal.underwritingHeader).toBeHidden();

        await editCompanyModal.approve();
        // Visible after Approve (in the same modal session).
        await expect(editCompanyModal.underwritingHeader).toBeVisible();
        await expect(editCompanyModal.underwritingAddNewButton).toBeVisible();
        await expect(editCompanyModal.billingInfoHeader).toBeVisible();

        // Verify persistence: close + reopen and the Underwriting section
        // should still be visible.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectOpen();
        await expect(editCompanyModal.underwritingHeader).toBeVisible();
        await expect(editCompanyModal.underwritingAddNewButton).toBeVisible();
    });

    test('Korisnik moze da kreira Approved units Underwriting za Truck i vidi 0/20 u tabeli', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal, underwritingModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.approve();
        await editCompanyModal.openAddUnderwritingModal();

        await underwritingModal.create({
            status: Constants.underwritingStatusApprovedUnits,
            units: 20,
            unitsType: Constants.underwritingUnitsTypeTruck,
            approvedBy: Constants.underwritingApprovedByUnderwriting,
            note: 'PW underwriting trucks',
        });

        // Persist + close edit modal so the table re-fetches.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        // Truck - Taken/Approved column should read "0 / 20" (with surrounding
        // whitespace on staging). Use a regex to ignore spacing variants.
        await expect(row).toContainText(/0\s*\/\s*20/);
    });

    test('Korisnik moze da kreira Approved units Underwriting za Trailer i vidi 0/20 u tabeli', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal, underwritingModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.approve();
        await editCompanyModal.openAddUnderwritingModal();

        await underwritingModal.create({
            status: Constants.underwritingStatusApprovedUnits,
            units: 20,
            unitsType: Constants.underwritingUnitsTypeTrailer,
            approvedBy: Constants.underwritingApprovedByUnderwriting,
        });

        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(name);
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(/0\s*\/\s*20/);
    });

    test('Korisnik moze da edituje address, cooperation, risk level i note i sve promene se cuvaju nakon reopen-a', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;

        // Create with a known starting state so we can detect changes after edit.
        await openNewCompanyModal.createCompany({
            info: {
                name,
                address: '111 Initial St',
                city: 'Belgrade',
                state: 'RS',
                zip: '11000',
                riskLevel: Constants.newCompanyRiskLevelA,
            },
            cooperation: {
                leasingAndSales: true,
                regruting: false,
                maintenance: false,
                fuel: false,
            },
            note: 'Initial note',
        });

        // First edit pass: change every editable section.
        const newAddress = '999 Edited Ave';
        const newCity = 'Chicago';
        const newState = 'IL';
        const newZip = '60601';
        const newRiskLevel = Constants.newCompanyRiskLevelC;
        const newNote = 'Updated note after edit';

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await editCompanyModal.editAddress({ address: newAddress, city: newCity, state: newState, zip: newZip });
        await editCompanyModal.selectRiskLevel(newRiskLevel);
        await editCompanyModal.setCooperation({
            leasingAndSales: false,
            regruting: true,
            maintenance: true,
            fuel: true,
        });
        await editCompanyModal.fillNote(newNote);

        await editCompanyModal.saveAndExpectClosed();

        // Reopen the modal — every change above must be still present.
        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectOpen();

        await expect(editCompanyModal.addressInput).toHaveValue(newAddress);
        await expect(editCompanyModal.cityInput).toHaveValue(newCity);
        await expect(editCompanyModal.stateInput).toHaveValue(newState);
        await expect(editCompanyModal.zipInput).toHaveValue(newZip);
        expect(await editCompanyModal.getSelectedRiskLevel()).toBe(newRiskLevel);
        await expect(editCompanyModal.leasingAndSalesCheckbox).not.toBeChecked();
        await expect(editCompanyModal.regrutingCheckbox).toBeChecked();
        await expect(editCompanyModal.maintenanceCheckbox).toBeChecked();
        await expect(editCompanyModal.fuelCheckbox).toBeChecked();
        await expect(editCompanyModal.noteTextarea).toHaveValue(newNote);
    });

    test('Korisnik moze da edituje postojeceg Presidenta preko pencil ikonice i promene se cuvaju nakon reopen-a', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const stamp = `${Date.now()}`;
        const oldFirst = `EditPresOld${stamp}`;
        const oldLast = 'Sr';
        const oldFull = `${oldFirst} ${oldLast}`;
        const newFirst = `EditPresNew${stamp}`;
        const newLast = 'Jr';
        const newFull = `${newFirst} ${newLast}`;

        const name = uniqueCompanyName();
        createdCompanyName = name;

        // Create company WITH the initial president.
        await openNewCompanyModal.createCompany({
            info: { name },
            president: { firstName: oldFirst, lastName: oldLast },
        });

        // Open the Edit modal — the existing president must render as a card.
        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectPresidentCardVisible(oldFull);

        // Edit: rename First + Last via the pencil-icon sub-dialog.
        await editCompanyModal.editPresident(oldFull, { firstName: newFirst, lastName: newLast });

        // Same-session sanity check.
        await editCompanyModal.expectPresidentCardHidden(oldFull);
        await editCompanyModal.expectPresidentCardVisible(newFull);

        // Persist + reopen — the change must survive the round-trip.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectOpen();
        await editCompanyModal.expectPresidentCardVisible(newFull);
        await editCompanyModal.expectPresidentCardHidden(oldFull);
    });

    test('Korisnik moze da otkaci (Unpair) Presidenta preko (-) ikonice i promena se cuva nakon reopen-a', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const presFirst = `UnpairPres${Date.now()}`;
        const presLast = 'Sr';
        const presFull = `${presFirst} ${presLast}`;

        const name = uniqueCompanyName();
        createdCompanyName = name;

        await openNewCompanyModal.createCompany({
            info: { name },
            president: { firstName: presFirst, lastName: presLast },
        });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectPresidentCardVisible(presFull);

        // Unpair → Warning confirm → card disappears.
        await editCompanyModal.unpairPresident(presFull);
        await editCompanyModal.expectPresidentCardHidden(presFull);

        // Persist + reopen — the president must still be absent from the modal.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectOpen();
        await editCompanyModal.expectPresidentCardHidden(presFull);
    });

    test('Korisnik moze da obrise Presidenta preko trash ikonice i promena se cuva nakon reopen-a', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const presFirst = `DelPres${Date.now()}`;
        const presLast = 'Sr';
        const presFull = `${presFirst} ${presLast}`;

        const name = uniqueCompanyName();
        createdCompanyName = name;

        await openNewCompanyModal.createCompany({
            info: { name },
            president: { firstName: presFirst, lastName: presLast },
        });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectPresidentCardVisible(presFull);

        // Delete → Warning confirm → card disappears.
        await editCompanyModal.deletePresident(presFull);
        await editCompanyModal.expectPresidentCardHidden(presFull);

        // Persist + reopen — the deleted president must stay gone.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectOpen();
        await editCompanyModal.expectPresidentCardHidden(presFull);
    });

    test('Korisnik moze da edituje postojeci Contact (Position + checkbox-ovi) i promene se cuvaju nakon reopen-a', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        const contactName = `Cont${Date.now()}`;

        // Create company WITH a persisted contact (fill + Add contact).
        await openNewCompanyModal.expectOpen();
        await openNewCompanyModal.fillName(name);
        await openNewCompanyModal.addContact({
            position: Constants.newCompanyPositionOffice,
            name: contactName,
            email: 'c@example.com',
            phone: Date.now().toString().slice(-10),
            invoices: true,
            contracts: false,
            insurance: true,
        });
        await openNewCompanyModal.saveAndExpectClosed();

        // Open Edit modal — the existing contact must render as a card.
        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectContactCardVisible(contactName);

        // Sanity check on starting state — Office position + initial checkbox icons.
        const card = editCompanyModal.getContactCard(contactName).first();
        await expect(card).toContainText(Constants.newCompanyPositionOffice);
        await editCompanyModal.expectContactCardCheckbox(contactName, 'Invoices', true);
        await editCompanyModal.expectContactCardCheckbox(contactName, 'Contracts', false);
        await editCompanyModal.expectContactCardCheckbox(contactName, 'Insurance', true);

        // Edit: change Position + flip all three checkboxes.
        await editCompanyModal.editContact(contactName, {
            position: Constants.newCompanyPositionManager,
            invoices: false,
            contracts: true,
            insurance: false,
        });

        // Same-session sanity check.
        await expect(card).toContainText(Constants.newCompanyPositionManager);
        await expect(card).not.toContainText(new RegExp(`Position:\\s*${Constants.newCompanyPositionOffice}\\s*$`, 'm'));

        // Persist + reopen — the change must survive the round-trip.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectOpen();
        await editCompanyModal.expectContactCardVisible(contactName);

        const reopenedCard = editCompanyModal.getContactCard(contactName).first();
        await expect(reopenedCard).toContainText(Constants.newCompanyPositionManager);
        await editCompanyModal.expectContactCardCheckbox(contactName, 'Invoices', false);
        await editCompanyModal.expectContactCardCheckbox(contactName, 'Contracts', true);
        await editCompanyModal.expectContactCardCheckbox(contactName, 'Insurance', false);
    });

    test('Korisnik moze da obrise Contact preko trash ikonice i promena se cuva nakon reopen-a', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        const contactName = `Cont${Date.now()}`;

        await openNewCompanyModal.expectOpen();
        await openNewCompanyModal.fillName(name);
        await openNewCompanyModal.addContact({
            position: Constants.newCompanyPositionOffice,
            name: contactName,
            email: 'c@example.com',
            phone: Date.now().toString().slice(-10),
            invoices: true,
            contracts: true,
            insurance: true,
        });
        await openNewCompanyModal.saveAndExpectClosed();

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectContactCardVisible(contactName);

        // Delete → Warning confirm → card disappears.
        await editCompanyModal.deleteContact(contactName);
        await editCompanyModal.expectContactCardHidden(contactName);

        // Persist + reopen — the deleted contact must stay gone.
        await editCompanyModal.saveAndExpectClosed();
        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.expectOpen();
        await editCompanyModal.expectContactCardHidden(contactName);
    });

    test('Korisnik moze da promeni status kompanije iz Pending u Blacklist i vidi dostupne Inactive/Approve/Decline opcije', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editCompanyModal.blacklist();
        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusBlacklist);

        // After Blacklist the available transitions are Inactive, Approve, Decline.
        await editCompanyModal.expectVisibleStatusButtons([
            Constants.editClientInactiveButton,
            Constants.editClientApproveButton,
            Constants.editClientDeclineButton,
        ]);

        // Persist and verify the Client status column flipped in the table.
        // The search filter is still applied after the modal closes, so the
        // row is reachable without re-searching.
        await editCompanyModal.saveAndExpectClosed();
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusBlacklist);
    });

    test('Korisnik moze da promeni status kompanije iz Pending u Inactive i vidi dostupne Blacklist/Returnee opcije', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editCompanyModal.inactive();
        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusInactive);

        // After Inactive the only available transitions are Blacklist + Returnee.
        await editCompanyModal.expectVisibleStatusButtons([
            Constants.editClientBlacklistButton,
            Constants.editClientReturneeButton,
        ]);

        // Verify the Client status column shows Inactive in the table.
        await editCompanyModal.saveAndExpectClosed();
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusInactive);
    });

    test('Korisnik moze da vrati Approved kompaniju u Pending preko Inactive -> Returnee i sve status opcije ponovo postaju dostupne', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        // Start: flip to Approved and persist so we begin the flow from a
        // saved Approved state (matches the spec scenario). Confirm the
        // Client status column flipped to Approved before reopening.
        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);
        await editCompanyModal.approve();
        await editCompanyModal.saveAndExpectClosed();
        const rowAfterApprove = leasingClientsOverview.getRowByName(name);
        await expect(rowAfterApprove).toContainText(Constants.editClientStatusApproved);

        // Reopen and move Approved -> Inactive; Returnee becomes available.
        // No re-search — the previous filter is still applied.
        await leasingClientsOverview.openEditClientModalForRow(name);
        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusApproved);
        await editCompanyModal.inactive();
        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusInactive);
        await expect(editCompanyModal.returneeButton).toBeVisible();

        // Click Returnee, accept the native confirm, and verify the message.
        const confirmMessage = await editCompanyModal.returneeAndAcceptConfirm();
        expect(confirmMessage).toBe(Constants.editClientReturneeConfirmText);

        // Back to Pending — all status transitions are available again.
        await expect(editCompanyModal.statusChip).toContainText(Constants.editClientStatusPending);
        await editCompanyModal.expectVisibleStatusButtons([
            Constants.editClientApproveButton,
            Constants.editClientDeclineButton,
            Constants.editClientBlacklistButton,
            Constants.editClientInactiveButton,
        ]);

        // Persist + verify the Client status column flipped back to Pending.
        await editCompanyModal.saveAndExpectClosed();
        const row = leasingClientsOverview.getRowByName(name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(Constants.editClientStatusPending);
    });

    test('Korisnik moze da zatvori Edit company modal preko Cancel dugmeta', async ({ openNewCompanyModal, leasingClientsOverview, editCompanyModal }) => {
        const name = uniqueCompanyName();
        createdCompanyName = name;
        await openNewCompanyModal.createCompany({ info: { name } });

        await leasingClientsOverview.searchClients(name);
        await leasingClientsOverview.openEditClientModalForRow(name);

        await editCompanyModal.cancel();
        await expect(editCompanyModal.dialog).toBeHidden();
    });
});
