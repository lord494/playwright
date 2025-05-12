import { Locator, Page } from "@playwright/test";

export class AddAndEditLoadModal {
    readonly page: Page;
    readonly deliveryCityMenu: Locator;
    readonly loadType: Locator;
    readonly dedicatetLoadCheckbox: Locator;
    readonly typeOfAbsence: Locator;
    readonly dateField: Locator;
    readonly commentTextfield: Locator;
    readonly addCommentButton: Locator;
    readonly closeButton: Locator;
    readonly saveButton: Locator;
    readonly deleteCommentIcon: Locator;
    readonly deleteLoadButton: Locator;
    readonly deliveryCity: Locator;
    readonly deliveryCitySecond: Locator;
    readonly addLoadModal: Locator;
    readonly deliveryCityLabel: Locator;
    readonly emptyNeedLoad: Locator;
    readonly loadedLoad: Locator;
    readonly dispatcherNotLoadedLoad: Locator;
    readonly loadProblemLoad: Locator;
    readonly specialNote: Locator;
    readonly pmService: Locator;
    readonly repoLoad: Locator;
    readonly lotrLoad: Locator;
    readonly brokenLoad: Locator;
    readonly hometimeAbsence: Locator;
    readonly vacationAbsence: Locator;
    readonly offAbsence: Locator;
    readonly todayDate: Locator;
    readonly selectedDate: Locator;
    readonly okButtonInDatePicker: Locator;
    readonly headerDatePicker: Locator;
    readonly rightArrowIconDatePicker: Locator;
    readonly leftArrowIconDatePicker: Locator;
    readonly comments: Locator;
    readonly disabledAbsence: Locator;
    readonly disabledDatePicker: Locator;
    readonly pencilIconOnComment: Locator;
    readonly editCommentButton: Locator;
    readonly emptyNeedLoadFilter: Locator;
    readonly loadedLoadFilter: Locator;
    readonly dispatchedNotLoadedFilter: Locator;
    readonly loadProblemFilter: Locator;
    readonly brokenLoadFilter: Locator;
    readonly specialNoteFilter: Locator;
    readonly pmServiceFilter: Locator;
    readonly repoFilter: Locator;
    readonly lotrFilter: Locator;
    readonly commentsHolder: Locator;

