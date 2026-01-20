import { test as base } from '@playwright/test';

export function createLoginData(phone, client_id, type) {
    return {
        phone,  
        client_id,
        type
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
    }
});