import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da otvori Manage Sales stranicu sa pretragom, karticama sales-a i listom kompanija', async ({ page, manageSales }) => {
    await manageSales.open();
    await expect(page).toHaveURL(Constants.manageSalesUrlRegex);
    await expect(manageSales.searchSalesInput).toBeVisible();
    await expect(manageSales.searchSalesButton).toBeVisible();
    await expect(manageSales.searchSalesButton).toBeDisabled();
    await expect(manageSales.cardsContainer).toBeVisible();
    await expect(manageSales.searchCompaniesInput).toBeVisible();
    await expect(manageSales.unassignedCompaniesPool).toBeVisible();
    expect(await manageSales.lazyCards.count()).toBeGreaterThan(0);
    expect(await manageSales.unassignedCompanyChips.count()).toBeGreaterThan(0);
});

test('Svaka kartica sales-a ima ime, Move All i Untie All dugme', async ({ manageSales }) => {
    await manageSales.open();
    const cardCount = await manageSales.salesCards.count();
    expect(cardCount).toBeGreaterThan(0);
    await expect(manageSales.salesNames).toHaveCount(cardCount);
    await expect(manageSales.salesCardMoveAllButtons).toHaveCount(cardCount);
    await expect(manageSales.salesCardUntieAllButtons).toHaveCount(cardCount);
    for (let i = 0; i < cardCount; i++) {
        await expect(manageSales.salesNames.nth(i)).not.toBeEmpty();
        await expect(manageSales.salesCardMoveAllButtons.nth(i)).toBeVisible();
        await expect(manageSales.salesCardUntieAllButtons.nth(i)).toBeVisible();
    }
});

test('Move All i Untie All su enabled samo kada kartica ima kompanije', async ({ manageSales }) => {
    await manageSales.open();
    const cardCount = await manageSales.salesCards.count();
    expect(cardCount).toBeGreaterThan(0);
    for (let i = 0; i < cardCount; i++) {
        const chipCount = await manageSales.getChipCountForCardAt(i);
        const moveAll = manageSales.salesCardMoveAllButtons.nth(i);
        const untieAll = manageSales.salesCardUntieAllButtons.nth(i);
        if (chipCount > 0) {
            await expect(moveAll).toBeEnabled();
            await expect(untieAll).toBeEnabled();
        } else {
            await expect(moveAll).toBeDisabled();
            await expect(untieAll).toBeDisabled();
        }
    }
});

// ===================== SEARCH SALES =====================

test('Search dugme je disabled dok je polje prazno, a enabled posle unosa teksta', async ({ manageSales }) => {
    await manageSales.open();

    await expect(manageSales.searchSalesButton).toBeDisabled();
    await manageSales.typeSalesSearch(Constants.manageSalesSearchTerm);
    await expect(manageSales.searchSalesButton).toBeEnabled();
    await manageSales.searchSalesInput.clear();
    await expect(manageSales.searchSalesButton).toBeDisabled();
});

test('Korisnik moze da pretrazi sales po dijelu imena i prikazuju se samo odgovarajuce kartice', async ({ manageSales }) => {
    await manageSales.open();
    const initialCount = await manageSales.lazyCards.count();

    const resultCount = await manageSales.searchSales(Constants.manageSalesSearchTerm);

    expect(resultCount).toBeGreaterThan(0);
    expect(resultCount).toBeLessThan(initialCount);
    const names = await manageSales.getAllSalesNames();
    expect(names).toHaveLength(resultCount);
    for (const name of names) {
        expect(name.toLowerCase()).toContain(Constants.manageSalesSearchTerm.toLowerCase());
    }
});

test('Pretraga sales-a ne razlikuje velika i mala slova i radi na Enter', async ({ manageSales }) => {
    await manageSales.open();

    const resultCount = await manageSales.searchSalesWithEnter(Constants.manageSalesSearchTermMixedCase);

    expect(resultCount).toBeGreaterThan(0);
    const names = await manageSales.getAllSalesNames();
    expect(names).toContain(Constants.manageSalesDragRep);
    for (const name of names) {
        expect(name.toLowerCase()).toContain(Constants.manageSalesSearchTermMixedCase.toLowerCase());
    }
});

