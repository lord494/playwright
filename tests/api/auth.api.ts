import { expect } from '@playwright/test';
import { createApiContext } from './api.context';

export async function login() {
    const apiContext = await createApiContext();

    const response = await apiContext.post('/api/users/login', {
        data: {
            email: 'bosko@superegoholding.net',
            password: 'Super123!',
            visitorID: 'apiTest'
        }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('LOGIN RESPONSE:', body);

    return apiContext; // čuva sesiju (cookie / session state)
}
