import { APIRequestContext } from '@playwright/test';

// Service layer for ELD Dashboard calls (/eld-dashboard).
//
// A truck that ends up in the "locked trucks" list (bottom of the dashboard) is shown
// DISABLED in the Start-call truck dropdown, so every test selecting it fails. The UI
// unlock (chip trash icon) was done after the Start-call modal was already open, so its
// overlay blocked the click and the lock survived into every following run.
//
// Endpoint (staging.vrlz.app, verified 2026-11-11 from the locked-truck chip):
//   DELETE /api/calls/locked-trucks-delete/{truckNumber} -> 200
export class EldCallService {
    private apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    /** Best-effort unlock — a truck that is not locked is simply ignored. */
    async unlockTrucks(...truckNumbers: string[]): Promise<void> {
        for (const truckNumber of truckNumbers) {
            await this.apiContext.delete(`/api/calls/locked-trucks-delete/${truckNumber}`);
        }
    }
}
