import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda employee sa statusom Unemployed', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.unemployedStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await recruitmentOverview.expectFirstEmployeeRow({
        cdl: randomCdl,
        name: Constants.driverName,
        recruiter: Constants.plawrightRecruiter,
        status: Constants.unemployedStatus,
        statusColor: Constants.unemployedStatusColor,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
    });
});

test('Korisnik moze da doda employee sa statusom Employed', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.empolyedStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await recruitmentOverview.expectFirstEmployeeRow({
        cdl: randomCdl,
        name: Constants.driverName,
        recruiter: Constants.plawrightRecruiter,
        status: Constants.employedStatus,
        statusColor: Constants.employedStatusColor,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
    });
});

test('Korisnik moze da doda employee sa statusom Blocked', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.blockedStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await recruitmentOverview.expectFirstEmployeeRow({
        cdl: randomCdl,
        name: Constants.driverName,
        recruiter: Constants.plawrightRecruiter,
        status: Constants.blockedStatus,
        statusColor: Constants.blockedStatusColor,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
    });
});

test('Korisnik moze da doda employee sa statusom ex driver', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.exDriversStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await recruitmentOverview.expectFirstEmployeeRow({
        cdl: randomCdl,
        name: Constants.driverName,
        recruiter: Constants.plawrightRecruiter,
        status: Constants.exDriversStatus,
        statusColor: Constants.exDriversStatusColor,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
    });
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
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterPetarPetrovicOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.holdStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await recruitmentOverview.expectFirstEmployeeRow({
        cdl: randomCdl,
        name: Constants.driverName,
        recruiter: Constants.recruiterPetarPetrovic,
        status: Constants.holdStatus,
        statusColor: Constants.holdStatusColor,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
    });
});

test('Korisnik moze da pretrazuje zaposlenog po broju telefona i da ga obrise', async ({ addEmployeeSetup, recruitmentOverview }) => {
    addEmployeeSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.unemployedStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await expect(recruitmentOverview.phoneColumn.first()).toContainText(randomPhone);
    await recruitmentOverview.deleteIcon.click();
    await expect(recruitmentOverview.phoneColumn).not.toBeVisible();
});

test('Korisnik ne moze da doda employee sa statusom stop ako taj regruter ima vec 100 employee sa tim statusom', async ({ addEmployeeSetup }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterPetarPetrovicOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.stopStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await expect(addEmployeeSetup.alertMessage).toBeVisible({ timeout: 5000 });
    await expect(addEmployeeSetup.alertMessage).toContainText('Recruiter Petar Petrovic has reached their maximum STOP capacity (100/100). Cannot add new STOP employee. Please free up space by moving or changing the status of existing STOP employees.');
});

test("Save button je disabled dok se ne popune sva obavezna polja", async ({ addEmployeeSetup }) => {
    const randomPhone = getRandom10Number().join('');
    await expect(addEmployeeSetup.saveButton).toBeDisabled();
    await addEmployeeSetup.enterName(Constants.driverName);
    await addEmployeeSetup.enterPhone(randomPhone);
    await addEmployeeSetup.enterCountry(Constants.state);
    await addEmployeeSetup.selectStatus(addEmployeeSetup.unemployedStatus);
    await expect(addEmployeeSetup.saveButton).not.toBeDisabled();
});

// Per-field required-field matrix: name, phone, country and status are ALL
// required (verified against staging — Save enables only when all four are
// present). Each case fills three of the four and asserts Save stays disabled,
// pinpointing that no single required field was silently dropped.
const requiredFieldCases: { missing: string; fill: (p: import('../../page/recruitment/addNewEmployee.page').AddNewEmployeePage, phone: string) => Promise<void> }[] = [
    {
        missing: 'Name',
        fill: async (p, phone) => {
            await p.enterPhone(phone);
            await p.enterCountry(Constants.state);
            await p.selectStatus(p.unemployedStatus);
        },
    },
    {
        missing: 'Phone',
        fill: async (p) => {
            await p.enterName(Constants.driverName);
            await p.enterCountry(Constants.state);
            await p.selectStatus(p.unemployedStatus);
        },
    },
    {
        missing: 'Country',
        fill: async (p, phone) => {
            await p.enterName(Constants.driverName);
            await p.enterPhone(phone);
            await p.selectStatus(p.unemployedStatus);
        },
    },
    {
        missing: 'Status',
        fill: async (p, phone) => {
            await p.enterName(Constants.driverName);
            await p.enterPhone(phone);
            await p.enterCountry(Constants.state);
        },
    },
];

for (const { missing, fill } of requiredFieldCases) {
    test(`Save button ostaje disabled ako nije popunjeno obavezno polje ${missing}`, async ({ addEmployeeSetup }) => {
        const randomPhone = getRandom10Number().join('');
        await fill(addEmployeeSetup, randomPhone);
        await expect(addEmployeeSetup.saveButton).toBeDisabled();
    });
}

test('Korisnik moze da otkaze dodavanje employee-a klikom na Close bez snimanja', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.unemployedStatus,
    });
    await recruitmentOverview.closeButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await recruitmentOverview.expectNoEmployees();
});

test('Korisnik ne moze da doda novog zaposlenog ako broj telefona vec postoji', async ({ addEmployeeSetup, recruitmentOverview }) => {
    await recruitmentOverview.closeButton.click();
    const existPhone = await recruitmentOverview.phoneColumn.first().allInnerTexts();
    await recruitmentOverview.addNewEmployeeButton.click();
    const randomCdl = get6RandomNumber().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: existPhone.join(''),
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.unemployedStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await expect(addEmployeeSetup.alertMessage).toBeVisible({ timeout: 5000 });
    await expect(addEmployeeSetup.alertMessage).toContainText('An employee with this phone number already exists');
});

test('Korisnik moze da doda edituje employee-a', async ({ addEmployeeSetup, recruitmentOverview }) => {
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await addEmployeeSetup.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addEmployeeSetup.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addEmployeeSetup.unemployedStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.searchEmployeeByPhone(randomPhone);
    await recruitmentOverview.pencilIcon.click();
    const randomCdlEdit = get6RandomNumber().join('');
    const randomPhoneEdit = getRandom10Number().join('');
    await addEmployeeSetup.editEmployeeForm({
        cdl: randomCdlEdit,
        recruiterOption: recruitmentOverview.secondRecruiterOption,
        name: Constants.driverNameFraser,
        email: Constants.appTestEmail,
        phone: randomPhoneEdit,
        country: Constants.city,
        note: Constants.noteSecond,
        statusOption: addEmployeeSetup.empolyedStatus,
    });
    await addEmployeeSetup.saveButton.click();
    await recruitmentOverview.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
    await recruitmentOverview.clearPhoneSearch();
    await recruitmentOverview.searchEmployeeByPhone(randomPhoneEdit);
    await recruitmentOverview.expectFirstEmployeeRow({
        cdl: randomCdlEdit,
        name: Constants.driverNameFraser,
        recruiter: Constants.seconPlaywrightRecruiter,
        status: Constants.employedStatus,
        statusColor: Constants.employedStatusColor,
        email: Constants.appTestEmail,
        phone: randomPhoneEdit,
        country: Constants.city,
        note: Constants.noteSecond,
    });
});
