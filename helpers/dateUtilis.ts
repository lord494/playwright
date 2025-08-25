import fs from 'fs';
import { Page } from '@playwright/test';


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
