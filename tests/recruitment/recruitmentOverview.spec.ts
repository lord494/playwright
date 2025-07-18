import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { RecrutimentPage } from '../../page/recruitment/recruitmentOverview.page';
import { AddNewEmployeePage } from '../../page/recruitment/addNewEmployee.page';
import { get6RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto(Constants.recruitmentUrl, { waitUntil: 'networkidle' });
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo unemployed statusi', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await recruitment.uncheck(recruitment.employedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.employedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.blocedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.blocedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.retiredCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.retiredCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.thirdCompanyCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.thirdCompanyCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.onwerOperatorCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.onwerOperatorCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.holdCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.holdCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.incContactCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.incContactCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitment.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.unemployedStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.unemployedStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo employed statusi', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await recruitment.uncheck(recruitment.unemployedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.unemployedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.blocedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.blocedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.retiredCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.retiredCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.thirdCompanyCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.thirdCompanyCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.onwerOperatorCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.onwerOperatorCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.holdCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.holdCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.incContactCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.incContactCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitment.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.employedStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.employedStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo blocked statusi', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await recruitment.uncheck(recruitment.employedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.employedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.unemployedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.unemployedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.retiredCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.retiredCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.thirdCompanyCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.thirdCompanyCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.onwerOperatorCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.onwerOperatorCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.holdCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.holdCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.incContactCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.incContactCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitment.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.blockedStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.blockedStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo ex drivers statusi', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await recruitment.uncheck(recruitment.employedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.employedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.unemployedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.unemployedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.blocedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.blocedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.thirdCompanyCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.thirdCompanyCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.onwerOperatorCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.onwerOperatorCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.holdCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.holdCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.incContactCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.incContactCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitment.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.exDriversStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.exDriversStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo hold statusi', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await recruitment.uncheck(recruitment.employedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.employedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.unemployedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.unemployedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.blocedCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.blocedCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.thirdCompanyCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.thirdCompanyCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.onwerOperatorCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.onwerOperatorCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.retiredCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.retiredCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.uncheck(recruitment.incContactCheckbox);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.incContactCheckbox).not.toBeChecked({ timeout: 5000 });
    await recruitment.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitment.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.holdStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.holdStatusColor);
    }
});

test('Korisnik moze da se prebaci na recruiter tab', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await recruitment.recruiterTab.click();
    await expect(recruitment.recruiterTab).toHaveClass(/v-tab--active/);
});

test('Korisnik moze da bira regrutera iz Search regruter menija na recuriter tabu', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await recruitment.recruiterTab.click();
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruitment.secondRecruiterOption);
    await page.waitForLoadState('networkidle');
    await expect(recruitment.employeesTable).toContainText(Constants.seconPlaywrightRecruiter);
});

test('Korisnik moze da prebaci broj na drugog regrutera sa Move akcijom', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhone = getRandom10Number().join('');
    const randomCdl = get6RandomNumber().join('');
    await recruitment.addNewEmployeeButton.click();
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await addEmployee.saveButton.click();
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await recruitment.recruiterTab.click();
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruitment.recruiterOption);
    await recruitment.searchField.fill(randomPhone);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitment.clickElement(recruitment.checkboxOfEmployee);
    await recruitment.moveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'visible' });
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenuInMoveModal, recruitment.secondRecruiterOption.last());
    await recruitment.okButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruitment.secondRecruiterOption.last());
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitment.searchField.fill(randomPhone);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitment.clickElement(recruitment.pencilIcon);
    await expect(recruitment.recruiterFieldValue).toContainText(Constants.seconPlaywrightRecruiter);
});

test('Korisnik moze da prebaci sve brojeve na drugog regrutera sa Move All akcijom', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const phoneList: string[] = [];
    let firstPhone: string;
    let secondPhone: string;
    for (let i = 0; i < 2; i++) {
        const randomCdlNew = get6RandomNumber().join('');
        const randomPhoneNew = getRandom10Number().join('');
        phoneList.push(randomPhoneNew);
        if (i === 0) firstPhone = randomPhoneNew;
        else if (i === 1) secondPhone = randomPhoneNew;
        await recruitment.addNewEmployeeButton.click();
        await addEmployee.enterCdl(addEmployee.cdlField, randomCdlNew);
        await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
        await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
        await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
        await addEmployee.enterPhone(addEmployee.phoneField, randomPhoneNew);
        await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
        await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
        await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
        await addEmployee.saveButton.click();
        await recruitment.dialogBox.waitFor({ state: 'detached' });
    }
    await recruitment.recruiterTab.click();
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruitment.recruiterOption.last());
    await page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    await recruitment.moveAllButton.click();
    await recruitment.dialogBox.waitFor({ state: 'visible' });
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenuInMoveModal, recruitment.secondRecruiterOption.last());
    await recruitment.okButton.click();
    await page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruitment.secondRecruiterOption.last());
    await page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    const phoneColumnTexts = await recruitment.phoneColumn.allTextContents();
    expect(phoneColumnTexts).toContain(firstPhone!);
    expect(phoneColumnTexts).toContain(secondPhone!);
});

//////////////////////////////////////////// KORISTI SE POVREMENO ZA BRISANJE BAZE /////////////////////////////////////////////////
// test('Korisnik moze da obrise brojeve', async ({ page }) => {
//     const recruitment = new RecrutimentPage(page);
//     page.on('dialog', async (dialog) => {
//         await dialog.accept();
//     });
//     await recruitment.recruiterTab.click();
//     await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruitment.secondRecruiterOption);
//     await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
//     await recruitment.deleteIcon.first().waitFor({ state: 'visible' });
//     const deleteButtons = await recruitment.deleteIcon;
//     const count = await deleteButtons.count();
//     for (let i = 0; i < count; i++) {
//         await deleteButtons.nth(0).click();
//         await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
//         await page.waitForTimeout(500);
//     }
// });