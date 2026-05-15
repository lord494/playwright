import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { safeRestoreRepresentativeCard } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da vidi leasing representatives stranicu sa svim elementima', async ({ leasingRepresentatives }) => {
    await leasingRepresentatives.expectOnUrl();
    await expect(leasingRepresentatives.wrapper).toBeVisible();
    await expect(leasingRepresentatives.form).toBeVisible();
    await expect(leasingRepresentatives.roleAutocompleteWrapper).toBeVisible();
    await expect(leasingRepresentatives.searchRepresentativeWrapper).toBeVisible();
    await expect(leasingRepresentatives.searchSubmitButton).toBeVisible();
    await expect(leasingRepresentatives.cardsContainer).toBeVisible();
    await expect(leasingRepresentatives.unassignedCompaniesPool).toBeVisible();

    const names = await leasingRepresentatives.getRepresentativeNames();
    expect(names.length).toBeGreaterThan(0);
});

test('Default rola je Sales Truck Manager i prikazuje karticu sa postojecim representative-om', async ({ leasingRepresentatives }) => {
    const names = await leasingRepresentatives.getRepresentativeNames();
    expect(names).toContain(Constants.leasingRepresentativesExistingRepName);

    const card = leasingRepresentatives.getCardByRepName(Constants.leasingRepresentativesExistingRepName);
    await expect(card).toBeVisible();
    await expect(leasingRepresentatives.getRepresentativeNameLabel(Constants.leasingRepresentativesExistingRepName))
        .toContainText(Constants.leasingRepresentativesExistingRepName);
});

test('Kartica representative-a ima Move All i Untie All buttone', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesExistingRepName;
    await expect(leasingRepresentatives.getMoveAllButton(rep)).toBeVisible();
    await expect(leasingRepresentatives.getUntieAllButton(rep)).toBeVisible();
});

test('Move All i Untie All su enabled kada kartica ima kompanije', async ({ leasingRepresentatives }) => {
    const rep = await leasingRepresentatives.findFirstNonEmptyRepName();
    const count = await leasingRepresentatives.getCompanyChipCountForRep(rep);
    expect(count).toBeGreaterThan(0);
    await leasingRepresentatives.expectMoveAllButtonEnabled(rep);
    await leasingRepresentatives.expectUntieAllButtonEnabled(rep);
});

test('Move All i Untie All su disabled kada kartica nema kompanije', async ({ leasingRepresentatives }) => {
    // Self-heal: ensure at least one sandbox rep is empty so the assertion
    // is meaningful regardless of staging state.
    const rep = Constants.leasingRepresentativesEmptyRep1;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);
    await leasingRepresentatives.expectMoveAllButtonDisabled(rep);
    await leasingRepresentatives.expectUntieAllButtonDisabled(rep);
});

test('Korisnik moze da promijeni rolu na Sales Trailer Manager i kartice se osvjeze', async ({ leasingRepresentatives }) => {
    const initial = await leasingRepresentatives.getRepresentativeNames();
    expect(initial).toContain(Constants.leasingRepresentativesExistingRepName);

    await leasingRepresentatives.selectRole(Constants.leasingRepresentativesRoleSalesTrailerManager);
    const afterChange = await leasingRepresentatives.getRepresentativeNames();
    expect(afterChange.length).toBeGreaterThan(0);
    expect(afterChange).not.toContain(Constants.leasingRepresentativesExistingRepName);
});

test('Search submit dugme je disabled kada je input prazan, a enabled posle unosa teksta', async ({ leasingRepresentatives }) => {
    expect(await leasingRepresentatives.isSearchSubmitDisabled()).toBeTruthy();
    await leasingRepresentatives.searchRepresentativeInput.fill(Constants.leasingRepresentativesSearchTerm);
    await expect(leasingRepresentatives.searchSubmitButton).toBeEnabled();
    await leasingRepresentatives.clearSearchRepresentative();
    await expect(leasingRepresentatives.searchSubmitButton).toBeDisabled();
});

test('Korisnik moze da pretrazi representative-a po imenu i tabela se suzava', async ({ leasingRepresentatives }) => {
    await leasingRepresentatives.searchRepresentative(Constants.leasingRepresentativesSearchTerm);
    const names = await leasingRepresentatives.getRepresentativeNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
        expect(name.toLowerCase()).toContain(Constants.leasingRepresentativesSearchTerm.toLowerCase());
    }
});

