import { chromium } from '@playwright/test';
import { Login } from './helpers/login';
import path from 'path';

async function globalSetup() {
    console.log('🔑 Pokrećem login...');
    const authPath = path.join(__dirname, 'auth.json');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const login = new Login(page);
    await login.loginOnTms('superegoholdingtest@gmail.com', 'test123');
    await page.context().storageState({ path: authPath });
    console.log('✅ auth.json je sačuvan.');
    await browser.close();
}
export default globalSetup;