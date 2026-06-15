import { test, expect } from '../../fixtures/api.fixture';
import { Constants } from '../../../helpers/constants';
import { generateRandomString, getLoadDay } from '../../../helpers/dateUtilis';
import { PrebookLoadInput } from '../../../services/prebookLoadService';

const buildLoad = (overrides: Partial<PrebookLoadInput> = {}): PrebookLoadInput => ({
    load_id: generateRandomString(6),
    pickup_date: getLoadDay(14).dayIso,
    delivery_date: getLoadDay(16).dayIso,
    ...overrides,
});

test('Korisnik moze da kreira novi prebook load preko API-ja', async ({ prebookLoadService }) => {
    const input = buildLoad();
    const created = await prebookLoadService.createLoad(input);
    expect(created._id).toBeDefined();
    expect(created.load_id).toBe(input.load_id);
    expect(created.company).toBe(Constants.prebookApiCompany);
    expect(created.trailer_type).toBe(Constants.firstTrailerType);
    expect(String(created.rate)).toBe(Constants.amount);
    expect(String(created.weight)).toBe(Constants.weight);
    const fetched = await prebookLoadService.getByLoadId(input.load_id, input.pickup_date);
    expect(fetched?._id).toBe(created._id);
});

test('Korisnik moze da kreira prebook load sa dodatnim podacima preko API-ja', async ({ prebookLoadService }) => {
    const input = buildLoad({ dedicated: true, note: Constants.noteFirst });
    const created = await prebookLoadService.createLoad(input);
    expect(created._id).toBeDefined();
    expect(created.dedicated).toBe(true);
    const fetched = await prebookLoadService.getByLoadId(input.load_id, input.pickup_date);
    expect(fetched?._id).toBe(created._id);
    expect(fetched?.dedicated).toBe(true);
});

test('Korisnik moze da edituje postojeci prebook load preko API-ja', async ({ prebookLoadService }) => {
    const input = buildLoad();
    const created = await prebookLoadService.createLoad(input);
    const updatedInput: PrebookLoadInput = {
        ...input,
        rate: Constants.suggestedRate,
        weight: '4300',
        contact: { name: Constants.appTestUser, phone: Constants.secondPhone, email: Constants.fndPlaywrightEmail },
    };
    await prebookLoadService.updateLoad(created._id, updatedInput);
    const fetched = await prebookLoadService.getByLoadId(input.load_id, input.pickup_date);
    expect(fetched?._id).toBe(created._id);
    expect(String(fetched?.rate)).toBe(Constants.suggestedRate);
    expect(String(fetched?.weight)).toBe('4300');
});

test('Korisnik moze da otkaze prebook load preko API-ja', async ({ prebookLoadService }) => {
    const input = buildLoad();
    const created = await prebookLoadService.createLoad(input);
    expect(created._id).toBeDefined();

    const response = await prebookLoadService.cancelLoad(created._id);
    expect(response.status()).toBe(200);

    // After cancel the load leaves the notbooked list.
    const fetched = await prebookLoadService.getByLoadId(input.load_id, input.pickup_date);
    expect(fetched).toBeUndefined();
});
