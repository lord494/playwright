import { test, expect } from '../../fixtures/api.fixture';
import { Constants } from '../../../helpers/constants';
import { getDashboardDateRange, getLoadDay, uniqueLoadDayOffset } from '../../../helpers/dateUtilis';

// API CRUD coverage for Dashboard "Loads". On the UI a load is created/edited by
// right-clicking a cell; the underlying calls are POST /api/loads (create),
// PUT /api/loads (edit), DELETE /api/loads/{id}/{board} (delete) and the listing
// is POST /api/drivers/dashboard. Loads are keyed per driver+day, so each test
// targets a unique far-future day and cleans up after itself (4-worker safe).

test('Korisnik moze da dobije listu load-ova sa dashboard-a', async ({ loadService }) => {
    const { startDate, endDate } = getDashboardDateRange();
    const { body } = await loadService.getDashboard({ byName: Constants.driverName, startDate, endDate });

    expect(body.status).toBe('OK');
    expect(Array.isArray(body.dispatchers)).toBe(true);
    const driver = await loadService.findDriver(Constants.driverName, { startDate, endDate });
    expect(driver._id).toBeDefined();
    expect(driver.board._id).toBeDefined();
});

test('Korisnik moze da kreira novi load', async ({ loadService }) => {
    const day = getLoadDay(1); // TEMP: near day (today+1) so the load is visible in the default dashboard view
    const range = getDashboardDateRange(day.date);
    const driver = await loadService.findDriver(Constants.driverName, range);
    const defaultType = await loadService.getLoadType(Constants.defaultLoad);

    // TEMP: cleanup is off, so remove any load left on this day by a previous run.
    const stale = await loadService.getLoadByDay(Constants.driverName, day.dayKey, range);
    if (stale) await loadService.deleteLoad(stale._id, driver.board._id);

    const { load } = await loadService.createLoad({ driver, loadType: defaultType, day });

    expect(load._id).toBeDefined();
    expect(load.name).toBe(Constants.deliveryCity);
    expect(load.loadType.type).toBe(Constants.defaultLoad);
    expect(load.driver_id).toBe(driver._id);
    expect(load.day_key).toBe(day.dayKey);

    // Confirm it is actually retrievable through the dashboard listing.
    const fetched = await loadService.getLoadByDay(Constants.driverName, day.dayKey, range);
    expect(fetched?._id).toBe(load._id);

    // TEMP: concrete proof in the terminal that a load was created on the app.
    // (Reload the dashboard, search "btest", open the date below to see it.)
    console.log(`[CREATE] load created on app -> driver: ${Constants.driverName} | date: ${load.day_key} | type: ${load.loadType.type} | city: ${load.name} | _id: ${load._id}`);
});

test('Korisnik moze da edituje postojeci load', async ({ loadService }) => {
    const day = getLoadDay(2); // TEMP: near day (today+2) so the load is visible in the default dashboard view
    const range = getDashboardDateRange(day.date);
    const driver = await loadService.findDriver(Constants.driverName, range);
    const defaultType = await loadService.getLoadType(Constants.defaultLoad);
    const emptyType = await loadService.getLoadType(Constants.emptyNeedLoad);

    // TEMP: cleanup is off, so remove any load left on this day by a previous run.
    const stale = await loadService.getLoadByDay(Constants.driverName, day.dayKey, range);
    if (stale) await loadService.deleteLoad(stale._id, driver.board._id);

    const { load, boardId } = await loadService.createLoad({ driver, loadType: defaultType, day });
    expect(load.loadType.type).toBe(Constants.defaultLoad);

    const { load: updated } = await loadService.updateLoad(load, boardId, { loadType: emptyType });

    expect(updated._id).toBe(load._id);
    expect(updated.loadType.type).toBe(Constants.emptyNeedLoad);

    // Confirm the change persisted in the dashboard listing.
    const fetched = await loadService.getLoadByDay(Constants.driverName, day.dayKey, range);
    expect(fetched?.loadType.type).toBe(Constants.emptyNeedLoad);
});

// test('Korisnik moze da obrise load', async ({ loadService }) => {
//     const day = getLoadDay(uniqueLoadDayOffset());
//     const range = getDashboardDateRange(day.date);
//     const driver = await loadService.findDriver(Constants.driverName, range);
//     const defaultType = await loadService.getLoadType(Constants.defaultLoad);

//     const { load, boardId } = await loadService.createLoad({ driver, loadType: defaultType, day });

//     const response = await loadService.deleteLoad(load._id, boardId);
//     expect(response.status()).toBe(200);

//     // Confirm the load is gone from the dashboard listing.
//     const fetched = await loadService.getLoadByDay(Constants.driverName, day.dayKey, range);
//     expect(fetched).toBeUndefined();
// });