test('Unassigned companies pool sadrzi vidljive chip-ove', async ({ leasingRepresentatives }) => {
    const unassignedCount = await leasingRepresentatives.getUnassignedCount();
    expect(unassignedCount).toBeGreaterThan(0);
    await expect(leasingRepresentatives.unassignedCompanyChips.first()).toBeVisible();
});

test('Korisnik moze da otvori Move All Companies modal i da ga zatvori dugmetom Cancel', async ({ leasingRepresentatives }) => {
    const rep = await leasingRepresentatives.findFirstNonEmptyRepName();
    await leasingRepresentatives.openMoveAllDialog(rep);
    await expect(leasingRepresentatives.moveAllDialog).toBeVisible();
    await expect(leasingRepresentatives.moveAllDialogTitle).toContainText(Constants.leasingRepresentativesMoveAllDialogTitle);
    await expect(leasingRepresentatives.moveAllDialogSelectWrapper).toBeVisible();
    await expect(leasingRepresentatives.moveAllDialogSubmit).toBeVisible();
    await expect(leasingRepresentatives.moveAllDialogCancel).toBeVisible();

    await leasingRepresentatives.closeMoveAllDialogWithCancel();
    await expect(leasingRepresentatives.moveAllDialog).toBeHidden();
});

test('Move All select prikazuje ostale representative-e iz iste role kao target opcije', async ({ leasingRepresentatives }) => {
    const allReps = await leasingRepresentatives.getRepresentativeNames();
    const sourceRep = await leasingRepresentatives.findFirstNonEmptyRepName();
    await leasingRepresentatives.openMoveAllDialog(sourceRep);

    const options = await leasingRepresentatives.getMoveAllTargetOptions();
    expect(options.length).toBeGreaterThan(0);
    expect(options).not.toContain(sourceRep);
    for (const option of options) {
        expect(allReps).toContain(option);
    }

    await leasingRepresentatives.closeMoveAllDialogWithCancel();
});

test('Klik na Untie All otvara native confirm sa odgovarajucim tekstom', async ({ leasingRepresentatives }) => {
    const rep = await leasingRepresentatives.findFirstNonEmptyRepName();
    let confirmText = '';
    let dialogShown = false;
    leasingRepresentatives.page.once('dialog', async (dialog) => {
        dialogShown = true;
        confirmText = dialog.message();
        await dialog.dismiss();
    });
    await leasingRepresentatives.clickUntieAll(rep);
    await expect.poll(() => dialogShown, { timeout: 5000 }).toBeTruthy();
    expect(confirmText).toContain(Constants.leasingRepresentativesUntieAllConfirmText);
});

test('Klik na X u chip-u kompanije otvara native confirm sa odgovarajucim tekstom', async ({ leasingRepresentatives }) => {
    const rep = await leasingRepresentatives.findFirstNonEmptyRepName();
    const chips = leasingRepresentatives.getCompanyChipsForRep(rep);
    await expect(chips.first()).toBeVisible();
    const firstChipText = ((await chips.first().textContent()) ?? '').trim();
    expect(firstChipText.length).toBeGreaterThan(0);

    let confirmText = '';
    let dialogShown = false;
    leasingRepresentatives.page.once('dialog', async (dialog) => {
        dialogShown = true;
        confirmText = dialog.message();
        await dialog.dismiss();
    });
    await leasingRepresentatives.clickCompanyChipClose(rep, firstChipText);
    await expect.poll(() => dialogShown, { timeout: 5000 }).toBeTruthy();
    expect(confirmText).toContain(Constants.leasingRepresentativesChipCloseConfirmText);
});

test('Chip kompanije ima Close button koji je vidljiv', async ({ leasingRepresentatives }) => {
    const rep = await leasingRepresentatives.findFirstNonEmptyRepName();
    const firstChip = leasingRepresentatives.getCompanyChipsForRep(rep).first();
    await expect(firstChip).toBeVisible();
    await expect(firstChip.locator('button[aria-label="Close"]')).toBeVisible();
});

// ===== MUTATING SCENARIOS =====
// Each test pre-cleans the rep card (self-heals from interrupted prior runs),
// asserts the card actually reached an empty/stable state, picks a "stable"
// chip from the pool (avoiding chips that may have just been released and are
// still in a transitional render state), and restores via try/finally.

