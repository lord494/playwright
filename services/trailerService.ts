import { APIRequestContext, expect } from '@playwright/test';
import { getRandom10Number } from '../helpers/dateUtilis';

export class TrailerService {
    private apiContext: APIRequestContext;
    private createdTrailerIds: string[] = [];

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async createTrailer(overrides: Partial<any> = {}) {
        const date = new Date().toISOString();
        const trailerBody = {
            number: getRandom10Number().join(''),
            type: 'Dry van',
            prodution_year: 2015,
            pickUpDate: date,
            delaership: {
                name: 'KEMOINPEX',
            },
            make: {
                name: 'MAXMISER',
            },
            vin_number: `VIN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            ...overrides,
        };
        const response = await this.apiContext.post('/api/trailers', {
            data: trailerBody,
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body._id).toBeDefined();
        this.createdTrailerIds.push(body._id);
        return {
            body,
            requestBody: trailerBody,
            response,
        };
    }

    async getTrailerByNumber(number: string) {
        const response = await this.apiContext.get('/api/trailers', {
            params: {
                page: '1',
                itemsPerPage: '15',
                search: number,
            },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        return {
            body,
            response,
        };
    }

    async updateTrailer(id: string, data: Partial<any>) {
        const response = await this.apiContext.put('/api/trailers', {
            data: {
                _id: id,
                ...data,
            },
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        return {
            body,
            response,
        };
    }

    async deleteTrailer(id: string) {
        const response = await this.apiContext.delete(`/api/trailers/${id}`);
        expect([200, 204]).toContain(response.status());
        this.createdTrailerIds = this.createdTrailerIds.filter(
            trailerId => trailerId !== id
        );
        return response;
    }
    async cleanup() {
        for (const id of this.createdTrailerIds) {
            try {
                await this.deleteTrailer(id);
            } catch (error) {
                console.warn(`Failed to delete trailer with id: ${id}`, error);
            }
        }
        this.createdTrailerIds = [];
    }
}