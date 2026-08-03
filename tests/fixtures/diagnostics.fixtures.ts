import { test as base } from '@playwright/test';
import fs from 'node:fs/promises';

function stripAnsi(text?: string): string | undefined {
    return text?.replace(/\u001B\[[0-9;]*m/g, '');
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
            }> = [];

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
                    httpErrors.push({
                        method: response.request().method(),
                        url: response.url(),
                        status: response.status(),
                    });
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