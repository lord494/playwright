import { test, expect } from '@playwright/test';
import { Constants } from '../../../helpers/constants';
import { BoardsPage } from '../../../page/Content/boards.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.boardsUrl, { waitUntil: 'networkidle', timeout: 20000 });
});

test('15 rows per page je prikazano po defaultu', async ({ page }) => {
    const board = new BoardsPage(page);
    await expect(board.rowsPerPageDropdownMenu).toContainText('10');
});

test('Izaberi 10 rows per page', async ({ page }) => {
    const board = new BoardsPage(page);
    await board.selectRowsPerPage(board.rowsPerPageDropdownMenu, board.rows15PerPage);
    await expect(board.rowsPerPageDropdownMenu).toContainText('15');
});

test('Izaberi 25 rows per page', async ({ page }) => {
    const board = new BoardsPage(page);
    await board.selectRowsPerPage(board.rowsPerPageDropdownMenu, board.rows25PerPage);
    await expect(board.rowsPerPageDropdownMenu).toContainText('25');
});

test('Korisnik moze da otvori add user modal', async ({ page }) => {
    const board = new BoardsPage(page);
    await board.clickElement(board.addBoardIcon);
});

test('Korisnik moze da otvori edit user modal', async ({ page }) => {
    const board = new BoardsPage(page);
    await board.clickElement(board.pencilIcon.first());
    await expect(board.addModal).toBeVisible();
});

test('Korisnik moze da otvori ordered modal', async ({ page }) => {
    const board = new BoardsPage(page);
    await board.clickElement(board.orderedIcon.first());
    await expect(board.addModal).toBeVisible();
});

test('Korisnik moze da doda Board', async ({ page }) => {
    const board = new BoardsPage(page);
    await page.waitForLoadState('networkidle');
    const elements = await page.locator('tr td:nth-child(2)').all();
    const lastText = await elements[elements.length - 1].innerText();
    const nextNumber = parseInt(lastText, 10) + 1;
    await board.clickElement(board.addBoardIcon);
    await board.fillBoardName(board.nameBoardField, Constants.newBoard);
    await board.clickElement(board.orderField);
    await board.orderField.clear();
    await board.orderField.fill(nextNumber.toString());
    await board.clickAddButton();
    await board.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(board.userNameColumn.last()).toContainText(Constants.newBoard);
    await expect(board.orderColumn.last()).toContainText(nextNumber.toString());
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await board.clickElement(board.grayDeleteIcon.last());
    await expect(board.snackMessage).toContainText(Constants.newBoard + " successfully deleted");
});

test('Korisnik moze da obrise Board', async ({ page }) => {
    const board = new BoardsPage(page);
    const elements = await page.locator('tr td:nth-child(2)').all();
    const lastText = await elements[elements.length - 1].innerText();
    const nextNumber = parseInt(lastText, 10) + 1;
    await board.clickElement(board.addBoardIcon);
    await board.fillBoardName(board.nameBoardField, Constants.newBoard);
    await board.clickElement(board.orderField);
    await board.orderField.clear();
    await board.orderField.fill(nextNumber.toString());
    await board.clickAddButton();
    await board.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(board.userNameColumn.last()).toContainText(Constants.newBoard);
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await board.clickElement(board.grayDeleteIcon.last());
    await expect(board.snackMessage).toContainText(Constants.newBoard + " successfully deleted");
});

test('Korisnik moze da edituje Board', async ({ page }) => {
    const board = new BoardsPage(page);
    await page.waitForLoadState('networkidle');
    const elements = await page.locator('tr td:nth-child(2)').all();
    const lastText = await elements[elements.length - 1].innerText();
    const nextNumber = parseInt(lastText, 10) + 1;
    const nextNumber2 = parseInt(lastText, 10) + 2;
    await board.clickElement(board.addBoardIcon);
    await board.fillBoardName(board.nameBoardField, Constants.newBoard);
    await board.clickElement(board.orderField);
    await board.orderField.clear();
    await board.orderField.fill(nextNumber.toString());
    await board.clickAddButton();
    await board.addModal.waitFor({ state: "detached", timeout: 5000 });
    await expect(board.userNameColumn.last()).toContainText(Constants.newBoard);
    await expect(board.orderColumn.last()).toContainText(nextNumber.toString());
    await board.clickElement(board.pencilIcon.last());
    await board.nameBoardField.clear();
    await board.fillBoardName(board.nameBoardField, Constants.newBoardEdit);
    await board.orderField.clear();
    await board.orderField.fill(nextNumber2.toString());
    await board.clickSaveButton();
    await expect(board.userNameColumn.last()).toContainText(Constants.newBoardEdit);
    await expect(board.orderColumn.last()).toContainText(nextNumber2.toString());
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    await board.clickElement(board.grayDeleteIcon.last());
    await expect(board.snackMessage).toContainText(Constants.newBoardEdit + " successfully deleted");
});