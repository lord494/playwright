import { test, expect } from '@playwright/test';
import { createApiContext } from '../api.context';

test('Dodavanje load-a', async () => {
    const apiContext = await createApiContext();
    const newLoad = {
        board_id: '67fe6c653cf2fd24d23a0b07',
        dateFrom: '2025-12-02',
        dateTo: '2025-12-02',
        day_key: '02-12-2025',
        driver_id: '5fecbc257e8a6a0ed85abf45',
        is_critical: true,
        is_dedicated: true,
        loadType: {
            color: '#B71C1CFF',
            is_active: true,
            type: 'EMPTY, NEED LOAD',
            id: '5fa6beffd4d2384bac5f13c6'
        },
        miles: '',
        name: {
            lat: 44.2884,
            lng: -83.4849,
            name: 'East Tawas, MI',
        },
        origin: '',
        price: ''
    };
    const postResponse = await apiContext.post('/api/loads', { data: newLoad });
    expect(postResponse.status()).toBe(200);
});

test('Dodavanje load-a 2', async () => {
    const apiContext = await createApiContext();
    const newLoad = {
        name: {
            "lat": 40.1745,
            "lng": -80.2325,
            "name": "East Washington, PA"
        },
        origin: "",
        price: "",
        miles: "",
        day_key: "12-02-2025",
        day: "2025-12-02T00:00:00.000Z",
        driver_id: "6748a622e90d522ad253cca6",
        loadType: {
            is_active: true,
            _id: "5fecbc257e8a6a0ed85abf45",
            type: "DEFAULT",
            color: "#FFEBEB00",
            __v: 0
        },
        comments: [],
        board_id: "67fe6c653cf2fd24d23a0b07",
        absenceType: "",
        dateFrom: "2025-12-02",
        dateTo: "2025-12-02",
        is_dedicated: false,
        is_critical: false
    };
    const postResponse = await apiContext.post('/api/loads', { data: newLoad });
    expect(postResponse.status()).toBe(200);
    const body = await postResponse.json();
    console.log('Post response: ', body);
});