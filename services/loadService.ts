import { APIRequestContext, expect } from '@playwright/test';
import { Constants } from '../helpers/constants';
import { getDashboardDateRange, LoadDay } from '../helpers/dateUtilis';

// Shapes are partial — only the fields the load CRUD flow relies on (verified
// against /api/drivers/dashboard and /api/loads on staging).
export type DashboardDriver = {
    _id: string;
    name: string;
    board: { _id: string; name?: string };
    loads?: Record<string, LoadRecord>;
};

export type LoadRecord = {
    _id: string;
    name: string;
    driver_id: string;
    day_key: string;
    day: string;
    loadType: { _id: string; type: string; color: string; is_active?: boolean };
    comments?: unknown[];
    origin?: string;
    is_dedicated?: boolean;
    is_critical?: boolean;
};

export type LoadType = { _id: string; type: string; color: string; is_active?: boolean };

type DateRange = { startDate: string; endDate: string };

// Service layer for Dashboard "Loads". Mirrors TrailerService: tracks created
// loads and deletes them on cleanup(). All mutating endpoints assert their status
// so callers get a clear failure at the offending call.
export class LoadService {
    private apiContext: APIRequestContext;
    private createdLoads: { id: string; boardId: string }[] = [];

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    // POST /api/drivers/dashboard — the dashboard listing for a board + date window.
    async getDashboard(params: { boardId?: string; byName?: string } & DateRange) {
        const response = await this.apiContext.post('/api/drivers/dashboard', {
            data: {
                board_id: params.boardId ?? Constants.dashboardBoardId,
                search: { byName: params.byName ?? '', byTruck: '', byTrailer: '' },
                searchActivated: Boolean(params.byName),
                loadType: '',
                startDate: params.startDate,
                endDate: params.endDate,
            },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        return { body, response };
    }

    // Finds a single driver row by (partial, case-insensitive) name within a window.
    async findDriver(name: string, range: DateRange): Promise<DashboardDriver> {
        const { body } = await this.getDashboard({ byName: name, ...range });
        const drivers: DashboardDriver[] = (body.dispatchers ?? []).flatMap(
            (d: { drivers?: DashboardDriver[] }) => d.drivers ?? []
        );
        const driver = drivers.find(d => (d.name ?? '').toLowerCase().includes(name.toLowerCase()));
        expect(driver, `Driver "${name}" not found on the dashboard`).toBeTruthy();
        return driver!;
    }

    // GET /api/load-types — resolves a load type by its display name (e.g. 'DEFAULT')
    // so callers never hardcode ObjectIds.
    async getLoadType(type: string): Promise<LoadType> {
        const response = await this.apiContext.get('/api/load-types', {
            params: { page: '1', itemsPerPage: '100' },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        const loadType = (body.docs ?? []).find((t: LoadType) => t.type === type);
        expect(loadType, `Load type "${type}" not found`).toBeTruthy();
        return loadType;
    }

    // Reads a single load off a driver for a given day_key (undefined if none).
    async getLoadByDay(driverName: string, dayKey: string, range: DateRange): Promise<LoadRecord | undefined> {
        const driver = await this.findDriver(driverName, range);
        return driver.loads?.[dayKey];
    }

    // POST /api/loads — `name` is the geocoded city OBJECT on create.
    async createLoad(opts: {
        driver: DashboardDriver;
        loadType: LoadType;
        day: LoadDay;
        city?: { lat: number; lng: number; name: string };
        overrides?: Record<string, unknown>;
    }) {
        const { driver, loadType, day } = opts;
        const city = opts.city ?? Constants.deliveryCityGeo;
        const boardId = driver.board._id;
        const requestBody = {
            name: city,
            origin: '',
            price: '',
            miles: '',
            day_key: day.dayKey,
            day: day.dayField,
            driver_id: driver._id,
            loadType,
            comments: [],
            board_id: boardId,
            absenceType: '',
            dateFrom: day.dayIso,
            dateTo: day.dayIso,
            is_dedicated: false,
            is_critical: false,
            ...opts.overrides,
        };
        const response = await this.apiContext.post('/api/loads', { data: requestBody });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('OK');
        expect(body.load?._id).toBeDefined();
        this.createdLoads.push({ id: body.load._id, boardId });
        return { body, load: body.load as LoadRecord, requestBody, boardId };
    }

    // PUT /api/loads — `name` is a STRING on edit. boardId is passed explicitly
    // because the create/list load record does not echo board_id back.
    async updateLoad(load: LoadRecord, boardId: string, data: Partial<Record<string, unknown>> = {}) {
        const requestBody = {
            _id: load._id,
            name: typeof load.name === 'string' ? load.name : (load.name as any)?.name,
            origin: load.origin ?? '',
            price: null,
            miles: null,
            day_key: load.day_key,
            day: load.day,
            driver_id: load.driver_id,
            loadType: load.loadType,
            comments: load.comments ?? [],
            board_id: boardId,
            is_dedicated: load.is_dedicated ?? false,
            is_critical: load.is_critical ?? false,
            ...data,
        };
        const response = await this.apiContext.put('/api/loads', { data: requestBody });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('OK');
        return { body, load: body.load as LoadRecord, requestBody };
    }

    // DELETE /api/loads/{loadId}/{boardId}
    async deleteLoad(id: string, boardId: string) {
        const response = await this.apiContext.delete(`/api/loads/${id}/${boardId}`);
        expect(response.status()).toBe(200);
        this.createdLoads = this.createdLoads.filter(l => l.id !== id);
        return response;
    }

    async cleanup() {
        for (const { id, boardId } of this.createdLoads) {
            try {
                await this.apiContext.delete(`/api/loads/${id}/${boardId}`);
            } catch (error) {
                console.warn(`Failed to delete load with id: ${id}`, error);
            }
        }
        this.createdLoads = [];
    }
}
