import { APIRequestContext, APIResponse, expect } from '@playwright/test';

// Service layer for Leasing "Clients" companies. Tracks created companies and
// deletes them on cleanup() so the suite stays 4-worker safe. All mutating
// endpoints assert their status so callers get a clear failure at the call site.
//
// Endpoints (staging.vrlz.app, verified 2026-09-03 against /leasing/clients):
//   POST   /ms-leasing/company      body { clientDto, sisterCompanies } -> 201, returns the full record
//   GET    /ms-leasing/company/{id} -> 200, returns the full record
//   PUT    /ms-leasing/company/{id} body { clientDto, sisterCompanies } -> 200 { updatedCompany, message }
//          (same clientDto shape as create, no id inside it; replaces the record)
//   DELETE /ms-leasing/company/{id} -> 200 { message, company } — soft-delete: the
//          record keeps its id and flips isActive to false, stays readable by id,
//          and drops out of the list + both search endpoints
//   GET    /ms-leasing/company?page&itemsPerPage&filters -> 200 { data, total }
//          (the /leasing/clients table; returns only isActive records)
//   GET    /ms-leasing/company/full-text-search?query -> 200 [ full records ]
//          (the "Search clients" box above the table)
//   GET    /ms-leasing/company/search?search&searchOwnerOperators -> 200 { data, total }
//          (the Name column-filter autocomplete; lightweight records)
//
// Only `name` is required inside clientDto; pass any other fields you want set.

export type LeasingCompanyAddress = {
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
};

/** Entry of `guarantors` on GET /ms-leasing/company/{id} (verified 2026-10-06). */
export type LeasingCompanyGuarantor = {
    id: number;
    name: string | null;
    status: string;
    isOwnerOperator: boolean;
    ownerFirstName: string | null;
    ownerLastName: string | null;
};

/**
 * Fields of a leasing company record that the tests read. The endpoint returns
 * ~70 columns (agency / plaintiff / collection blocks, money totals, nested
 * collections); the index signature keeps those reachable without `any`.
 */
export type LeasingCompany = {
    id: number;
    name: string;
    mc: string | null;
    dot: string | null;
    fain: string | null;
    companyAddress: LeasingCompanyAddress | null;
    ownerAddress: LeasingCompanyAddress | null;
    isMuslim: boolean;
    note: string | null;
    leasingCooperation: boolean;
    recruitingCooperation: boolean;
    maintenanceCooperation: boolean;
    fuelCooperation: boolean;
    leasingCoopStartDate: string | null;
    recruitingCoopStartDate: string | null;
    maintenanceCoopStartDate: string | null;
    fuelCoopStartDate: string | null;
    status: string;
    riskLevel: string | null;
    isOwnerOperator: boolean;
    isActive: boolean;
    isGuarantor?: boolean;
    /** Guarantors of this company (filled on the guaranteed company, empty on the guarantor itself). */
    guarantors?: LeasingCompanyGuarantor[];
    fullNameSearch?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
};

/** Body sent inside `clientDto`. `name` is the only server-required field. */
export type LeasingCompanyPayload = {
    name: string;
    [key: string]: unknown;
};

/**
 * Concrete payload the API CRUD tests submit, built by
 * `buildLeasingCompanyPayload` in helpers/dateUtilis. Mirrors the `clientDto`
 * the New Company / Edit company modals send field for field (captured from
 * /leasing/clients 2026-09-03) — create and edit use the same shape.
 *
 * Note what is NOT here: the four `*CoopStartDate` fields. The modals never
 * send them; the backend stamps each one itself when its cooperation flag is
 * true. Declared as a flat type alias (not an interface, not an intersection)
 * so it keeps its implicit index signature and stays assignable to
 * `LeasingCompanyPayload`.
 */