test('Pretraga nepostojeceg sales-a ne prikazuje nijednu karticu, a lista kompanija ostaje', async ({ manageSales }) => {
    await manageSales.open();

    const resultCount = await manageSales.searchSales(Constants.manageSalesNoMatchSearchTerm);

    expect(resultCount).toBe(0);
    await expect(manageSales.lazyCards).toHaveCount(0);
    await expect(manageSales.salesCards).toHaveCount(0);
    expect(await manageSales.unassignedCompanyChips.count()).toBeGreaterThan(0);
});

test('Korisnik moze da obrise pretragu sales-a na X i vrate se sve kartice', async ({ manageSales }) => {
    await manageSales.open();
    const initialCount = await manageSales.lazyCards.count();

    await manageSales.searchSales(Constants.manageSalesDragRep);
    await expect(manageSales.lazyCards).toHaveCount(1);

    const restoredCount = await manageSales.clearSalesSearch();

    expect(restoredCount).toBe(initialCount);
    await expect(manageSales.lazyCards).toHaveCount(initialCount);
    await expect(manageSales.searchSalesInput).toHaveValue('');
    await expect(manageSales.searchSalesButton).toBeDisabled();
});

// ===================== SEARCH COMPANIES (pool) =====================

test('Korisnik moze da pretrazi listu kompanija bez sales-a, pretraga ne razlikuje velika i mala slova', async ({ manageSales, createSalesCompany }) => {
    const company = await createSalesCompany();
    await manageSales.open();

    await manageSales.searchCompanies(company.name.toLowerCase());

    await expect(manageSales.getUnassignedCompanyChip(company.name)).toBeVisible();
    const texts = await manageSales.getUnassignedCompanyTexts();
    expect(texts.length).toBeGreaterThan(0);
    for (const text of texts) {
        expect(text.toLowerCase()).toContain(company.name.toLowerCase());
    }
});

test('Pretraga nepostojece kompanije prazni listu, a X vraca sve kompanije', async ({ manageSales }) => {
    await manageSales.open();
    const initialCount = await manageSales.unassignedCompanyChips.count();

    await manageSales.searchCompanies(Constants.manageSalesNoMatchCompanySearchTerm);
    await expect(manageSales.unassignedCompanyChips).toHaveCount(0);

    await manageSales.clearCompanySearch();
    await expect(manageSales.unassignedCompanyChips).toHaveCount(initialCount);
    await expect(manageSales.searchCompaniesInput).toHaveValue('');
});

// ===================== ASSIGN (drag & drop) =====================

// The page updates its local lists itself after drag / chip X (no re-fetch), so
// these tests also ask the backend via LeasingCompanyService to prove the change
// was actually saved.

test('Korisnik moze da prevuce kompaniju iz liste na karticu sales-a i promjena se cuva na backend-u', async ({ manageSales, createSalesCompany, salesRepresentative, leasingCompanyService }) => {
    const company = await createSalesCompany();
    const rep = await salesRepresentative(Constants.manageSalesDragRep);
    await manageSales.open();
    await manageSales.searchSales(rep.name);
    await manageSales.searchCompanies(company.name);

    await manageSales.dragCompanyToSales(company.name, rep.name);

    await expect(manageSales.getSalesCardChip(rep.name, company.name)).toBeVisible();
    await expect(manageSales.getUnassignedCompanyChip(company.name)).toHaveCount(0);
    await expect(manageSales.getMoveAllButton(rep.name)).toBeEnabled();
    await expect(manageSales.getUntieAllButton(rep.name)).toBeEnabled();

    expect(await leasingCompanyService.getRepresentativeCompanyIds(Constants.manageSalesRoleName, rep.id)).toContain(company.id);
    const pool = await leasingCompanyService.getCompaniesWithoutRepresentative(Constants.manageSalesRoleName);
    expect(pool.map(c => c.id)).not.toContain(company.id);
});

// ===================== REMOVE (chip X) =====================

