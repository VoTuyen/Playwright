import { test as base, expect } from '@playwright/test';
import endpoints from '../data/apiEndpoints.js';


export async function validate_user(request, phone, client_id, type, headers, platform) {
    const response = await request.post(endpoints[platform].validate_user, {
        data: {
            phone,  
            client_id,
            type
        }, 
        headers,
    });
    return await response.json();  //data được trả ra ở dạng json()
}

export async function send_otp(request, phone, client_id, type, verify_token, headers, platform) {
    const response = await request.post(endpoints[platform].send_otp, {
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

export async function verify_OTP(request, phone, client_id, type, otp_code, headers, platform) {
    const response = await request.post(endpoints[platform].verify_otp, {
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

export async function login(request, phone, client_id, verify_token, headers, platform) {
    const response = await request.post(endpoints[platform].login, {
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

export async function device_limit_list(request, verify_token_device_limit_list, headers, platform) {
    const response = await request.post(endpoints[platform].device_limit_list, {
        data: {
            verify_token: verify_token_device_limit_list
        },
        headers,
    })
    return await response.json()
}

export async function device_remove(request, device_id, verify_token_device_remove, headers, platform) {
    const response = await request.post(endpoints[platform].device_remove, {
        data: {
            list_ids: [device_id],
            verify_token: verify_token_device_remove
        },
        headers
    })
    return await response.json()
   
}

// export async function get_benefitUser(request, authToken, platform) {

//     const response = await request.get(endpoints[platform].fetch_user_benefit, {
//         headers: {
//             //'X-DID': '10:39:4E:A8:85:32',
//             'Authorization': authToken
//         }
//     })
//     return await response.json()
// }



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

export const bearerToken = {
    authToken: null,
}

//export const expect = base.expect;
export { expect };