import { test, expect } from '../../fixtures/api.fixture';

test('Trailer CRUD flow', async ({ trailerService }) => {
    const created = await trailerService.createTrailer();
    const trailerId = created.body._id;
    const trailerNumber = created.body.number;
    expect(trailerId).toBeDefined();
    expect(trailerNumber).toBe(created.requestBody.number);
    const found = await trailerService.getTrailerByNumber(trailerNumber);
    expect(JSON.stringify(found.body)).toContain(trailerNumber);
    const updated = await trailerService.updateTrailer(trailerId, {
        type: 'Reefer',
    });
    expect(updated.body.type).toBe('Reefer');
    await trailerService.deleteTrailer(trailerId);
});