test('Klik na X u chip-u otvara confirm, a Cancel ne uklanja kompaniju', async ({ manageSales, createSalesCompany, salesRepresentative, leasingCompanyService }) => {
    const company = await createSalesCompany();
    const rep = await salesRepresentative(Constants.manageSalesDragRep);
    await leasingCompanyService.assignRepresentative(Constants.manageSalesRoleName, rep, [company.id]);
    await manageSales.open();
    await manageSales.searchSales(rep.name);

    const message = await manageSales.clickRemoveCompanyAndDismiss(rep.name, company.name);

    expect(message).toBe(Constants.manageSalesRemoveCompanyConfirmText);
    await expect(manageSales.getSalesCardChip(rep.name, company.name)).toBeVisible();
    await expect(manageSales.getUnassignedCompanyChip(company.name)).toHaveCount(0);
});

test('Korisnik moze da ukloni kompaniju sa kartice sales-a i ona se vraca u listu bez sales-a', async ({ manageSales, createSalesCompany, salesRepresentative, leasingCompanyService }) => {
    const company = await createSalesCompany();
    const rep = await salesRepresentative(Constants.manageSalesDragRep);
    await leasingCompanyService.assignRepresentative(Constants.manageSalesRoleName, rep, [company.id]);
    await manageSales.open();
    await manageSales.searchSales(rep.name);

    const message = await manageSales.removeCompanyFromSales(rep.name, company.name);

    expect(message).toBe(Constants.manageSalesRemoveCompanyConfirmText);
    await expect(manageSales.getSalesCardChip(rep.name, company.name)).toHaveCount(0);
    await expect(manageSales.getUnassignedCompanyChip(company.name)).toHaveCount(1);

    expect(await leasingCompanyService.getRepresentativeCompanyIds(Constants.manageSalesRoleName, rep.id)).not.toContain(company.id);
    const pool = await leasingCompanyService.getCompaniesWithoutRepresentative(Constants.manageSalesRoleName);
    expect(pool.map(c => c.id)).toContain(company.id);
});

// ===================== UNTIE ALL =====================

test('Klik na Untie All otvara confirm, a Cancel ostavlja sve kompanije na kartici', async ({ manageSales, createSalesCompany, salesRepresentative, leasingCompanyService }) => {
    const company = await createSalesCompany();
    const rep = await salesRepresentative(Constants.manageSalesDragRep);
    await leasingCompanyService.assignRepresentative(Constants.manageSalesRoleName, rep, [company.id]);
    await manageSales.open();
    await manageSales.searchSales(rep.name);
    const chipsBefore = await manageSales.getSalesCardChipTexts(rep.name);

    const message = await manageSales.clickUntieAllAndDismiss(rep.name);

    expect(message).toBe(Constants.manageSalesUntieAllConfirmText);
    await expect(manageSales.getSalesCardChip(rep.name, company.name)).toBeVisible();
    expect(await manageSales.getSalesCardChipTexts(rep.name)).toEqual(chipsBefore);
});

test('Korisnik moze da uradi Untie All i sve kompanije se vracaju u listu bez sales-a', async ({ manageSales, createSalesCompany, salesRepresentative, leasingCompanyService }) => {
    const first = await createSalesCompany();
    const second = await createSalesCompany();
    const rep = await salesRepresentative(Constants.manageSalesUntieRep);
    await leasingCompanyService.assignRepresentative(Constants.manageSalesRoleName, rep, [first.id, second.id]);
    await manageSales.open();
    await manageSales.searchSales(rep.name);

    // Guard: Untie All releases the whole card — refuse to run if the sandbox
    // rep holds anything other than test-created companies.
    const chipsBefore = await manageSales.getSalesCardChipTexts(rep.name);
    expect(chipsBefore).toEqual(expect.arrayContaining([first.name, second.name]));
    for (const chip of chipsBefore) {
        expect(chip.startsWith(Constants.leasingTestEntityPrefix)).toBeTruthy();
    }

    const message = await manageSales.untieAllCompanies(rep.name);

    expect(message).toBe(Constants.manageSalesUntieAllConfirmText);
    await expect(manageSales.getSalesCardChips(rep.name)).toHaveCount(0);
    await expect(manageSales.getMoveAllButton(rep.name)).toBeDisabled();
    await expect(manageSales.getUntieAllButton(rep.name)).toBeDisabled();
    await expect(manageSales.getUnassignedCompanyChip(first.name)).toHaveCount(1);
    await expect(manageSales.getUnassignedCompanyChip(second.name)).toHaveCount(1);
});

