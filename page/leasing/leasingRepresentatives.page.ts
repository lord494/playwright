import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export class LeasingRepresentativesPage extends BasePage {
    readonly page: Page;

    readonly wrapper: Locator;
    readonly form: Locator;
    readonly roleAutocompleteWrapper: Locator;
    readonly roleAutocompleteInput: Locator;
    readonly searchRepresentativeWrapper: Locator;
    readonly searchRepresentativeInput: Locator;
    readonly searchSubmitButton: Locator;

    readonly cardsContainer: Locator;
    readonly representativeCards: Locator;
    readonly representativeNames: Locator;

    readonly unassignedCompaniesPool: Locator;
    readonly unassignedCompanyChips: Locator;

    readonly moveAllDialog: Locator;
    readonly moveAllDialogTitle: Locator;
    readonly moveAllDialogSelectWrapper: Locator;
    readonly moveAllDialogSubmit: Locator;
    readonly moveAllDialogCancel: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.wrapper = page.locator('.representatives-wrapper');
        this.form = this.wrapper.locator('form');

        this.roleAutocompleteWrapper = this.form.locator('.v-input.v-autocomplete');
        this.roleAutocompleteInput = this.roleAutocompleteWrapper.locator('input[type="text"]');

        this.searchRepresentativeWrapper = this.form.locator('.v-input:not(.v-autocomplete)');
        this.searchRepresentativeInput = this.searchRepresentativeWrapper.locator('input[type="text"]');
        this.searchSubmitButton = this.form.locator('button[type="submit"]');

        this.cardsContainer = this.wrapper.locator('.representatives-container');
        this.representativeCards = this.cardsContainer.locator('.v-card');
        this.representativeNames = this.cardsContainer.locator('.representative-name strong');

        // NOTE: typo in app — class is "comapnies-without-representative-holder", not "companies-..."
        this.unassignedCompaniesPool = this.wrapper.locator('.comapnies-without-representative-holder');
        this.unassignedCompanyChips = this.unassignedCompaniesPool.locator('.my-chip');

        this.moveAllDialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__title', { hasText: Constants.leasingRepresentativesMoveAllDialogTitle }),
        });
        this.moveAllDialogTitle = this.moveAllDialog.locator('.v-card__title');
        this.moveAllDialogSelectWrapper = this.moveAllDialog.locator('.v-input.v-select', {
            has: page.locator('label', { hasText: Constants.leasingRepresentativesMoveAllSelectLabel }),
        });
        this.moveAllDialogSubmit = this.moveAllDialog.getByRole('button', {
            name: Constants.leasingRepresentativesSubmitButtonLabel,
            exact: true,
        });
        this.moveAllDialogCancel = this.moveAllDialog.getByRole('button', {
            name: Constants.leasingRepresentativesCancelButtonLabel,
            exact: true,
        });
    }

    // ===== STATE =====

    async expectOnUrl(): Promise<void> {
        await this.page.waitForURL(Constants.leasingRepresentativesUrlRegex);
    }

    async waitForLoaded(): Promise<void> {
        await this.wrapper.waitFor({ state: 'visible', timeout: 10000 });
        await this.cardsContainer.waitFor({ state: 'visible', timeout: 10000 });
        await this.unassignedCompanyChips.first().waitFor({ state: 'visible', timeout: 20000 });
    }

    // ===== ROLE AUTOCOMPLETE =====

    async selectRole(roleName: string): Promise<void> {
        const initialNames = await this.getRepresentativeNames();
        await this.roleAutocompleteWrapper.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
        await this.pickAutocompleteOption(roleName);
        // Different roles produce different rep sets — wait for the names array to actually change.
        await expect.poll(async () => {
            const current = await this.getRepresentativeNames();
            return JSON.stringify(current) !== JSON.stringify(initialNames);
        }, { timeout: 10000, intervals: [200, 400, 800] }).toBeTruthy();
    }

    // ===== SEARCH REPRESENTATIVE =====

    async searchRepresentative(text: string): Promise<void> {
        // Use .fill() directly — calling fillInputField (which types char-by-char) on this
        // input causes Vuetify combobox context-close issues on this page.
        await this.searchRepresentativeInput.click();
        await this.searchRepresentativeInput.fill(text);
        await expect(this.searchSubmitButton).toBeEnabled();
        await Promise.all([
            this.page.waitForResponse(res => res.url().includes('/api/users') && (res.status() === 200 || res.status() === 304), { timeout: 10000 }),
            this.searchSubmitButton.click(),
        ]);
        // Wait until the representative names list narrows / changes to reflect the search.
        await expect.poll(async () => {
            const names = await this.getRepresentativeNames();
            return names.length > 0 && names.every(n => n.toLowerCase().includes(text.toLowerCase()));
        }, { timeout: 10000, intervals: [200, 400, 800] }).toBeTruthy();
    }

    async clearSearchRepresentative(): Promise<void> {
        await this.searchRepresentativeInput.click();
        await this.searchRepresentativeInput.fill('');
    }

    async isSearchSubmitDisabled(): Promise<boolean> {
        return this.searchSubmitButton.isDisabled();
    }

    // ===== CARDS / REPRESENTATIVES =====

    getCardByRepName(repName: string): Locator {
        const escaped = repName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        return this.cardsContainer.locator('.v-card', {
            has: this.page.locator('.representative-name strong').filter({ hasText: exactRe }),
        });
    }

    getRepresentativeNameLabel(repName: string): Locator {
        return this.getCardByRepName(repName).locator('.representative-name');
    }

    getMoveAllButton(repName: string): Locator {
        return this.getCardByRepName(repName).locator('button.move-all-btn');
    }

    getUntieAllButton(repName: string): Locator {
        return this.getCardByRepName(repName).locator('button.untie-all-btn');
    }

    getCompanyChipsForRep(repName: string): Locator {
        return this.getCardByRepName(repName).locator('.companies .v-chip');
    }

    getCompanyChipForRep(repName: string, companyText: string): Locator {
        const escaped = companyText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        return this.getCompanyChipsForRep(repName).filter({ hasText: exactRe });
    }

    async getCompanyChipCountForRep(repName: string): Promise<number> {
        return this.getCompanyChipsForRep(repName).count();
    }

    async getRepresentativeNames(): Promise<string[]> {
        const texts = await this.representativeNames.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    // ===== UNASSIGNED POOL =====

    getUnassignedCompanyChip(companyText: string): Locator {
        const escaped = companyText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        return this.unassignedCompanyChips.filter({ hasText: exactRe });
    }

    async getUnassignedCompanyTexts(): Promise<string[]> {
        const texts = await this.unassignedCompanyChips.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    async getUnassignedCount(): Promise<number> {
        return this.unassignedCompanyChips.count();
    }

    // ===== MOVE ALL DIALOG =====

    async openMoveAllDialog(repName: string): Promise<void> {
        const button = this.getMoveAllButton(repName);
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await this.clickElement(button);
        await this.moveAllDialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    async closeMoveAllDialogWithCancel(): Promise<void> {
        await this.clickElement(this.moveAllDialogCancel);
        await this.moveAllDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async getMoveAllTargetOptions(): Promise<string[]> {
        await this.moveAllDialogSelectWrapper.click();
        const menu = this.activeAutocompleteMenu();
        await menu.waitFor({ state: 'visible', timeout: 5000 });
        const texts = await menu.locator('.v-list-item__title').allTextContents();
        // Close the menu to leave the dialog in a clean state
        await this.page.keyboard.press('Escape');
        await menu.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        return texts.map(t => t.trim()).filter(Boolean);
    }

    async expectMoveAllButtonEnabled(repName: string): Promise<void> {
        await expect(this.getMoveAllButton(repName)).toBeEnabled();
    }

    async expectMoveAllButtonDisabled(repName: string): Promise<void> {
        await expect(this.getMoveAllButton(repName)).toBeDisabled();
    }

    async expectUntieAllButtonEnabled(repName: string): Promise<void> {
        await expect(this.getUntieAllButton(repName)).toBeEnabled();
    }

    async expectUntieAllButtonDisabled(repName: string): Promise<void> {
        await expect(this.getUntieAllButton(repName)).toBeDisabled();
    }

    // ===== NATIVE-CONFIRM ACTIONS =====
    // These methods do NOT auto-accept the native confirm — the caller decides
    // whether to accept (mutate) or dismiss (read-only verification).

    async clickUntieAll(repName: string): Promise<void> {
        const button = this.getUntieAllButton(repName);
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.click();
    }

    async clickCompanyChipClose(repName: string, companyText: string): Promise<void> {
        const chip = this.getCompanyChipForRep(repName, companyText);
        await chip.waitFor({ state: 'visible', timeout: 5000 });
        await chip.locator('button[aria-label="Close"]').click();
    }

    // ===== MUTATING ACTIONS =====

    async untieAllAndAccept(repName: string): Promise<void> {
        this.page.once('dialog', async (dialog) => { await dialog.accept(); });
        await this.clickUntieAll(repName);
        await expect.poll(async () => this.getCompanyChipCountForRep(repName), {
            timeout: 10000,
            intervals: [200, 400, 800],
        }).toBe(0);
    }

    async removeCompanyFromRep(repName: string, companyText: string): Promise<void> {
        const chip = this.getCompanyChipForRep(repName, companyText);
        this.page.once('dialog', async (dialog) => { await dialog.accept(); });
        await this.clickCompanyChipClose(repName, companyText);
        await chip.waitFor({ state: 'detached', timeout: 10000 });
    }

    async removeAllCompaniesFromRep(repName: string): Promise<void> {
        const chips = this.getCompanyChipsForRep(repName);
        let safety = 30;
        while ((await chips.count()) > 0 && safety-- > 0) {
            const before = await chips.count();
            this.page.once('dialog', async (dialog) => { await dialog.accept(); });
            await chips.first().locator('button[aria-label="Close"]').click();
            await expect.poll(async () => chips.count(), {
                timeout: 10000,
                intervals: [200, 400, 800],
            }).toBeLessThan(before);
        }
    }

    async selectMoveAllTarget(targetRepName: string): Promise<void> {
        await this.moveAllDialogSelectWrapper.click();
        const menu = this.activeAutocompleteMenu();
        await menu.waitFor({ state: 'visible', timeout: 5000 });
        await this.pickAutocompleteOption(targetRepName);
    }

    async submitMoveAll(): Promise<void> {
        await this.clickElement(this.moveAllDialogSubmit);
        await this.moveAllDialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async moveAllCompanies(sourceRep: string, targetRep: string): Promise<void> {
        await this.openMoveAllDialog(sourceRep);
        await this.selectMoveAllTarget(targetRep);
        await this.submitMoveAll();
        await expect.poll(async () => this.getCompanyChipCountForRep(sourceRep), {
            timeout: 10000,
            intervals: [200, 400, 800],
        }).toBe(0);
    }

    async dragCompanyToRep(companyText: string, repName: string): Promise<void> {
        const target = this.getCardByRepName(repName);
        const targetCompaniesZone = target.locator('.companies');
        const targetChip = this.getCompanyChipForRep(repName, companyText);

        let lastError: unknown;
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                if (await targetChip.isVisible().catch(() => false)) return;

                // Ensure source is in pool (recover if it ended up on the
                // wrong rep card during a previous failed attempt).
                if ((await this.getUnassignedCompanyChip(companyText).count()) === 0) {
                    await this.recoverChipToPool(companyText, repName);
                    continue;
                }

                const source = this.getUnassignedCompanyChip(companyText).first();
                await source.waitFor({ state: 'visible', timeout: 7000 });
                await target.waitFor({ state: 'visible', timeout: 5000 });

                // Strategy A: Playwright's dragTo (HTML5 drag, handles scroll).
                // Strategy B: manual mouse drag dropping in the .companies div.
                // Alternate between them across attempts.
                const useMouseDrag = attempt % 2 === 1;

                if (useMouseDrag) {
                    await this.performMouseDrag(source, targetCompaniesZone);
                } else {
                    await source.dragTo(targetCompaniesZone);
                }

                await expect(targetChip).toBeVisible({ timeout: 7000 });
                return;
            } catch (e) {
                lastError = e;
                await this.page.mouse.up().catch(() => { });
                // After a failed drag, the chip may have ended up on the wrong
                // card. Put it back in the pool before retrying.
                await this.recoverChipToPool(companyText, repName).catch(() => { });
            }
        }
        throw lastError;
    }

    private async performMouseDrag(source: Locator, dropZone: Locator): Promise<void> {
        await source.scrollIntoViewIfNeeded().catch(() => { });
        await dropZone.scrollIntoViewIfNeeded().catch(() => { });
        // Re-resolve source bounding box AFTER dropZone scroll, since target
        // scroll may have moved source.
        const sourceBox = await source.boundingBox();
        const dropBox = await dropZone.boundingBox();
        if (!sourceBox || !dropBox) {
            throw new Error(`Cannot drag: missing bounding box (source=${!!sourceBox}, drop=${!!dropBox})`);
        }

        const startX = sourceBox.x + sourceBox.width / 2;
        const startY = sourceBox.y + sourceBox.height / 2;
        // Drop at the BOTTOM of the .companies zone — for empty cards the
        // zone may have zero height, so fall back to its top edge.
        const endX = dropBox.x + dropBox.width / 2;
        const endY = dropBox.height > 0
            ? dropBox.y + Math.max(dropBox.height - 10, dropBox.height / 2)
            : dropBox.y + 10;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + 5, startY + 5, { steps: 5 });
        await this.page.mouse.move(startX + 20, startY + 20, { steps: 5 });
        // Approach the target gradually so Sortable.js has time to register
        // dragover events on intermediate elements (and auto-scroll if needed).
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        await this.page.mouse.move(midX, midY, { steps: 15 });
        await this.page.mouse.move(endX, endY, { steps: 15 });
        await this.page.mouse.move(endX, endY, { steps: 5 });
        await this.page.mouse.up();
    }

    // If `companyText` ended up on a rep card OTHER than `repName` (e.g. a
    // drag drop landed on the wrong card), untie it so it returns to the
    // pool. Used by dragCompanyToRep's retry recovery. Best-effort.
    private async recoverChipToPool(companyText: string, repName: string): Promise<void> {
        const escaped = companyText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        const cardsWithChip = this.cardsContainer.locator('.v-card', {
            has: this.page.locator('.companies .v-chip').filter({ hasText: exactRe }),
        });
        const count = await cardsWithChip.count();
        for (let i = 0; i < count; i++) {
            const card = cardsWithChip.nth(i);
            // Skip the intended target — if the chip already landed there,
            // dragCompanyToRep's early-return handles it.
            const repLabel = await card.locator('.representative-name strong').textContent();
            if (repLabel && repLabel.trim() === repName) continue;
            const chip = card.locator('.companies .v-chip').filter({ hasText: exactRe }).first();
            if ((await chip.count()) === 0) continue;
            this.page.once('dialog', async (dialog) => { await dialog.accept(); });
            await chip.locator('button[aria-label="Close"]').click().catch(() => { });
            await chip.waitFor({ state: 'detached', timeout: 5000 }).catch(() => { });
        }
        // Wait briefly for the pool to receive the chip back.
        await expect.poll(
            async () => this.getUnassignedCompanyChip(companyText).count(),
            { timeout: 5000, intervals: [200, 400, 600] },
        ).toBeGreaterThan(0);
    }

    // ===== STABILITY HELPERS =====

    async waitForCardEmpty(repName: string): Promise<void> {
        await expect.poll(async () => this.getCompanyChipCountForRep(repName), {
            timeout: 10000,
            intervals: [200, 400, 800],
        }).toBe(0);
        await expect(this.getMoveAllButton(repName)).toBeDisabled({ timeout: 5000 });
        await expect(this.getUntieAllButton(repName)).toBeDisabled({ timeout: 5000 });
    }

    // Picks a pool chip text from a position deep enough that it is unlikely
    // to be a chip that was *just* released from a rep card. Polls until the
    // picked text is uniquely queryable by exact-text in the pool — without
    // this, there's a sub-100ms window after pre-cleanup where the chip is in
    // the DOM but Vue hasn't finished re-rendering yet, and an exact-text
    // lookup returns 0.
    async pickStablePoolChipText(skip: number = 5): Promise<string> {
        const chips = this.unassignedCompanyChips;
        await chips.first().waitFor({ state: 'visible' });
        let pickedText = '';
        await expect.poll(async () => {
            const count = await chips.count();
            if (count === 0) return false;
            // Walk forward from `skip` — if a position's text isn't uniquely
            // queryable yet (transitional render, duplicate text, etc.), try
            // the next one.
            for (let offset = 0; offset < 10; offset++) {
                const idx = Math.min(skip + offset, count - 1);
                const text = ((await chips.nth(idx).textContent()) ?? '').trim();
                if (!text) continue;
                if ((await this.getUnassignedCompanyChip(text).count()) !== 1) continue;
                pickedText = text;
                return true;
            }
            return false;
        }, { timeout: 10000, intervals: [200, 400, 600] }).toBeTruthy();
        return pickedText;
    }

    // Returns the first representative name (in the current role) whose card
    // has at least one company chip. Used by behavioral tests that need a
    // populated card without assuming a specific rep is populated on staging.
    async findFirstNonEmptyRepName(): Promise<string> {
        let found = '';
        await expect.poll(async () => {
            const names = await this.getRepresentativeNames();
            for (const name of names) {
                if ((await this.getCompanyChipCountForRep(name)) > 0) {
                    found = name;
                    return true;
                }
            }
            return false;
        }, {
            timeout: 15000,
            intervals: [200, 400, 800],
            message: 'No representative in the current role has any companies',
        }).toBeTruthy();
        return found;
    }

    async pickStablePoolChipTexts(n: number, skip: number = 5): Promise<string[]> {
        const chips = this.unassignedCompanyChips;
        await chips.first().waitFor({ state: 'visible' });
        let picked: string[] = [];
        await expect.poll(async () => {
            const count = await chips.count();
            if (count < n + skip) return false;
            const out: string[] = [];
            // Walk forward from `skip` and collect the first `n` positions
            // whose texts are uniquely queryable.
            for (let offset = 0; out.length < n && skip + offset < count; offset++) {
                const text = ((await chips.nth(skip + offset).textContent()) ?? '').trim();
                if (!text) continue;
                if ((await this.getUnassignedCompanyChip(text).count()) !== 1) continue;
                if (out.includes(text)) continue;
                out.push(text);
            }
            if (out.length < n) return false;
            picked = out;
            return true;
        }, { timeout: 10000, intervals: [200, 400, 600] }).toBeTruthy();
        return picked;
    }

    // ===== AUTOCOMPLETE HELPERS =====

    private activeAutocompleteMenu(): Locator {
        return this.page.locator('.menuable__content__active').last();
    }

    private async pickAutocompleteOption(optionText: string): Promise<void> {
        const escaped = optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        const menu = this.activeAutocompleteMenu();
        const option = menu.locator('.v-list-item').filter({ hasText: exactRe }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await menu.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
    }
}
