import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber, get8RandomNumber, get9RandomNumber, getRandom10Number, safeDeleteEmployeeByPhone } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da filtrira zaposlene da se prikazu samo unemployed statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('unemployed');
    await recruitmentOverviewSetup.expectAllStatusCellsAre(Constants.unemployedStatus, Constants.unemployedStatusColor);
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo employed statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('employed');
    await recruitmentOverviewSetup.expectAllStatusCellsAre(Constants.employedStatus, Constants.employedStatusColor);
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo blocked statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('blocked');
    await recruitmentOverviewSetup.expectAllStatusCellsAre(Constants.blockedStatus, Constants.blockedStatusColor);
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo ex drivers statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('retired');
    await recruitmentOverviewSetup.expectAllStatusCellsAre(Constants.exDriversStatus, Constants.exDriversStatusColor);
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo hold statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('hold');
    await recruitmentOverviewSetup.expectAllStatusCellsAre(Constants.holdStatus, Constants.holdStatusColor);
});

test('Korisnik moze da se prebaci na recruiter tab', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.recruiterTab.click();
    await expect(recruitmentOverviewSetup.recruiterTab).toHaveClass(/v-tab--active/);
});

test('Korisnik moze da bira regrutera iz Search regruter menija na recuriter tabu', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.secondRecruiterOption);
    await recruitmentOverviewSetup.page.waitForLoadState('networkidle');
    await expect(recruitmentOverviewSetup.employeesTable).toContainText(Constants.seconPlaywrightRecruiter);
});

test('Korisnik moze da prebaci broj na drugog regrutera sa Move akcijom', async ({ recruitmentOverviewSetup, addNewEmployee }) => {
    const randomPhone = getRandom10Number().join('');
    const randomCdl = get6RandomNumber().join('');
    await recruitmentOverviewSetup.addNewEmployeeButton.click();
    await addNewEmployee.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addNewEmployee.recruiterOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addNewEmployee.unemployedStatus,
    });
    await addNewEmployee.saveButton.click();
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'detached' });
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterOption);
    await recruitmentOverviewSetup.searchPhoneNumber(recruitmentOverviewSetup.searchPhoneNumberField.last(), randomPhone);
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.clickElement(recruitmentOverviewSetup.checkboxOfEmployee);
    await recruitmentOverviewSetup.moveButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'visible' });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenuInMoveModal, recruitmentOverviewSetup.secondRecruiterOption.last());
    await recruitmentOverviewSetup.okButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'detached' });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.secondRecruiterOption.first());
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.searchPhoneNumber(recruitmentOverviewSetup.searchPhoneNumberField.last(), randomPhone);
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.clickElement(recruitmentOverviewSetup.pencilIcon);
    await expect(recruitmentOverviewSetup.recruiterFieldValue).toContainText(Constants.seconPlaywrightRecruiter);
});

test('Test koji dodaje novog usera, radi se Move All akcija i brise se dodati user', async ({ recruitmentOverviewSetup, inviteAddEditModal, user }) => {
    test.setTimeout(180000);
    recruitmentOverviewSetup.page.on('dialog', async (dialog) => {
        await dialog.accept();
    });
    const email = inviteAddEditModal.generateUniqueEmail();
    await user.page.goto(Constants.userUrl, { waitUntil: 'networkidle', timeout: 50000 });
    await user.emailColumn.first().waitFor({ state: 'visible', timeout: 10000 });
    await user.clickElement(user.accountIcon);
    await user.clickElement(user.addUserIcon);
    await inviteAddEditModal.enterData(inviteAddEditModal.emailField, email);
    await inviteAddEditModal.enterData(inviteAddEditModal.nameField, Constants.temporaryUser);
    await inviteAddEditModal.selectOptionFromMenu(inviteAddEditModal.roleField, inviteAddEditModal.recruitingRole);
    await inviteAddEditModal.enterData(inviteAddEditModal.passwordField, Constants.password);
    await inviteAddEditModal.clickElement(inviteAddEditModal.saveButton);
    await inviteAddEditModal.page.waitForLoadState('networkidle', { timeout: 50000 });
    await expect(inviteAddEditModal.snackMessage).toContainText("User: " + email + " successfully added");
    await recruitmentOverviewSetup.page.goto(Constants.recruitmentUrl, { waitUntil: 'networkidle', timeout: 50000 });
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.stagingRecruiterOption);
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden', timeout: 15000 });
    const phoneColumnTexts = await recruitmentOverviewSetup.phoneColumn.allTextContents();
    await recruitmentOverviewSetup.moveAllButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'visible' });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenuInMoveModal, recruitmentOverviewSetup.temporaryUserOption.last());
    await recruitmentOverviewSetup.okButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'detached', timeout: 80000 });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.temporaryUserOption.first());
    await recruitmentOverviewSetup.waitForEmployees();
    const phoneColumnTextsAfterMove = await recruitmentOverviewSetup.phoneColumn.allTextContents();
    for (const phone of phoneColumnTexts) {
        expect(phoneColumnTextsAfterMove).toContain(phone);
    }
    await user.page.goto(Constants.userUrl, { waitUntil: 'networkidle', timeout: 50000 });
    await user.searchInputField.fill(email);
    await user.page.waitForResponse(response => response.url().includes('/api/users') && (response.status() == 200 || response.status() == 304));
    await user.redDeleteIcon.click();
    await user.page.waitForResponse(response => response.url().includes('/api/users') && (response.status() == 200 || response.status() == 304));
});

