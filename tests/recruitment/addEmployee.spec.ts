import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda employee sa statusom Unemployed', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.unemployedStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhone);
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees?page=1&perPage=100&search=' + randomPhone) && response.status() == 200 || response.status() == 304);
    await expect(recruitmentOverview.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitmentOverview.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitmentOverview.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitmentOverview.stausColumn.first()).toContainText(Constants.unemployedStatus);
    await expect(recruitmentOverview.stausColumn.first()).toHaveCSS('background-color', Constants.unemployedStatusColor);
    await expect(recruitmentOverview.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitmentOverview.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitmentOverview.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitmentOverview.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom Employed', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.empolyedStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhone);
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees?page=1&perPage=100&search=' + randomPhone) && response.status() == 200 || response.status() == 304);
    await expect(recruitmentOverview.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitmentOverview.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitmentOverview.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitmentOverview.stausColumn.first()).toContainText(Constants.employedStatus);
    await expect(recruitmentOverview.stausColumn.first()).toHaveCSS('background-color', Constants.employedStatusColor);
    await expect(recruitmentOverview.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitmentOverview.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitmentOverview.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitmentOverview.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom Blocked', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.blockedStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhone);
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees?page=1&perPage=100&search=' + randomPhone) && response.status() == 200 || response.status() == 304);
    await expect(recruitmentOverview.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitmentOverview.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitmentOverview.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitmentOverview.stausColumn.first()).toContainText(Constants.blockedStatus);
    await expect(recruitmentOverview.stausColumn.first()).toHaveCSS('background-color', Constants.blockedStatusColor);
    await expect(recruitmentOverview.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitmentOverview.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitmentOverview.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitmentOverview.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom ex driver', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.exDriversStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhone);
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees?page=1&perPage=100&search=' + randomPhone) && response.status() == 200 || response.status() == 304);
    await expect(recruitmentOverview.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitmentOverview.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitmentOverview.recruiterColumn.first()).toContainText(Constants.plawrightRecruiter);
    await expect(recruitmentOverview.stausColumn.first()).toContainText(Constants.exDriversStatus);
    await expect(recruitmentOverview.stausColumn.first()).toHaveCSS('background-color', Constants.exDriversStatusColor);
    await expect(recruitmentOverview.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitmentOverview.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitmentOverview.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitmentOverview.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da doda employee sa statusom Hold', async ({ addEmployeeSetup, recruitmentOverview }) => {
    addEmployeeSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await recruitmentOverview.page.goto(Constants.recruitmentUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await recruitmentOverview.recruiterTab.click();
    await recruitmentOverview.selectRecruiter(recruitmentOverview.searchRecruiterMenu, recruitmentOverview.recruiterPetarPetrovicOption);
    await recruitmentOverview.selectOnlyStatus('hold');
    await recruitmentOverview.progressBar.waitFor({ state: 'hidden', timeout: 5000 });
    await recruitmentOverview.page.waitForLoadState('networkidle', { timeout: 5000 });
    await recruitmentOverview.deleteLastIf20OrMore();
    await recruitmentOverview.employeesTab.click();
    await recruitmentOverview.progressBar.waitFor({ state: 'hidden', timeout: 5000 });
    await recruitmentOverview.addNewEmployeeButton.click();
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterPetarPetrovicOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.holdStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhone);
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees?page=1&perPage=100&search=' + randomPhone) && response.status() == 200 || response.status() == 304);
    await expect(recruitmentOverview.cdlColumn.first()).toContainText(randomCdl);
    await expect(recruitmentOverview.employeeNameColumn.first()).toContainText(Constants.driverName);
    await expect(recruitmentOverview.recruiterColumn.first()).toContainText(Constants.recruiterPetarPetrovic);
    await expect(recruitmentOverview.stausColumn.first()).toContainText(Constants.holdStatus);
    await expect(recruitmentOverview.stausColumn.first()).toHaveCSS('background-color', Constants.holdStatusColor);
    await expect(recruitmentOverview.emailColumn.first()).toContainText(Constants.testEmail);
    await expect(recruitmentOverview.phoneColumn.first()).toContainText(randomPhone);
    await expect(recruitmentOverview.countryColumn.first()).toContainText(Constants.state);
    await expect(recruitmentOverview.noteColumn.first()).toContainText(Constants.noteFirst);
});

test('Korisnik moze da pretrazuje zaposlenog po broju telefona i da ga obrise', async ({ addEmployeeSetup, recruitmentOverview }) => {
    addEmployeeSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.unemployedStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhone);
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees?page=1&perPage=100&search=' + randomPhone) && response.status() == 200 || response.status() == 304);
    await expect(recruitmentOverview.phoneColumn.first()).toContainText(randomPhone);
    await recruitmentOverview.deleteIcon.click();
    await expect(recruitmentOverview.phoneColumn).not.toBeVisible();
});

test('Korisnik ne moze da doda employee sa statusom stop ako taj regruter ima vec 100 employee sa tim statusom', async ({ addEmployeeSetup }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterPetarPetrovicOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.stopStatus);
    await addEmployeeSetup.saveButton.click();
    await expect(addEmployeeSetup.alertMessage).toBeVisible({ timeout: 5000 });
    await expect(addEmployeeSetup.alertMessage).toContainText('Recruiter Petar Petrovic has reached their maximum STOP capacity (100/100). Cannot add new STOP employee. Please free up space by moving or changing the status of existing STOP employees.');
});

