import { APIRequestContext, expect } from '@playwright/test';
import { Constants } from '../helpers/constants';

// Service layer for Prebook "Post Loads". Tracks created loads and cancels them on
// cleanup() so the suite stays 4-worker safe. All mutating endpoints assert their
// status so callers get a clear failure at the offending call.
//
// Endpoints (staging.vrlz.app, captured 2026-06-15):
//   POST /api/prebook-loads                                        multipart -> created load
//   GET  /api/prebook-loads?loadId&filter=notbooked&pickup[]&pickup[]&dho&dhd -> { docs }
//   PUT  /api/prebook-loads                                        multipart (full record) -> updated
//   PUT  /api/prebook-loads/book/CANCELED/{id}                     soft-delete: status -> CANCELED
//
// A load is identified by a unique random load_id; only load_id + the two dates are
// required, everything else falls back to Constants.
type Geo = { lat: number; lng: number; name: string };

export type PrebookLoadInput = {
    load_id: string;
    pickup_date: string;   // YYYY-MM-DD
    delivery_date: string; // YYYY-MM-DD
    pickup_time?: string;
    delivery_time?: string;
    origin?: Geo;
    destination?: Geo;
    company?: string;
    contact?: { name: string; phone: string; email: string };
    trailer_type?: string;
    weight?: string | number;
    rate?: string | number;
    suggested_rate?: string | number;
    dedicated?: boolean;
    note?: string;
};

export class PrebookLoadService {
    private apiContext: APIRequestContext;
    private createdLoadIds: string[] = [];

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    // Flat multipart body matching the form the UI posts. Nested fields use
    // bracket keys (`origin[lat]`); arrays go as the literal '[]' string.
    private buildForm(input: PrebookLoadInput): Record<string, string | number | boolean> {
        const origin = input.origin ?? Constants.prebookOriginGeo;
        const destination = input.destination ?? Constants.prebookDestinationGeo;
        const contact = input.contact ?? {
            name: Constants.playWrightUser,
            phone: Constants.phoneNumberOfUserApp,
            email: Constants.testEmail,
        };
        return {
            load_id: input.load_id,
            pickup_date: input.pickup_date,
            pickup_time: input.pickup_time ?? '12:00',
            pickup_time_to: '',
            delivery_date: input.delivery_date,
            delivery_time: input.delivery_time ?? '12:00',
            delivery_time_to: '',
            dedicated: String(input.dedicated ?? false),
            'origin[lat]': origin.lat,
            'origin[lng]': origin.lng,
            'origin[name]': origin.name,
            'destination[lat]': destination.lat,
            'destination[lng]': destination.lng,
            'destination[name]': destination.name,
            company: input.company ?? Constants.prebookApiCompany,
            'contact[name]': contact.name,
            'contact[phone]': contact.phone,
            'contact[email]': contact.email,
            trailer_type: input.trailer_type ?? Constants.firstTrailerType,
            weight: input.weight ?? Constants.weight,
            rate: input.rate ?? Constants.amount,
            suggested_rate: input.suggested_rate ?? Constants.suggestedRate,
            file: '',
            'note[text]': input.note ?? '',
            booked_contact: '',
            booked_company: '',
            additional_origins: '[]',
            additional_destinations: '[]',
        };
    }

    // Brackets the pickup day by ±1 so the load lands inside the read window
    // regardless of timezone bucketing.
    private pickupWindow(pickupDate: string): { from: string; to: string } {
        const day = new Date(`${pickupDate}T00:00:00Z`);
        const fmt = (d: Date) => d.toISOString().slice(0, 10);
        const from = new Date(day);
        from.setUTCDate(day.getUTCDate() - 1);
        const to = new Date(day);
        to.setUTCDate(day.getUTCDate() + 1);
        return { from: fmt(from), to: fmt(to) };
    }

    // POST /api/prebook-loads, then resolve the stored record (and its _id) via the
    // notbooked list so callers always get a record with _id for update/cancel.
    async createLoad(input: PrebookLoadInput) {
        const response = await this.apiContext.post('/api/prebook-loads', { multipart: this.buildForm(input) });
        expect([200, 201], await response.text().catch(() => '')).toContain(response.status());

        const record = await this.getByLoadId(input.load_id, input.pickup_date);
        expect(record, `Prebook load "${input.load_id}" not found after create`).toBeTruthy();
        this.createdLoadIds.push(record._id);
        return record;
    }

    // GET the notbooked list filtered by loadId and pickup window; returns the
    // matching record (undefined if none).
    async getByLoadId(loadId: string, pickupDate: string) {
        const { from, to } = this.pickupWindow(pickupDate);
        const url =
            `/api/prebook-loads?loadId=${encodeURIComponent(loadId)}&filter=notbooked` +
            `&pickup[]=${from}&pickup[]=${to}&dho=300&dhd=300`;
        const response = await this.apiContext.get(url);
        expect(response.status()).toBe(200);
        const body = await response.json();
        const docs = Array.isArray(body) ? body : (body.docs ?? body.data ?? []);
        return docs.find((d: { load_id: string }) => d.load_id === loadId);
    }

    // PUT /api/prebook-loads with the full editable payload plus _id + status.
    async updateLoad(id: string, input: PrebookLoadInput) {
        const form = { ...this.buildForm(input), _id: id, status: 'NOT_BOOKED' };
        const response = await this.apiContext.put('/api/prebook-loads', { multipart: form });
        expect([200, 201], await response.text().catch(() => '')).toContain(response.status());
        return response;
    }

    // PUT /api/prebook-loads/book/CANCELED/{id} — soft-delete (status -> CANCELED),
    // so the load leaves the notbooked list.
    async cancelLoad(id: string) {
        const response = await this.apiContext.put(`/api/prebook-loads/book/CANCELED/${id}`);
        expect(response.status()).toBe(200);
        this.createdLoadIds = this.createdLoadIds.filter((loadId) => loadId !== id);
        return response;
    }

    async cleanup() {
        for (const id of this.createdLoadIds) {
            try {
                await this.apiContext.put(`/api/prebook-loads/book/CANCELED/${id}`);
            } catch (error) {
                console.warn(`Failed to cancel prebook load with id: ${id}`, error);
            }
        }
        this.createdLoadIds = [];
    }
}
