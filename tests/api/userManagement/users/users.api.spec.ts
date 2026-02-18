import { test, expect } from '@playwright/test';
import { createApiContext } from '../../api.context';

test('Provjera usera sa dispatcher rolom', async () => {
    const apiContext = await createApiContext();
    const response = await apiContext.get(
        '/api/users?page=1&perPage=15&sortBy[]=roles&sortBy[]=name&order[]=ASC&order[]=ASC&search=&role_id=7'
    );
    const status = response.status();
    const body = await response.json();
    console.log('✅ STATUS:', status);
    console.log('✅ USERS:', body);
    expect([200, 304]).toContain(status);
    expect(body).toHaveProperty('docs');
    expect(Array.isArray(body.docs)).toBe(true);
    expect(body.docs.length).toBeGreaterThan(0);
    for (const user of body.docs) {
        expect(user).toHaveProperty('role');
        expect(user.role).toHaveProperty('name');
        expect(user.role.name).toBe('DISPATCHER');
    }
});

test('Provjera usera sa regruter rolom', async () => {
    const apiContext = await createApiContext();
    const response = await apiContext.get(
        '/api/users?page=1&perPage=15&sortBy[]=roles&sortBy[]=name&order[]=ASC&order[]=ASC&search=&role_id=17'
    );
    const status = response.status();
    const body = await response.json();
    console.log('✅ STATUS:', status);
    console.log('✅ USERS:', body);
    expect([200, 304]).toContain(status);
    expect(body).toHaveProperty('docs');
    expect(Array.isArray(body.docs)).toBe(true);
    expect(body.docs.length).toBeGreaterThan(0);
    for (const user of body.docs) {
        expect(user).toHaveProperty('role');
        expect(user.role).toHaveProperty('name');
        expect(user.role.name).toBe('RECRUITING');
    }
});

test('Provjera usera sa superadmin rolom', async () => {
    const apiContext = await createApiContext();
    const response = await apiContext.get(
        '/api/users?page=1&perPage=15&sortBy[]=roles&sortBy[]=name&order[]=ASC&order[]=ASC&search=&role_id=1'
    );
    const status = response.status();
    const body = await response.json();
    console.log('✅ STATUS:', status);
    console.log('✅ USERS:', body);
    expect([200, 304]).toContain(status);
    expect(body).toHaveProperty('docs');
    expect(Array.isArray(body.docs)).toBe(true);
    expect(body.docs.length).toBeGreaterThan(0);
    for (const user of body.docs) {
        expect(user).toHaveProperty('role');
        expect(user.role).toHaveProperty('name');
        expect(user.role.name).toBe('SUPERADMIN');
    }
});

