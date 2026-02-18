import { test, expect } from "@playwright/test";
import { createApiContext } from "../api.context";
import { get17RandomNumbers, get6RandomNumber, getRandom10Number } from "../../../helpers/dateUtilis";

let truckId: string | undefined;
let vinNumber = get17RandomNumbers().join('');
let truckNumber = get6RandomNumber().join('');

test.describe.serial('Truck API flow', () => {

    test('Dodavanje truck-a', async () => {
        const apiContext = await createApiContext();
        const date = new Date().toISOString();
        const newTruck = {
            _id: null,
            number: truckNumber,
            trailer: null,
            current_driver: {
                id: "642f051333c05ab66b4309a5",
                name: "btest / secondDriver (ALZ Express Ohio LLC)",
                phone_number: "0698751163",
                trailer: "5625315826"
            },
            current_trailer: null,
            yard: null,
            owner: null,
            start_date: date,
            start_date_second: null,
            make: {
                is_active: true,
                _id: "635bf5383c76b66f3442cd3e",
                name: "FREIGHTLINER",
                note: "",
                createdAt: "2022-10-28T15:28:56.740Z",
                updatedAt: "2022-10-28T15:28:56.740Z",
                __v: 0
            },
            model: {
                is_active: true,
                _id: "635bf54b878c146f26a251ea",
                name: "COLUMBIA",
                note: "",
                truck_make: {
                    is_active: true,
                    _id: "635bf5383c76b66f3442cd3e",
                    name: "FREIGHTLINER",
                    note: "",
                    createdAt: "2022-10-28T15:28:56.740Z",
                    updatedAt: "2022-10-28T15:28:56.740Z",
                    __v: 0
                },
                createdAt: "2022-10-28T15:29:15.322Z",
                updatedAt: "2022-10-28T15:29:15.322Z",
                __v: 0
            },
            year: 2025,
            engine: '',
            color: 'RED',
            transmission: "Automatic",
            gps_type: "",
            mileage: 0,
            oil_change_date: null,
            vin_number: vinNumber,
            plate_number: "BG8556987",
            aOwner: null,
            aOwnerNote: null,
            aStartDateNote: null,
            phone: "",
            info: "",
            note: "",
            noteNew: "",
            total_damage: false,
            broken: false,
            rent: false,
            on_the_road: false,
            lat: null,
            lng: null,
            is_active: true,
            is_third_party: false,
            released: false,
            division: 'Folyd'
        };
        const postResponse = await apiContext.post('/api/trucks', { data: newTruck });
        console.log('status tekst: ', postResponse.statusText())
        expect(postResponse.status()).toBe(200);
        const body = await postResponse.json();
        console.log('Post response: ', body);
        expect(body.number).toBe(newTruck.number);
        expect(body.vin_number).toBe(newTruck.vin_number);
        expect(body.make.name).toBe(newTruck.make.name);
        expect(body.model.name).toBe(newTruck.model.name);
        expect(body.current_driver.name).toBe(newTruck.current_driver.name);
        expect(body._id).toBeDefined();
        truckId = body._id;
    });

    test('Pretraga truck-a', async () => {
        const apiContext = await createApiContext();
        const getResponse = await apiContext.get('/api/trucks?page=1&perPage=50&sortby[]=number&order=1&search=' + vinNumber + '&filter=all&company=');
        console.log('status tekst: ', getResponse.statusText());
        console.log('tekst: ', await getResponse.text());
        expect(getResponse.status()).toBe(200);
        const body = await getResponse.json();
        const docs = body.docs.find((trailer: { vin_number: string }) => trailer.vin_number === vinNumber);
        expect(docs).toBeDefined();
        expect(docs.vin_number).toBe(vinNumber);
        expect(docs._id).toBe(truckId);
    });

    test('Editovanje truck-a', async () => {
        const apiContext = await createApiContext();
        const date = new Date().toISOString();
        const editTruck = {
            _id: truckId,
            number: truckNumber,
            trailer: null,
            current_driver: {
                id: "67a103ca573a2b7af5ae26eb",
                name: "driverTest",
                phone_number: "06112344",
                trailer: "2315232491"
            },
            start_date: date,
            make: {
                is_active: true,
                _id: "635bf5383c76b66f3442cd3e",
                name: "FREIGHTLINER",
                note: "",
                createdAt: date,
                updatedAt: date,
                __v: 0
            },
            model: {
                is_active: true,
                _id: "637e653789da10c673145715",
                name: "5700",
                note: "",
                truck_make: {
                    is_active: true,
                    _id: "636408b0dfb19a37cc222839",
                    name: "INTERNATIONAL",
                    note: "",
                    createdAt: date,
                    updatedAt: date,
                    __v: 0
                },
                createdAt: "2022-10-28T15:29:15.322Z",
                updatedAt: "2022-10-28T15:29:15.322Z",
                __v: 0
            },
            year: 2024,
            color: 'WHITE',
            transmission: "Manual",
            gps_type: "",
            mileage: 0,
            oil_change_date: null,
            vin_number: vinNumber,
            plate_number: "HP996581",
            on_the_road: false,
            rent: false,
            subtype: 'SEMI'
        };
        const putResponse = await apiContext.put('/api/trucks', { data: editTruck });
        console.log('status tekst: ', putResponse.statusText());
        console.log('tekst: ', await putResponse.text());
        expect(putResponse.status()).toBe(200);
        const body = await putResponse.json();
        console.log('Post response: ', body);
        expect(body.number).toBe(editTruck.number);
        expect(body.vin_number).toBe(editTruck.vin_number);
        expect(body.make.name).toBe(editTruck.make.name);
        expect(body.model.name).toBe(editTruck.model.name);
        expect(body.current_driver.name).toBe(editTruck.current_driver.name);
        expect(body._id).toBe(truckId);
    });

    test('Brisanje truck-a', async () => {
        const apiContext = await createApiContext();
        const getResponse = await apiContext.delete('/api/trucks/' + truckId);
        console.log('status tekst: ', getResponse.statusText());
        console.log('tekst: ', await getResponse.text());
        expect(getResponse.status()).toBe(200);
        const body = await getResponse.json();
        expect(body).toBeDefined();
        expect(body.vin_number).toBe(vinNumber);
        expect(body._id).toBe(truckId);
    });
});