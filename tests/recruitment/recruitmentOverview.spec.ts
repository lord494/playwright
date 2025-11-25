import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { get6RandomNumber, get8RandomNumber, get9RandomNumber, getRandom10Number } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da filtrira zaposlene da se prikazu samo unemployed statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('unemployed');
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitmentOverviewSetup.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.unemployedStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.unemployedStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo employed statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('employed');
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitmentOverviewSetup.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.employedStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.employedStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo blocked statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('blocked');
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitmentOverviewSetup.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.blockedStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.blockedStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo ex drivers statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('retired');
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitmentOverviewSetup.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.exDriversStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.exDriversStatusColor);
    }
});

test('Korisnik moze da filtrira zaposlene da se prikazu samo hold statusi', async ({ recruitmentOverviewSetup }) => {
    await recruitmentOverviewSetup.selectOnlyStatus('hold');
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden' });
    const statusCells = await recruitmentOverviewSetup.stausColumn.all();
    for (const cell of statusCells) {
        await expect(cell).toHaveText(Constants.holdStatus);
        const backgroundColor = await cell.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        expect(backgroundColor).toBe(Constants.holdStatusColor);
    }
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
    await addNewEmployee.enterCdl(addNewEmployee.cdlField, randomCdl)
    await addNewEmployee.selectRecruiter(addNewEmployee.recruiterMenu, addNewEmployee.recruiterOption);
    await addNewEmployee.enterName(addNewEmployee.nameField, Constants.driverName);
    await addNewEmployee.enterEmail(addNewEmployee.emailField, Constants.testEmail);
    await addNewEmployee.enterPhone(addNewEmployee.phoneField, randomPhone);
    await addNewEmployee.enterCountry(addNewEmployee.countryField, Constants.state);
    await addNewEmployee.enterNote(addNewEmployee.noteField, Constants.noteFirst);
    await addNewEmployee.selectStatus(addNewEmployee.stausMenu, addNewEmployee.unemployedStatus);
    await addNewEmployee.saveButton.click();
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'detached' });
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterOption);
    await recruitmentOverviewSetup.searchPhoneNumber(recruitmentOverviewSetup.searchPhoneNumberField.last(), randomPhone);
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitmentOverviewSetup.clickElement(recruitmentOverviewSetup.checkboxOfEmployee);
    await recruitmentOverviewSetup.moveButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'visible' });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenuInMoveModal, recruitmentOverviewSetup.secondRecruiterOption.last());
    await recruitmentOverviewSetup.okButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'detached' });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.secondRecruiterOption.first());
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitmentOverviewSetup.searchPhoneNumber(recruitmentOverviewSetup.searchPhoneNumberField.last(), randomPhone);
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && response.status() == 200 || response.status() == 304);
    await recruitmentOverviewSetup.clickElement(recruitmentOverviewSetup.pencilIcon);
    await expect(recruitmentOverviewSetup.recruiterFieldValue).toContainText(Constants.seconPlaywrightRecruiter);
});

test('Test koji dodaje novog usera, radi se Move All akcija i brise se dodati user', async ({ recruitmentOverviewSetup, inviteAddEditModal, user }) => {
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
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    await recruitmentOverviewSetup.progressBar.waitFor({ state: 'hidden', timeout: 15000 });
    const phoneColumnTexts = await recruitmentOverviewSetup.phoneColumn.allTextContents();
    await recruitmentOverviewSetup.moveAllButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'visible' });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenuInMoveModal, recruitmentOverviewSetup.temporaryUserOption.last());
    await recruitmentOverviewSetup.okButton.click();
    await recruitmentOverviewSetup.dialogBox.waitFor({ state: 'detached', timeout: 80000 });
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.temporaryUserOption.first());
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
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
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    await recruitmentOverviewSetup.selectOnlyStatus('hold');
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
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
    await addNewEmployee.enterCdl(addNewEmployee.cdlField, randomCdl)
    await addNewEmployee.selectRecruiter(addNewEmployee.recruiterMenu, addNewEmployee.recruiterPetarPetrovicOption);
    await addNewEmployee.enterName(addNewEmployee.nameField, Constants.driverName);
    await addNewEmployee.enterEmail(addNewEmployee.emailField, Constants.testEmail);
    await addNewEmployee.enterPhone(addNewEmployee.phoneField, randomPhone);
    await addNewEmployee.enterCountry(addNewEmployee.countryField, Constants.state);
    await addNewEmployee.enterNote(addNewEmployee.noteField, Constants.noteFirst);
    await addNewEmployee.selectStatus(addNewEmployee.stausMenu, addNewEmployee.holdStatus);
    await addNewEmployee.saveButton.click();
    await expect(addNewEmployee.alertMessage).toBeVisible({ timeout: 5000 });
    await expect(addNewEmployee.alertMessage).toContainText('Recruiter Petar Petrovic has reached their maximum HOLD capacity (20/20). Cannot add new HOLD employee. Please free up space by moving or changing the status of existing HOLD employees.');
});

test('Korisnik moze da stopira hold broj', async ({ recruitmentOverviewSetup, addNewEmployee }) => {
    await recruitmentOverviewSetup.recruiterTab.click();
    await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterPetarPetrovicOption);
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    await recruitmentOverviewSetup.selectOnlyStatus('hold');
    await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
    const count = await recruitmentOverviewSetup.deleteIcon.count();
    if (count === 0) {
        await addNewEmployee.addHoldNumbers();
        await recruitmentOverviewSetup.recruiterTab.click();
        await recruitmentOverviewSetup.selectRecruiter(recruitmentOverviewSetup.searchRecruiterMenu, recruitmentOverviewSetup.recruiterPetarPetrovicOption);
        await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
        await recruitmentOverviewSetup.selectOnlyStatus('hold');
        await recruitmentOverviewSetup.page.waitForResponse(response => response.url().includes('/api/employees') && (response.status() == 200 || response.status() == 304));
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