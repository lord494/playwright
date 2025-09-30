import fs from 'fs';
import { expect, Page } from '@playwright/test';
import { RecrutimentPage } from '../page/recruitment/recruitmentOverview.page';
import { time } from 'console';


export function getWeekRange(offset = 0): string {
    const today = new Date();
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - today.getDay() + 1 + offset * 7); // ponedeljak

    const endDay = new Date(currentMonday);
    endDay.setDate(currentMonday.getDate() + 8); // 8 dana

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formatDate = (date: Date) => {
        const days = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        return `${days}${month}`;
    };

    return `${formatDate(currentMonday)} - ${formatDate(endDay)}`;
}


const COUNTER_FILE = './counter.txt';
export function generateUniqueRoleName(): string {
    let count = 1;
    if (fs.existsSync(COUNTER_FILE)) {
        const fileContent = fs.readFileSync(COUNTER_FILE, 'utf-8');
        count = parseInt(fileContent.trim()) + 1;
    }

    fs.writeFileSync(COUNTER_FILE, count.toString());

    return `playwright rola ${count}`;
}

export function get17RandomNumbers(): number[] {
    return Array.from({ length: 17 }, () => Math.floor(Math.random() * 10));
}

export function get6RandomNumber(): number[] {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
}

export function getRandom10Number(): number[] {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
}

export function generateRandomLetters(length = 10): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

export function generateRandomString(input: number = 5): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < input; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


async function typeSlowly(page: any, selector: string, text: string, delay = 100) {
    const input = page.locator(selector);
    await input.click();

    for (const char of text) {
        await input.type(char);
        await page.waitForTimeout(delay);
        await input.click();
    }
}

export async function waitForPrebookLoads(page: Page, action: () => Promise<void>) {
    await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/api/prebook-loads?filter=notbooked') &&
            (response.status() === 200 || response.status() === 304)
        ),
        action()
    ]);
}

export async function waitForShopLoads(page: Page, action: () => Promise<void>) {
    await Promise.all([
        page.waitForResponse(
            response =>
                response.url().includes('/ms-shop/shop') &&
                (response.status() === 200 || response.status() === 304),
            { timeout: 20_000 }
        ),
        action()
    ]);
}

export async function waitForBrokerLoad(page: Page, action: () => Promise<void>) {
    await Promise.all([
        page.waitForResponse(
            response =>
                response.url().includes('/api/brokers') &&
                (response.status() === 200 || response.status() === 304),
            { timeout: 20_000 }
        ),
        action()
    ]);
}

export async function waitForDriver(page: Page, action: () => Promise<void>) {
    await Promise.all([
        page.waitForResponse(
            response =>
                response.url().includes('/api/drivers') &&
                (response.status() === 200 || response.status() === 304),
            { timeout: 20_000 }
        ),
        action()
    ]);
}