test('Korisnik ne moze da doda hold status ako je ispunjen max capacity', async ({ recruitmentOverviewSetup, addNewEmployee }) => {
    test.setTimeout(180_000);
    const randomCdl = get6RandomNumber().join('');
    const randomPhone = getRandom10Number().join('');
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterPetarPetrovicOption);
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.selectOnlyStatus('hold');
    await recruitmentOverviewSetup.waitForEmployees();
    const neededCount = 20;
    const currentCount = await recruitmentOverviewSetup.deleteIcon.count();
    if (currentCount < neededCount) {
        const howManyToAdd = neededCount - currentCount;
        for (let i = 0; i < howManyToAdd; i++) {
            await addNewEmployee.addHoldNumbers();
        }
    } else {
        await recruitmentOverviewSetup.employeesTab.click();
    }
    await recruitmentOverviewSetup.addNewEmployeeButton.click();
    await addNewEmployee.fillEmployeeForm({
        cdl: randomCdl,
        recruiterOption: addNewEmployee.recruiterPetarPetrovicOption,
        name: Constants.driverName,
        email: Constants.testEmail,
        phone: randomPhone,
        country: Constants.state,
        note: Constants.noteFirst,
        statusOption: addNewEmployee.holdStatus,
    });
    await addNewEmployee.saveButton.click();
    await expect(addNewEmployee.alertMessage).toBeVisible({ timeout: 5000 });
    await expect(addNewEmployee.alertMessage).toContainText('Recruiter Petar Petrovic has reached their maximum HOLD capacity (20/20). Cannot add new HOLD employee. Please free up space by moving or changing the status of existing HOLD employees.');
});

test('Korisnik moze da stopira hold broj', async ({ recruitmentOverviewSetup, addNewEmployee }) => {
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterPetarPetrovicOption);
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.selectOnlyStatus('hold');
    await recruitmentOverviewSetup.waitForEmployees();
    const count = await recruitmentOverviewSetup.deleteIcon.count();
    if (count === 0) {
        await addNewEmployee.addHoldNumbers();
        await recruitmentOverviewSetup.recruiterTab.click();
        await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterPetarPetrovicOption);
        await recruitmentOverviewSetup.waitForEmployees();
        await recruitmentOverviewSetup.selectOnlyStatus('hold');
        await recruitmentOverviewSetup.waitForEmployees();
    }
    const numberOfPauseIcon = await recruitmentOverviewSetup.pauseIcon.count();
    let found = false;
    for (let i = 0; i < numberOfPauseIcon; i++) {
        await recruitmentOverviewSetup.pauseIcon.nth(i).click();

        await recruitmentOverviewSetup.snackMessage.last().waitFor({ timeout: 2000 }).catch(() => { });
        const messageText = await recruitmentOverviewSetup.snackMessage.last().textContent();
        if (messageText?.includes('Employee excluded from next rotation')) {
            found = true;
            break;
        }
    }
    expect(found).toBeTruthy();
});

test('Search button je onemoguceno ako broj ima manje od 9 cifara', async ({ recruitmentOverviewSetup }) => {
    const randomPhone = get8RandomNumber().join('');
    await recruitmentOverviewSetup.searchPhoneNumberField.click();
    await recruitmentOverviewSetup.searchPhoneNumberField.type(randomPhone);
    await expect(recruitmentOverviewSetup.disabledSearchButton).toBeVisible();
});

