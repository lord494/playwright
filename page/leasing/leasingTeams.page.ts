import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export class LeasingTeamsPage extends BasePage {
    readonly page: Page;

    readonly wrapper: Locator;
    readonly teamsContainer: Locator;
    readonly usersWithoutTeamHolder: Locator;

    readonly selectTeamTypeWrapper: Locator;
    readonly selectTeamTypeInput: Locator;
    readonly searchUsersByRoleWrapper: Locator;
    readonly searchUsersByRoleInput: Locator;
    readonly createNewButton: Locator;

    readonly sectionHeadings: Locator;
    readonly salesTruckSection: Locator;
    readonly salesTrailerSection: Locator;
    readonly billingSection: Locator;

    readonly teamCards: Locator;
    readonly cardTitle: Locator;
    readonly memberChips: Locator;
    readonly availableUserChips: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.wrapper = page.locator('.leasingteams-wrapper');
        this.teamsContainer = this.wrapper.locator('.leasing-team-container');
        this.usersWithoutTeamHolder = page.locator('#users-with-no-team-holder');

        this.selectTeamTypeWrapper = this.wrapper.locator('.v-input', {
            has: page.locator('label', { hasText: Constants.leasingTeamsSelectTeamTypeLabel }),
        });
        this.selectTeamTypeInput = this.selectTeamTypeWrapper.locator('input[type="text"]');

        this.searchUsersByRoleWrapper = this.wrapper.locator('.v-input', {
            has: page.locator('label', { hasText: Constants.leasingTeamsSearchUsersByRoleLabel }),
        });
        this.searchUsersByRoleInput = this.searchUsersByRoleWrapper.locator('input[type="text"]');

        this.createNewButton = this.wrapper.getByRole('button', { name: Constants.leasingTeamsCreateNewButtonLabel, exact: true });

        this.sectionHeadings = this.teamsContainer.locator('h2.leasing-team-name');
        this.salesTruckSection = this.getSectionByName(Constants.leasingTeamsSalesTruckSection);
        this.salesTrailerSection = this.getSectionByName(Constants.leasingTeamsSalesTrailerSection);
        this.billingSection = this.getSectionByName(Constants.leasingTeamsBillingSection);

        this.teamCards = this.teamsContainer.locator('.v-card');
        this.cardTitle = this.teamCards.locator('.tl-name');
        this.memberChips = this.teamCards.locator('.members .v-chip');
        this.availableUserChips = this.usersWithoutTeamHolder.locator('.my-chip');
    }

    async expectOnUrl(): Promise<void> {
        await this.page.waitForURL(Constants.leasingTeamsUrlRegex);
    }

    async waitForLoaded(): Promise<void> {
        await this.wrapper.waitFor({ state: 'visible', timeout: 10000 });
        await this.teamsContainer.waitFor({ state: 'visible', timeout: 10000 });
    }

    // ===== SECTIONS / CARDS =====

    getSectionByName(sectionName: string): Locator {
        return this.teamsContainer.locator('.row.cards', {
            has: this.page.locator('h2.leasing-team-name', { hasText: sectionName }),
        });
    }

    getCardsInSection(sectionName: string): Locator {
        return this.getSectionByName(sectionName).locator('.v-card');
    }

    getCardByTeamName(teamName: string): Locator {
        return this.teamsContainer.locator('.v-card', {
            has: this.page.locator('.tl-name strong', { hasText: teamName }),
        });
    }

    getCardTitleText(teamName: string): Locator {
        return this.getCardByTeamName(teamName).locator('.tl-name');
    }

    getMoveAllButton(teamName: string): Locator {
        return this.getCardByTeamName(teamName).getByRole('button', {
            name: Constants.leasingTeamsMoveAllButtonLabel,
            exact: true,
        });
    }

    getDeleteTeamButton(teamName: string): Locator {
        return this.getCardByTeamName(teamName).locator('button.delete-team-btn');
    }

    getMemberChipsForTeam(teamName: string): Locator {
        return this.getCardByTeamName(teamName).locator('.members .v-chip');
    }

    getMemberChipForTeam(teamName: string, memberText: string): Locator {
        return this.getCardByTeamName(teamName)
            .locator('.members .v-chip')
            .filter({ hasText: memberText });
    }

    async clickMoveAllForTeam(teamName: string): Promise<void> {
        const button = this.getMoveAllButton(teamName);
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await this.clickElement(button);
    }

    async clickDeleteTeam(teamName: string): Promise<void> {
        const button = this.getDeleteTeamButton(teamName);
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await this.clickElement(button);
    }

    async deleteTeam(teamName: string): Promise<void> {
        const card = this.getCardByTeamName(teamName);
        const button = this.getDeleteTeamButton(teamName);
        await button.waitFor({ state: 'visible', timeout: 5000 });
        this.page.once('dialog', async (dialog) => { await dialog.accept(); });
        await button.click();
        await card.waitFor({ state: 'detached', timeout: 10000 });
    }

    async moveAllMembersTo(sourceTeam: string, targetTeam: string): Promise<void> {
        const moveBtn = this.getMoveAllButton(sourceTeam);
        await moveBtn.waitFor({ state: 'visible', timeout: 5000 });
        await this.clickElement(moveBtn);

        const modal = this.page.locator('.v-dialog--active', {
            has: this.page.locator('.v-card__title', { hasText: Constants.leasingTeamsMoveAllModalTitle }),
        });
        await modal.waitFor({ state: 'visible', timeout: 10000 });

        const dropdown = modal.locator('.v-input', {
            has: this.page.locator('label', { hasText: Constants.leasingTeamsMoveAllSelectTeamLabel }),
        });
        await dropdown.click();

        const escaped = targetTeam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        const option = this.page.locator('.menuable__content__active .v-list-item')
            .filter({ hasText: exactRe })
            .first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();

        const submit = modal.getByRole('button', {
            name: Constants.leasingTeamsMoveAllSubmitLabel,
            exact: true,
        });
        await this.clickElement(submit);
        await modal.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async removeMemberFromTeam(teamName: string, memberText: string): Promise<void> {
        const chip = this.getMemberChipForTeam(teamName, memberText);
        await chip.waitFor({ state: 'visible', timeout: 5000 });
        this.page.once('dialog', async (dialog) => { await dialog.accept(); });
        await chip.locator('button.v-chip__close').click();
        await chip.waitFor({ state: 'detached', timeout: 10000 });
    }

    async removeAllMembersFromTeam(teamName: string): Promise<void> {
        const chips = this.getMemberChipsForTeam(teamName);
        let safety = 50;
        while ((await chips.count()) > 0 && safety-- > 0) {
            const before = await chips.count();
            this.page.once('dialog', async (dialog) => { await dialog.accept(); });
            await chips.first().locator('button.v-chip__close').click();
            await expect.poll(async () => chips.count(), {
                timeout: 10000,
                intervals: [200, 400, 800],
            }).toBeLessThan(before);
        }
    }

    async expectMoveAllEnabled(teamName: string): Promise<void> {
        await expect(this.getMoveAllButton(teamName)).toBeEnabled();
    }

    async expectMoveAllDisabled(teamName: string): Promise<void> {
        await expect(this.getMoveAllButton(teamName)).toBeDisabled();
    }

    async expectDeleteTeamEnabled(teamName: string): Promise<void> {
        await expect(this.getDeleteTeamButton(teamName)).toBeEnabled();
    }

    async expectDeleteTeamDisabled(teamName: string): Promise<void> {
        await expect(this.getDeleteTeamButton(teamName)).toBeDisabled();
    }

    async getCardsCount(): Promise<number> {
        return this.teamCards.count();
    }

    async getCardsCountInSection(sectionName: string): Promise<number> {
        return this.getCardsInSection(sectionName).count();
    }

    async getVisibleSectionNames(): Promise<string[]> {
        const texts = await this.sectionHeadings.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    // ===== SELECT LEASING TEAM TYPE =====

    async selectLeasingTeamType(typeName: string): Promise<void> {
        await this.openLeasingTeamTypeMenu();
        await this.pickAutocompleteOption(typeName);
        await this.waitForSectionsToShow(typeName);
    }

    async openLeasingTeamTypeMenu(): Promise<void> {
        await this.selectTeamTypeWrapper.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
    }

    async clearLeasingTeamType(): Promise<void> {
        const clearIcon = this.selectTeamTypeWrapper.locator('.mdi-close, [aria-label="clear icon"]').first();
        if (await clearIcon.isVisible().catch(() => false)) {
            await clearIcon.click();
        }
    }

    private async waitForSectionsToShow(sectionName: string): Promise<void> {
        await expect.poll(async () => {
            const names = await this.getVisibleSectionNames();
            return names.length === 1 && names[0] === sectionName;
        }, { timeout: 10000, intervals: [200, 400, 800] }).toBeTruthy();
    }

    // ===== SEARCH USERS BY ROLE =====

    async searchUsersByRole(roleName: string): Promise<void> {
        const before = await this.availableUserChips.count();
        await this.searchUsersByRoleWrapper.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
        await this.pickAutocompleteOption(roleName);
        await expect.poll(async () => this.availableUserChips.count(), {
            timeout: 10000,
            intervals: [200, 400, 800],
        }).not.toBe(before);
    }

    async clearSearchUsersByRole(): Promise<void> {
        const clearIcon = this.searchUsersByRoleWrapper.locator('.mdi-close, [aria-label="clear icon"]').first();
        if (await clearIcon.isVisible().catch(() => false)) {
            await clearIcon.click();
        }
    }

    getAvailableUserChipByText(userText: string): Locator {
        return this.availableUserChips.filter({ hasText: userText });
    }

    async getAvailableUsersCount(): Promise<number> {
        return this.availableUserChips.count();
    }

    async getAvailableUserTexts(): Promise<string[]> {
        const texts = await this.availableUserChips.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    async expectAvailableUserVisible(userText: string): Promise<void> {
        await expect(this.getAvailableUserChipByText(userText)).toBeVisible();
    }

    // ===== DRAG AND DROP =====

    async dragUserToTeamCard(userText: string, teamName: string): Promise<void> {
        const source = this.getAvailableUserChipByText(userText).first();
        const target = this.getCardByTeamName(teamName);
        await source.waitFor({ state: 'visible', timeout: 5000 });
        await target.waitFor({ state: 'visible', timeout: 5000 });

        const sourceBox = await source.boundingBox();
        const targetBox = await target.boundingBox();
        if (!sourceBox || !targetBox) {
            throw new Error(`Cannot drag: missing bounding box (source=${!!sourceBox}, target=${!!targetBox})`);
        }

        const startX = sourceBox.x + sourceBox.width / 2;
        const startY = sourceBox.y + sourceBox.height / 2;
        const endX = targetBox.x + targetBox.width / 2;
        const endY = targetBox.y + targetBox.height / 2;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + 10, startY + 10, { steps: 5 });
        await this.page.mouse.move(endX, endY, { steps: 20 });
        await this.page.mouse.up();

        await expect(this.getMemberChipForTeam(teamName, userText)).toBeVisible({ timeout: 10000 });
    }

    // ===== CREATE NEW =====

    async clickCreateNew(): Promise<void> {
        await this.clickElement(this.createNewButton);
    }

    // ===== AUTOCOMPLETE HELPERS =====

    private activeAutocompleteMenu(): Locator {
        return this.page.locator('.v-autocomplete__content.menuable__content__active').last();
    }

    private async pickAutocompleteOption(optionText: string): Promise<void> {
        const escaped = optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        const option = this.activeAutocompleteMenu()
            .locator('.v-list-item')
            .filter({ hasText: exactRe })
            .first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'hidden', timeout: 5000 });
    }
}
