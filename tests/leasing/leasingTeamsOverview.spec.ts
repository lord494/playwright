import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da vidi leasing teams stranicu sa svim sekcijama', async ({ leasingTeams }) => {
    await leasingTeams.expectOnUrl();
    await expect(leasingTeams.createNewButton).toBeVisible();
    await expect(leasingTeams.selectTeamTypeWrapper).toBeVisible();
    await expect(leasingTeams.searchUsersByRoleWrapper).toBeVisible();
    await expect(leasingTeams.usersWithoutTeamHolder).toBeVisible();

    const sections = await leasingTeams.getVisibleSectionNames();
    expect(sections).toContain(Constants.leasingTeamsSalesTruckSection);
    expect(sections).toContain(Constants.leasingTeamsSalesTrailerSection);
    expect(sections).toContain(Constants.leasingTeamsBillingSection);
});

test('Kartica ima Move all i Delete Team buttone', async ({ leasingTeams }) => {
    const card = leasingTeams.getCardByTeamName(Constants.leasingTeamsExistingTeamName);
    await expect(card).toBeVisible();
    await expect(leasingTeams.getCardTitleText(Constants.leasingTeamsExistingTeamName)).toContainText(Constants.leasingTeamsExistingTeamName);
    await expect(leasingTeams.getMoveAllButton(Constants.leasingTeamsExistingTeamName)).toBeVisible();
    await expect(leasingTeams.getDeleteTeamButton(Constants.leasingTeamsExistingTeamName)).toBeVisible();
});

test('Korisnik moze da izabere Sales Truck team type i prikaze samo Sales Truck sekciju', async ({ leasingTeams }) => {
    await leasingTeams.selectLeasingTeamType(Constants.leasingTeamsSalesTruckSection);
    const visible = await leasingTeams.getVisibleSectionNames();
    expect(visible).toContain(Constants.leasingTeamsSalesTruckSection);
    for (const section of visible) {
        expect(section).toBe(Constants.leasingTeamsSalesTruckSection);
    }
});

test('Korisnik moze da izabere Sales Trailer team type i prikaze samo Sales Trailer sekciju', async ({ leasingTeams }) => {
    await leasingTeams.selectLeasingTeamType(Constants.leasingTeamsSalesTrailerSection);
    const visible = await leasingTeams.getVisibleSectionNames();
    expect(visible).toContain(Constants.leasingTeamsSalesTrailerSection);
    for (const section of visible) {
        expect(section).toBe(Constants.leasingTeamsSalesTrailerSection);
    }
});

test('Korisnik moze da izabere Billing team type i prikaze samo Billing sekciju', async ({ leasingTeams }) => {
    await leasingTeams.selectLeasingTeamType(Constants.leasingTeamsBillingSection);
    const visible = await leasingTeams.getVisibleSectionNames();
    expect(visible).toContain(Constants.leasingTeamsBillingSection);
    for (const section of visible) {
        expect(section).toBe(Constants.leasingTeamsBillingSection);
    }
});

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

test('Korisnik moze da prevuce korisnika iz liste na timsku karticu', async ({ leasingTeams }) => {
    const teamName = Constants.leasingTeamsExistingTeamName;
    await leasingTeams.removeAllMembersFromTeam(teamName);

    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(0);
    const userText = availableUsers[0];

    try {
        await leasingTeams.dragUserToTeamCard(userText, teamName);
        await expect(leasingTeams.getMemberChipForTeam(teamName, userText)).toBeVisible();

        const memberTexts = await leasingTeams.getMemberChipsForTeam(teamName).allTextContents();
        const trimmed = memberTexts.map(m => m.trim());
        expect(trimmed.some(m => m.includes(userText))).toBeTruthy();
    } finally {
        await leasingTeams.removeAllMembersFromTeam(teamName).catch(() => { });
    }
});
