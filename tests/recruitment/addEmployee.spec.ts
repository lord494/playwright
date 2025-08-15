import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { RecrutimentPage } from '../../page/recruitment/recruitmentOverview.page';
import { AddNewEmployeePage } from '../../page/recruitment/addNewEmployee.page';
import { get6RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    await page.goto(Constants.recruitmentUrl, { waitUntil: 'networkidle' });
    await recruitment.addNewEmployeeButton.click();
});

test('Korisnik moze da doda employee sa statusom Unemployed', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
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
    await expect(recruitment.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.unemployedStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.unemployedStatusColor);
    await expect(recruitment.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitment.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom Employed', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.empolyedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.employedStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.employedStatusColor);
    await expect(recruitment.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitment.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom Blocked', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.blockedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.blockedStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.blockedStatusColor);
    await expect(recruitment.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitment.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom ex driver', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.exDriversStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.exDriversStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.exDriversStatusColor);
    await expect(recruitment.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitment.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom Hold', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.holdStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.holdStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.holdStatusColor);
    await expect(recruitment.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitment.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da pretrazuje zaposlenog po broju telefona i da ga obrise', async ({ page }) => {
    page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await recruitment.searchField.fill(randomPhone);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhone);
    await recruitment.deleteIcon.click();
    await expect(recruitment.phoneColumn).not.toBeVisible();
});

test('Korisnik moze da pretrazuje zaposlenog po imenu', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await recruitment.searchField.fill(Constants.driverName);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    const nameCells = await recruitment.employeeNameColumn.allTextContents();
    for (const name of nameCells) {
        expect(name).toContain(Constants.driverName);
    }
});

test("Korisnik moze da pretrazuje zaposlenog po CDL broju", async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await recruitment.searchField.fill(randomCdl);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    const cdl = await recruitment.cdlColumn.allTextContents();
    for (const cdlName of cdl) {
        expect(cdlName).toContain(randomCdl);
    }
});

test("Save button je disabled dok se ne popune sva obavezna polja", async ({ page }) => {
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhone = getRandom10Number().join('');
    await expect(addEmployee.saveButton).toBeDisabled();
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await expect(addEmployee.saveButton).not.toBeDisabled();
});

test("Recruiter meni je obavezno polje", async ({ page }) => {
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhone = getRandom10Number().join('');
    await expect(addEmployee.saveButton).toBeDisabled();
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await addEmployee.saveButton.click();
    await expect(addEmployee.errorMessage).toContainText('The recruiter field is required');
});

test('Novi employee se nalazi kod odgovarajuce regrutera', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhone = getRandom10Number().join('');
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhone);
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await recruitment.recruiterTab.click();
    await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruitment.recruiterOption);
    await page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    const phoneNumbers = await recruitment.phoneColumn.allTextContents();
    const hasPhone = phoneNumbers.some(phone => phone.includes(randomPhone));
    expect(hasPhone).toBe(true);
});

test('Korisnik ne moze da doda novog zaposlenog ako broj telefona vec postoji', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    await recruitment.closeButton.click();
    const existPhone = await recruitment.phoneColumn.first().allInnerTexts();
    await recruitment.addNewEmployeeButton.click();
    const randomCdl = get6RandomNumber().join('');
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdl)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, addEmployee.recruiterOption);
    await addEmployee.enterName(addEmployee.nameField, Constants.driverName);
    await addEmployee.enterEmail(addEmployee.emailField, Constants.testEmail);
    await addEmployee.enterPhone(addEmployee.phoneField, existPhone.join(''));
    await addEmployee.enterCountry(addEmployee.countryField, Constants.state);
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteFirst);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.unemployedStatus);
    await addEmployee.saveButton.click();
    await expect(addEmployee.alertMessage).toBeVisible({ timeout: 5000 });
    await expect(addEmployee.alertMessage).toContainText('An employee with this PHONE NUMBER already exists.');
});