import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { buildLeasingCompanyPayload, uniqueCompanyName, uniqueOwnerOperatorName } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

// Isolation (4 workers): every save scenario guarantees for companies it creates
// through LeasingCompanyService (unique PWGuar* names) and registers the created
// guarantor with trackCompanyForCleanup(), so the service fixture soft-deletes
// both after the test. The persisted result is verified on the backend: the
// guarantor record itself and the `guarantors` list of the guaranteed company.

// ===================== ENTRY POINT =====================

test('Korisnik moze da otvori New guarantor meni i vidi opcije Company i Owner operator', async ({ page, newGuarantorModal }) => {
    await expect(page).toHaveURL(Constants.leasingClientsUrlRegex);
    await newGuarantorModal.openGuarantorTypeMenu();

    await expect(newGuarantorModal.companyTypeOption).toBeVisible();
    await expect(newGuarantorModal.ownerOperatorTypeOption).toBeVisible();
});

// ===================== COMPANY GUARANTOR =====================

test.describe('New guarantor - Company', () => {
    test('Korisnik moze da otvori Company guarantor modal i vidi sva polja', async ({ openCompanyGuarantorModal }) => {
        const modal = openCompanyGuarantorModal;

        await expect(modal.title).toHaveText(Constants.newCompanyModalTitle);
        await expect(modal.companyInfoHeading).toBeVisible();
        await expect(modal.guaranteesForHeading).toBeVisible();
        await expect(modal.clientIdInput).toBeDisabled();
        await expect(modal.nameInput).toBeVisible();
        await expect(modal.mcInput).toBeVisible();
        await expect(modal.dotInput).toBeVisible();
        await expect(modal.addressInput).toBeVisible();
        await expect(modal.cityInput).toBeVisible();
        await expect(modal.stateInput).toBeVisible();
        await expect(modal.zipInput).toBeVisible();
        await expect(modal.feinInput).toBeVisible();
        await expect(modal.sisterCompanyWrapper).toBeVisible();
        await expect(modal.riskLevelWrapper).toBeVisible();
        await expect(modal.guaranteesForWrapper).toBeVisible();
        await expect(modal.saveButton).toBeVisible();
        await expect(modal.cancelButton).toBeVisible();
        await expect(modal.ownerInfoHeading).toHaveCount(0);
        await expect(modal.firstNameInput).toHaveCount(0);
    });

    test('Korisnik moze da zatvori Company guarantor modal preko Cancel dugmeta', async ({ openCompanyGuarantorModal }) => {
        await openCompanyGuarantorModal.cancel();

        await expect(openCompanyGuarantorModal.dialog).toBeHidden();
    });

    test('Korisnik ne moze da sacuva Company guarantora bez obaveznih polja', async ({ openCompanyGuarantorModal }) => {
        await openCompanyGuarantorModal.clickSave();

        await expect(openCompanyGuarantorModal.validationMessages).toHaveCount(2);
        const messages = await openCompanyGuarantorModal.getValidationMessages();
        expect(messages).toEqual(expect.arrayContaining([
            Constants.newCompanyValidationNameRequired,
            Constants.newGuarantorValidationGuaranteesForRequired,
        ]));
        await expect(openCompanyGuarantorModal.dialog).toBeVisible();
    });

    test('Korisnik ne moze da sacuva Company guarantora bez Guarantees for polja', async ({ openCompanyGuarantorModal }) => {
        await openCompanyGuarantorModal.fillCompanyInformation({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) });
        await openCompanyGuarantorModal.clickSave();

        await expect(openCompanyGuarantorModal.guaranteesForMessage).toHaveText(Constants.newGuarantorValidationGuaranteesForRequired);
        await expect(openCompanyGuarantorModal.validationMessages).toHaveCount(1);
        await expect(openCompanyGuarantorModal.dialog).toBeVisible();
    });

    test('Korisnik moze da kreira Company guarantora samo sa obaveznim poljima', async ({ openCompanyGuarantorModal, leasingCompanyService }) => {
        const modal = openCompanyGuarantorModal;
        const guaranteed = await leasingCompanyService.createCompany(
            buildLeasingCompanyPayload({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) }),
        );
        const guarantorName = uniqueCompanyName(Constants.newGuarantorTestPrefix);

        await modal.fillCompanyInformation({ name: guarantorName });
        await modal.addGuaranteedCompany(guaranteed.name);
        await expect(modal.getGuaranteedCompanyChip(guaranteed.name)).toBeVisible();
        const guarantorId = await modal.save();
        leasingCompanyService.trackCompanyForCleanup(guarantorId);

        await expect(modal.successSnack).toContainText(Constants.newGuarantorSuccessMessage);
        await expect(modal.dialog).toBeHidden();

        const guarantor = await leasingCompanyService.getCompanyById(guarantorId);
        expect(guarantor?.name).toBe(guarantorName);
        expect(guarantor?.status).toBe(Constants.newGuarantorApiStatus);
        expect(guarantor?.isOwnerOperator).toBe(false);

        const guaranteedAfter = await leasingCompanyService.getCompanyById(guaranteed.id);
        expect(guaranteedAfter?.guarantors?.map(g => g.id)).toContain(guarantorId);
    });

    test('Korisnik moze da kreira Company guarantora sa svim poljima koji garantuje za dvije kompanije', async ({ openCompanyGuarantorModal, leasingCompanyService }) => {
        const modal = openCompanyGuarantorModal;
        const first = await leasingCompanyService.createCompany(
            buildLeasingCompanyPayload({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) }),
        );
        const second = await leasingCompanyService.createCompany(
            buildLeasingCompanyPayload({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) }),
        );
        const guarantorName = uniqueCompanyName(Constants.newGuarantorTestPrefix);

        await modal.fillCompanyInformation({
            name: guarantorName,
            mc: Constants.newGuarantorMC,
            dot: Constants.newGuarantorDOT,
            address: Constants.newGuarantorAddress,
            city: Constants.newGuarantorCity,
            state: Constants.newGuarantorState,
            zip: Constants.newGuarantorZip,
            fein: Constants.newGuarantorFEIN,
        });
        await modal.addGuaranteedCompany(first.name);
        await modal.addGuaranteedCompany(second.name);
        await expect(modal.guaranteesForChips).toHaveCount(2);
        const guarantorId = await modal.save();
        leasingCompanyService.trackCompanyForCleanup(guarantorId);

        await expect(modal.successSnack).toContainText(Constants.newGuarantorSuccessMessage);

        const guarantor = await leasingCompanyService.getCompanyById(guarantorId);
        expect(guarantor?.name).toBe(guarantorName);
        expect(guarantor?.status).toBe(Constants.newGuarantorApiStatus);
        expect(guarantor?.mc).toBe(Constants.newGuarantorMC);
        expect(guarantor?.dot).toBe(Constants.newGuarantorDOT);
        expect(guarantor?.fain).toBe(Constants.newGuarantorFEIN);
        expect(guarantor?.companyAddress).toEqual({
            address: Constants.newGuarantorAddress,
            city: Constants.newGuarantorCity,
            state: Constants.newGuarantorState,
            zip: Constants.newGuarantorZip,
        });

        for (const guaranteed of [first, second]) {
            const after = await leasingCompanyService.getCompanyById(guaranteed.id);
            expect(after?.guarantors?.map(g => g.id)).toContain(guarantorId);
        }
    });

    test('Korisnik moze da sacuva Risk level na Company guarantoru', async ({ openCompanyGuarantorModal, leasingCompanyService }) => {
        // BUG (2026-10-06): in guarantor mode the form drops the selected Risk level —
        // the POST /ms-leasing/company clientDto has no riskLevel, so it is stored as null.
        // Remove test.fail() once the app sends it.
        test.fail(true, 'Known bug: New guarantor (Company) does not send the selected Risk level');
        const modal = openCompanyGuarantorModal;
        const guaranteed = await leasingCompanyService.createCompany(
            buildLeasingCompanyPayload({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) }),
        );

        await modal.fillCompanyInformation({
            name: uniqueCompanyName(Constants.newGuarantorTestPrefix),
            riskLevel: Constants.newCompanyRiskLevelB,
        });
        await expect(modal.riskLevelSelection).toHaveText(Constants.newCompanyRiskLevelB);
        await modal.addGuaranteedCompany(guaranteed.name);
        const guarantorId = await modal.save();
        leasingCompanyService.trackCompanyForCleanup(guarantorId);

        const guarantor = await leasingCompanyService.getCompanyById(guarantorId);
        expect(guarantor?.riskLevel).toBe(Constants.newCompanyRiskLevelB);
    });
});

