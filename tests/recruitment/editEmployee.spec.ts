import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { RecrutimentPage } from '../../page/recruitment/recruitmentOverview.page';
import { AddNewEmployeePage } from '../../page/recruitment/addNewEmployee.page';
import { get6RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';

test.use({ storageState: 'auth.json' });

// Dodavanje unepmloyed statusa prije svakog testa 
test.beforeEach(async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhone = getRandom10Number().join('');
    const randomCdl = get6RandomNumber().join('');
    await page.goto(Constants.recruitmentUrl, { waitUntil: 'networkidle' });
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
    await recruitment.dialogBox.waitFor({ state: 'detached' });
});

test('Korisnik moze da edituje employee', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomCdlEdit = get6RandomNumber().join('');
    const randomPhoneEdit = getRandom10Number().join('');
    await recruitment.pencilIcon.first().click();
    await addEmployee.cdlField.clear();
    await addEmployee.enterCdl(addEmployee.cdlField, randomCdlEdit)
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, recruitment.secondRecruiterOption);
    await addEmployee.nameField.clear();
    await addEmployee.enterName(addEmployee.nameField, Constants.driverNameFraser);
    await addEmployee.emailField.clear();
    await addEmployee.enterEmail(addEmployee.emailField, Constants.appTestEmail);
    await addEmployee.phoneField.clear();
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhoneEdit);
    await addEmployee.countryField.clear();
    await addEmployee.enterCountry(addEmployee.countryField, Constants.city);
    await addEmployee.noteField.clear();
    await addEmployee.enterNote(addEmployee.noteField, Constants.noteSecond);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.empolyedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.cdlColumn.first()).toContainText(randomCdlEdit);
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverNameFraser);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.seconPlaywrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.employedStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.employedStatusColor);
    await expect(recruitment.emailColumn.first()).toContainText(Constants.appTestEmail);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhoneEdit);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.city);
    await expect(recruitment.noteColumn.first()).toContainText(Constants.noteSecond);
});

test('Korisnik moze da promjeni status u blocked', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhoneEdit = getRandom10Number().join('');
    await recruitment.pencilIcon.first().click();
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, recruitment.secondRecruiterOption);
    await addEmployee.nameField.clear();
    await addEmployee.enterName(addEmployee.nameField, Constants.driverNameFraser);
    await addEmployee.phoneField.clear();
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhoneEdit);
    await addEmployee.countryField.clear();
    await addEmployee.enterCountry(addEmployee.countryField, Constants.city);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.blockedStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverNameFraser);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.seconPlaywrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.blockedStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.blockedStatusColor);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhoneEdit);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.city);
});

test('Korisnik moze da promjeni status u ex drivers', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhoneEdit = getRandom10Number().join('');
    await recruitment.pencilIcon.first().click();
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, recruitment.secondRecruiterOption);
    await addEmployee.nameField.clear();
    await addEmployee.enterName(addEmployee.nameField, Constants.driverNameFraser);
    await addEmployee.phoneField.clear();
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhoneEdit);
    await addEmployee.countryField.clear();
    await addEmployee.enterCountry(addEmployee.countryField, Constants.city);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.exDriversStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverNameFraser);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.seconPlaywrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.exDriversStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.exDriversStatusColor);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhoneEdit);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.city);
});

test('Korisnik moze da promjeni status u hold', async ({ page }) => {
    const recruitment = new RecrutimentPage(page);
    const addEmployee = new AddNewEmployeePage(page);
    const randomPhoneEdit = getRandom10Number().join('');
    await recruitment.pencilIcon.first().click();
    await addEmployee.selectRecruiter(addEmployee.recruiterMenu, recruitment.secondRecruiterOption);
    await addEmployee.nameField.clear();
    await addEmployee.enterName(addEmployee.nameField, Constants.driverNameFraser);
    await addEmployee.phoneField.clear();
    await addEmployee.enterPhone(addEmployee.phoneField, randomPhoneEdit);
    await addEmployee.countryField.clear();
    await addEmployee.enterCountry(addEmployee.countryField, Constants.city);
    await addEmployee.selectStatus(addEmployee.stausMenu, addEmployee.holdStatus);
    await addEmployee.saveButton.click();
    await recruitment.dialogBox.waitFor({ state: 'detached' });
    await expect(recruitment.employeeNameColumn.first()).toContainText(Constants.driverNameFraser);
    await expect(recruitment.recruiterColumn.first()).toContainText(Constants.seconPlaywrightRecruiter);
    await expect(recruitment.stausColumn.first()).toContainText(Constants.holdStatus);
    await expect(recruitment.stausColumn.first()).toHaveCSS('background-color', Constants.holdStatusColor);
    await expect(recruitment.phoneColumn.first()).toContainText(randomPhoneEdit);
    await expect(recruitment.countryColumn.first()).toContainText(Constants.city);
});