import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../helpers/base';
import { Constants } from '../../helpers/constants';

export type UnderwritingData = {
    status: string;
    units: number;
    unitsType: string;
    approvedBy: string;
    note?: string;
};

/**
 * Day-of-month to click in the Expired date picker AFTER advancing one
 * month. Picking 15 keeps us safely inside the month regardless of
 * 28/30/31-day lengths.
 */
const EXPIRED_DATE_DAY = 15;

/**
 * Page object for the "Add Underwriting" modal — opened from the Edit modal's
 * Underwriting section via the Add new button. The modal renders in its own
 * v-dialog--active container, stacked on top of the Edit modal.
 *
 * Form `data-vv-scope="underwriting"` is the unique-ish anchor; we scope by
 * the h3 "Underwriting" headline that lives inside the same v-card so the
 * outer Edit modal's Underwriting section header doesn't strict-mode-violate.
 *
 * Start date + Expired date default to today on the server (verified on
 * staging 2026-05-20). They are NOT required by the form, so this page object
 * does not expose pickers for them — the test data we care about is Status,
 * Units, Units type, Approved By (and optionally Note).
 */
export class UnderwritingModalPage extends BasePage {
    readonly page: Page;

    readonly dialog: Locator;
    readonly form: Locator;
    readonly title: Locator;

    readonly statusWrapper: Locator;
    readonly startDateInput: Locator;
    readonly expiredDateInput: Locator;
    readonly unitsInput: Locator;
    readonly unitsTypeWrapper: Locator;
    readonly approvedByWrapper: Locator;
    readonly noteTextarea: Locator;

    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        // The modal is rendered in a fresh .v-dialog--active stacked on top of
        // the Edit modal. Scope to the dialog that contains the underwriting
        // form (data-vv-scope="underwriting" is unique to this modal).
        this.dialog = page.locator('.v-dialog--active', {
            has: page.locator('form[data-vv-scope="underwriting"]'),
        });
        this.form = this.dialog.locator('form[data-vv-scope="underwriting"]');
        this.title = this.form.locator('h3.title', { hasText: new RegExp(`^\\s*${Constants.underwritingModalTitle}\\s*$`) });

        this.statusWrapper = this.fieldWrapper(Constants.underwritingLabelStatus);
        this.startDateInput = this.form.locator('input[name="startDate"]');
        this.expiredDateInput = this.form.locator('input[name="expiredDate"]');
        this.unitsInput = this.form.locator('input[name="units"]');
        this.unitsTypeWrapper = this.fieldWrapper(Constants.underwritingLabelUnitsType);
        this.approvedByWrapper = this.fieldWrapper(Constants.underwritingLabelApprovedBy);
        this.noteTextarea = this.form.locator('textarea[name="note"]');

