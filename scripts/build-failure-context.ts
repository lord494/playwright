import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();

const INPUT_FILE = path.join(
    PROJECT_ROOT,
    'test-results',
    'results.json',
);

const OUTPUT_FILE = path.join(
    PROJECT_ROOT,
    'test-results',
    'failure-context.json',
);

/**
 * Dijelovi Playwright JSON reporta koje trenutno koristimo.
 *
 * Ne opisujemo kompletan Playwright JSON format, već samo polja
 * koja su potrebna našoj skripti.
 */

interface PlaywrightLocation {
    file?: string;
    line?: number;
    column?: number;
}

interface PlaywrightError {
    message?: string;
    stack?: string;
    location?: PlaywrightLocation;
    snippet?: string;
}

interface PlaywrightAttachment {
    name?: string;
    contentType?: string;
    path?: string;
}

interface PlaywrightTestResult {
    workerIndex?: number;
    status?: string;
    duration?: number;
    error?: PlaywrightError;
    errors?: PlaywrightError[];
    retry?: number;
    startTime?: string;
    attachments?: PlaywrightAttachment[];
    errorLocation?: PlaywrightLocation;
    stdout?: unknown[];
    stderr?: unknown[];
}

interface PlaywrightTest {
    timeout?: number;
    expectedStatus?: string;
    projectId?: string;
    projectName?: string;
    status?: string;
    results?: PlaywrightTestResult[];
}

interface PlaywrightSpec {
    title?: string;
    ok?: boolean;
    id?: string;
    file?: string;
    line?: number;
    column?: number;
    tests?: PlaywrightTest[];
}

interface PlaywrightSuite {
    title?: string;
    file?: string;
    suites?: PlaywrightSuite[];
    specs?: PlaywrightSpec[];
}

interface PlaywrightStats {
    startTime?: string;
    duration?: number;
    expected?: number;
    skipped?: number;
    unexpected?: number;
    flaky?: number;
}

interface PlaywrightReport {
    config?: {
        configFile?: string;
        rootDir?: string;
        workers?: number;
        version?: string;
        metadata?: {
            actualWorkers?: number;
        };
        projects?: Array<{
            name?: string;
            retries?: number;
            timeout?: number;
            outputDir?: string;
        }>;
    };
    suites?: PlaywrightSuite[];
    errors?: PlaywrightError[];
    stats?: PlaywrightStats;
}

/**
 * Struktura čistog fajla koji generišemo.
 */

interface CleanAttachment {
    name: string;
    contentType: string | null;
    path: string | null;
    relativePath: string | null;
}

interface CleanAttempt {
    attempt: number;
    retry: number;
    workerIndex: number | null;
    status: string;
    durationMs: number;
    startTime: string | null;
    errorType: string | null;
    errorMessage: string | null;
    stack: string | null;
    location: {
        file: string | null;
        relativeFile: string | null;
        line: number | null;
        column: number | null;
    };
    attachments: CleanAttachment[];
}

interface CleanFailure {
    id: string;
    title: string;
    file: string | null;
    line: number | null;
    column: number | null;
    projectName: string | null;
    expectedStatus: string;
    finalStatus: string;
    classification: 'failed' | 'flaky';
    attemptsCount: number;
    failedAttemptsCount: number;
    passedAttemptsCount: number;
    attempts: CleanAttempt[];
    failureSignature: string;
}

interface FailureContext {
    generatedAt: string;
    sourceFile: string;
    run: {
        playwrightVersion: string | null;
        configFile: string | null;
        rootDir: string | null;
        workers: number | null;
        retries: number | null;
        testTimeoutMs: number | null;
        startTime: string | null;
        durationMs: number;
    };
    summary: {
        total: number;
        expected: number;
        failed: number;
        flaky: number;
        skipped: number;
        failureEntries: number;
    };
    failures: CleanFailure[];
    globalErrors: Array<{
        message: string;
        stack: string | null;
        location: {
            file: string | null;
            relativeFile: string | null;
            line: number | null;
            column: number | null;
        };
    }>;
}