test('Korisnik moze da prevuce kompaniju iz pool-a na karticu representative-a', async ({ leasingRepresentatives }) => {
    const targetRep = Constants.leasingRepresentativesEmptyRep1;
    await safeRestoreRepresentativeCard(leasingRepresentatives, targetRep);
    await leasingRepresentatives.waitForCardEmpty(targetRep);

    const companyText = await leasingRepresentatives.pickStablePoolChipText();

    try {
        await leasingRepresentatives.dragCompanyToRep(companyText, targetRep);

        await expect(leasingRepresentatives.getCompanyChipForRep(targetRep, companyText)).toBeVisible();
        expect(await leasingRepresentatives.getCompanyChipCountForRep(targetRep)).toBe(1);
        await leasingRepresentatives.expectMoveAllButtonEnabled(targetRep);
        await leasingRepresentatives.expectUntieAllButtonEnabled(targetRep);

        const poolTexts = await leasingRepresentatives.getUnassignedCompanyTexts();
        expect(poolTexts).not.toContain(companyText);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, targetRep);
    }
});

test('Korisnik moze da obrise kompaniju sa kartice klikom na X i potvrdom', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep2;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const companyText = await leasingRepresentatives.pickStablePoolChipText();

    try {
        await leasingRepresentatives.dragCompanyToRep(companyText, rep);
        await expect(leasingRepresentatives.getCompanyChipForRep(rep, companyText)).toBeVisible();

        await leasingRepresentatives.removeCompanyFromRep(rep, companyText);

        await expect(leasingRepresentatives.getCompanyChipForRep(rep, companyText)).toBeHidden();
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(0);
        await leasingRepresentatives.expectMoveAllButtonDisabled(rep);
        await leasingRepresentatives.expectUntieAllButtonDisabled(rep);

        const poolTexts = await leasingRepresentatives.getUnassignedCompanyTexts();
        expect(poolTexts).toContain(companyText);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});

test('Korisnik moze da uradi Untie All i sve kompanije se vracaju u pool', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep3;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const companyText = await leasingRepresentatives.pickStablePoolChipText();

    try {
        await leasingRepresentatives.dragCompanyToRep(companyText, rep);
        await expect(leasingRepresentatives.getCompanyChipForRep(rep, companyText)).toBeVisible();
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(1);

        await leasingRepresentatives.untieAllAndAccept(rep);

        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(0);
        await leasingRepresentatives.expectMoveAllButtonDisabled(rep);
        await leasingRepresentatives.expectUntieAllButtonDisabled(rep);

        const poolTexts = await leasingRepresentatives.getUnassignedCompanyTexts();
        expect(poolTexts).toContain(companyText);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});

test('Korisnik moze da prebaci sve kompanije sa jednog representative-a na drugog (Move All)', async ({ leasingRepresentatives }) => {
    const sourceRep = Constants.leasingRepresentativesEmptyRep4;
    const targetRep = Constants.leasingRepresentativesEmptyRep1;
    await safeRestoreRepresentativeCard(leasingRepresentatives, sourceRep);
    await safeRestoreRepresentativeCard(leasingRepresentatives, targetRep);
    await leasingRepresentatives.waitForCardEmpty(sourceRep);
    await leasingRepresentatives.waitForCardEmpty(targetRep);

    const companyText = await leasingRepresentatives.pickStablePoolChipText();

    try {
        await leasingRepresentatives.dragCompanyToRep(companyText, sourceRep);
        await expect(leasingRepresentatives.getCompanyChipForRep(sourceRep, companyText)).toBeVisible();

        await leasingRepresentatives.moveAllCompanies(sourceRep, targetRep);

        expect(await leasingRepresentatives.getCompanyChipCountForRep(sourceRep)).toBe(0);
        await leasingRepresentatives.expectMoveAllButtonDisabled(sourceRep);
        await leasingRepresentatives.expectUntieAllButtonDisabled(sourceRep);

        await expect(leasingRepresentatives.getCompanyChipForRep(targetRep, companyText)).toBeVisible();
        await leasingRepresentatives.expectMoveAllButtonEnabled(targetRep);
        await leasingRepresentatives.expectUntieAllButtonEnabled(targetRep);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, sourceRep);
        await safeRestoreRepresentativeCard(leasingRepresentatives, targetRep);
    }
});

