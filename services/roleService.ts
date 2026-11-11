import { APIRequestContext, expect } from '@playwright/test';

// Service layer for User Management roles (/roles). Used for cleanup: the
// "add/remove permission" UI test edits a real role (Read), and if it fails
// half-way the role keeps the extra permission — every following run then fails
// on the first drag because the chip is no longer in "All remaining permissions".
//
// Endpoints (staging.vrlz.app, verified 2026-11-11 from the Edit role modal):
//   GET /api/roles?page&perPage           -> 200 { docs: [{ id, name, permissions: [{ subject, action, ... }] }] }
//   PUT /api/roles  body { id, name, permissions } -> 200 (replaces the role's permission list)

type RolePermission = { subject: string; action: string };
type Role = { id: number; name: string; permissions: RolePermission[] };

export class RoleService {
    private apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async getRoleByName(name: string): Promise<Role> {
        const response = await this.apiContext.get('/api/roles', { params: { page: '1', perPage: '100' } });
        expect(response.status()).toBe(200);
        const body = await response.json();
        const role = body.docs.find((r: Role) => r.name.toUpperCase() === name.toUpperCase());
        expect(role, `Role "${name}" not found`).toBeDefined();
        return role;
    }

    /** Removes subject+action from the role if present (no-op otherwise). */
    async removePermission(roleName: string, subject: string, action: string): Promise<void> {
        const role = await this.getRoleByName(roleName);
        const permissions = role.permissions.filter(p => !(p.subject === subject && p.action === action));
        if (permissions.length === role.permissions.length) {
            return;
        }
        const response = await this.apiContext.put('/api/roles', {
            data: { id: role.id, name: role.name, permissions },
        });
        expect(response.status()).toBe(200);
    }
}