        this.saveButton = this.dialog.getByRole('button', { name: Constants.underwritingSaveButton, exact: true });
    }

    private fieldWrapper(labelText: string): Locator {
        const escaped = labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.form.locator('.v-input', {
            has: this.page.locator('label', { hasText: new RegExp(`^\\s*${escaped}\\s*$`) }),
        });
    }

    async expectOpen(): Promise<void> {
        await this.dialog.waitFor({ state: 'visible', timeout: 10000 });
        await this.title.waitFor({ state: 'visible', timeout: 5000 });
    }

    async expectClosed(): Promise<void> {
        await this.dialog.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async selectStatus(status: string): Promise<void> {
        await this.openMenuForWrapper(this.statusWrapper);
        await this.pickExactOption(status);
    }

    /**
     * Opens the Start date picker and selects today.
     * Server-side required even though the input is readonly + visually empty.
     */
    async selectStartDateToday(): Promise<void> {
        await this.startDateInput.click();
        const picker = this.activeAutocompleteMenu();
        await picker.waitFor({ state: 'visible', timeout: 5000 });
        await picker.locator('.v-btn.v-date-picker-table__current').click();
        await picker.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * Opens the Expired date picker, advances one month, and selects a fixed
     * day so the date is always strictly after today (server-side validation
     * likely rejects expired==start).
     */
    async selectExpiredDateNextMonth(): Promise<void> {
        await this.expiredDateInput.click();
        const picker = this.activeAutocompleteMenu();
        await picker.waitFor({ state: 'visible', timeout: 5000 });
        // Vuetify's next-month arrow has aria-label="Next month" in default locale.
        await picker.locator('[aria-label="Next month"]').click();

        // Scope the day to the date table (nav arrows live in the header, so
        // this never matches them) and use .last(): the month-slide is a
        // v-window transition that briefly keeps BOTH the outgoing and incoming
        // month tables in the DOM. The incoming (next month) table is the one
        // that survives, so .last() lands on it once the slide settles.
        const dayButton = picker
            .locator('.v-date-picker-table .v-btn', { hasText: new RegExp(`^${EXPIRED_DATE_DAY}$`) })
            .last();

        // During the transition a click can hit a detaching node in the
        // outgoing table — it "succeeds" but the selection never commits and the
        // menu stays open, which is the flaky CI timeout we saw at this step.
        // Retry the click until the picker actually closes; a real (committed)
        // selection is the only thing that auto-closes it, so closure is proof
        // the next-month day registered.
        await expect(async () => {
            await dayButton.click({ timeout: 2000 });
            await picker.waitFor({ state: 'hidden', timeout: 2000 });
        }).toPass({ timeout: 10000 });
    }

    async selectUnitsType(unitsType: string): Promise<void> {
        await this.openMenuForWrapper(this.unitsTypeWrapper);
        await this.pickExactOption(unitsType);
    }

    async selectApprovedBy(approvedBy: string): Promise<void> {
        await this.openMenuForWrapper(this.approvedByWrapper);
        await this.pickExactOption(approvedBy);
    }

    async fillUnits(units: number): Promise<void> {
        await this.unitsInput.click();
        await this.unitsInput.fill(String(units));
    }

    async fillNote(text: string): Promise<void> {
        await this.fillInputField(this.noteTextarea, text);
    }

    async fill(data: UnderwritingData): Promise<void> {
        await this.selectStatus(data.status);
        // Date fields are server-side required even though they look optional —
        // skipping them produces "The Start date field is required" / "The
        // Expired date field is required" validation errors that silently keep
        // the modal open.
        await this.selectStartDateToday();
        await this.selectExpiredDateNextMonth();
        await this.fillUnits(data.units);
        await this.selectUnitsType(data.unitsType);
        await this.selectApprovedBy(data.approvedBy);
        if (data.note) await this.fillNote(data.note);
    }

    async save(): Promise<void> {
        await this.clickElement(this.saveButton);
    }

    /**
     * Saves the form and waits for the modal to detach. The POST hits
     * /ms-leasing/underwritings (verified 2026-05-20); we additionally await
     * the underlying request for stability across slower CI environments.
     */
    async saveAndExpectClosed(): Promise<void> {
        const respPromise = this.page.waitForResponse(
            r => r.url().includes('/ms-leasing') && r.request().method() === 'POST',
            { timeout: 10000 },
        ).catch(() => null);
        await this.save();
        await respPromise;
        await this.expectClosed();
    }

    /** Convenience: fill + save in one call. */
    async create(data: UnderwritingData): Promise<void> {
        await this.expectOpen();
        await this.fill(data);
        await this.saveAndExpectClosed();
    }

    // ===== AUTOCOMPLETE HELPERS (mirrors NewCompanyModalPage) =====

    private activeAutocompleteMenu(): Locator {
        return this.page.locator('.menuable__content__active').last();
    }

    private async openMenuForWrapper(wrapper: Locator): Promise<void> {
        const slot = wrapper.locator('.v-input__slot').first();
        await slot.click();
        await this.activeAutocompleteMenu().waitFor({ state: 'visible', timeout: 5000 });
    }

    private async pickExactOption(optionText: string): Promise<void> {
        const escaped = optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`^\\s*${escaped}\\s*$`);
        const menu = this.activeAutocompleteMenu();
        const option = menu.locator('.v-list-item').filter({ hasText: re }).first();
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        await menu.waitFor({ state: 'hidden', timeout: 5000 });
    }
}