export type NewLeasingCompanyPayload = {
    name: string;
    mc: string;
    dot: string;
    fain: string;
    companyAddress: { address: string; city: string; state: string; zip: string };
    isMuslim: boolean;
    note: string;
    leasingCooperation: boolean;
    recruitingCooperation: boolean;
    maintenanceCooperation: boolean;
    fuelCooperation: boolean;
    startDateOfCooperation: string | null;
    riskLevel: string | null;
    presidentsIds: number[];

    // Insured-agency / collection-agency / plaintiff / representative slots. The
    // modals always send the whole block, as null when nothing is filled in, and
    // PUT replaces the record — so the payload has to carry them to be faithful
    // to the app. Non-null member types are inferred from the table columns;
    // only the null case is exercised by these tests.
    insuredAgencyId: number | null;
    insuredAgencyName: string | null;
    insuredAgencyDateOfPlacement: string | null;
    insuredAgencyInsuredAmount: number | null;
    insuredAgencyPolicyNumber: string | null;
    insuredAgencyPolicyStatus: string | null;
    insuredAgencyDateOfClaim: string | null;
    insuredAgencyClaimId: string | null;
    insuredAgencySettlementAmount: number | null;
    insuredAgencySettlementDate: string | null;
    collectionAgencyId: number | null;
    collectionAgencyName: string | null;
    collectionAgencyStatus: string | null;
    collectionAgencyLastReturnCode: string | null;
    plaintiffId: number | null;
    plaintiffName: string | null;
    plaintiffDateFiled: string | null;
    plaintiffLawsuitAmount: number | null;
    plaintiffReceivedAmount: number | null;
    plaintiffPercentageOfAgency: number | null;
    plaintiffCaseStatus: string | null;
    salesTrucksManager: number | null;
    salesTrucks: number | null;
    salesTrailersManager: number | null;
    salesTrailers: number | null;
    accTeamLeader: number | null;
    accPerson: number | null;
    collectionPerson: number | null;
};

/** Row shape of GET /ms-leasing/company/search (Name column-filter source). */
export type LeasingCompanyOption = {
    id: number;
    name: string;
    isOwnerOperator: boolean;
    ownerFirstName: string | null;
    ownerMiddleName: string | null;
    ownerLastName: string | null;
    isActive: boolean;
};

export type LeasingCompanyOptionsResponse = { data: LeasingCompanyOption[]; total: number };

export type LeasingCompanyListResponse = { data: LeasingCompany[]; total: number };

/** Representative (user) as the /leasing/manage-* pages send it to change-representative. */
export type LeasingRepresentative = { id: string; name: string; email: string };

/** Row of GET /ms-leasing/company/grouped-by-representatives (one card on /leasing/manage-sales). */
export type CompaniesGroupedByRepresentative = {
    representative: LeasingRepresentative;
    companies: Array<{
        id: number;
        name: string | null;
        ownerFirstName: string | null;
        ownerMiddleName: string | null;
        ownerLastName: string | null;
    }>;
};

export class LeasingCompanyService {
    private apiContext: APIRequestContext;
    private createdCompanyIds: number[] = [];

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async createCompany(company: LeasingCompanyPayload): Promise<LeasingCompany> {
        const response = await this.apiContext.post('/ms-leasing/company', {
            data: { clientDto: company, sisterCompanies: [] },
        });
        await this.expectStatus(response, [201], `POST /ms-leasing/company (name: ${company.name})`);
        const created = await response.json() as LeasingCompany;
        expect(created.id).toBeDefined();
        this.createdCompanyIds.push(created.id);
        return created;
    }

    /** Registers a company created outside this service (e.g. through a UI modal) so cleanup() deletes it too. */
    trackCompanyForCleanup(id: number): void {
        if (!this.createdCompanyIds.includes(id)) this.createdCompanyIds.push(id);
    }

    async getCompanyById(id: number): Promise<LeasingCompany | undefined> {
        const response = await this.apiContext.get(`/ms-leasing/company/${id}`);
        if (response.status() === 404) return undefined;
        await this.expectStatus(response, [200], `GET /ms-leasing/company/${id}`);
        return await response.json() as LeasingCompany;
    }