// ===================== OWNER OPERATOR GUARANTOR =====================

test.describe('New guarantor - Owner operator', () => {
    test('Korisnik moze da otvori Owner operator guarantor modal i vidi sva polja', async ({ openOwnerOperatorGuarantorModal }) => {
        const modal = openOwnerOperatorGuarantorModal;

        await expect(modal.title).toHaveText(Constants.newOwnerOperatorModalTitle);
        await expect(modal.ownerInfoHeading).toBeVisible();
        await expect(modal.guaranteesForHeading).toBeVisible();
        await expect(modal.clientIdInput).toBeDisabled();
        await expect(modal.firstNameInput).toBeVisible();
        await expect(modal.middleNameInput).toBeVisible();
        await expect(modal.lastNameInput).toBeVisible();
        await expect(modal.addressInput).toBeVisible();
        await expect(modal.cityInput).toBeVisible();
        await expect(modal.stateInput).toBeVisible();
        await expect(modal.zipInput).toBeVisible();
        await expect(modal.ssnInput).toBeVisible();
        await expect(modal.riskLevelWrapper).toBeVisible();
        await expect(modal.guaranteesForWrapper).toBeVisible();
        await expect(modal.saveButton).toBeVisible();
        await expect(modal.cancelButton).toBeVisible();
        await expect(modal.companyInfoHeading).toHaveCount(0);
        await expect(modal.nameInput).toHaveCount(0);
    });

    test('Korisnik moze da zatvori Owner operator guarantor modal preko Cancel dugmeta', async ({ openOwnerOperatorGuarantorModal }) => {
        await openOwnerOperatorGuarantorModal.cancel();

        await expect(openOwnerOperatorGuarantorModal.dialog).toBeHidden();
    });

    test('Korisnik ne moze da sacuva Owner operator guarantora bez obaveznih polja', async ({ openOwnerOperatorGuarantorModal }) => {
        await openOwnerOperatorGuarantorModal.clickSave();

        await expect(openOwnerOperatorGuarantorModal.validationMessages).toHaveCount(3);
        const messages = await openOwnerOperatorGuarantorModal.getValidationMessages();
        expect(messages).toEqual(expect.arrayContaining([
            Constants.newOwnerOperatorValidationFirstNameRequired,
            Constants.newOwnerOperatorValidationLastNameRequired,
            Constants.newGuarantorValidationGuaranteesForRequired,
        ]));
        await expect(openOwnerOperatorGuarantorModal.dialog).toBeVisible();
    });

    test('Korisnik ne moze da sacuva Owner operator guarantora bez Guarantees for polja', async ({ openOwnerOperatorGuarantorModal }) => {
        const { firstName, lastName } = uniqueOwnerOperatorName(Constants.newGuarantorTestPrefix);
        await openOwnerOperatorGuarantorModal.fillOwnerInformation({ firstName, lastName });
        await openOwnerOperatorGuarantorModal.clickSave();

        await expect(openOwnerOperatorGuarantorModal.guaranteesForMessage).toHaveText(Constants.newGuarantorValidationGuaranteesForRequired);
        await expect(openOwnerOperatorGuarantorModal.validationMessages).toHaveCount(1);
        await expect(openOwnerOperatorGuarantorModal.dialog).toBeVisible();
    });

    test('Korisnik moze da kreira Owner operator guarantora samo sa obaveznim poljima', async ({ openOwnerOperatorGuarantorModal, leasingCompanyService }) => {
        const modal = openOwnerOperatorGuarantorModal;
        const guaranteed = await leasingCompanyService.createCompany(
            buildLeasingCompanyPayload({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) }),
        );
        const { firstName, lastName } = uniqueOwnerOperatorName(Constants.newGuarantorTestPrefix);

        await modal.fillOwnerInformation({ firstName, lastName });
        await modal.addGuaranteedCompany(guaranteed.name);
        const guarantorId = await modal.save();
        leasingCompanyService.trackCompanyForCleanup(guarantorId);

        await expect(modal.successSnack).toContainText(Constants.newGuarantorSuccessMessage);
        await expect(modal.dialog).toBeHidden();

        const guarantor = await leasingCompanyService.getCompanyById(guarantorId);
        expect(guarantor?.isOwnerOperator).toBe(true);
        expect(guarantor?.status).toBe(Constants.newGuarantorApiStatus);
        expect(guarantor?.ownerFirstName).toBe(firstName);
        expect(guarantor?.ownerLastName).toBe(lastName);

        const guaranteedAfter = await leasingCompanyService.getCompanyById(guaranteed.id);
        const entry = guaranteedAfter?.guarantors?.find(g => g.id === guarantorId);
        expect(entry?.isOwnerOperator).toBe(true);
        expect(entry?.ownerFirstName).toBe(firstName);
        expect(entry?.ownerLastName).toBe(lastName);
    });

    test('Korisnik moze da kreira Owner operator guarantora sa svim poljima', async ({ openOwnerOperatorGuarantorModal, leasingCompanyService }) => {
        const modal = openOwnerOperatorGuarantorModal;
        const guaranteed = await leasingCompanyService.createCompany(
            buildLeasingCompanyPayload({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) }),
        );
        const { firstName, lastName } = uniqueOwnerOperatorName(Constants.newGuarantorTestPrefix);

        await modal.fillOwnerInformation({
            firstName,
            middleName: Constants.newGuarantorOwnerMiddleName,
            lastName,
            address: Constants.newGuarantorAddress,
            city: Constants.newGuarantorCity,
            state: Constants.newGuarantorState,
            zip: Constants.newGuarantorZip,
        });
        await modal.addGuaranteedCompany(guaranteed.name);
        const guarantorId = await modal.save();
        leasingCompanyService.trackCompanyForCleanup(guarantorId);

        await expect(modal.successSnack).toContainText(Constants.newGuarantorSuccessMessage);

        const guarantor = await leasingCompanyService.getCompanyById(guarantorId);
        expect(guarantor?.status).toBe(Constants.newGuarantorApiStatus);
        expect(guarantor?.ownerFirstName).toBe(firstName);
        expect(guarantor?.ownerMiddleName).toBe(Constants.newGuarantorOwnerMiddleName);
        expect(guarantor?.ownerLastName).toBe(lastName);
        expect(guarantor?.ownerAddress).toEqual({
            address: Constants.newGuarantorAddress,
            city: Constants.newGuarantorCity,
            state: Constants.newGuarantorState,
            zip: Constants.newGuarantorZip,
        });

        const guaranteedAfter = await leasingCompanyService.getCompanyById(guaranteed.id);
        expect(guaranteedAfter?.guarantors?.map(g => g.id)).toContain(guarantorId);
    });

    test('Korisnik moze da sacuva Risk level na Owner operator guarantoru', async ({ openOwnerOperatorGuarantorModal, leasingCompanyService }) => {
        // BUG (2026-10-06): same as the Company variant — the selected Risk level is
        // not sent in guarantor mode and is stored as null. Remove test.fail() once fixed.
        test.fail(true, 'Known bug: New guarantor (Owner operator) does not send the selected Risk level');
        const modal = openOwnerOperatorGuarantorModal;
        const guaranteed = await leasingCompanyService.createCompany(
            buildLeasingCompanyPayload({ name: uniqueCompanyName(Constants.newGuarantorTestPrefix) }),
        );
        const { firstName, lastName } = uniqueOwnerOperatorName(Constants.newGuarantorTestPrefix);

        await modal.fillOwnerInformation({ firstName, lastName, riskLevel: Constants.newOwnerOperatorRiskLevelC });
        await expect(modal.riskLevelSelection).toHaveText(Constants.newOwnerOperatorRiskLevelC);
        await modal.addGuaranteedCompany(guaranteed.name);
        const guarantorId = await modal.save();
        leasingCompanyService.trackCompanyForCleanup(guarantorId);

        const guarantor = await leasingCompanyService.getCompanyById(guarantorId);
        expect(guarantor?.riskLevel).toBe(Constants.newOwnerOperatorRiskLevelC);
    });
});
