import { APIRequestContext, expect } from '@playwright/test';

// Service layer for Leasing "Clients" companies. Tracks created companies and
// deletes them on cleanup() so the suite stays 4-worker safe. All mutating
// endpoints assert their status so callers get a clear failure at the call site.
//
// Endpoints (staging.vrlz.app, verified 2026-06-10):
//   POST   /ms-leasing/company      body { clientDto, sisterCompanies } -> 201, returns the full record
//   GET    /ms-leasing/company/{id} -> 200, returns the full record
//   PUT    /ms-leasing/company/{id} body { clientDto, sisterCompanies } -> 200, returns { updatedCompany }
//   DELETE /ms-leasing/company/{id} -> 200/204 (soft-delete: flips isActive -> false)
//
// Only `name` is required inside clientDto; pass any other fields you want set.
export class LeasingCompanyService {
    private apiContext: APIRequestContext;
    private createdCompanyIds: number[] = [];

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async createCompany(company: { name: string;[key: string]: unknown }) {
        const response = await this.apiContext.post('/ms-leasing/company', {
            data: { clientDto: company, sisterCompanies: [] },
        });
        expect(response.status(), await response.text().catch(() => '')).toBe(201);
        const created = await response.json();
        expect(created.id).toBeDefined();
        this.createdCompanyIds.push(created.id);
        return created;
    }

    async getCompanyById(id: number) {
        const response = await this.apiContext.get(`/ms-leasing/company/${id}`);
        if (response.status() === 404) return undefined;
        expect(response.status()).toBe(200);
        return await response.json();
    }

    // Sends the fields wrapped in clientDto (same shape as create); the backend
    // replaces the company with them, so pass every field you want to keep.
    async updateCompany(id: number, fields: { [key: string]: unknown }) {
        const response = await this.apiContext.put(`/ms-leasing/company/${id}`, {
            data: { clientDto: fields, sisterCompanies: [] },
        });
        expect(response.status(), await response.text().catch(() => '')).toBe(200);
        const body = await response.json();
        return body.updatedCompany ?? body;
    }

    async deleteCompany(id: number) {
        const response = await this.apiContext.delete(`/ms-leasing/company/${id}`);
        expect([200, 204]).toContain(response.status());
        this.createdCompanyIds = this.createdCompanyIds.filter((companyId) => companyId !== id);
        return response;
    }

    async cleanup() {
        for (const id of this.createdCompanyIds) {
            try {
                await this.apiContext.delete(`/ms-leasing/company/${id}`);
            } catch (error) {
                console.warn(`Failed to delete company with id: ${id}`, error);
            }
        }
        this.createdCompanyIds = [];
    }
}
