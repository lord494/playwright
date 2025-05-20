import { Page } from "@playwright/test";
import Imap = require('node-imap');
import { simpleParser } from 'mailparser';
import { PassThrough } from 'stream';

export function getLatestOtpEmail(): Promise<string> {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: 'superegoholdingtest@gmail.com',
      password: 'zckn dywa xgwe ejmj',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
        imap.search([
          ['SUBJECT', 'OTP TOKEN'],
          ['SINCE', fiveMinutesAgo]
        ], (err, results) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          if (results.length === 0) {
            imap.end();
            return reject("No OTP emails found in the last 5 minutes.");
          }

          const latestEmail = results[results.length - 1];
          const fetch = imap.fetch([latestEmail], { bodies: '' });

          fetch.on('message', (msg) => {
            const passThrough = new PassThrough();

            msg.on('body', (stream) => {
              stream.pipe(passThrough);
              simpleParser(passThrough, async (err, parsed) => {
                if (err) {
                  imap.end();
                  return reject(err);
                }

                const textContent = parsed.text || '';
                console.log('Email text content:', textContent);
                const textMatch = textContent.match(/.*?([A-Z0-9]{6,})$/i);
                if (textMatch && textMatch[1]) {
                  console.log('Found OTP in text:', textMatch[1]);
                  return resolve(textMatch[1]);
                }
                const htmlContent = parsed.html || '';
                console.log('Email HTML content:', htmlContent);
                const htmlMatch = htmlContent.match(/.*?([A-Z0-9]{6,})$/i);
                if (htmlMatch && htmlMatch[1]) {
                  console.log('Found OTP in HTML:', htmlMatch[1]);
                  imap.end();
                  return resolve(htmlMatch[1]);
                }

                imap.end();
                reject("OTP token not found in email content");
              });
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            imap.end();
            reject(err);
          });

          fetch.once('end', () => {
            console.log('Finished fetching email');
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP error:', err);
      reject(err);
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
    });

    imap.connect();
  });
}

export class Login {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginOnTms(email: string, password: string) {
    await this.page.goto('https://staging.superegoholding.app/login', { timeout: 60000 });
    await this.page.getByRole('textbox', { name: 'Login' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);

    if (this.page.url().includes('/otp-validate')) {
      console.log('Entering OTP validation flow');
      await this.page.getByRole('button', { name: 'Resend OTP token Email' }).click();
      console.log('Clicked resend OTP button');
      await this.page.waitForTimeout(3000);
      let otp;
      try {
        console.log('Attempting to get OTP from email...');
        otp = await getLatestOtpEmail();
        console.log('Retrieved OTP:', otp);
      } catch (error) {
        console.error('Failed to get OTP:', error);
        throw error;
      }

      console.log('Filling OTP:', otp);
      await this.page.fill('input[name="otp"]', otp);
      await this.page.getByRole('button', { name: 'Verify' }).click();
      console.log('Clicked verify button');
      await this.page.waitForTimeout(3000);
      await this.page.screenshot({ path: 'C:\\Users\\Bosko\\QA-test\\screenshot.png' });
      await this.page.waitForSelector('input[name="login"]', { timeout: 60000 });
      await this.page.waitForSelector('input[name="password"]', { timeout: 60000 });
      console.log('Re-entering login credentials');
      await this.page.fill('input[name="login"]', email);
      await this.page.fill('input[name="password"]', password);
      await this.page.getByRole('button', { name: 'Login' }).click();
      await this.page.waitForLoadState('networkidle');
      console.log('Login process completed');
    }
  }
}