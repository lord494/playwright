import { test as base, request, APIRequestContext, expect } from '@playwright/test';
import { TrailerService } from '../../services/trailerService';
import config from '../../playwright.config';
import { TruckService } from '../../services/truckService';
import { LoadService } from '../../services/loadService';
import { LeasingCompanyService } from '../../services/leasingCompanyService';
import { PrebookLoadService } from '../../services/prebookLoadService';

type ApiFixtures = {
    apiContext: APIRequestContext;
    trailerService: TrailerService;
    truckService: TruckService;
    loadService: LoadService;
    leasingCompanyService: LeasingCompanyService;
    prebookLoadService: PrebookLoadService;
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

    loadService: async ({ apiContext }, use) => {
        const loadService = new LoadService(apiContext);
        await use(loadService);
        // TEMP: cleanup disabled so created loads stay visible in the app.
        // Re-enable before merging.
        // await loadService.cleanup();
    },

    leasingCompanyService: async ({ apiContext }, use) => {
        const leasingCompanyService = new LeasingCompanyService(apiContext);
        await use(leasingCompanyService);
        await leasingCompanyService.cleanup();
    },

    prebookLoadService: async ({ }, use) => {
        // Own context WITHOUT a default Content-Type: the prebook endpoints take
        // multipart/form-data, so Playwright must set the boundary itself. A shared
        // 'application/json' default makes the server JSON-parse the multipart body.
        const apiContext = await request.newContext({
            baseURL: config.use?.baseURL as string,
            storageState: 'auth.json',
        });
        const prebookLoadService = new PrebookLoadService(apiContext);
        await use(prebookLoadService);
        await prebookLoadService.cleanup();
        await apiContext.dispose();
    },
});

export { expect };