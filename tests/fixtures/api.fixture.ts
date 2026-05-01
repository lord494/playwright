import { test as base, request, APIRequestContext, expect } from '@playwright/test';
import { TrailerService } from '../../services/trailerService';
import config from '../../playwright.config';
import { TruckService } from '../../services/truckService';

type ApiFixtures = {
    apiContext: APIRequestContext;
    trailerService: TrailerService;
    truckService: TruckService;
};

export const test = base.extend<ApiFixtures>({
    apiContext: async ({ }, use) => {
        const apiContext = await request.newContext({
            baseURL: config.use?.baseURL as string,
            storageState: 'auth.json',
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
            },
        });
        await use(apiContext);
        await apiContext.dispose();
    },

    trailerService: async ({ apiContext }, use) => {
        const trailerService = new TrailerService(apiContext);
        await use(trailerService);
        await trailerService.cleanup();

    },

    truckService: async ({ apiContext }, use) => {
        const truckService = new TruckService(apiContext);
        await use(truckService);
    },
});

export { expect };