test('Korisnik moze da prevuce dvije kompanije pa Untie All ih sve vrati u pool', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep2;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const [firstText, secondText] = await leasingRepresentatives.pickStablePoolChipTexts(2);

    try {
        await leasingRepresentatives.dragCompanyToRep(firstText, rep);
        await leasingRepresentatives.dragCompanyToRep(secondText, rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(2);

        await leasingRepresentatives.untieAllAndAccept(rep);

        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(0);
        const poolTexts = await leasingRepresentatives.getUnassignedCompanyTexts();
        expect(poolTexts).toContain(firstText);
        expect(poolTexts).toContain(secondText);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});

test('Dismiss potvrde za Untie All ne mijenja kartice (read-only verifikacija)', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep1;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const companyText = await leasingRepresentatives.pickStablePoolChipText();

    try {
        await leasingRepresentatives.dragCompanyToRep(companyText, rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(1);

        leasingRepresentatives.page.once('dialog', async (dialog) => { await dialog.dismiss(); });
        await leasingRepresentatives.clickUntieAll(rep);

        await expect(leasingRepresentatives.getCompanyChipForRep(rep, companyText)).toBeVisible();
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(1);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});

test('Dismiss potvrde za chip X ne brise chip (read-only verifikacija)', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep3;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const companyText = await leasingRepresentatives.pickStablePoolChipText();

    try {
        await leasingRepresentatives.dragCompanyToRep(companyText, rep);
        await expect(leasingRepresentatives.getCompanyChipForRep(rep, companyText)).toBeVisible();

        leasingRepresentatives.page.once('dialog', async (dialog) => { await dialog.dismiss(); });
        await leasingRepresentatives.clickCompanyChipClose(rep, companyText);

        await expect(leasingRepresentatives.getCompanyChipForRep(rep, companyText)).toBeVisible();
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(1);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});

test('Korisnik moze da prevuce kompaniju iz pool-a na karticu sa vec dodijeljenim kompanijama', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep4;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const [firstText, secondText] = await leasingRepresentatives.pickStablePoolChipTexts(2);

    try {
        await leasingRepresentatives.dragCompanyToRep(firstText, rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(1);

        await leasingRepresentatives.dragCompanyToRep(secondText, rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(2);
        await expect(leasingRepresentatives.getCompanyChipForRep(rep, firstText)).toBeVisible();
        await expect(leasingRepresentatives.getCompanyChipForRep(rep, secondText)).toBeVisible();
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});

// ===== INITIAL-STATE COVERAGE =====
// Explicit verification that pre-cleanup handles all three starting states:
// 0 / 1 / multiple chips on a card.

test('Pre-cleanup obradjuje pocetnu praznu karticu (0 kompanija)', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep1;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);
    expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(0);
});

test('Pre-cleanup obradjuje karticu sa jednom kompanijom', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep2;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const companyText = await leasingRepresentatives.pickStablePoolChipText();
    try {
        // Pre-seed: drag exactly one company onto the card
        await leasingRepresentatives.dragCompanyToRep(companyText, rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(1);

        // Verify cleanup resets to empty
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
        await leasingRepresentatives.waitForCardEmpty(rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(0);

        const poolTexts = await leasingRepresentatives.getUnassignedCompanyTexts();
        expect(poolTexts).toContain(companyText);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});

test('Pre-cleanup obradjuje karticu sa vise kompanija', async ({ leasingRepresentatives }) => {
    const rep = Constants.leasingRepresentativesEmptyRep3;
    await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    await leasingRepresentatives.waitForCardEmpty(rep);

    const [t1, t2, t3] = await leasingRepresentatives.pickStablePoolChipTexts(3);
    try {
        // Pre-seed: drag three companies onto the card
        await leasingRepresentatives.dragCompanyToRep(t1, rep);
        await leasingRepresentatives.dragCompanyToRep(t2, rep);
        await leasingRepresentatives.dragCompanyToRep(t3, rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(3);

        // Verify cleanup resets to empty (handles the multi-chip path)
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
        await leasingRepresentatives.waitForCardEmpty(rep);
        expect(await leasingRepresentatives.getCompanyChipCountForRep(rep)).toBe(0);

        const poolTexts = await leasingRepresentatives.getUnassignedCompanyTexts();
        expect(poolTexts).toContain(t1);
        expect(poolTexts).toContain(t2);
        expect(poolTexts).toContain(t3);
    } finally {
        await safeRestoreRepresentativeCard(leasingRepresentatives, rep);
    }
});