export async function saveNumbersForStatus(page: Page, recruiterName: any, statusKey: string, fileName: fs.PathOrFileDescriptor) {
    const recruitment = new RecrutimentPage(page);
    const recruiterLocator = page.locator('.v-list-item__title').filter({ hasText: recruiterName });
    await recruitment.recruiterTab.click();
    const dropdownList = page.locator('.v-menu__content');
    await recruitment.searchRecruiterMenu.click();

    let previousHeight = 0;
    for (let i = 0; i < 10; i++) { // max 10 pokušaja, da ne uđe u beskonačnu petlju
        const currentHeight = await dropdownList.evaluate(el => el.scrollHeight);

        if (currentHeight === previousHeight) {
            // ništa novo se nije učitalo → kraj skrola
            break;
        }

        await dropdownList.evaluate(el => {
            el.scrollTop = el.scrollHeight;
        });

        previousHeight = currentHeight;
        await page.waitForTimeout(300); // malo sačekaj za novo učitavanje
    }

    await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruiterLocator);

    const allCheckboxes = {
        employed: recruitment.employedCheckbox,
        unemployed: recruitment.unemployedCheckbox,
        blocked: recruitment.blocedCheckbox,
        retired: recruitment.retiredCheckbox,
        thirdCompany: recruitment.thirdCompanyCheckbox,
        ownerOperator: recruitment.onwerOperatorCheckbox,
        hold: recruitment.holdCheckbox,
        incContact: recruitment.incContactCheckbox
    };

    // Odcekiraj sve osim statusa koji testiramo
    for (const [key, locator] of Object.entries(allCheckboxes)) {
        if (key !== statusKey) {
            await recruitment.uncheck(locator);
            await page.waitForResponse((r: { url: () => string | string[]; status: () => number; }) => r.url().includes('/api/employees') && (r.status() === 200 || r.status() === 304));
            await page.locator('.v-data-table__progress .v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 10000 });
            await expect(locator).not.toBeChecked({ timeout: 5000 });
        }
    }

    await recruitment.progressBar.waitFor({ state: 'hidden' });

    // Load more employees
    while (true) {
        const loadMoreButton = page.locator('text=Load more employees').first();
        if (!(await loadMoreButton.isVisible() && await loadMoreButton.isEnabled())) break;

        try {
            await Promise.all([
                loadMoreButton.click(),
                page.waitForResponse((r: { url: () => string | string[]; status: () => number; }) => r.url().includes('/api/employees') && (r.status() === 200 || r.status() === 304)),
                page.waitForLoadState('networkidle')
            ]);
            await recruitment.progressBar.waitFor({ state: 'hidden' });
        } catch {
            break;
        }
    }

    const numbers = await page.$$eval('tr td:nth-child(7)', (cells: any[]) => cells.map((c: { textContent: string; }) => c.textContent?.trim() || ''));
    fs.writeFileSync(fileName, JSON.stringify(numbers, null, 2));
    console.log(`Sacuvano ${numbers.length} brojeva za ${recruiterName} - ${statusKey}`);
}


export async function filterByStatus(page: Page, recruitment: RecrutimentPage, statusKey: string) {
    const checkboxes: Record<string, any> = {
        employed: recruitment.employedCheckbox,
        unemployed: recruitment.unemployedCheckbox,
        retired: recruitment.retiredCheckbox,
        thirdCompany: recruitment.thirdCompanyCheckbox,
        ownerOperator: recruitment.onwerOperatorCheckbox,
        hold: recruitment.holdCheckbox,
        incContact: recruitment.incContactCheckbox,
        blocked: recruitment.blocedCheckbox,
    };

    for (const [key, checkbox] of Object.entries(checkboxes)) {
        if (key !== statusKey) {
            if (await checkbox.isChecked()) {
                await checkbox.uncheck();

                await Promise.all([
                    page.waitForResponse(r =>
                        r.url().includes('/api/employees') && (r.status() === 200 || r.status() === 304)
                    ),
                    await page.locator('.v-data-table__progress .v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 10000 })
                ]);
                await page.locator('.v-data-table__progress .v-progress-linear__buffer').waitFor({ state: 'hidden', timeout: 10000 });
                await page.waitForTimeout(2000);
            }
        }
    }
}

export async function getNumbersFromTable(page: Page, recruitment: RecrutimentPage): Promise<string[]> {
    // Load more dokle god ima
    while (true) {
        const loadMoreButton = page.locator('text=Load more employees').first();
        if (!(await loadMoreButton.isVisible() && await loadMoreButton.isEnabled())) break;

        await Promise.all([
            loadMoreButton.click(),
            page.waitForResponse(r =>
                r.url().includes('/api/employees') && (r.status() === 200 || r.status() === 304)
            ),
            page.waitForLoadState('networkidle'),
        ]);

        await recruitment.progressBar.waitFor({ state: 'hidden' });
    }

    // pokupi brojeve iz 7. kolone (proveri index!)
    return await page.$$eval('tr td:nth-child(7)', cells =>
        cells.map(cell => cell.textContent?.trim() || '')
    );
}


