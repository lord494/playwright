import { test, expect } from '../../fixtures/api.fixture';
import { Constants } from '../../../helpers/constants';
import { buildLeasingCompanyPayload, uniqueDigits } from '../../../helpers/dateUtilis';

// Full API CRUD flow for a Leasing "Clients" company, on ONE company:
// create -> search -> update -> delete. The calls mirror what /leasing/clients
// issues from the UI:
//   create  POST   /ms-leasing/company            { clientDto, sisterCompanies } -> 201
//   search  GET    /ms-leasing/company/full-text-search?query=  ("Search clients" box)
//           GET    /ms-leasing/company/search?search=&searchOwnerOperators=true
//                  (Name column-filter autocomplete)
//   update  PUT    /ms-leasing/company/{id}       { clientDto, sisterCompanies } -> 200
//   delete  DELETE /ms-leasing/company/{id}       -> 200/204, soft-delete
//
// Independence: the company name / MC / DOT / FEIN are generated per run and
// carry the worker index, no id is hardcoded and nothing depends on rows that
// already live in the database. If the test dies before the delete step, the
// `leasingCompanyService` fixture calls cleanup() in teardown and removes every
// company the run created.

test('Korisnik moze da kreira, pronadje, izmeni i obrise kompaniju preko API-ja', async ({ leasingCompanyService }) => {
    // ===== CREATE =====
    const createPayload = buildLeasingCompanyPayload();
    const { name } = createPayload;

    const created = await leasingCompanyService.createCompany(createPayload);

    expect(created.id).toBeDefined();
    expect(typeof created.id).toBe('number');
    expect(created.name).toBe(name);
    expect(created.mc).toBe(createPayload.mc);
    expect(created.dot).toBe(createPayload.dot);
    expect(created.fain).toBe(createPayload.fain);
    expect(created.companyAddress).toMatchObject(createPayload.companyAddress);
    expect(created.leasingCooperation).toBe(true);
    expect(created.recruitingCooperation).toBe(true);
    expect(created.maintenanceCooperation).toBe(false);
    expect(created.fuelCooperation).toBe(false);
    expect(created.note).toBe(createPayload.note);
    expect(created.riskLevel).toBe(createPayload.riskLevel);
    // Server-owned values: a new company starts as PENDING, active and non-owner-operator.
    expect(created.status).toBe(Constants.leasingCompanyDefaultStatus);
    expect(created.isActive).toBe(true);
    expect(created.isOwnerOperator).toBe(false);
    // The payload carries no cooperation dates — the backend stamps one per
    // enabled flag and leaves the disabled ones null.
    expect(created.leasingCoopStartDate).not.toBeNull();
    expect(created.recruitingCoopStartDate).not.toBeNull();
    expect(created.maintenanceCoopStartDate).toBeNull();
    expect(created.fuelCoopStartDate).toBeNull();

    console.log(`[CREATE] company created -> name: ${name} | MC: ${createPayload.mc} | id: ${created.id}`);

    // ===== SEARCH =====
    // "Search clients" box: full records for everything matching the query.
    const searchHits = await leasingCompanyService.searchCompaniesByName(name);

    expect(searchHits.length).toBeGreaterThan(0);
    expect(searchHits.map((company) => company.id)).toContain(created.id);
    // Every returned row has to match the query, not just the one we look for —
    // a search that also returns unrelated companies is a defect.
    for (const hit of searchHits) {
        expect(hit.name).toContain(name);
    }

    const foundCompany = searchHits.find((company) => company.id === created.id);
    expect(foundCompany?.name).toBe(name);
    expect(foundCompany?.mc).toBe(createPayload.mc);
    expect(foundCompany?.isActive).toBe(true);

    // Name column-filter autocomplete: same company through the second search endpoint.
    const options = await leasingCompanyService.searchCompanyOptions(name);

    expect(options.total).toBeGreaterThan(0);
    expect(options.data.map((option) => option.id)).toContain(created.id);

    console.log(`[SEARCH] company found -> id: ${created.id} | full-text hits: ${searchHits.length}`);

    // ===== UPDATE =====
    // PUT replaces the record with the submitted clientDto, so send the create
    // payload plus the changed fields. The name stays the same on purpose — the
    // flow keeps searching for the same unique company after the update.
    const updatePayload = buildLeasingCompanyPayload({
        name,
        mc: uniqueDigits(6),
        dot: uniqueDigits(7),
        note: Constants.leasingApiCompanyUpdatedNote,
        companyAddress: {
            address: Constants.leasingApiCompanyUpdatedAddress,
            city: Constants.leasingApiCompanyUpdatedCity,
            state: Constants.leasingApiCompanyUpdatedState,
            zip: Constants.leasingApiCompanyUpdatedZip,
        },
        riskLevel: Constants.newCompanyRiskLevelC,
        maintenanceCooperation: true,
    });

    const updated = await leasingCompanyService.updateCompany(created.id, updatePayload);

    expect(updated.id).toBe(created.id);
    expect(updated.mc).toBe(updatePayload.mc);
    expect(updated.dot).toBe(updatePayload.dot);
    expect(updated.note).toBe(updatePayload.note);
    expect(updated.riskLevel).toBe(updatePayload.riskLevel);

    // Re-read the company: the update has to be persisted, not just echoed back.
    const fetchedAfterUpdate = await leasingCompanyService.getCompanyById(created.id);

    expect(fetchedAfterUpdate).toBeDefined();
    expect(fetchedAfterUpdate?.name).toBe(name);
    expect(fetchedAfterUpdate?.mc).toBe(updatePayload.mc);
    expect(fetchedAfterUpdate?.dot).toBe(updatePayload.dot);
    expect(fetchedAfterUpdate?.fain).toBe(updatePayload.fain);
    expect(fetchedAfterUpdate?.note).toBe(updatePayload.note);
    expect(fetchedAfterUpdate?.companyAddress).toMatchObject(updatePayload.companyAddress);
    expect(fetchedAfterUpdate?.riskLevel).toBe(updatePayload.riskLevel);
    expect(fetchedAfterUpdate?.maintenanceCooperation).toBe(true);
    expect(fetchedAfterUpdate?.isActive).toBe(true);
    // Newly enabled cooperation gets stamped, and the dates stamped at create
    // must survive the update (PUT replaces the record but keeps them).
    expect(fetchedAfterUpdate?.maintenanceCoopStartDate).not.toBeNull();
    expect(fetchedAfterUpdate?.leasingCoopStartDate).toBe(created.leasingCoopStartDate);

    // The same values must come back through the search endpoint the UI uses.
    const hitAfterUpdate = await leasingCompanyService.findCompanyByName(name);

    expect(hitAfterUpdate).toBeDefined();
    expect(hitAfterUpdate?.id).toBe(created.id);
    expect(hitAfterUpdate?.mc).toBe(updatePayload.mc);
    expect(hitAfterUpdate?.note).toBe(updatePayload.note);

    console.log(`[UPDATE] company updated -> id: ${created.id} | new MC: ${updatePayload.mc}`);

    // ===== DELETE =====
    const deleteResponse = await leasingCompanyService.deleteCompany(created.id);

    expect([200, 204]).toContain(deleteResponse.status());

    const deleteBody = await deleteResponse.json() as { message?: string; company?: { id?: number } };
    expect(deleteBody.company?.id).toBe(created.id);

    // Delete is a soft-delete: the record keeps its id and stays readable, with
    // isActive flipped to false.
    const fetchedAfterDelete = await leasingCompanyService.getCompanyById(created.id);
    expect(fetchedAfterDelete).toBeDefined();
    expect(fetchedAfterDelete?.isActive).toBe(false);

    // /leasing/clients lists active clients only, and both search endpoints that
    // feed it drop the company once it is soft-deleted.
    const hitsAfterDelete = await leasingCompanyService.searchCompaniesByName(name);
    expect(hitsAfterDelete.map((company) => company.id)).not.toContain(created.id);

    const optionsAfterDelete = await leasingCompanyService.searchCompanyOptions(name);
    expect(optionsAfterDelete.data.map((option) => option.id)).not.toContain(created.id);

    console.log(`[DELETE] company deleted -> id: ${created.id}`);
});
