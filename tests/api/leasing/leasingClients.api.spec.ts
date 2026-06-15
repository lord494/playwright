import { test, expect } from '../../fixtures/api.fixture';
import { Constants } from '../../../helpers/constants';
import { generateRandomString } from '../../../helpers/dateUtilis';

const uniqueCompanyName = () => `${Constants.leasingApiCompanyNamePrefix}${generateRandomString(8)}`;

test('Korisnik moze da kreira novu kompaniju preko API-ja', async ({ leasingCompanyService }) => {
    const name = uniqueCompanyName();
    const mc = generateRandomString(6);

    const company = await leasingCompanyService.createCompany({ name, mc, companyAddress: { address: 'adresa kompanije 12344122' } });
    expect(company.id).toBeDefined();
    expect(company.name).toBe(name);
    expect(company.status).toBe(Constants.leasingCompanyDefaultStatus);
    expect(company.isActive).toBe(true);
    expect(company.isOwnerOperator).toBe(false);
    const fetched = await leasingCompanyService.getCompanyById(company.id);
    expect(fetched?.id).toBe(company.id);
    expect(fetched?.name).toBe(name);
});

test('Korisnik moze da kreira kompaniju sa dodatnim podacima preko API-ja', async ({ leasingCompanyService }) => {
    const name = uniqueCompanyName();
    const mc = generateRandomString(6);
    const dot = generateRandomString(6);
    const fain = generateRandomString(9);
    const companyAddress = { address: '123 Test St', city: 'Chicago', state: 'IL', zip: '60601' };
    const company = await leasingCompanyService.createCompany({
        name,
        mc,
        dot,
        fain,
        companyAddress,
        maintenanceCooperation: true,
        fuelCooperation: true,
    });
    expect(company.id).toBeDefined();
    expect(company.name).toBe(name);
    expect(company.mc).toBe(mc);
    expect(company.dot).toBe(dot);
    const fetched = await leasingCompanyService.getCompanyById(company.id);
    expect(fetched?.mc).toBe(mc);
    expect(fetched?.dot).toBe(dot);
    expect(fetched?.fain).toBe(fain);
    expect(fetched?.companyAddress).toMatchObject(companyAddress);
    expect(fetched?.maintenanceCooperation).toBe(true);
    expect(fetched?.fuelCooperation).toBe(true);
});

test('Korisnik moze da edituje postojecu kompaniju preko API-ja', async ({ leasingCompanyService }) => {
    const name = uniqueCompanyName();
    const company = await leasingCompanyService.createCompany({ name });

    const newMc = generateRandomString(6);
    const newNote = 'Izmenjena napomena';
    const updated = await leasingCompanyService.updateCompany(company.id, {
        name,
        mc: newMc,
        note: newNote,
    });
    expect(updated.id).toBe(company.id);
    expect(updated.mc).toBe(newMc);
    const fetched = await leasingCompanyService.getCompanyById(company.id);
    expect(fetched?.name).toBe(name);
    expect(fetched?.mc).toBe(newMc);
    expect(fetched?.note).toBe(newNote);
});

test('Korisnik moze da obrise kreiranu kompaniju preko API-ja', async ({ leasingCompanyService }) => {
    const name = uniqueCompanyName();
    const company = await leasingCompanyService.createCompany({ name });
    expect(company.isActive).toBe(true);
    const response = await leasingCompanyService.deleteCompany(company.id);
    expect([200, 204]).toContain(response.status());
    const fetched = await leasingCompanyService.getCompanyById(company.id);
    expect(fetched?.isActive).toBe(false);
});
