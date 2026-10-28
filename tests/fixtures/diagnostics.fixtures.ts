import { test as base } from '@playwright/test';
import fs from 'node:fs/promises';

function stripAnsi(text?: string): string | undefined {
    return text?.replace(/\u001B\[[0-9;]*m/g, '');
}

const MAX_BODY_LENGTH = 1_000;

// Request/response bodies end up in CI artifacts and in the Claude prompt, so secret-looking
// fields are masked (JSON "password": "..." and form password=...).
function redactAndTruncate(text: string | null): string | null {
    if (!text) {
        return null;
    }

    const redacted = text
        .replace(/("(?:password|token|accessToken|refreshToken|secret|otp)"\s*:\s*)"[^"]*"/gi, '$1"[redacted]"')
        .replace(/\b(password|token|secret|otp)=[^&\s]*/gi, '$1=[redacted]')
        // Validation errors echo the rejected value next to the property name.
        .replace(/("value"\s*:\s*)"[^"]*"(?=\s*,\s*"property"\s*:\s*"(?:password|token|accessToken|refreshToken|secret|otp)")/gi, '$1"[redacted]"');

    return redacted.length > MAX_BODY_LENGTH
        ? `${redacted.slice(0, MAX_BODY_LENGTH)}... [truncated]`
        : redacted;
}


type DiagnosticsFixtures = {
    diagnostics: void;
};

export const test = base.extend<DiagnosticsFixtures>({
    diagnostics: [
        async ({ page }, use, testInfo) => {
            const consoleErrors: string[] = [];
            const pageErrors: string[] = [];
            const failedRequests: string[] = [];
            const httpErrors: Array<{
                method: string;
                url: string;
                status: number;
                requestBody: string | null;
                responseBody: string | null;
            }> = [];
            // Response bodies are read asynchronously; awaited before the diagnostics are written.
            const pendingBodies: Promise<void>[] = [];

            page.on('console', message => {
                if (message.type() === 'error') {
                    consoleErrors.push(message.text());
                }
            });

            page.on('pageerror', error => {
                pageErrors.push(error.message);
            });

            page.on('requestfailed', request => {
                failedRequests.push(
                    `${request.method()} ${request.url()} - ${request.failure()?.errorText ?? 'Unknown error'
                    }`,
                );
            });

            page.on('response', response => {
                if (response.status() >= 400) {
                    // Server poruka (npr. "Shop already exists within this radius") je u body-ju,
                    // bez nje analiza vidi samo status kod.
                    const entry = {
                        method: response.request().method(),
                        url: response.url(),
                        status: response.status(),
                        requestBody: redactAndTruncate(response.request().postData()),
                        responseBody: null as string | null,
                    };
                    httpErrors.push(entry);
                    pendingBodies.push(
                        response.text()
                            .then(body => { entry.responseBody = redactAndTruncate(body); })
                            .catch(() => { }),
                    );
                }
            });

            // Ovdje se izvršava test.
            await use();

            const testFailed =
                testInfo.status !== testInfo.expectedStatus;

            // Dijagnostiku pravimo samo kada test padne.
            if (!testFailed) {
                return;
            }

            await Promise.all(pendingBodies);

            const diagnostics = {
                generatedAt: new Date().toISOString(),
                testTitle: testInfo.title,
                testFile: testInfo.file,
                retry: testInfo.retry,
                status: testInfo.status,
                expectedStatus: testInfo.expectedStatus,
                error: testInfo.error
                    ? {
                        message: stripAnsi(testInfo.error.message),
                        stack: stripAnsi(testInfo.error.stack),
                    }
                    : null,
                project: testInfo.project.name,
                workerIndex: testInfo.workerIndex,
                finalUrl: page.isClosed() ? null : page.url(),
                consoleErrors,
                pageErrors,
                failedRequests,
                httpErrors,
            };

            const diagnosticsPath = testInfo.outputPath(
                'browser-diagnostics.json',
            );

            await fs.writeFile(
                diagnosticsPath,
                JSON.stringify(diagnostics, null, 2),
                'utf8',
            );

            await testInfo.attach('browser-diagnostics', {
                path: diagnosticsPath,
                contentType: 'application/json',
            });
        },
        {
            auto: true,
        },
    ],
});

export { expect } from '@playwright/test';