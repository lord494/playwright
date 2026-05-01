import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { uniqueTeamName, extractUserName, safeDeleteTeam } from '../../helpers/dateUtilis';
import { test } from '../fixtures/fixtures';

// ===================== CREATE =====================

test('Korisnik moze da kreira novi team preko Create New modala', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(0);
    const lead = extractUserName(availableUsers[10]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.expectOpen();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTruckSection,
            teamName,
            teamLead: lead,
        });

        const card = leasingTeams.getCardByTeamName(teamName);
        await expect(card).toBeVisible();
        await expect(leasingTeams.getCardTitleText(teamName)).toContainText(teamName);
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

test('Korisnik moze da kreira novi team sa članovima već dodatim u Create modalu', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(1);
    const lead = extractUserName(availableUsers[9]);
    const memberName = extractUserName(availableUsers[5]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.expectOpen();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName,
            teamLead: lead,
            people: [memberName],
        });

        const memberChip = leasingTeams.getMemberChipForTeam(teamName, memberName);
        await expect(memberChip).toBeVisible();

        const memberTexts = await leasingTeams.getMemberChipsForTeam(teamName).allTextContents();
        expect(memberTexts.map(t => t.trim()).some(t => t.includes(memberName))).toBeTruthy();
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

// ===================== READ / VIEW =====================

test('Korisnik moze da vidi novokreirani team u Sales Truck sekciji', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(0);
    const lead = extractUserName(availableUsers[8]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTruckSection,
            teamName,
            teamLead: lead,
        });

        const card = leasingTeams.getCardByTeamName(teamName);
        await expect(card).toBeVisible();

        const cardsInSection = leasingTeams.getCardsInSection(Constants.leasingTeamsSalesTruckSection);
        await expect.poll(async () => {
            const titles = await cardsInSection.locator('.tl-name').allTextContents();
            return titles.some(t => t.includes(teamName));
        }, { timeout: 10000, intervals: [200, 400, 800] }).toBeTruthy();

        await expect(leasingTeams.getDeleteTeamButton(teamName)).toBeVisible();
        await expect(leasingTeams.getMoveAllButton(teamName)).toBeVisible();
        await expect(card.locator('.members')).toBeVisible();
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

test('Korisnik moze da pronadje team filtriranjem po team type Sales Trailer', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(0);
    const lead = extractUserName(availableUsers[7]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName,
            teamLead: lead,
        });

        await leasingTeams.selectLeasingTeamType(Constants.leasingTeamsSalesTrailerSection);

        const visible = await leasingTeams.getVisibleSectionNames();
        for (const section of visible) {
            expect(section).toBe(Constants.leasingTeamsSalesTrailerSection);
        }
        await expect(leasingTeams.getCardByTeamName(teamName)).toBeVisible();
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

// ===================== UPDATE =====================

test('Korisnik moze da doda novog clana u team drag and drop-om', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(1);
    const lead = extractUserName(availableUsers[5]);
    const userToDrag = availableUsers[1];

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTruckSection,
            teamName,
            teamLead: lead,
        });

        await leasingTeams.dragUserToTeamCard(userToDrag, teamName);

        await expect(leasingTeams.getMemberChipForTeam(teamName, userToDrag)).toBeVisible();
        const memberTexts = await leasingTeams.getMemberChipsForTeam(teamName).allTextContents();
        expect(memberTexts.map(t => t.trim()).some(t => t.includes(userToDrag))).toBeTruthy();
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

test('Korisnik moze da ukloni clana iz tima preko X dugmeta na chip-u', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(1);
    const lead = extractUserName(availableUsers[3]);
    const memberName = extractUserName(availableUsers[1]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName,
            teamLead: lead,
            people: [memberName],
        });

        await expect(leasingTeams.getMemberChipForTeam(teamName, memberName)).toBeVisible();

        await leasingTeams.removeMemberFromTeam(teamName, memberName);

        await expect(leasingTeams.getMemberChipForTeam(teamName, memberName)).toHaveCount(0);
        expect(await leasingTeams.getMemberChipsForTeam(teamName).count()).toBe(0);
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

test('Korisnik moze da prebaci sve clanove iz jednog tima u drugi preko Move All dugmeta', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const sourceTeam = uniqueTeamName('PWsrc');
    const targetTeam = uniqueTeamName('PWtgt');
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(2);
    const sourceLead = extractUserName(availableUsers[0]);
    const targetLead = extractUserName(availableUsers[1]);
    const memberName = extractUserName(availableUsers[2]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName: targetTeam,
            teamLead: targetLead,
        });

        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName: sourceTeam,
            teamLead: sourceLead,
            people: [memberName],
        });

        await expect(leasingTeams.getMemberChipForTeam(sourceTeam, memberName)).toBeVisible();

        await leasingTeams.moveAllMembersTo(sourceTeam, targetTeam);

        await expect(leasingTeams.getMemberChipForTeam(targetTeam, memberName)).toBeVisible();
        expect(await leasingTeams.getMemberChipsForTeam(sourceTeam).count()).toBe(0);
    } finally {
        await safeDeleteTeam(leasingTeams, sourceTeam);
        await safeDeleteTeam(leasingTeams, targetTeam);
    }
});

// ===================== DELETE =====================

