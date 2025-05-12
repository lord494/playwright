import Imap = require('node-imap');
import { simpleParser } from 'mailparser';
import { chromium } from '@playwright/test';
import { PassThrough } from 'stream';

export class OtpAutomation {
  async getOtp(): Promise<string> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: 'superegoholdingtest@gmail.com',
        password: 'zckn dywa xgwe ejmj',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
      });

      imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
          if (err) return reject(err);

          imap.search([['SUBJECT', 'OTP TOKEN']], (err, results) => {
            if (err || results.length < 2) {
              imap.end();
              return reject("Nema dovoljno OTP emailova.");
            }

            const secondLatestEmail = results[results.length - 1];
            const fetch = imap.fetch([secondLatestEmail], { bodies: '', struct: true });

            fetch.on('message', (msg) => {
              const passThrough = new PassThrough();

              msg.on('body', (stream) => {
                stream.pipe(passThrough);
                simpleParser(passThrough, (err, parsed) => {
                  if (err) return reject(err);

                  const otpMatch = parsed.text?.match(/ENTER THIS OTP TOKEN IN FORM TO GET LOGIN ACCESS: ([A-Za-z0-9]+)/);
                  if (otpMatch && otpMatch[1]) {
                    imap.end();
                    resolve(otpMatch[1]); // Samo vraćamo OTP kod
                  } else {
                    imap.end();
                    reject("OTP nije pronađen u emailu.");
                  }
                });
              });
            });

            fetch.once('end', () => {
              console.log('Preuzimanje emaila završeno.');
            });
          });
        });
      });

      imap.once('error', (err) => reject(err));
      imap.once('end', () => console.log('IMAP konekcija zatvorena.'));
      imap.connect();
    });
  }
}

(async () => {
  try {
    const automation = new OtpAutomation();
    await automation.getOtp();
  } catch (err) {
    console.error("Došlo je do greške:", err);
  }
})();
