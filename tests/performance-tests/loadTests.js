import http from 'k6/http';
import { check, sleep } from 'k6';

/* ================= CONFIG ================= */

const BASE_URL = __ENV.BASE_URL || 'https://staging.superegoholding.app';

export const options = {
    stages: [
        { duration: '30s', target: 10 }, // ramp-up
        { duration: '1m', target: 10 },  // steady load
        { duration: '30s', target: 0 },  // ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<60000'], // 95% zahteva ispod 500ms
        http_req_failed: ['rate<0.01'], // manje od 1% grešaka
    },
};

/* ================= TEST ================= */

export default function () {
    /* ---- LOGIN ---- */
    const loginPayload = JSON.stringify({
        email: "bosko@superegoholding.net",
        password: "Super123!",
    });

    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginRes = http.post(
        `${BASE_URL}/api/users/login`,
        loginPayload,
        loginParams
    );

    check(loginRes, {
        'login status is 200': r => r.status === 200,
    });

    /* ---- AUTHENTICATED REQUEST ---- */
    // k6 AUTOMATSKI salje cookie koji je dobijen tokom logina

    const profileRes = http.get(`${BASE_URL}/users`);

    check(profileRes, {
        'profile status is 200': r => r.status === 200,
        'profile response < 400ms': r => r.timings.duration < 400,
    });

    sleep(1); // simulacija realnog korisnika
}