test('Korisnik moze da obrise prazan team preko Delete Team dugmeta', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(0);
    const lead = extractUserName(availableUsers[7]);

    let createdTeam = false;
    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTruckSection,
            teamName,
            teamLead: lead,
        });
        createdTeam = true;

        await expect(leasingTeams.getCardByTeamName(teamName)).toBeVisible();

        await leasingTeams.deleteTeam(teamName);

        await expect(leasingTeams.getCardByTeamName(teamName)).toHaveCount(0);
        createdTeam = false;
    } finally {
        if (createdTeam) {
            await safeDeleteTeam(leasingTeams, teamName);
        }
    }
});

test('Korisnik ne moze da obrise team koji ima clanove (Delete Team dugme je disabled)', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(1);
    const lead = extractUserName(availableUsers[6]);
    const memberName = extractUserName(availableUsers[1]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName,
            teamLead: lead,
            people: [memberName],
        });

        await expect(leasingTeams.getMemberChipForTeam(teamName, memberName)).toBeVisible();
        await expect(leasingTeams.getDeleteTeamButton(teamName)).toBeDisabled();
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

// ===================== MANDATORY FIELDS (Create New Team modal) =====================

test('Korisnik ne moze da kreira team bez nijednog popunjenog polja - prikazuju se sve validacione poruke', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.expectOpen();

        await leasingTeamsCreateModal.clickCreate();

        await leasingTeamsCreateModal.expectValidationMessage(Constants.leasingTeamsValidationTeamTypeRequired);
        await leasingTeamsCreateModal.expectValidationMessage(Constants.leasingTeamsValidationTeamNameRequired);
        await leasingTeamsCreateModal.expectValidationMessage(Constants.leasingTeamsValidationTeamLeadRequired);
        await leasingTeamsCreateModal.expectOpen();
    } finally {
        await leasingTeamsCreateModal.cancel().catch(() => { });
    }
});

test('Korisnik ne moze da kreira team bez Team type-a - prikazuje se Team type required poruka', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(0);
    const lead = extractUserName(availableUsers[4]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.expectOpen();

        await leasingTeamsCreateModal.fillTeamName(teamName);
        await leasingTeamsCreateModal.selectTeamLead(lead);

        await leasingTeamsCreateModal.clickCreate();

        await leasingTeamsCreateModal.expectValidationMessage(Constants.leasingTeamsValidationTeamTypeRequired);
        await leasingTeamsCreateModal.expectOpen();
    } finally {
        await leasingTeamsCreateModal.cancel().catch(() => { });
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

test('Korisnik ne moze da kreira team bez Team name-a - prikazuje se Team name required poruka', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(0);
    const lead = extractUserName(availableUsers[2]);

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.expectOpen();

        await leasingTeamsCreateModal.selectTeamType(Constants.leasingTeamsSalesTruckSection);
        await leasingTeamsCreateModal.selectTeamLead(lead);

        await leasingTeamsCreateModal.clickCreate();

        await leasingTeamsCreateModal.expectValidationMessage(Constants.leasingTeamsValidationTeamNameRequired);
        await leasingTeamsCreateModal.expectOpen();
    } finally {
        await leasingTeamsCreateModal.cancel().catch(() => { });
    }
});

test('Korisnik ne moze da kreira team bez Team lead-a - prikazuje se Team lead required poruka', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.expectOpen();

        await leasingTeamsCreateModal.selectTeamType(Constants.leasingTeamsSalesTrailerSection);
        await leasingTeamsCreateModal.fillTeamName(teamName);

        await leasingTeamsCreateModal.clickCreate();

        await leasingTeamsCreateModal.expectValidationMessage(Constants.leasingTeamsValidationTeamLeadRequired);
        await leasingTeamsCreateModal.expectOpen();
    } finally {
        await leasingTeamsCreateModal.cancel().catch(() => { });
        await safeDeleteTeam(leasingTeams, teamName);
    }
});

test('Korisnik moze da kreira novi team sa 5 clanova dodatih u Create modalu', async ({ leasingTeams, leasingTeamsCreateModal }) => {
    const teamName = uniqueTeamName();
    const availableUsers = await leasingTeams.getAvailableUserTexts();
    expect(availableUsers.length).toBeGreaterThan(15);
    const lead = extractUserName(availableUsers[15]);
    const memberNames = [
        extractUserName(availableUsers[10]),
        extractUserName(availableUsers[11]),
        extractUserName(availableUsers[12]),
        extractUserName(availableUsers[13]),
        extractUserName(availableUsers[14]),
    ];

    try {
        await leasingTeams.clickCreateNew();
        await leasingTeamsCreateModal.expectOpen();
        await leasingTeamsCreateModal.createTeam({
            teamType: Constants.leasingTeamsSalesTrailerSection,
            teamName,
            teamLead: lead,
            people: memberNames,
        });

        await expect(leasingTeams.getCardByTeamName(teamName)).toBeVisible();
        await expect(leasingTeams.getMemberChipsForTeam(teamName)).toHaveCount(memberNames.length);

        const memberTexts = (await leasingTeams.getMemberChipsForTeam(teamName).allTextContents())
            .map(t => t.trim());
        for (const name of memberNames) {
            expect(memberTexts.some(t => t.includes(name))).toBeTruthy();
        }
    } finally {
        await safeDeleteTeam(leasingTeams, teamName);
    }
});