    // Sends the fields wrapped in clientDto (same shape as create); the backend
    // replaces the company with them, so pass every field you want to keep.
    async updateCompany(id: number, fields: LeasingCompanyPayload): Promise<LeasingCompany> {
        const response = await this.apiContext.put(`/ms-leasing/company/${id}`, {
            data: { clientDto: fields, sisterCompanies: [] },
        });
        await this.expectStatus(response, [200], `PUT /ms-leasing/company/${id}`);
        const body = await response.json() as { updatedCompany?: LeasingCompany } & LeasingCompany;
        return body.updatedCompany ?? body;
    }

    async deleteCompany(id: number): Promise<APIResponse> {
        const response = await this.apiContext.delete(`/ms-leasing/company/${id}`);
        await this.expectStatus(response, [200, 204], `DELETE /ms-leasing/company/${id}`);
        this.createdCompanyIds = this.createdCompanyIds.filter((companyId) => companyId !== id);
        return response;
    }

    /**
     * The "Search clients" box on /leasing/clients. Returns full company records
     * whose searchable text matches `query`; an unmatched query returns [].
     */
    async searchCompaniesByName(query: string): Promise<LeasingCompany[]> {
        const response = await this.apiContext.get('/ms-leasing/company/full-text-search', {
            params: { query },
        });
        await this.expectStatus(response, [200], `GET /ms-leasing/company/full-text-search?query=${query}`);
        return await response.json() as LeasingCompany[];
    }

    /** Single full-text-search hit for `query`, or undefined when nothing matches. */
    async findCompanyByName(query: string): Promise<LeasingCompany | undefined> {
        const companies = await this.searchCompaniesByName(query);
        return companies.find((company) => company.name === query);
    }

    /**
     * The Name column-filter autocomplete. Lightweight rows (id / name /
     * isOwnerOperator / isActive) plus a total, and it also matches owner
     * operators when `searchOwnerOperators` is true — which is what the UI sends.
     */
    async searchCompanyOptions(search: string, searchOwnerOperators = true): Promise<LeasingCompanyOptionsResponse> {
        const response = await this.apiContext.get('/ms-leasing/company/search', {
            params: { search, searchOwnerOperators: String(searchOwnerOperators) },
        });
        await this.expectStatus(response, [200], `GET /ms-leasing/company/search?search=${search}`);
        return await response.json() as LeasingCompanyOptionsResponse;
    }

    /** The paginated /leasing/clients table. `filters` is the UI's JSON filter array. */
    async getCompanies(
        { page = 1, itemsPerPage = 15, filters = '[]' }: { page?: number; itemsPerPage?: number; filters?: string } = {},
    ): Promise<LeasingCompanyListResponse> {
        const response = await this.apiContext.get('/ms-leasing/company', {
            params: { page: String(page), itemsPerPage: String(itemsPerPage), filters },
        });
        await this.expectStatus(response, [200], `GET /ms-leasing/company?page=${page}`);
        return await response.json() as LeasingCompanyListResponse;
    }

    // ===== REPRESENTATIVES (/leasing/manage-sales and siblings) =====
    // Endpoints verified 2026-10-06 against /leasing/manage-sales (roleName=SALES):
    //   GET /api/roles/by-name?roleName                     -> 200 { docs: { id, name } }
    //   GET /api/users?search&role_id&isActive=true         -> 200 { docs: [user] } (case-insensitive search)
    //   PUT /ms-leasing/company/change-representative       body { roleName, selectedRepresentative, companyIds }
    //   PUT /ms-leasing/company/remove-representative       body { roleName, companyIds }
    //   GET /ms-leasing/company/without-representative-role?roleName  -> 200 { docs: [company] } (right-hand pool)
    //   GET /ms-leasing/company/grouped-by-representatives?roleName&userIds[] -> 200 { docs: [{ representative, companies }] }

