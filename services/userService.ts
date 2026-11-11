import { APIRequestContext, expect } from '@playwright/test';
import { Constants } from '../helpers/constants';
import { uniqueUserEmail } from '../helpers/dateUtilis';

// Service layer for User Management users (/users, /users?role=FND_USER).
// Every edit/delete UI test creates its OWN user here instead of acting on the
// first table row — the table is sorted by role+name, so "first row" is shared
// between workers (and with 4 workers one test was deleting/editing the user
// another test was using, including Constants.playWrightUserEmail).
//
// Endpoints (staging.vrlz.app, verified 2026-11-10 from the Add User modal):
//   POST   /api/users                          -> 201, returns the created user (with id)
//   DELETE /api/users/delete-permanent/{id}    -> 200 (hard delete, red icon)

export type CreatedUser = {
    id: string;
    email: string;
    name: string;
    roleName: string;
};

export class UserService {
    private apiContext: APIRequestContext;
    private createdUserIds: string[] = [];

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async createFndUser(overrides: Partial<Record<string, unknown>> = {}): Promise<CreatedUser> {
        return this.createUser({ id: Constants.fndUserRoleId, name: 'FND_USER' }, overrides);
    }

    /** DISPATCHER users show up in the /manage-app-users dispatcher panel (GET /api/users/get-users-by-role?roleName=DISPATCHER). */
    async createDispatcherUser(overrides: Partial<Record<string, unknown>> = {}): Promise<CreatedUser> {
        return this.createUser({ id: Constants.dispatcherRoleId, name: 'DISPATCHER' }, overrides);
    }

    private async createUser(role: { id: number; name: string }, overrides: Partial<Record<string, unknown>>): Promise<CreatedUser> {
        const body = {
            id: null,
            email: uniqueUserEmail(),
            phone_number: '',
            name: Constants.playWrightUser,
            password: Constants.password,
            is_active: true,
            is_team_lead: false,
            roles: { ...role, permissions: [] },
            board_id: null,
            fm_city: 'BG',
            ext: '',
            ext_second: '',
            ext_third: '',
            ext_fourth: '',
            order: 0,
            user_permissions: [],
            ...overrides,
        };
        const response = await this.apiContext.post('/api/users', { data: body });
        expect(response.status()).toBe(201);
        const created = await response.json();
        expect(created.id).toBeDefined();
        this.createdUserIds.push(created.id);
        return { id: created.id, email: created.email, name: created.name, roleName: created.role?.name ?? role.name };
    }

    async deleteUserPermanently(id: string): Promise<number> {
        const response = await this.apiContext.delete(`/api/users/delete-permanent/${id}`);
        return response.status();
    }

    /** Hard-deletes every user this instance created. Users already deleted by the test are ignored. */
    async cleanup(): Promise<void> {
        for (const id of this.createdUserIds) {
            await this.deleteUserPermanently(id);
        }
        this.createdUserIds = [];
    }
}
