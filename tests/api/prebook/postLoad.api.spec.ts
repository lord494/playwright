// import { test, expect } from "@playwright/test";
// import { createApiContext, createApiContext2 } from "../api.context";
// import { get17RandomNumbers, get6RandomNumber, getRandom10Number } from "../../../helpers/dateUtilis";

// let loadId = get6RandomNumber().join('');

// test.describe.serial('Post load API flow', () => {

//     test('Dodavanje load-a', async () => {
//         const apiContext = await createApiContext();
//         const date = new Date().toISOString();
//         const newLoad = {
//             //_id: null,
//             load_id: loadId,
//             pickup_date: '2026-01-23T18:00:00.000Z',
//             pickup_time: '12:00',
//             delivery_date: '2026-01-24T18:00:00.000Z',
//             dedicated: false,
//             delivery_time: '23:00',
//             origin: {
//                 lat: 40.1745,
//                 lng: -80.2325,
//                 name: 'East Washington, PA',
//             },
//             destination: {
//                 lat: 40.6943,
//                 lng: -73.9249,
//                 name: 'New York, NY',
//             },
//             company: '11 Test kompanija',
//             contact: {
//                 name: 'test boker',
//                 phone: '0659887788',
//                 email: 'test@gm.com'
//             },
//             trailer_type: 'V',
//             weight: 15000,
//             rate: 1800,
//             suggested_rate: 1800
//         };
//         // const response = await apiContext.post('/api/prebook-loads', {
//         //     data: newLoad
//         // });
//         // console.log('status tekst: ', response.statusText());
//         // expect(response.status()).toBe(200);
//         // const responseBody = await response.json();
//         // console.log(responseBody);
//         // expect(responseBody).toHaveProperty('_id');

//         const response = await apiContext.post('/api/prebook-loads', {
//             multipart: {
//                 _id: '',
//                 load_id: '900911',
//                 pickup_date: '2026-01-23',
//                 pickup_time: '12:00',
//                 delivery_date: '2026-01-24',
//                 dedicated: 'false',
//                 delivery_time: '12:00',

//                 'origin[lat]': '39.5558',
//                 'origin[lng]': '-104.8958',
//                 'origin[name]': 'Acres Green, CO',

//                 'destination[lat]': '41.3642',
//                 'destination[lng]': '-93.4723',
//                 'destination[name]': 'Ackworth, IA',

//                 company: '11 Test kompanija',
//                 'contact[name]': 'testbr',
//                 'contact[email]': 'tes@d2.hg',

//                 trailer_type: 'V',
//                 weight: '15000',
//                 rate: '1800',
//                 suggested_rate: '1800',

//                 additional_origins: '[]',
//                 additional_destinations: '[]'
//             }
//         });
//     });

//     test('Dodavanje load-a 2', async () => {
//         const apiContext = await createApiContext2();

//         const response = await apiContext.post('/api/prebook-loads', {
//             multipart: {
//                 _id: '',
//                 load_id: 900911,

//                 pickup_date: '2026-01-23',
//                 pickup_time: '12:00',
//                 pickup_time_to: '',

//                 delivery_date: '2026-01-24',
//                 delivery_time: '12:00',
//                 delivery_time_to: '',

//                 dedicated: false,

//                 'origin[lat]': 39.5558,
//                 'origin[lng]': -104.8958,
//                 'origin[name]': 'Acres Green, CO',

//                 'destination[lat]': 41.3642,
//                 'destination[lng]': -93.4723,
//                 'destination[name]': 'Ackworth, IA',

//                 company: '11 Test kompanija',

//                 'contact[name]': 'testbr',
//                 'contact[phone]': '',
//                 'contact[email]': 'tes@d2.hg',

//                 trailer_type: 'V',
//                 weight: 15000,
//                 rate: 1800,
//                 suggested_rate: 1800,

//                 file: '',
//                 'note[text]': '',
//                 booked_contact: '',
//                 booked_company: '',

//                 additional_origins: '[]',
//                 additional_destinations: '[]'
//             }
//         });

//         console.log('Status:', response.status());
//         console.log('Status text:', response.statusText());

//         const raw = await response.text();
//         console.log('RAW RESPONSE:', raw);

//         expect(response.status()).toBe(200);

//         const responseBody = JSON.parse(raw);
//         expect(responseBody).toHaveProperty('_id');
//     });

// });