    constructor(page: Page) {
        this.page = page;
        this.deliveryCityMenu = page.locator('.v-input--is-focused.theme--light.v-text-field .v-input__control');
        this.deliveryCityLabel = page.getByRole('textbox', { name: 'Delivery City*' });
        this.loadType = page.getByText('Load type*');
        this.dedicatetLoadCheckbox = page.getByText('Dedicated load', { exact: true });
        this.typeOfAbsence = page.getByRole('textbox', { name: 'Type of absence' });
        this.dateField = page.locator('.v-input.comment-text-field.v-input--is-label-active .v-text-field__slot');
        this.commentTextfield = page.locator('.v-input.mention-input.v-textarea .v-text-field__slot');
        this.addCommentButton = page.getByRole('button', { name: 'Add comment' });
        this.closeButton = page.getByRole('button', { name: 'Close' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.deleteCommentIcon = page.locator('.v-icon.mdi-delete');
        this.deleteLoadButton = page.getByRole('button', { name: 'Delete' });
        this.deliveryCity = page.getByRole('option', { name: 'East Washington, PA' });
        this.deliveryCitySecond = page.getByRole('option', { name: 'East Los Angeles, CA' });
        this.addLoadModal = page.locator('.v-dialog.v-dialog--active');
        this.emptyNeedLoad = page.getByRole('option', { name: 'EMPTY, NEED LOAD' });
        this.loadedLoad = page.getByRole('option', { name: 'LOADED', exact: true });
        this.dispatcherNotLoadedLoad = page.getByRole('option', { name: 'DISPATCHED, NOT LOADED', exact: true });
        this.loadProblemLoad = page.getByRole('option', { name: 'LOAD PROBLEM', exact: true });
        this.specialNote = page.getByRole('option', { name: 'SPECIAL NOTE', exact: true });
        this.pmService = page.getByRole('option', { name: 'PM SERVICE', exact: true });
        this.repoLoad = page.getByRole('option', { name: 'REPO', exact: true });
        this.lotrLoad = page.getByRole('option', { name: 'L.O.T.R.', exact: true });
        this.brokenLoad = page.getByRole('option', { name: 'BROKEN', exact: true });
        this.hometimeAbsence = page.getByRole('option', { name: 'HOMETIME', exact: true });
        this.vacationAbsence = page.getByRole('option', { name: 'VACATION', exact: true });
        this.offAbsence = page.getByRole('option', { name: 'OFF', exact: true });
        this.todayDate = page.locator('.v-btn.v-date-picker-table__current.v-btn--active .v-btn__content');
        this.selectedDate = page.locator('.v-btn--active .v-btn__content');
        this.okButtonInDatePicker = page.getByRole('button', { name: 'OK', exact: true });
        this.headerDatePicker = page.locator('.v-date-picker-header__value');
        this.rightArrowIconDatePicker = page.locator('.v-icon.notranslate.mdi.mdi-chevron-right.theme--light');
        this.leftArrowIconDatePicker = page.locator('.v-icon.notranslate.mdi.mdi-chevron-left.theme--light');
        this.comments = page.locator('.comments-wrapper .v-list-item.theme--light');
        this.disabledAbsence = page.locator('.v-input.menu-comment-type.v-input--is-disabled');
        this.disabledDatePicker = page.locator('.v-input--is-label-active.v-input--is-dirty.v-input--is-disabled');
        this.pencilIconOnComment = page.locator('.v-icon.mdi-pencil');
        this.editCommentButton = page.getByRole('button', { name: 'Edit comment' });
        this.emptyNeedLoadFilter = page.locator('.v-chip__content', { hasText: 'EMPTY, NEED LOAD' });
        this.loadedLoadFilter = page.locator('.v-chip__content').filter({ hasText: /LOADED/ });
        this.dispatchedNotLoadedFilter = page.locator('.v-chip__content', { hasText: 'DISPATCHED, NOT LOADED' });
        this.loadProblemFilter = page.locator('.v-chip__content', { hasText: 'LOAD PROBLEM' });
        this.brokenLoadFilter = page.locator('.v-chip__content', { hasText: 'BROKEN' });
        this.specialNoteFilter = page.locator('.v-chip__content', { hasText: 'SPECIAL NOTE' });
        this.pmServiceFilter = page.locator('.v-chip__content', { hasText: 'PM SERVICE' });
        this.repoFilter = page.locator('.v-chip__content', { hasText: 'REPO' });
        this.lotrFilter = page.locator('.v-chip__content', { hasText: 'L.O.T.R.' });
        this.commentsHolder = page.locator('.comments-holder');
    }

    async fillAndSelectOption(locator: Locator, text: string, locator2: Locator): Promise<void> {
        await locator.click();
        await locator.clear();
        await locator.type(text, { delay: 30 });
        await locator2.waitFor({ state: 'visible', timeout: 3000 });
        await locator2.click();
    }

    async selectFromMenu(menu: Locator, optionFromMenu: Locator) {
        await menu.waitFor({ state: 'visible', timeout: 3000 });
        await menu.click();
        await this.page.waitForLoadState('networkidle');
        await optionFromMenu.click();
    }

    async check(checkbox: Locator): Promise<void> {
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
            await checkbox.click();
        }
    }

    async enterComment(locator: Locator, text: string, button: Locator): Promise<void> {
        await locator.click();
        await locator.type(text, { delay: 30 });
        await button.click();
    }

    async editComment(addButton: Locator, locator: Locator, text: string, button: Locator): Promise<void> {
        await addButton.click();
        await locator.click();
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await locator.type(text, { delay: 30 });
        await button.click();
    }
}