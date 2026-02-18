import { test, expect } from "@playwright/test";
import { createApiContext } from "../api.context";
import { get17RandomNumbers, get6RandomNumber, getRandom10Number } from "../../../helpers/dateUtilis";
import { Constants } from "../../../helpers/constants";

let trailerId: string | undefined;
let vinNumber = get17RandomNumbers().join('');

test.describe.serial('Trailer API flow', () => {

    test('Dodavanje trailer-a', async () => {
        const apiContext = await createApiContext();
        const date = new Date().toISOString();
        const newTrailer = {
            number: getRandom10Number().join(''),
            type: 'Dry van',
            prodution_year: 2015,
            pickUpDate: date,
            delaership: {
                name: 'KEMOINPEX',
            },
            make: {
                name: 'MAXMISER',
            },
            vin_number: vinNumber
        };
        const postResponse = await apiContext.post('/api/trailers', { data: newTrailer });
        expect(postResponse.status()).toBe(200);
        const body = await postResponse.json();
        console.log('Post response: ', body);
        expect(body.number).toBe(newTrailer.number);
        expect(body.type).toBe(newTrailer.type);
        expect(body.make.name).toBe(newTrailer.make.name);
        expect(body.vin_number).toBe(newTrailer.vin_number);
        expect(body._id).toBeDefined();
        trailerId = body._id;
    });

    test('Pretraga trailer-a', async () => {
        const apiContext = await createApiContext();
        console.log('vin number: ' + vinNumber);
        const getResponse = await apiContext.get('/api/trailers?page=1&perPage=7&sortby[]=number&order=1&search=' + vinNumber);
        expect(getResponse.status()).toBe(200);
        const body = await getResponse.json();
        const docs = body.docs.find((trailer: { vin_number: string }) => trailer.vin_number === vinNumber);
        expect(docs).toBeDefined();
        expect(docs.vin_number).toBe(vinNumber);
        expect(docs._id).toBe(trailerId);
    });

    test('Editovanje trailer-a', async () => {
        const apiContext = await createApiContext();
        const editTrailer = {
            _id: trailerId,
            type: 'Dry van S',
            prodution_year: 2018,
            in_company: true,
            drivers_id: '67a103ca573a2b7af5ae26eb',
            driver_name: Constants.driverTest,
            drivers_phone: '12344',
            company: 'Floyd',
            truck: {
                name: 'driverTest',
                truck_id: '0222',
            },
            delaership: {
                name: 'VOLVO AUTO',
            },
            make: {
                name: 'Hyundai',
            },
        };
        const postResponse = await apiContext.put('/api/trailers', { data: editTrailer });
        expect(postResponse.status()).toBe(200);
        const body = await postResponse.json();
        console.log('Post response: ', body);
        expect(body._id).toBe(trailerId);
        expect(body.type).toBe(editTrailer.type);
        expect(body.make.name).toBe(editTrailer.make.name);
        expect(body.driver_name).toBe(Constants.driverTest);
        expect(body.drivers_phone).toBe(editTrailer.drivers_phone);
        expect(body.drivers_id).toBe(editTrailer.drivers_id);
        expect(body.in_company).toBe(editTrailer.in_company);
        expect(body.company).toBe(editTrailer.company);
        expect(body.truck.name).toBe(editTrailer.truck.name);
        expect(body.truck.truck_id).toBe(editTrailer.truck.truck_id);
    });

    test('Brisanje trailer-a', async () => {
        const apiContext = await createApiContext();
        const postResponse = await apiContext.delete('/api/trailers/' + trailerId);
        expect(postResponse.status()).toBe(200);
        const body = await postResponse.json();
        console.log('Post response: ', body);
        expect(body._id).toBe(trailerId);
    });
});