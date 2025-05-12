import { chromium } from '@playwright/test';
import { Login } from './helpers/login';
import fs from 'fs';
import path from 'path';
import { getLatestOtpEmail } from './helpers/login';  // Dodajte ovaj import


async function globalSetup() {
    // Proveri da li auth.json već postoji
    // const authPath = path.join(__dirname, 'auth.json');
    // if (fs.existsSync(authPath)) {
    //     console.log('✅ auth.json već postoji, preskačem login.');
    //     return;
    // }

    // Pokreni browser i login
    console.log('🔑 Pokrećem login...');

    const authPath = path.join(__dirname, 'auth.json');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const login = new Login(page);
    await login.loginOnTms('superegoholdingtest@gmail.com', 'test123');  // Koristi svoj email i password
    // Čuvanje session stanja u auth.json
    await page.context().storageState({ path: authPath });
    console.log('✅ auth.json je sačuvan.');
    await browser.close();
}
export default globalSetup;

// async function globalSetup() {
//     console.log('🚀 Početak globalSetup...');
//     console.log('📍 Trenutni direktorijum:', process.cwd());

//     // Kreiraj direktorijum za auth fajlove ako ne postoji
//     const authDir = path.join(process.cwd(), 'auth');
//     console.log('📁 Auth direktorijum:', authDir);

//     if (!fs.existsSync(authDir)) {
//         fs.mkdirSync(authDir, { recursive: true });
//         console.log('✅ Kreiran auth direktorijum');
//     }

//     // Dobavi broj workera iz environment varijable ili koristi default vrednost
//     const workers = parseInt(process.env.WORKERS || '4', 10);
//     console.log(`👥 Kreiranje ${workers} auth fajlova...`);

//     // Kreiraj auth fajl za svakog workera
//     for (let i = 0; i < workers; i++) {
//         console.log(`🔄 Kreiranje auth fajla za workera ${i + 1}/${workers}`);

//         const authPath = path.join(authDir, `auth-worker-${i}.json`);
//         const browser = await chromium.launch();
//         const context = await browser.newContext();
//         const page = await context.newPage();

//         try {
//             const login = new Login(page);
//             console.log('🔐 Pokušaj logina...');
//             await login.loginOnTms('superegoholdingtest@gmail.com', 'test1234!!');
//             console.log('✅ Login uspešan');

//             // Čekamo da se stranica učita
//             await page.waitForLoadState('networkidle');

//             // Proveravamo da li smo na OTP stranici
//             if (page.url().includes('/otp-validate')) {
//                 console.log('📱 OTP verifikacija potrebna...');
//                 await page.getByRole('button', { name: 'Resend OTP token Email' }).click();
//                 await page.waitForTimeout(3000);
//                 const otp = await getLatestOtpEmail();
//                 await page.fill('input[name="otp"]', otp);
//                 await page.waitForTimeout(3000);
//                 await page.getByRole('button', { name: 'Verify' }).click();
//                 await page.waitForLoadState('networkidle');

//                 // Ponovni login nakon OTP verifikacije
//                 await login.loginOnTms('superegoholdingtest@gmail.com', 'test1234!!');
//                 await page.waitForLoadState('networkidle');
//             }

//             // Navigiramo na dashboard
//             console.log('📍 Navigacija na dashboard...');
//             await page.goto('http://207.154.213.8/dashboard');
//             await page.waitForLoadState('networkidle');

//             // Proveravamo da li smo na dashboard stranici
//             const currentUrl = page.url();
//             console.log(`📍 Trenutni URL nakon logina: ${currentUrl}`);

//             if (!currentUrl.includes('/dashboard')) {
//                 console.log('⚠️ Nismo na dashboard stranici, pokušavam ponovno...');
//                 await page.goto('http://207.154.213.8/dashboard');
//                 await page.waitForLoadState('networkidle');

//                 const finalUrl = page.url();
//                 console.log(`📍 Finalni URL: ${finalUrl}`);

//                 if (!finalUrl.includes('/dashboard')) {
//                     throw new Error('Nismo na dashboard stranici nakon ponovnog pokušaja');
//                 }
//             }

//             // Sačuvaj storage state
//             await context.storageState({ path: authPath });
//             console.log(`✅ auth-worker-${i}.json je sačuvan.`);

//             // Proveri sadržaj auth fajla
//             const authContent = JSON.parse(fs.readFileSync(authPath, 'utf8'));
//             console.log(`📝 Auth fajl sadrži ${authContent.cookies?.length || 0} kolačića`);

//             // Proveri da li ima jwt kolačić
//             const hasJwtCookie = authContent.cookies?.some((cookie: { name: string; }) => cookie.name === 'jwt');
//             console.log(`🔑 JWT kolačić ${hasJwtCookie ? 'postoji' : 'ne postoji'}`);

//             // Proveri da li auth fajl radi
//             const testContext = await browser.newContext({ storageState: authPath });
//             const testPage = await testContext.newPage();
//             await testPage.goto('http://207.154.213.8/dashboard');
//             await testPage.waitForLoadState('networkidle');
//             const testUrl = testPage.url();
//             console.log(`🔍 Test URL sa auth fajlom: ${testUrl}`);
//             await testContext.close();

//         } catch (error) {
//             console.error('❌ Greška prilikom logina:', error);
//             throw error;
//         } finally {
//             await browser.close();
//         }
//     }

//     console.log('🎉 Setup završen uspešno');
// }

// export default globalSetup;