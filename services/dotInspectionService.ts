import { APIRequestContext } from '@playwright/test';

// Service layer for DOT inspections (/dot-inspections).
//
// Endpoint (staging.vrlz.app, verified 2026-11-11):
//   DELETE /api/dot-inspections/{id} -> 200
export class DotInspectionService {
    private apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    /** Deletes the given inspections; ids already deleted by the test's own UI step are ignored. */
    async deleteInspections(ids: string[]): Promise<void> {
        for (const id of ids) {
            await this.apiContext.delete(`/api/dot-inspections/${id}`);
        }
    }
}
