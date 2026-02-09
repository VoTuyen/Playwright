import { test as base, expect, request } from '@playwright/test';
import endpoints from '../data/apiEndpoints.js';

export async function validate_user(request, phone, client_id, type, headers) {
    const response = await request.post(endpoints.validate_user, {
        data: {
            phone,  
            client_id,
            type
        }, 
        headers,
    });
    return await response.json();  //data được trả ra ở dạng json()
}

export async function send_otp(request, phone, client_id, type, verify_token, headers) {
    const response = await request.post(endpoints.send_otp, {
        data: {
            phone,
            client_id,
            type_otp: type,
            verify_token
        }, 
        headers,
    });
    return await response.json();     
}

export async function verify_OTP(request, phone, client_id, type, otp_code, headers) {
    const response = await request.post(endpoints.verify_otp, {
        data: {
            phone,
            client_id,
            type_otp: type,
            otp_code
        }, 
        headers,
    })
    return await response.json()
}

export async function login(request, phone, client_id, verify_token, headers) {
    const response = await request.post(endpoints.login, {
        data: {
            phone,
            client_id,
            push_reg_id: '',
            verify_token: verify_token
        },
        headers
    })
    return await response.json()
    
}



export const test = base.extend({
    async headers({}, use) {
        // Tạo object chứa header
        const header = {
            'X-DID': '10:39:4E:A8:85:32',
            'Content-Type': 'application/json'
        };

        await use(header); // Sử dụng fixture
    }
});

//export const expect = base.expect;
export { expect };