    /** Active user with `roleName` whose name is exactly `name` (the page shows one card per user). */
    async getRepresentativeByName(roleName: string, name: string): Promise<LeasingRepresentative> {
        const roleResponse = await this.apiContext.get('/api/roles/by-name', { params: { roleName } });
        await this.expectStatus(roleResponse, [200], `GET /api/roles/by-name?roleName=${roleName}`);
        const role = (await roleResponse.json() as { docs: { id: number } }).docs;

        const usersResponse = await this.apiContext.get('/api/users', {
            params: { page: '1', perPage: '200', search: name, role_id: String(role.id), isActive: 'true' },
        });
        await this.expectStatus(usersResponse, [200], `GET /api/users?search=${name}&role_id=${role.id}`);
        const users = (await usersResponse.json() as { docs: LeasingRepresentative[] }).docs;
        const matches = users.filter((user) => user.name === name);
        expect(matches, `Expected exactly one active ${roleName} user named "${name}"`).toHaveLength(1);
        const { id, email } = matches[0];
        return { id, name, email };
    }

    async assignRepresentative(roleName: string, representative: LeasingRepresentative, companyIds: number[]): Promise<void> {
        const response = await this.apiContext.put('/ms-leasing/company/change-representative', {
            data: { roleName, selectedRepresentative: representative, companyIds },
        });
        await this.expectStatus(response, [200], `PUT /ms-leasing/company/change-representative (${companyIds.join(',')})`);
    }

    async removeRepresentative(roleName: string, companyIds: number[]): Promise<void> {
        const response = await this.apiContext.put('/ms-leasing/company/remove-representative', {
            data: { roleName, companyIds },
        });
        await this.expectStatus(response, [200], `PUT /ms-leasing/company/remove-representative (${companyIds.join(',')})`);
    }

    async getCompaniesWithoutRepresentative(roleName: string): Promise<LeasingCompany[]> {
        const response = await this.apiContext.get('/ms-leasing/company/without-representative-role', { params: { roleName } });
        await this.expectStatus(response, [200], `GET /ms-leasing/company/without-representative-role?roleName=${roleName}`);
        return (await response.json() as { docs: LeasingCompany[] }).docs;
    }

    async getCompaniesGroupedByRepresentatives(roleName: string, userIds: string[]): Promise<CompaniesGroupedByRepresentative[]> {
        const query = new URLSearchParams({ roleName });
        userIds.forEach((userId) => query.append('userIds[]', userId));
        const response = await this.apiContext.get(`/ms-leasing/company/grouped-by-representatives?${query.toString()}`);
        await this.expectStatus(response, [200], `GET /ms-leasing/company/grouped-by-representatives?roleName=${roleName}`);
        return (await response.json() as { docs: CompaniesGroupedByRepresentative[] }).docs;
    }

    /** Ids of the companies `representativeId` currently holds for `roleName` (empty when none). */
    async getRepresentativeCompanyIds(roleName: string, representativeId: string): Promise<number[]> {
        const groups = await this.getCompaniesGroupedByRepresentatives(roleName, [representativeId]);
        const group = groups.find((g) => g.representative.id === representativeId);
        return group ? group.companies.map((company) => company.id) : [];
    }

    async cleanup(): Promise<void> {
        for (const id of this.createdCompanyIds) {
            try {
                await this.apiContext.delete(`/ms-leasing/company/${id}`);
            } catch (error) {
                console.warn(`Failed to delete company with id: ${id}`, error);
            }
        }
        this.createdCompanyIds = [];
    }

    /**
     * Status assertion that puts the endpoint and the response body into the
     * failure message — a bare "expected 201, got 403" tells nobody reading the
     * CI report what the backend actually complained about.
     */
    private async expectStatus(response: APIResponse, expected: number[], label: string): Promise<void> {
        const body = await response.text().catch(() => '<body could not be read>');
        expect(
            expected,
            `${label} -> expected status ${expected.join(' or ')}, got ${response.status()}. Response body: ${body}`,
        ).toContain(response.status());
    }
}
