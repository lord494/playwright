import fs from 'fs';
import { expect, Locator, Page } from '@playwright/test';
import { RecrutimentPage } from '../page/recruitment/recruitmentOverview.page';
import { LeasingTeamsPage } from '../page/leasing/leasingTeams.page';
import { LeasingRepresentativesPage } from '../page/leasing/leasingRepresentatives.page';
import { Constants } from './constants';
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

export function get8RandomNumber(): number[] {
    return Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
}

export function get9RandomNumber(): number[] {
    return Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
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
                page.waitForTimeout(1000)
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
                r.url().includes('/api/employees') && (r.status() === 200 || r.status() === 304),
            ),
            //page.waitForLoadState('networkidle'),
            page.waitForTimeout(1000)
        ]);

        await recruitment.progressBar.waitFor({ state: 'hidden' });
    }

    // pokupi brojeve iz 7. kolone (proveri index!)
    return await page.$$eval('tr td:nth-child(7)', cells =>
        cells.map(cell => cell.textContent?.trim() || '')
    );

}

export async function getIconFromCell(page: Page, cellSelector: string, rowIndex: number): Promise<'mdi-check' | 'mdi-close-octagon-outline' | undefined> {
    const className = await page.locator(cellSelector).nth(rowIndex).locator('i').getAttribute('class');
    if (className?.includes('mdi-check')) {
        return 'mdi-check';
    }
    if (className?.includes('mdi-close-octagon-outline')) {
        return 'mdi-close-octagon-outline';
    }
    return undefined;
};

export async function expectIcon(locator: Locator, expectedIcon?: 'mdi-check' | 'mdi-close-octagon-outline') {
    const className = await locator.locator('i').getAttribute('class') ?? '';
    if (expectedIcon) {
        await expect(className).toContain(expectedIcon);
    }
};

export function uniqueTeamName(prefix: string = 'PW'): string {
    return `${prefix}_${Date.now()}_${generateRandomString(4)}`;
}

export function extractUserName(chipText: string): string {
    return chipText.split(' - ')[0].trim();
}

export async function safeDeleteTeam(leasingTeams: LeasingTeamsPage, teamName: string): Promise<void> {
    const card = leasingTeams.getCardByTeamName(teamName);
    if ((await card.count()) === 0) return;
    await leasingTeams.removeAllMembersFromTeam(teamName).catch(() => { });
    await leasingTeams.deleteTeam(teamName).catch(() => { });
}

// Best-effort cleanup for a leasing-representative card: removes every company
// chip currently on that card, accepting the native confirms. Used inside
// try/finally blocks so mutating representative tests leave staging in the
// same state they started.
export async function safeRestoreRepresentativeCard(reps: LeasingRepresentativesPage, repName: string,): Promise<void> {
    const card = reps.getCardByRepName(repName);
    if ((await card.count()) === 0) return;
    await reps.removeAllCompaniesFromRep(repName).catch(() => { });
}

// Deletes orphan PW_Test_<timestamp> saved-filter rows the test account
// accumulated from prior runs whose cleanup silently failed (the test's finally
// block uses `.catch(() => {})`). Without this, the Saved Filters dialog ends
// up with so many PW_Test_* rows that a freshly-saved one lands past page 1
// and the visibility assertion times out.
// Uses page.request (not the UI) — faster, and bypasses dialog pagination.
// Best-effort: returns the number of deletions; never throws.
export async function cleanupOrphanSavedFilters(page: Page, tableName: string): Promise<number> {
    try {
        const auth = JSON.parse(fs.readFileSync('auth.json', 'utf-8'));
        const msAuth = auth.cookies?.find((c: { name: string }) => c.name === 'msAuthKey');
        if (!msAuth) return 0;
        const payload = JSON.parse(Buffer.from(msAuth.value.split('.')[1], 'base64').toString('utf-8'));
        const userId: string | undefined = payload?.user?.id;
        if (!userId) return 0;

        const allItems: { _id: string; label: string }[] = [];
        let total = Infinity;
        for (let p = 1; allItems.length < total && p < 50; p++) {
            const resp = await page.request.get(
                `/api/table-filter/${userId}/${tableName}?page=${p}&itemsPerPage=10&sortDesc[]=false&mustSort=false&multiSort=false`,
            );
            if (!resp.ok()) break;
            const body = await resp.json();
            total = body.total ?? 0;
            const items = (body.tableFilters || []) as { _id: string; label: string }[];
            if (items.length === 0) break;
            allItems.push(...items);
        }

        let deleted = 0;
        for (const item of allItems) {
            if (/^PW_Test_\d+$/.test(item.label)) {
                const r = await page.request.delete(`/api/table-filter/${item._id}`);
                if (r.ok()) deleted++;
            }
        }
        return deleted;
    } catch {
        return 0;
    }
}

export function generateUniqueTrailerNumber(): string {
    const workerIndex = process.env.TEST_WORKER_INDEX ?? '0';
    return `${workerIndex}${Date.now().toString().slice(-7)}`;
}

export async function waitForAvailableTrailerRow(page: Page, trailerNumber: string, timeoutMs: number = 10000): Promise<void> {
    const row = page.locator('tr', {
        has: page.locator('td:nth-child(1)', { hasText: trailerNumber })
    });
    await expect.poll(async () => await row.count(), { timeout: timeoutMs, message: `Waiting for trailer ${trailerNumber} to appear in /available-trailers` }).toBeGreaterThan(0);
}

// Best-effort cleanup helper. Operates on /trailers ONLY (the UI flow to add a trailer
// to /available-trailers is currently broken on staging, so any test-created trailer
// stays on /trailers).
// Hard-capped at 12s total — never fails the test, never blocks teardown excessively.
// Verified selectors against staging.vrlz.app DOM 2026-05-11:
//   - /trailers trailer-number filter: getByLabel('Trailer/VIN #')
//     (the page has 7 .TableFilters__field inputs: Company, All, Status, Trailer/VIN #,
//      Driver, Owner, Dealership — disambiguation by label is required)
//   - /trailers trailer-number column: td:nth-child(2) (header "Trl #")
//   - /trailers delete: native browser confirm
export async function safeDeleteAvailableTrailer(page: Page, trailerNumber: string): Promise<void> {
    const acceptDialog = async (d: any) => { try { await d.accept(); } catch { /* ignore */ } };
    const cleanup = (async () => {
        try {
            await page.goto(Constants.trailerUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
            const filter = page.getByLabel('Trailer/VIN #', { exact: true });
            if (await filter.isVisible({ timeout: 2000 }).catch(() => false)) {
                await filter.click({ timeout: 2000 });
                await page.keyboard.type(trailerNumber, { delay: 40 });
                await page.waitForResponse(
                    r => r.url().includes('/api/trailers') && (r.status() === 200 || r.status() === 304),
                    { timeout: 5000 }
                ).catch(() => { });
            }
            const row = page.locator('tbody tr', {
                has: page.locator('td:nth-child(2)', { hasText: trailerNumber })
            });
            if (await row.count().catch(() => 0) > 0) {
                page.on('dialog', acceptDialog);
                await row.first().locator('button.mdi-delete, i.mdi-delete').first().click({ timeout: 3000 });
                await page.waitForTimeout(800);
                page.off('dialog', acceptDialog);
            }
        } catch { /* best-effort */ }
    })();
    await Promise.race([
        cleanup,
        new Promise<void>(resolve => setTimeout(resolve, 12000)),
    ]);
}

