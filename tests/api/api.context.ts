import { request, APIRequestContext } from '@playwright/test';
import config from '../../playwright.config';

export async function createApiContext(): Promise<APIRequestContext> {
    return await request.newContext({
        baseURL: (config.use!.baseURL as string), // koristimo "!" da kažemo TS da nije undefined
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    });
}

export async function createApiContext2(): Promise<APIRequestContext> {
    return await request.newContext({
        baseURL: (config.use!.baseURL as string), // koristimo "!" da kažemo TS da nije undefined
    });
}
