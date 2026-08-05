import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();

const FAILURE_CONTEXT_PATH = path.join(
    PROJECT_ROOT,
    'test-results',
    'failure-context.json',
);

const FIX_CONTEXT_PATH = path.join(
    PROJECT_ROOT,
    'test-results',
    'fix-context.json',
);

interface BrowserDiagnostics {
    generatedAt?: string;
    testTitle?: string;
    testFile?: string;
    retry?: number;
    status?: string | null;
    expectedStatus?: string;
    finalUrl?: string | null;

    error?: {
        message?: string;
        stack?: string;
    } | null;

    consoleErrors?: string[];
    pageErrors?: string[];
    failedRequests?: string[];

    httpErrors?: Array<{
        method: string;
        url: string;
        status: number;
    }>;
}

interface FailureAttempt {
    attempt: number;
    retry: number;
    status: string;
    errorType: string | null;
    errorMessage: string | null;
    stack: string | null;

    location: {
        file: string | null;
        relativeFile: string | null;
        line: number | null;
        column: number | null;
    };

    browserDiagnostics?: BrowserDiagnostics | null;
}

interface FailureEntry {
    id: string;
    title: string;
    file: string | null;
    line: number | null;
    column: number | null;
    classification: 'failed' | 'flaky';
    failureSignature: string;
    attempts: FailureAttempt[];
}

interface FailureContext {
    generatedAt: string;

    summary: {
        total: number;
        expected: number;
        failed: number;
        flaky: number;
        skipped: number;
        failureEntries: number;
    };

    failures: FailureEntry[];
}

interface FixContextEntry {
    failure: {
        id: string;
        title: string;
        classification: 'failed' | 'flaky';
        failureSignature: string;
        testFile: string;
        testLine: number | null;
        errorType: string | null;
        errorMessage: string | null;
        errorLocation: {
            file: string | null;
            line: number | null;
            column: number | null;
        };
        browserDiagnostics: BrowserDiagnostics | null;
    };

    sourceCode: {
        file: string;
        content: string;
    };
}

interface FixContext {
    generatedAt: string;
    sourceFile: string;
    failuresCount: number;
    failures: FixContextEntry[];
}

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const content = await fs.readFile(filePath, 'utf8');

        return JSON.parse(content) as T;
    } catch (error) {
        if (
            error instanceof Error &&
            'code' in error &&
            error.code === 'ENOENT'
        ) {
            throw new Error(`File was not found: ${filePath}`);
        }

        if (error instanceof SyntaxError) {
            throw new Error(`File is not valid JSON: ${filePath}`);
        }

        throw error;
    }
}

async function readSourceFile(
    relativeFilePath: string,
): Promise<string> {
    const absolutePath = path.join(
        PROJECT_ROOT,
        relativeFilePath,
    );

    try {
        return await fs.readFile(absolutePath, 'utf8');
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : String(error);

        console.warn(
            `Could not read source file: ${relativeFilePath}`,
        );

        console.warn(message);

        return '';
    }
}

function normalizeTestFile(file: string): string {
    const normalized = file.replace(/\\/g, '/');

    if (normalized.startsWith('tests/')) {
        return normalized;
    }

    return `tests/${normalized}`;
}

function getMainFailedAttempt(
    failure: FailureEntry,
): FailureAttempt | null {
    return (
        failure.attempts.find(
            attempt =>
                attempt.status === 'failed' ||
                attempt.status === 'timedOut' ||
                attempt.status === 'interrupted',
        ) ??
        failure.attempts[0] ??
        null
    );
}

async function buildFixContext(): Promise<void> {
    console.log(
        `Reading failure context: ${FAILURE_CONTEXT_PATH}`,
    );

    const failureContext =
        await readJsonFile<FailureContext>(
            FAILURE_CONTEXT_PATH,
        );

    const fixEntries: FixContextEntry[] = [];

    for (const failure of failureContext.failures) {
        if (!failure.file) {
            console.warn(
                `Skipping failure without a test file: ${failure.title}`,
            );

            continue;
        }

        const testFile = normalizeTestFile(failure.file);
        const sourceCode = await readSourceFile(testFile);
        const failedAttempt = getMainFailedAttempt(failure);

        fixEntries.push({
            failure: {
                id: failure.id,
                title: failure.title,
                classification: failure.classification,
                failureSignature: failure.failureSignature,
                testFile,
                testLine: failure.line,
                errorType: failedAttempt?.errorType ?? null,
                errorMessage: failedAttempt?.errorMessage ?? null,

                errorLocation: {
                    file:
                        failedAttempt?.location.relativeFile ??
                        failedAttempt?.location.file ??
                        null,
                    line: failedAttempt?.location.line ?? null,
                    column: failedAttempt?.location.column ?? null,
                },

                browserDiagnostics:
                    failedAttempt?.browserDiagnostics ?? null,
            },

            sourceCode: {
                file: testFile,
                content: sourceCode,
            },
        });
    }

    const fixContext: FixContext = {
        generatedAt: new Date().toISOString(),
        sourceFile: 'test-results/failure-context.json',
        failuresCount: fixEntries.length,
        failures: fixEntries,
    };

    await fs.writeFile(
        FIX_CONTEXT_PATH,
        JSON.stringify(fixContext, null, 2),
        'utf8',
    );

    console.log('');
    console.log('Fix context successfully generated.');
    console.log(`Output: ${FIX_CONTEXT_PATH}`);
    console.log(`Failures included: ${fixEntries.length}`);
}

buildFixContext().catch(error => {
    console.error('');
    console.error('Failed to build fix context.');

    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }

    process.exitCode = 1;
});