// ===================== MOVE ALL =====================

test('Move All dialog ne dozvoljava Submit bez izabranog sales-a i zatvara se na Cancel', async ({ manageSales, createSalesCompany, salesRepresentative, leasingCompanyService }) => {
    const company = await createSalesCompany();
    const rep = await salesRepresentative(Constants.manageSalesDragRep);
    await leasingCompanyService.assignRepresentative(Constants.manageSalesRoleName, rep, [company.id]);
    await manageSales.open();
    await manageSales.revealSalesCard(rep.name);

    await manageSales.openMoveAllDialog(rep.name);
    await expect(manageSales.moveAllDialogTitle).toHaveText(Constants.manageSalesMoveAllDialogTitle);
    await expect(manageSales.moveAllSelect).toBeVisible();
    await expect(manageSales.moveAllSubmitButton).toBeVisible();
    await expect(manageSales.moveAllCancelButton).toBeVisible();

    await manageSales.clickMoveAllSubmit();
    await expect(manageSales.moveAllValidationMessage).toHaveText(Constants.manageSalesMoveAllRequiredMessage);
    await expect(manageSales.moveAllDialog).toBeVisible();

    await manageSales.cancelMoveAllDialog();
    await expect(manageSales.moveAllDialog).toBeHidden();
    await expect(manageSales.getSalesCardChip(rep.name, company.name)).toBeVisible();
});

test('Korisnik moze da prebaci sve kompanije sa jednog sales-a na drugog preko Move All', async ({ manageSales, createSalesCompany, salesRepresentative, leasingCompanyService }) => {
    const first = await createSalesCompany();
    const second = await createSalesCompany();
    const source = await salesRepresentative(Constants.manageSalesMoveSourceRep);
    const target = await salesRepresentative(Constants.manageSalesMoveTargetRep);
    await leasingCompanyService.assignRepresentative(Constants.manageSalesRoleName, source, [first.id, second.id]);
    await manageSales.open();
    await manageSales.revealSalesCard(source.name);

    // Guard: Move All moves the whole card — only test-created companies allowed.
    const chipsBefore = await manageSales.getSalesCardChipTexts(source.name);
    expect(chipsBefore).toEqual(expect.arrayContaining([first.name, second.name]));
    for (const chip of chipsBefore) {
        expect(chip.startsWith(Constants.leasingTestEntityPrefix)).toBeTruthy();
    }

    await manageSales.openMoveAllDialog(source.name);
    const options = await manageSales.getMoveAllTargetOptions();
    expect(options).toContain(target.name);
    await manageSales.cancelMoveAllDialog();

    await manageSales.moveAllCompanies(source.name, target.name);

    await expect(manageSales.getSalesCardChip(source.name, first.name)).toHaveCount(0);
    await expect(manageSales.getSalesCardChip(source.name, second.name)).toHaveCount(0);
    await manageSales.revealSalesCard(target.name);
    await expect(manageSales.getSalesCardChip(target.name, first.name)).toBeVisible();
    await expect(manageSales.getSalesCardChip(target.name, second.name)).toBeVisible();

    const sourceIds = await leasingCompanyService.getRepresentativeCompanyIds(Constants.manageSalesRoleName, source.id);
    expect(sourceIds).not.toContain(first.id);
    expect(sourceIds).not.toContain(second.id);
    const targetIds = await leasingCompanyService.getRepresentativeCompanyIds(Constants.manageSalesRoleName, target.id);
    expect(targetIds).toEqual(expect.arrayContaining([first.id, second.id]));
});
