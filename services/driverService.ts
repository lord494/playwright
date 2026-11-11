import { APIRequestContext, expect } from '@playwright/test';

// Service layer for drivers (/drivers, /drivers/deleted = inactive drivers).
// Used to snapshot a shared driver before a test edits it and restore it afterwards —
// the old UI-based afterAll restore was fragile: when it failed, the driver stayed
// renamed and every other inactive-driver test (which searches it by name) failed.
//
// Endpoints (staging.vrlz.app, verified 2026-11-11):
//   GET /api/drivers?search&deleted=1   -> 200 { docs } (deleted=1 → inactive drivers)
//   GET /api/drivers/{id}               -> 200 full driver
//   PUT /api/drivers  body = driver     -> 200 (full replace; server re-stamps deacivationTime)

// Server-managed fields that must not be sent back on PUT.
const SERVER_FIELDS = ['formatedName', 'createdAt', 'updatedAt', '__v'];

export type DriverSnapshot = Record<string, unknown> & { _id: string };

export class DriverService {
    private apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async findInactiveDriverId(name: string): Promise<string> {
        const response = await this.apiContext.get('/api/drivers', {
            params: { page: '1', perPage: '15', search: name, deleted: '1' },
        });
        expect(response.status()).toBe(200);
        const docs: { _id: string; name: string }[] = (await response.json()).docs;
        const driver = docs.find(d => d.name === name);
        expect(driver, `Inactive driver "${name}" not found — was it left renamed by a previous run?`).toBeDefined();
        return driver!._id;
    }

    async snapshot(id: string): Promise<DriverSnapshot> {
        const response = await this.apiContext.get(`/api/drivers/${id}`);
        expect(response.status()).toBe(200);
        const driver = await response.json();
        for (const field of SERVER_FIELDS) delete driver[field];
        return driver;
    }

    async restore(snapshot: DriverSnapshot): Promise<void> {
        const response = await this.apiContext.put('/api/drivers', { data: snapshot });
        expect(response.status()).toBe(200);
    }
}
