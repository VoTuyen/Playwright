import { test as base, expect, request } from '@playwright/test';
import endpoints from '../data/apiEndpoints.js';

export function createLoginData(phone, client_id, type) {
    return {
        phone,  
        client_id,
        type
    };
}

export function send_otp(phone, client_id, type, verify_token) {
    return {
        phone,
        client_id,
        type,
        verify_token
    };
}

export const test = base.extend({
    async headers({}, use) {
        // Tạo object chứa header
        const header = {
            'X-DID': '10:39:4E:A8:85:32',
            'Content-Type': 'application/json'
        };

        await use(header); // Sử dụng fixture
    },
    async authToken({}, use) {
        let verify_token;
        const response = await request.post(endpoints.validate_user, {
            headers: {
                'X-DID': '10:39:4E:A8:85:32',
                'Content-Type': 'application/json'
            },
            data: createLoginData(phone, client_id, type) // Cung cấp thông tin cần thiết
        });
            
        const responseBody = await response.json();
        verify_token = responseBody.data.verify_token; // Lưu token


    await use(verify_token); // Xuất token để sử dụng
    }
});

//export const expect = base.expect;
export { expect };