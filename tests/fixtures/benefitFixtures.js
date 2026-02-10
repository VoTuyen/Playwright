import { test as base, expect } from '@playwright/test';
import endpoints from "../data/apiEndpoints";

export async function fetch_user_benefit(request, authToken, headers_with_token) {
    const response = await request.get(endpoints.fetch_user_benefit, {
        headers: headers_with_token
    })
    return response.json()
}


export const test = base.extend({

    async authToken({}, use) {
        const token = ''
        await use(token)
    }, 
    

    async headers_with_token({authToken}, use) {
        const headers = {
            'X-DID': '10:39:4E:A8:85:32',
            'Authorization': authToken
        };

        await use(headers); // Sử dụng fixture
    }
});

export { expect };