test("Save button je disabled dok se ne popune sva obavezna polja", async ({ addEmployeeSetup }) => {
    const randomPhone = getRandom10Number().join('');
    await expect(addEmployeeSetup.saveButton).toBeDisabled();
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.unemployedStatus);
    await expect(addEmployeeSetup.saveButton).not.toBeDisabled();
});

test('Korisnik ne moze da doda novog zaposlenog ako broj telefona vec postoji', async ({ addEmployeeSetup, recruitmentOverview }) => {
    await recruitmentOverview.closeButton.click();
    const existPhone = await recruitmentOverview.phoneColumn.first().allInnerTexts();
    await recruitmentOverview.addNewEmployeeButton.click();
    const randomCdl = get6RandomNumber().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, existPhone.join(''));
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.unemployedStatus);
    await addEmployeeSetup.saveButton.click();
    await expect(addEmployeeSetup.alertMessage).toBeVisible({ timeout: 5000 });
    await expect(addEmployeeSetup.alertMessage).toContainText('An employee with this phone number already exists');
});

test('Korisnik moze da doda edituje employee-a', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdl)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, addEmployeeSetup.recruiterOption);
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverName);
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.testEmail);
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhone);
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.state);
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteFirst);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.unemployedStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhone);
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees?page=1&perPage=100&search=' + randomPhone) && response.status() == 200 || response.status() == 304);
    await recruitmentOverview.pencilIcon.click();
    const randomCdlEdit = get6RandomNumber().join('');
    const randomPhoneEdit = getRandom10Number().join('');
    await addEmployeeSetup.cdlField.clear();
    await addEmployeeSetup.enterCdl(addEmployeeSetup.cdlField, randomCdlEdit)
    await addEmployeeSetup.selectRecruiter(addEmployeeSetup.recruiterMenu, recruitmentOverview.secondRecruiterOption);
    await addEmployeeSetup.nameField.clear();
    await addEmployeeSetup.enterName(addEmployeeSetup.nameField, Constants.driverNameFraser);
    await addEmployeeSetup.emailField.clear();
    await addEmployeeSetup.enterEmail(addEmployeeSetup.emailField, Constants.appTestEmail);
    await addEmployeeSetup.phoneField.clear();
    await addEmployeeSetup.enterPhone(addEmployeeSetup.phoneField, randomPhoneEdit);
    await addEmployeeSetup.countryField.clear();
    await addEmployeeSetup.enterCountry(addEmployeeSetup.countryField, Constants.city);
    await addEmployeeSetup.noteField.clear();
    await addEmployeeSetup.enterNote(addEmployeeSetup.noteField, Constants.noteSecond);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.stausMenu, addEmployeeSetup.empolyedStatus);
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchPhoneNumberField.click();
    await recruitmentOverview.page.keyboard.press('Control+A');
    await recruitmentOverview.page.keyboard.press('Backspace');
    await recruitmentOverview.searchPhoneNumber(recruitmentOverview.searchPhoneNumberField, randomPhoneEdit);
    await recruitmentOverview.searchButton.click();
    await recruitmentOverview.page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await expect(recruitmentOverview.cdlColumn).toContainText(randomCdlEdit);
    await expect(recruitmentOverview.employeeNameColumn).toContainText(Constants.driverNameFraser);
    await expect(recruitmentOverview.recruiterColumn).toContainText(Constants.seconPlaywrightRecruiter);
    await expect(recruitmentOverview.stausColumn).toContainText(Constants.employedStatus);
    await expect(recruitmentOverview.stausColumn).toHaveCSS('background-color', Constants.employedStatusColor);
    await expect(recruitmentOverview.emailColumn).toContainText(Constants.appTestEmail);
    await expect(recruitmentOverview.phoneColumn).toContainText(randomPhoneEdit);
    await expect(recruitmentOverview.countryColumn).toContainText(Constants.city);
    await expect(recruitmentOverview.noteColumn).toContainText(Constants.noteSecond);
});