// import { test, expect } from '@playwright/test';
// import { RecrutimentPage } from '../../page/recruitment/recruitmentOverview.page';
// import * as fs from 'fs';
// import { filterByStatus, getNumbersFromTable } from '../../helpers/dateUtilis';
// import path from 'path';

// test.beforeEach(async ({ page }) => {
//     await page.goto('https://master.superegoholding.app/login');
//     await page.getByRole('textbox', { name: 'Login' }).fill("bosko@superegoholding.net");
//     await page.getByRole('textbox', { name: 'Password' }).fill("Super123!");
//     await page.getByRole('button', { name: 'Login' }).click();
//     await page.waitForLoadState('networkidle');
//     // await page.fill('input[name="otp"]', "FASUSL3LNQ");
//     // await page.getByRole('button', { name: 'Verify' }).click();
//     // console.log('Clicked verify button');
//     // await page.waitForTimeout(3000);
// });

// const recruiters = ['Paul Allen', 'Julian Thompson', 'Gary Reed', 'Diaz Stark', 'Ryan Miles', 'Jake Walker'];
// const statuses = [
//     { key: 'blocked', file: 'blockedNumbers.json' },
//     { key: 'employed', file: 'employedNumbers.json' },
//     { key: 'retired', file: 'exDrivers.json' },
//     { key: 'incContact', file: 'incContact.json' }
// ];

// for (const recruiter of recruiters) {
//     for (const status of statuses) {
//         test(`Poređenje ${status.key} brojeva - ${recruiter}`, async ({ page }) => {
//             test.setTimeout(120000);
//             const recruitment = new RecrutimentPage(page);
//             await page.goto('https://master.superegoholding.app/recruitment', { waitUntil: 'networkidle' });
//             await recruitment.recruiterTab.click();
//             const recruiterOption = page.locator('.v-list-item__title').filter({ hasText: recruiter });
//             const dropdownList = page.locator('.v-menu__content');
//             await recruitment.searchRecruiterMenu.click();
//             // scroll
//             let previousHeight = 0;
//             for (let i = 0; i < 10; i++) {
//                 const currentHeight = await dropdownList.evaluate(el => el.scrollHeight);
//                 if (currentHeight === previousHeight) {
//                     break;
//                 }
//                 await dropdownList.evaluate(el => {
//                     el.scrollTop = el.scrollHeight;
//                 });
//                 previousHeight = currentHeight;
//                 await page.waitForTimeout(300);
//             }
//             await recruitment.selectRecruiter(recruitment.searchRecruiterMenu, recruiterOption);
//             await page.waitForLoadState('networkidle');
//             // filtriraj samo status koji testiramo
//             await filterByStatus(page, recruitment, status.key);
//             // pokupi nove brojeve
//             const newNumbers = await getNumbersFromTable(page, recruitment);
//             // učitaj stare brojeve iz fajla (root projekta)
//             const filePath = path.join(
//                 process.cwd(),
//                 status.file.replace('.json', `_${recruiter.replace(' ', '_')}.json`)
//             );
//             if (!fs.existsSync(filePath)) {
//                 throw new Error(`❌ Fajl ne postoji: ${filePath}. Pokreni prvo saveNumber test.`);
//             }
//             const oldNumbers: string[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//             // validacija: novi skup brojeva ne sme sadržati stare
//             const oldSet = new Set(oldNumbers);
//             const duplicates = newNumbers.filter(num => oldSet.has(num));
//             expect(duplicates.length, `Ponovljeni brojevi za ${status.key} - ${recruiter}`).toBe(0);
//             console.log(`✅ Provera završena: ${status.key} - ${recruiter} (${newNumbers.length} brojeva)`);
//         });
//     }
// }
