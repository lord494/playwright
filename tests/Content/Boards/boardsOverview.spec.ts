import { expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { test } from '../../fixtures/fixtures';

test('15 rows per page je prikazano po defaultu', async ({ boardPage }) => {
    await expect(boardPage.rowsPerPageDropdownMenu).toContainText('10');
});

test('Izaberi 10 rows per page', async ({ boardPage }) => {
    await boardPage.selectRowsPerPage(boardPage.rowsPerPageDropdownMenu, boardPage.rows15PerPage);
    await expect(boardPage.rowsPerPageDropdownMenu).toContainText('15');
});

test('Izaberi 25 rows per page', async ({ boardPage }) => {
    await boardPage.selectRowsPerPage(boardPage.rowsPerPageDropdownMenu, boardPage.rows25PerPage);
    await expect(boardPage.rowsPerPageDropdownMenu).toContainText('25');
});

test('Korisnik moze da otvori add user modal', async ({ boardPage }) => {
    await boardPage.clickElement(boardPage.addBoardIcon);
});

test('Korisnik moze da otvori edit user modal', async ({ boardPage }) => {
    await boardPage.clickElement(boardPage.pencilIcon.first());
    await expect(boardPage.addModal).toBeVisible();
});

test('Korisnik moze da otvori ordered modal', async ({ boardPage }) => {
    await boardPage.clickElement(boardPage.orderedIcon.first());
    await expect(boardPage.addModal).toBeVisible();
});

test('Korisnik moze da doda Board', async ({ boardPage }) => {
    const elements = await boardPage.page.locator('tr td:nth-child(2)').all();
    const lastText = await elements[elements.length - 1].innerText();
    const nextNumber = parseInt(lastText, 10) + 1;
    await boardPage.clickElement(boardPage.addBoardIcon);
    await boardPage.fillBoardName(boardPage.nameBoardField, Constants.newBoard);
    await boardPage.clickElement(boardPage.orderField);
    await boardPage.orderField.clear();
    await boardPage.orderField.fill(nextNumber.toString());
    await boardPage.clickAddButton();
    await boardPage.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(boardPage.userNameColumn.last()).toContainText(Constants.newBoard);
    await expect(boardPage.orderColumn.last()).toContainText(nextNumber.toString());
    boardPage.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await boardPage.clickElement(boardPage.grayDeleteIcon.last());
    await expect(boardPage.snackMessage).toContainText(Constants.newBoard + " successfully deleted");
});

test('Korisnik moze da obrise Board', async ({ boardPage }) => {
    const elements = await boardPage.page.locator('tr td:nth-child(2)').all();
    const lastText = await elements[elements.length - 1].innerText();
    const nextNumber = parseInt(lastText, 10) + 1;
    await boardPage.clickElement(boardPage.addBoardIcon);
    await boardPage.fillBoardName(boardPage.nameBoardField, Constants.newBoard);
    await boardPage.clickElement(boardPage.orderField);
    await boardPage.orderField.clear();
    await boardPage.orderField.fill(nextNumber.toString());
    await boardPage.clickAddButton();
    await boardPage.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(boardPage.userNameColumn.last()).toContainText(Constants.newBoard);
    boardPage.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await boardPage.clickElement(boardPage.grayDeleteIcon.last());
    await expect(boardPage.snackMessage).toContainText(Constants.newBoard + " successfully deleted");
});

test('Korisnik moze da edituje Board', async ({ boardPage }) => {
    const elements = await boardPage.page.locator('tr td:nth-child(2)').all();
    const lastText = await elements[elements.length - 1].innerText();
    const nextNumber = parseInt(lastText, 10) + 1;
    const nextNumber2 = parseInt(lastText, 10) + 2;
    await boardPage.clickElement(boardPage.addBoardIcon);
    await boardPage.fillBoardName(boardPage.nameBoardField, Constants.newBoard);
    await boardPage.clickElement(boardPage.orderField);
    await boardPage.orderField.clear();
    await boardPage.orderField.fill(nextNumber.toString());
    await boardPage.clickAddButton();
    await boardPage.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(boardPage.userNameColumn.last()).toContainText(Constants.newBoard);
    await expect(boardPage.orderColumn.last()).toContainText(nextNumber.toString());
    await boardPage.clickElement(boardPage.pencilIcon.last());
    await boardPage.nameBoardField.clear();
    await boardPage.fillBoardName(boardPage.nameBoardField, Constants.newBoardEdit);
    await boardPage.orderField.clear();
    await boardPage.orderField.fill(nextNumber2.toString());
    await boardPage.clickSaveButton();
    await expect(boardPage.userNameColumn.last()).toContainText(Constants.newBoardEdit);
    await expect(boardPage.orderColumn.last()).toContainText(nextNumber2.toString());
    boardPage.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await boardPage.clickElement(boardPage.grayDeleteIcon.last());
    await expect(boardPage.snackMessage).toContainText(Constants.newBoardEdit + " successfully deleted");
});
