import fs from 'node:fs';
import path from 'node:path';
import type { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

/**
 * Za svaki pali pokušaj testa zapisuje najsporije Playwright akcije i expect korake.
 *
 * JSON reporter ne sadrži korake, a bez njih analiza ne može da razlikuje bug od
 * preopterećenog CI runnera (npr. jedan klik koji traje 15s).
 *
 * Output: test-results/slow-steps.json, ključ je `${test.id}#${retry}`
 * (test.id je isti kao spec.id u results.json). Čita ga build-failure-context.ts.
 */

const OUTPUT_FILE = path.join(process.cwd(), 'test-results', 'slow-steps.json');
const MAX_STEPS = 8;

export interface SlowStep {
    title: string;
    category: string;
    durationMs: number;
    startOffsetMs: number;
    failed: boolean;
}

class SlowStepsReporter implements Reporter {
    private readonly entries: Record<string, SlowStep[]> = {};

    onTestEnd(test: TestCase, result: TestResult): void {
        if (result.status === test.expectedStatus) {
            return;
        }

        const steps: SlowStep[] = [];
        const collect = (list: TestStep[]) => {
            for (const step of list) {
                if (step.category === 'pw:api' || step.category === 'expect') {
                    steps.push({
                        title: step.title,
                        category: step.category,
                        durationMs: step.duration,
                        startOffsetMs: step.startTime.getTime() - result.startTime.getTime(),
                        failed: Boolean(step.error),
                    });
                }
                collect(step.steps);
            }
        };
        collect(result.steps);

        steps.sort((a, b) => b.durationMs - a.durationMs);
        this.entries[`${test.id}#${result.retry}`] = steps.slice(0, MAX_STEPS);
    }

    onEnd(): void {
        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(this.entries, null, 2), 'utf8');
    }

    printsToStdio(): boolean {
        return false;
    }
}

export default SlowStepsReporter;
