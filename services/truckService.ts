import { APIRequestContext, expect } from "@playwright/test";
import { get17RandomNumbers, get6RandomNumber, getRandom10Number } from "../helpers/dateUtilis";
import { get } from "http";

export class TruckService {
    private apiContext: APIRequestContext;
    private truckId: string[] = [];

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    async createTruck(overrides: Partial<any> = {}) {
        const date = new Date().toISOString();
        const truckBody = {
            "_id": null,
            "number": get6RandomNumber().join(''),
            "trailer": null,
            "current_driver": {
                "id": "642f051333c05ab66b4309a5",
                "name": "btest / secondDriver (ALZ Express Ohio LLC)",
                "phone_number": "0698751163",
                "trailer": "5625315826"
            },
            "current_trailer": null,
            "division": "",
            "yard": null,
            "owner": null,
            "start_date": date,
            "start_date_second": null,
            "make": {
                "is_active": true,
                "_id": "635bf5383c76b66f3442cd3e",
                "name": "FREIGHTLINER",
                "note": "",
                "createdAt": "2022-10-28T15:28:56.740Z",
                "updatedAt": "2022-10-28T15:28:56.740Z",
                "__v": 0
            },
            "model": {
                "is_active": true,
                "_id": "635bf54b878c146f26a251ea",
                "name": "COLUMBIA",
                "note": "",
                "truck_make": {
                    "is_active": true,
                    "_id": "635bf5383c76b66f3442cd3e",
                    "name": "FREIGHTLINER",
                    "note": "",
                    "createdAt": "2022-10-28T15:28:56.740Z",
                    "updatedAt": "2022-10-28T15:28:56.740Z",
                    "__v": 0
                },
                "createdAt": "2022-10-28T15:29:15.322Z",
                "updatedAt": "2022-10-28T15:29:15.322Z",
                "__v": 0
            },
            "year": 2025,
            "engine": "",
            "color": "",
            "transmission": "Automatic",
            "gps_type": "",
            "mileage": 0,
            "oil_change_date": null,
            "vin_number": get17RandomNumbers().join(''),
            "plate_number": "BG8556987",
            "aOwner": null,
            "aOwnerNote": null,
            "aStartDateNote": null,
            "phone": "",
            "info": "",
            "note": "",
            "noteNew": "",
            "total_damage": false,
            "broken": false,
            "rent": false,
            "on_the_road": false,
            "lat": null,
            "lng": null,
            "is_active": true,
            "is_third_party": false,
            "released": false,
            ...overrides,
        }
        const response = await this.apiContext.post('/api/trucks', {
            data: truckBody,
        });
        const body = await response.json();
        console.log('CREATE TRUCK STATUS:', response.status());
        console.log('CREATE TRUCK BODY:', JSON.stringify(body, null, 2));
        console.log('CREATE TRUCK REQUEST:', JSON.stringify(truckBody, null, 2));

        expect(response.status()).toBe(200);
        expect(body.userInactive).not.toBe(true);
        this.truckId.push(body._id);
        return {
            body,
            requestBody: truckBody,
            response,
        };
    }
}