// import Imap = require('node-imap');
// import { simpleParser } from 'mailparser';
// import test, { chromium, expect } from '@playwright/test';
// import { PassThrough } from 'stream';

// function getLatestOtpEmail(): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const imap = new Imap({
//       user: 'superegoholdingtest@gmail.com',
//       password: 'zckn dywa xgwe ejmj',
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//     });

//     imap.once('ready', () => {
//       imap.openBox('INBOX', true, (err, box) => {
//         if (err) return reject(err);

//         // Ispravan format pretrage u node-imap
//         imap.search([['SUBJECT', 'OTP TOKEN']], (err, results) => {
//           if (err || results.length === 0) {
//             imap.end();
//             return reject("Nema OTP emailova.");
//           }

//           const latestEmail = results[results.length - 1];
//           const fetch = imap.fetch([latestEmail], { bodies: '', struct: true });

//           fetch.on('message', (msg) => {
//             const passThrough = new PassThrough();

//             msg.on('body', (stream) => {
//               stream.pipe(passThrough);
//               simpleParser(passThrough, (err, parsed) => {
//                 if (err) return reject(err);

//                 const otpMatch = parsed.text?.match(/ENTER THIS OTP TOKEN IN FORM TO GET LOGIN ACCESS: ([A-Za-z0-9]+)/);
//                 if (otpMatch && otpMatch[1]) {
//                   resolve(otpMatch[1]);
//                   imap.end();
//                 } else {
//                   reject("OTP nije pronađen u emailu.");
//                   imap.end();
//                 }
//               });
//             });
//           });

//           fetch.once('end', () => {
//             console.log('Preuzimanje emaila završeno.');
//           });
//         });
//       });
//     });

//     imap.once('error', (err) => reject(err));
//     imap.once('end', () => console.log('IMAP konekcija zatvorena.'));
//     imap.connect();
//   });
// }

// test('Login with OTP', async ({ page }) => {
//   console.log("Starting browser automation...");
//   await page.goto('http://207.154.213.8/login');
//   console.log("Navigating to login page...");
//   await page.getByRole('textbox', { name: 'Login' }).fill("superegoholdingtest@gmail.com");
//   await page.getByRole('textbox', { name: 'Password' }).fill("test1234!!");
//   await page.getByRole('button', { name: 'Login' }).click();
//   await page.waitForLoadState("networkidle");
//   await page.getByRole('button', { name: 'Resend OTP token Email' }).click();
//   console.log("Login form submitted...");
//   // Čekaj nekoliko sekundi da OTP stigne na e-mail
//   await new Promise(resolve => setTimeout(resolve, 5000));  // Čekaj 5 sekundi
//   console.log("Waiting for OTP...");
//   const otp = await getLatestOtpEmail();
//   console.log("OTP is:", otp);
//   await page.fill('input[name="otp"]', otp);
//   await page.getByRole('button', { name: 'Verify' }).click();
//   await page.waitForLoadState('networkidle');
//   await expect(page).toHaveURL(/login/);
// });
