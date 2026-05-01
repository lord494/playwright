import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export type CreateLeasingTeamData = {
    teamType: string;
    teamName: string;
    teamLead?: string;
    people?: string[];
};

export class LeasingTeamsCreateModalPage extends BasePage {
    readonly page: Page;

    readonly dialog: Locator;
    readonly title: Locator;

    readonly teamTypeWrapper: Locator;
    readonly teamTypeInput: Locator;
    readonly teamNameInput: Locator;
    readonly teamLeadWrapper: Locator;
    readonly teamLeadInput: Locator;
    readonly addPeopleWrapper: Locator;
    readonly addPeopleInput: Locator;
    readonly addPeopleSelections: Locator;
    readonly addPeopleChips: Locator;

    readonly createButton: Locator;
    readonly cancelButton: Locator;

    readonly validationMessages: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.dialog = page.locator('.v-dialog--active', {
            has: page.locator('.v-card__title', { hasText: Constants.leasingTeamsCreateModalTitle }),
        });
        this.title = this.dialog.locator('.v-card__title');

        this.teamTypeWrapper = this.dialog.locator('.v-input', {
            has: page.locator('label', { hasText: Constants.leasingTeamsCreateTeamTypeLabel }),
        });
        this.teamTypeInput = this.dialog.locator('input[name="teamType"][type="text"]');

        this.teamNameInput = this.dialog.locator('input[name="teamName"]');

        this.teamLeadWrapper = this.dialog.locator('.v-input', {
            has: page.locator('label', { hasText: Constants.leasingTeamsTeamLeadLabel }),
        });
        this.teamLeadInput = this.dialog.locator('input[name="teamLead"][type="text"]');

        this.addPeopleWrapper = this.dialog.locator('.v-input', {
            has: page.locator('label', { hasText: Constants.leasingTeamsAddPeopleLabel }),
        });
        this.addPeopleSelections = this.addPeopleWrapper.locator('.v-select__selections');
        this.addPeopleInput = this.addPeopleSelections.locator('input[type="text"]');
        this.addPeopleChips = this.addPeopleSelections.locator('.v-chip');

        this.createButton = this.dialog.getByRole('button', {
            name: Constants.leasingTeamsCreateButtonLabel,
            exact: true,
        });
        this.cancelButton = this.dialog.getByRole('button', {
            name: Constants.leasingTeamsCancelButtonLabel,
            exact: true,
        });

        this.validationMessages = this.dialog.locator('.v-messages__message');
    }

    // ===== STATE =====

    async expectOpen(): Promise<void> {
        await this.dialog.waitFor({ state: 'visible', timeout: 10000 });
    }

    async expectClosed(): Promise<void> {
        await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async expectCreateEnabled(): Promise<void> {
        await expect(this.createButton).toBeEnabled();
    }

    async expectCreateDisabled(): Promise<void> {
        await expect(this.createButton).toBeDisabled();
    }

    // ===== FIELDS =====

    async selectTeamType(typeName: string): Promise<void> {
        await this.teamTypeWrapper.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
        await this.pickAutocompleteOption(typeName);
    }

    async fillTeamName(name: string): Promise<void> {
        await this.fillInputField(this.teamNameInput, name);
    }

    async clearTeamName(): Promise<void> {
        await this.teamNameInput.click();
        await this.teamNameInput.clear();
    }

    async selectTeamLead(leadName: string): Promise<void> {
        await this.teamLeadWrapper.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
        await this.teamLeadInput.type(leadName, { delay: 30 });
        await this.pickFilteredOption(leadName);
    }

    async addPerson(personName: string): Promise<void> {
        const chipsBefore = await this.addPeopleChips.count();
        if (!(await this.isAddPeopleMenuOpen())) {
            await this.addPeopleWrapper.click();
            await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
        }
        await this.addPeopleInput.type(personName, { delay: 30 });

        const menu = this.activeAutocompleteMenu();
        const option = menu.locator('.v-list-item').filter({ hasText: personName }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();

        await expect.poll(async () => this.addPeopleChips.count(), {
            timeout: 5000,
            intervals: [100, 200, 400],
        }).toBeGreaterThan(chipsBefore);
    }

    async addPeople(personNames: string[]): Promise<void> {
        for (const name of personNames) {
            await this.addPerson(name);
        }
        await this.closeAddPeopleMenu();
    }

    async closeAddPeopleMenu(): Promise<void> {
        if (await this.isAddPeopleMenuOpen()) {
            await this.page.keyboard.press('Escape');
            await this.activeAutocompleteMenu().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        }
    }

    private async isAddPeopleMenuOpen(): Promise<boolean> {
        return this.activeAutocompleteMenu().isVisible().catch(() => false);
    }

    async removePerson(personName: string): Promise<void> {
        const chip = this.getSelectedPersonChip(personName);
        await chip.waitFor({ state: 'visible', timeout: 5000 });
        await chip.locator('button.v-chip__close, .v-chip__close').first().click();
        await chip.waitFor({ state: 'detached', timeout: 5000 });
    }

    getSelectedPersonChip(personName: string): Locator {
        return this.addPeopleChips.filter({ hasText: personName });
    }

    async getSelectedPeopleTexts(): Promise<string[]> {
        const texts = await this.addPeopleChips.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    async getSelectedPeopleCount(): Promise<number> {
        return this.addPeopleChips.count();
    }

    // ===== ACTIONS =====

    async clickCreate(): Promise<void> {
        await this.clickElement(this.createButton);
    }

    async clickCancel(): Promise<void> {
        await this.clickElement(this.cancelButton);
    }

    async submit(): Promise<void> {
        await this.clickCreate();
        await this.expectClosed();
    }

    async cancel(): Promise<void> {
        await this.clickCancel();
        await this.expectClosed();
    }

    async createTeam(data: CreateLeasingTeamData): Promise<void> {
        await this.expectOpen();
        await this.selectTeamType(data.teamType);
        await this.fillTeamName(data.teamName);
        if (data.teamLead) {
            await this.selectTeamLead(data.teamLead);
        }
        if (data.people && data.people.length > 0) {
            await this.addPeople(data.people);
        }
        await this.submit();
    }

    // ===== VALIDATION =====

    async getValidationMessages(): Promise<string[]> {
        const texts = await this.validationMessages.allTextContents();
        return texts.map(t => t.trim()).filter(Boolean);
    }

    async expectValidationMessage(message: string): Promise<void> {
        await expect(this.validationMessages.filter({ hasText: message }).first()).toBeVisible();
    }

    // ===== AUTOCOMPLETE HELPERS =====

    private activeAutocompleteMenu(): Locator {
        return this.page.locator('.v-autocomplete__content.menuable__content__active').last();
    }

    private async pickAutocompleteOption(optionText: string): Promise<void> {
        const escaped = optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactRe = new RegExp(`^\\s*${escaped}\\s*$`);
        const menu = this.activeAutocompleteMenu();
        const option = menu.locator('.v-list-item').filter({ hasText: exactRe }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await menu.waitFor({ state: 'hidden', timeout: 5000 });
    }

    private async pickFilteredOption(searchText: string): Promise<void> {
        const menu = this.activeAutocompleteMenu();
        const option = menu.locator('.v-list-item').filter({ hasText: searchText }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await menu.waitFor({ state: 'hidden', timeout: 5000 });
    }
}
