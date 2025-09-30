// import { test } from '@playwright/test';
// import { saveNumbersForStatus } from '../../helpers/dateUtilis';


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

// const recruiters = ['Paul Allen', 'Julian Thompson', 'Jake Walker', 'Diaz Stark', 'Gary Reed', 'Ryan Miles'];
// const statuses = [
//     { key: 'blocked', file: 'blockedNumbers.json' },
//     { key: 'employed', file: 'employedNumbers.json' },
//     { key: 'retired', file: 'exDrivers.json' },
//     { key: 'incContact', file: 'incContact.json' }
// ];

// for (const recruiter of recruiters) {
//     for (const status of statuses) {
//         test(`Snimanje brojeva za ${status.key} - ${recruiter}`, async ({ page }) => {
//             test.setTimeout(120000);
//             await page.goto('https://master.superegoholding.app/recruitment', { waitUntil: 'networkidle' });
//             await saveNumbersForStatus(
//                 page,
//                 recruiter,
//                 status.key,
//                 status.file.replace('.json', `_${recruiter.replace(' ', '_')}.json`)
//             );
//         });
//     }
// }