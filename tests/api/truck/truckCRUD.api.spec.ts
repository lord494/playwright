// import { test, expect } from '../../fixtures/api.fixture';

// test('Truck CRUD flow', async ({ truckService }) => {
//     const createdTruck = await truckService.createTruck();
//     const truckId = createdTruck.body._id;
//     const truckNumber = createdTruck.body.number;
//     expect(truckId).toBeDefined();
//     expect(truckNumber).toBe(createdTruck.requestBody.number);
// });

// test('Pretraga truck-a', async () => {
//     const apiContext = await createApiContext();
//     const getResponse = await apiContext.get('/api/trucks?page=1&perPage=50&sortby[]=number&order=1&search=' + vinNumber + '&filter=all&company=');
//     console.log('status tekst: ', getResponse.statusText());
//     console.log('tekst: ', await getResponse.text());
//     expect(getResponse.status()).toBe(200);
//     const body = await getResponse.json();
//     const docs = body.docs.find((trailer: { vin_number: string }) => trailer.vin_number === vinNumber);
//     expect(docs).toBeDefined();
//     expect(docs.vin_number).toBe(vinNumber);
//     expect(docs._id).toBe(truckId);
// });

// test('Editovanje truck-a', async () => {
//     const apiContext = await createApiContext();
//     const date = new Date().toISOString();
//     const editTruck = {
//         _id: truckId,
//         number: truckNumber,
//         trailer: null,
//         current_driver: {
//             id: "67a103ca573a2b7af5ae26eb",
//             name: "driverTest",
//             phone_number: "06112344",
//             trailer: "2315232491"
//         },
//         start_date: date,
//         make: {
//             is_active: true,
//             _id: "635bf5383c76b66f3442cd3e",
//             name: "FREIGHTLINER",
//             note: "",
//             createdAt: date,
//             updatedAt: date,
//             __v: 0
//         },
//         model: {
//             is_active: true,
//             _id: "637e653789da10c673145715",
//             name: "5700",
//             note: "",
//             truck_make: {
//                 is_active: true,
//                 _id: "636408b0dfb19a37cc222839",
//                 name: "INTERNATIONAL",
//                 note: "",
//                 createdAt: date,
//                 updatedAt: date,
//                 __v: 0
//             },
//             createdAt: "2022-10-28T15:29:15.322Z",
//             updatedAt: "2022-10-28T15:29:15.322Z",
//             __v: 0
//         },
//         year: 2024,
//         color: 'WHITE',
//         transmission: "Manual",
//         gps_type: "",
//         mileage: 0,
//         oil_change_date: null,
//         vin_number: vinNumber,
//         plate_number: "HP996581",
//         on_the_road: false,
//         rent: false,
//         subtype: 'SEMI'
//     };
//     const putResponse = await apiContext.put('/api/trucks', { data: editTruck });
//     console.log('status tekst: ', putResponse.statusText());
//     console.log('tekst: ', await putResponse.text());
//     expect(putResponse.status()).toBe(200);
//     const body = await putResponse.json();
//     console.log('Post response: ', body);
//     expect(body.number).toBe(editTruck.number);
//     expect(body.vin_number).toBe(editTruck.vin_number);
//     expect(body.make.name).toBe(editTruck.make.name);
//     expect(body.model.name).toBe(editTruck.model.name);
//     expect(body.current_driver.name).toBe(editTruck.current_driver.name);
//     expect(body._id).toBe(truckId);
// });

// test('Brisanje truck-a', async () => {
//     const apiContext = await createApiContext();
//     const getResponse = await apiContext.delete('/api/trucks/' + truckId);
//     console.log('status tekst: ', getResponse.statusText());
//     console.log('tekst: ', await getResponse.text());
//     expect(getResponse.status()).toBe(200);
//     const body = await getResponse.json();
//     expect(body).toBeDefined();
//     expect(body.vin_number).toBe(vinNumber);
//     expect(body._id).toBe(truckId);
// });