/**
 * Uklanja ANSI kodove za terminalske boje.
 *
 * Na primjer:
 * \u001b[31mTimed out\u001b[39m
 *
 * postaje:
 * Timed out
 */
function stripAnsi(value: string | undefined | null): string | null {
    if (!value) {
        return null;
    }

    return value
        .replace(
            // eslint-disable-next-line no-control-regex
            /[\u001B\u009B][[\]()#;?]*(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d/#&.:=?%@~_]+)*)?\u0007|(?:(?:\d{1,4}(?:[;:]\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g,
            '',
        )
        .trim();
}

/**
 * Pretvara apsolutnu Windows/Linux putanju u putanju
 * relativnu rootu projekta.
 *
 * Primjer:
 * C:\Users\Bosko\QA-test\tests\trailer\example.spec.ts
 *
 * postaje:
 * tests/trailer/example.spec.ts
 */
function toRelativePath(
    filePath: string | undefined | null,
): string | null {
    if (!filePath) {
        return null;
    }

    const relativePath = path.relative(PROJECT_ROOT, filePath);

    return relativePath.split(path.sep).join('/');
}

/**
 * Standardizuje putanju bez obzira da li skripta radi
 * na Windowsu ili Linux GitHub runneru.
 */
function normalizePath(
    filePath: string | undefined | null,
): string | null {
    if (!filePath) {
        return null;
    }

    return filePath.split('\\').join('/');
}

/**
 * Pokušava da prepozna osnovni tip greške.
 *
 * Ovo još nije AI klasifikacija root cause-a.
 * Samo normalizujemo tehnički tip Playwright greške.
 */
function detectErrorType(
    message: string | null,
    stack: string | null,
): string | null {
    const combinedText = `${message ?? ''}\n${stack ?? ''}`.toLowerCase();

    if (!combinedText.trim()) {
        return null;
    }

    if (
        combinedText.includes(
            'target page, context or browser has been closed',
        )
    ) {
        return 'TargetClosedError';
    }

    if (
        combinedText.includes('strict mode violation') ||
        combinedText.includes('resolved to') &&
        combinedText.includes('elements')
    ) {
        return 'StrictModeViolation';
    }

    if (
        combinedText.includes('timed out') &&
        combinedText.includes('expect(')
    ) {
        return 'ExpectationTimeout';
    }

    if (
        combinedText.includes('timeout') ||
        combinedText.includes('timed out')
    ) {
        return 'TimeoutError';
    }

    if (combinedText.includes('net::')) {
        return 'NetworkError';
    }

    if (
        combinedText.includes('401') ||
        combinedText.includes('unauthorized')
    ) {
        return 'UnauthorizedError';
    }

    if (
        combinedText.includes('403') ||
        combinedText.includes('forbidden')
    ) {
        return 'ForbiddenError';
    }

    if (combinedText.includes('locator')) {
        return 'LocatorError';
    }

    if (combinedText.includes('expect')) {
        return 'AssertionError';
    }

    return 'UnknownError';
}

/**
 * Skrati predugačke vrijednosti da failure-context.json
 * ne postane skoro jednako velik kao originalni results.json.
 */
function truncate(
    value: string | null,
    maxLength: number,
): string | null {
    if (!value || value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength)}\n... [truncated]`;
}

/**
 * Normalizuje poruku kako bismo kasnije mogli grupisati
 * testove koji su pali zbog istog razloga.
 *
 * Uklanjamo vrijednosti koje se mogu razlikovati od runa do runa:
 * - timeout brojeve
 * - line/column brojeve
 * - duge ID vrijednosti
 * - Windows/Linux razlike u putanjama
 */
function normalizeForSignature(value: string | null): string {
    if (!value) {
        return 'no-error-message';
    }

    return value
        .toLowerCase()
        .replace(/\d+ms/g, '<timeout>')
        .replace(/:\d+:\d+/g, ':<line>:<column>')
        .replace(/line\s+\d+/g, 'line <number>')
        .replace(/[a-f0-9]{16,}/gi, '<id>')
        .replace(/\\/g, '/')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Jednostavan stabilan hash.
 *
 * Nije sigurnosni hash. Koristimo ga samo da napravimo
 * kratak ID za failure signature.
 */
function createSimpleHash(value: string): string {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }

    return hash.toString(16).padStart(8, '0');
}

function cleanLocation(
    location: PlaywrightLocation | undefined,
): CleanAttempt['location'] {
    return {
        file: normalizePath(location?.file),
        relativeFile: toRelativePath(location?.file),
        line: location?.line ?? null,
        column: location?.column ?? null,
    };
}

function cleanAttachments(
    attachments: PlaywrightAttachment[] | undefined,
): CleanAttachment[] {
    return (attachments ?? []).map(attachment => ({
        name: attachment.name ?? 'unknown',
        contentType: attachment.contentType ?? null,
        path: normalizePath(attachment.path),
        relativePath: toRelativePath(attachment.path),
    }));
}

function cleanAttempt(
    result: PlaywrightTestResult,
    index: number,
): CleanAttempt {
    const rawMessage =
        result.error?.message ??
        result.errors?.[0]?.message ??
        null;

    const rawStack =
        result.error?.stack ??
        result.errors?.[0]?.stack ??
        null;

    const errorMessage = truncate(stripAnsi(rawMessage), 5_000);
    const stack = truncate(stripAnsi(rawStack), 8_000);

    const location =
        result.errorLocation ??
        result.error?.location ??
        result.errors?.[0]?.location;

    return {
        attempt: index + 1,
        retry: result.retry ?? index,
        workerIndex: result.workerIndex ?? null,
        status: result.status ?? 'unknown',
        durationMs: result.duration ?? 0,
        startTime: result.startTime ?? null,
        errorType: detectErrorType(errorMessage, stack),
        errorMessage,
        stack,
        location: cleanLocation(location),
        attachments: cleanAttachments(result.attachments),
    };
}

/**
 * Rekurzivno prolazi kroz Playwright suite strukturu.
 *
 * Playwright suite može imati:
 * - specs direktno
 * - dodatne nested suites
 */
function collectFailuresFromSuite(
    suite: PlaywrightSuite,
    failures: CleanFailure[],
): void {
    for (const spec of suite.specs ?? []) {
        for (const test of spec.tests ?? []) {
            const finalStatus = test.status ?? 'unknown';

            const shouldInclude =
                finalStatus === 'unexpected' ||
                finalStatus === 'flaky';

            if (!shouldInclude) {
                continue;
            }

            const attempts = (test.results ?? []).map(cleanAttempt);

            const failedAttemptsCount = attempts.filter(
                attempt =>
                    attempt.status === 'failed' ||
                    attempt.status === 'timedOut' ||
                    attempt.status === 'interrupted',
            ).length;

            const passedAttemptsCount = attempts.filter(
                attempt => attempt.status === 'passed',
            ).length;

            const firstFailedAttempt =
                attempts.find(
                    attempt =>
                        attempt.status === 'failed' ||
                        attempt.status === 'timedOut' ||
                        attempt.status === 'interrupted',
                ) ?? attempts[0];

            const normalizedMessage = normalizeForSignature(
                firstFailedAttempt?.errorMessage ?? null,
            );

            const signatureSource = [
                firstFailedAttempt?.errorType ?? 'UnknownError',
                normalizedMessage,
                firstFailedAttempt?.location.relativeFile ?? spec.file ?? '',
            ].join('|');

            const signatureHash = createSimpleHash(signatureSource);

            failures.push({
                id: spec.id ?? `${spec.file ?? 'unknown'}:${spec.line ?? 0}`,
                title: spec.title ?? 'Unnamed test',
                file: normalizePath(spec.file),
                line: spec.line ?? null,
                column: spec.column ?? null,
                projectName: test.projectName || null,
                expectedStatus: test.expectedStatus ?? 'passed',
                finalStatus,
                classification:
                    finalStatus === 'flaky' ? 'flaky' : 'failed',
                attemptsCount: attempts.length,
                failedAttemptsCount,
                passedAttemptsCount,
                attempts,
                failureSignature: `${firstFailedAttempt?.errorType ?? 'UnknownError'}-${signatureHash}`,
            });
        }
    }

    for (const childSuite of suite.suites ?? []) {
        collectFailuresFromSuite(childSuite, failures);
    }
}

function cleanGlobalErrors(
    errors: PlaywrightError[] | undefined,
): FailureContext['globalErrors'] {
    return (errors ?? []).map(error => ({
        message: truncate(stripAnsi(error.message), 5_000) ?? 'Unknown error',
        stack: truncate(stripAnsi(error.stack), 8_000),
        location: cleanLocation(error.location),
    }));
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
            throw new Error(
                [
                    `Input file was not found: ${filePath}`,
                    '',
                    'First run Playwright with the JSON reporter enabled:',
                    '$env:CI = "true"',
                    'npx playwright test',
                ].join('\n'),
            );
        }

        if (error instanceof SyntaxError) {
            throw new Error(
                `Input file is not valid JSON: ${filePath}`,
            );
        }

        throw error;
    }
}

async function writeJsonFile(
    filePath: string,
    value: unknown,
): Promise<void> {
    await fs.mkdir(path.dirname(filePath), {
        recursive: true,
    });

    await fs.writeFile(
        filePath,
        JSON.stringify(value, null, 2),
        'utf8',
    );
}

async function buildFailureContext(): Promise<void> {
    console.log(`Reading Playwright report: ${INPUT_FILE}`);

    const report = await readJsonFile<PlaywrightReport>(INPUT_FILE);

    const failures: CleanFailure[] = [];

    for (const suite of report.suites ?? []) {
        collectFailuresFromSuite(suite, failures);
    }

    const stats = report.stats ?? {};

    const expected = stats.expected ?? 0;
    const failed = stats.unexpected ?? 0;
    const flaky = stats.flaky ?? 0;
    const skipped = stats.skipped ?? 0;

    const total = expected + failed + flaky + skipped;

    const firstProject = report.config?.projects?.[0];

    const failureContext: FailureContext = {
        generatedAt: new Date().toISOString(),
        sourceFile: toRelativePath(INPUT_FILE) ?? INPUT_FILE,

        run: {
            playwrightVersion: report.config?.version ?? null,
            configFile:
                normalizePath(report.config?.configFile) ?? null,
            rootDir:
                normalizePath(report.config?.rootDir) ?? null,
            workers:
                report.config?.metadata?.actualWorkers ??
                report.config?.workers ??
                null,
            retries: firstProject?.retries ?? null,
            testTimeoutMs: firstProject?.timeout ?? null,
            startTime: stats.startTime ?? null,
            durationMs: stats.duration ?? 0,
        },

        summary: {
            total,
            expected,
            failed,
            flaky,
            skipped,
            failureEntries: failures.length,
        },

        failures,

        globalErrors: cleanGlobalErrors(report.errors),
    };

    await writeJsonFile(OUTPUT_FILE, failureContext);

    console.log('');
    console.log('Failure context successfully generated.');
    console.log(`Output: ${OUTPUT_FILE}`);
    console.log('');
    console.log(`Total tests: ${total}`);
    console.log(`Expected: ${expected}`);
    console.log(`Failed: ${failed}`);
    console.log(`Flaky: ${flaky}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Failure entries: ${failures.length}`);
}

buildFailureContext().catch(error => {
    console.error('');
    console.error('Failed to build failure context.');

    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }

    process.exitCode = 1;
});