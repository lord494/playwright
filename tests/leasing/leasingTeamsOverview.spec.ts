import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { createTeamOfType, extractUserName, safeDeleteTeam, uniqueTeamName } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

// A section exists only while its team type has at least one team, so every test
// below creates the team(s) it needs and deletes them again — no staging data assumed.

test('Korisnik moze da vidi leasing teams stranicu sa svim sekcijama', async ({ page, leasingTeams, leasingTeamsCreateModal }) => {
    await expect(page).toHaveURL(Constants.leasingTeamsUrlRegex);
    await expect(leasingTeams.createNewButton).toBeVisible();
    await expect(leasingTeams.selectTeamTypeWrapper).toBeVisible();
    await expect(leasingTeams.searchUsersByRoleWrapper).toBeVisible();
    await expect(leasingTeams.usersWithoutTeamHolder).toBeVisible();

    const created: string[] = [];
    try {
        created.push(await createTeamOfType(leasingTeams, leasingTeamsCreateModal, Constants.leasingTeamsSalesTruckSection, 1));
        created.push(await createTeamOfType(leasingTeams, leasingTeamsCreateModal, Constants.leasingTeamsSalesTrailerSection, 2));
        created.push(await createTeamOfType(leasingTeams, leasingTeamsCreateModal, Constants.leasingTeamsBillingSection, 3));

        const sections = await leasingTeams.getVisibleSectionNames();
        expect(sections).toContain(Constants.leasingTeamsSalesTruckSection);
        expect(sections).toContain(Constants.leasingTeamsSalesTrailerSection);
        expect(sections).toContain(Constants.leasingTeamsBillingSection);
    } finally {
        for (const teamName of created) await safeDeleteTeam(leasingTeams, teamName);
    }
});

test('Kartica ima Move all i Delete Team buttone', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = await createTeamOfType(leasingTeams, leasingTeamsCreateModal, Constants.leasingTeamsSalesTrailerSection);
    try {
        await expect(leasingTeams.getCardByTeamName(teamName)).toBeVisible();
        await expect(leasingTeams.getCardTitleText(teamName)).toContainText(teamName);
        await expect(leasingTeams.getMoveAllButton(teamName)).toBeVisible();
        await expect(leasingTeams.getDeleteTeamButton(teamName)).toBeVisible();
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

for (const teamType of [
    Constants.leasingTeamsSalesTruckSection,
    Constants.leasingTeamsSalesTrailerSection,
    Constants.leasingTeamsBillingSection,
]) {
    test(`Korisnik moze da izabere ${teamType} team type i prikaze samo ${teamType} sekciju`, async ({ leasingTeams, leasingTeamsCreateModal }) => {
        const teamName = await createTeamOfType(leasingTeams, leasingTeamsCreateModal, teamType);
        try {
            await leasingTeams.selectLeasingTeamType(teamType);
            const visible = await leasingTeams.getVisibleSectionNames();
            expect(visible).toContain(teamType);
            for (const section of visible) {
                expect(section).toBe(teamType);
            }
        } finally {
            await safeDeleteTeam(leasingTeams, teamName);
        }
    });
}

test('Korisnik moze da pretrazuje korisnike po roli ADMIN', async ({ leasingTeams }) => {
    const initial = await leasingTeams.getAvailableUsersCount();
    await leasingTeams.searchUsersByRole(Constants.leasingTeamsRoleAdmin);
    const filtered = await leasingTeams.getAvailableUsersCount();
    expect(filtered).not.toBe(initial);
});

test('Korisnik moze da pretrazuje korisnike po roli DISPATCHER', async ({ leasingTeams }) => {
    const initial = await leasingTeams.getAvailableUsersCount();
    await leasingTeams.searchUsersByRole(Constants.leasingTeamsRoleDispatcher);
    const filtered = await leasingTeams.getAvailableUsersCount();
    expect(filtered).not.toBe(initial);
});

test('Korisnik moze da prevuce korisnika iz liste na timsku karticu', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    // Own empty team, so the test never touches members of real staging teams.
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(1);
    const lead = extractUserName(availableUsers[availableUsers.length - 1]);
    const userText = availableUsers[0];

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName,
            teamLead: lead,
        });
        await expect(leasingTeams.getCardByTeamName(teamName)).toBeVisible();

        await leasingTeams.dragUserToTeamCard(userText, teamName);
        await expect(leasingTeams.getMemberChipForTeam(teamName, userText)).toBeVisible();

        const memberTexts = await leasingTeams.getMemberChipsForTeam(teamName).allTextContents();
        const trimmed = memberTexts.map(m => m.trim());
        expect(trimmed.some(m => m.includes(userText))).toBeTruthy();
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});
