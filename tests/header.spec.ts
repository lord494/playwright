import { test, expect, chromium, Page } from '@playwright/test';
import { HeaderPage } from '../page/header.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    await page.goto('');
});

test('Korisnik moze da otvori side menu kada klikne na "hamburger" meni ', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.click(header.hamburgerMenu);
    await expect(header.connectionStatus).toBeVisible();
});

test('Korisnik moze da otvori trucks stranicu kada klikne na trucks ikonicu ', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.click(header.truckIcon);
    await expect(page).toHaveURL(/trucks/);
});

test('Korisnik moze da otvori trailers stranicu kada klikne na trailer ikonicu ', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.click(header.trailerIcon);
    await expect(page).toHaveURL(/trailers/);
});

test('Korisnik moze da otvori Super ego Colud stranicu kada klikne na cloud ikonicu ', async ({ page, context }) => {
    const [infoTab] = await Promise.all([
        context.waitForEvent('page'),
        page.locator(".mdi.mdi-cloud").click(),
    ]);
    await infoTab.waitForLoadState();
    expect(infoTab.url()).toContain("super-ego.direct.quickconnect");
});

test('Korisnik moze da otvori alert stranicu kada klikne na alert ikonicu ', async ({ page, context }) => {
    const [infoTab] = await Promise.all([
        context.waitForEvent('page'),
        page.locator(".v-icon.mdi-alert-outline").click(),
    ]);
    await infoTab.waitForLoadState();
    expect(infoTab.url()).toContain("accounts.google.com");
});

test('Korisnik moze da otvori inbox kada klikne na message ikonicu ', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.click(header.emailIcon);
    await expect(page).toHaveURL(/inbox/);
});

test('Korisnik moze da ide na dashboard kada klikne na naziv board-a i moze da ide na contact board kada klikne na contact tab ', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto('');
    let tabs = await page.locator('.v-tabs.theme--dark .v-tab').all();
    tabs = tabs.slice(0, -3);

    for (const tab of tabs) {
        const tabText = await tab.innerText();
        await tab.click();
        await page.waitForLoadState('networkidle');
        const currentURL = page.url();
        if (tabText.toLowerCase().includes('contacts')) {
            expect(currentURL).toContain('/contacts-board');
        }
        else if (tabText) {
            expect(currentURL).toContain('/dashboard');
        }
    }
});

test('Korisnik moze da otvori daly report kada klikne na daily tab ', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto('');
    page.locator('.tabs-holder .v-tab', { hasText: 'Daily' }).click();
    await expect(page).toHaveURL(/daily-report/);
});

test('Korisnik moze da otvori weekly report kada klikne na weekly tab ', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto('');
    page.locator('.tabs-holder .v-tab', { hasText: 'Weekly' }).click();
    await expect(page).toHaveURL(/weekly-report/);
});

test('Korisnik moze da ide na eld dashboard kada klikne na naziv shift-a', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto('');
    let shiftTabs = await page.locator('.v-btn.v-btn--text.v-size--small').all();

    for (let i = 0; i < shiftTabs.length - 1; i++) {
        const tab = shiftTabs[i];
        const tabText = await tab.innerText();
        await tab.click();
        await page.waitForLoadState('domcontentloaded');
        const currentURL = page.url();
        expect(currentURL).toContain('/eld-dashboard');
    }
});

test('Korisnik moze da otvori BOBTAIL_INSURANCE iz safety menija ', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.hoverAndClick(header.safetyButton, header.BOBTAILINSURANCE);
    await expect(page).toHaveURL(/BOBTAIL_INSURANCE/);
});

test('Korisnik moze da otvori ELD iz safety menija ', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.hoverAndClick(header.safetyButton, header.eldFromSafety);
    await expect(page).toHaveURL(/eld-dashboard/);
});

test('Korisnik moze da otvori cargo claims iz safety menija ', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.hoverAndClick(header.safetyButton, header.cargoClaimsFromSafety);
    await expect(page).toHaveURL(/CARGO_CLAIMS/);
});

test('Korisnik moze da otvori new drivers iz safety menija ', async ({ page }) => {
    const header = new HeaderPage(page);
    console.log('test');
    await header.hoverAndClick(header.safetyButton, header.newDriversFromSafety);
    await expect(page).toHaveURL(/new-drivers/);
});

test('Korisnik moze da otvori dispatch info', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    await page.goto('');
    const header = new HeaderPage(page);
    await header.rightArrowInHeader.click();
    await header.dispatchInfo.click();
    await expect(page).toHaveURL(/dispatch-info/);
});