test('Search button je omoguceno kada unesemo 9 cifara', async ({ recruitmentOverviewSetup }) => {
    const randomPhone = get9RandomNumber().join('');
    await recruitmentOverviewSetup.searchPhoneNumberField.click();
    await recruitmentOverviewSetup.searchPhoneNumberField.type(randomPhone);
    await expect(recruitmentOverviewSetup.searchButton).toBeEnabled();
});

test('Search polje za broj telefona ignorise nenumericke karaktere', async ({ recruitmentOverviewSetup }) => {
    // The phone-search input is numeric-only: typing letters/symbols is stripped,
    // so the input value stays empty (verified against staging).
    await recruitmentOverviewSetup.searchPhoneNumberField.click();
    await recruitmentOverviewSetup.searchPhoneNumberField.type('abcdef');
    await expect(recruitmentOverviewSetup.searchPhoneNumberField.locator('input')).toHaveValue('');
});

/**
 * SAP kolona (td:nth-child(6), renderuje YES / NO) i SAP filter checkbox u redu sa
 * filterima statusa. Filter je server-side:
 *   oznacen (default) -> nema `sap` parametra -> lista i SAP i non-SAP zaposlene
 *   neoznacen         -> `sap=false`          -> lista SAMO non-SAP zaposlene
 * Testovi za SAP checkbox u add/edit formi su u addEmployee.spec.ts.
 */
test.describe('SAP kolona i SAP filter', () => {
    // Test koji dodaje SAP zaposlenog + pretraga + cleanup u afterEach ne staju u
    // podrazumevanih 30s (afterEach deli budzet sa testom).
    test.describe.configure({ timeout: 60_000 });

    let createdPhone: string | null = null;

    test.afterEach(async ({ loggedPage }) => {
        if (createdPhone) {
            await safeDeleteEmployeeByPhone(loggedPage, createdPhone);
            createdPhone = null;
        }
    });

    test('Tabela zaposlenih prikazuje SAP kolonu sa YES ili NO vrednostima', async ({ recruitmentOverviewSetup }) => {
        await expect(recruitmentOverviewSetup.sapHeader).toBeVisible();
        await recruitmentOverviewSetup.expectAllSapCellsAre(Constants.sapYes, Constants.sapNo);
    });

    test('SAP filter je podrazumevano oznacen', async ({ recruitmentOverviewSetup }) => {
        await expect(recruitmentOverviewSetup.sapFilterInput).toBeChecked();
    });

    test('Korisnik moze da iskljuci SAP filter da se prikazu samo non-SAP zaposleni', async ({ recruitmentOverviewSetup }) => {
        await recruitmentOverviewSetup.excludeSapEmployees();
        await recruitmentOverviewSetup.expectAllSapCellsAre(Constants.sapNo);
    });

    test('SAP zaposleni se ne prikazuje kada je SAP filter iskljucen i vraca se kada se ukljuci', async ({ recruitmentOverviewSetup, addNewEmployee }) => {
        const randomCdl = get6RandomNumber().join('');
        const randomPhone = getRandom10Number().join('');
        createdPhone = randomPhone;
        await recruitmentOverviewSetup.addNewEmployeeButton.click();
        await addNewEmployee.fillEmployeeForm({
            cdl: randomCdl,
            recruiterOption: addNewEmployee.recruiterOption,
            name: Constants.driverName,
            email: Constants.testEmail,
            phone: randomPhone,
            country: Constants.state,
            note: Constants.noteFirst,
            statusOption: addNewEmployee.unemployedStatus,
            sap: true,
        });
        await addNewEmployee.saveButton.click();
        await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'detached', timeout: 5000 });
        await recruitmentOverviewSetup.searchEmployeeByPhone(randomPhone);
        await recruitmentOverviewSetup.expectFirstSapCellIs(Constants.sapYes);
        // Filter se primenjuje i na aktivnu pretragu — SAP=YES red ispada iz rezultata.
        await recruitmentOverviewSetup.excludeSapEmployees();
        await recruitmentOverviewSetup.expectNoEmployees();
        await recruitmentOverviewSetup.includeSapEmployees();
        await recruitmentOverviewSetup.expectFirstSapCellIs(Constants.sapYes);
    });
});

test('Move akcija je onemogucena dok nije selektovan nijedan red', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterPetarPetrovicOption);
    await recruitmentOverviewSetup.waitForEmployees();
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });
    await expect(recruitmentOverviewSetup.moveButton).toBeDisabled();
});



//////////////////////////////////////////// KORISTI SE POVREMENO ZA BRISANJE BAZE /////////////////////////////////////////////////
// i ovo mozda nece treba jer ce se sada posle svake rotacije ravnomjerno rasporedjivati brojevi
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
