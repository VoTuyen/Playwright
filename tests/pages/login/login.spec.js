const { test as base, expect } = require('@playwright/test');
import endpoints from '../../data/apiEndpoints.js';
import { createLoginData } from '../../fixtures/loginFixture.js';
import testCases from '../../data/loginData.js';
import { test } from '@playwright/test';


testCases.forEach(({ phone, client_id, type, expectedSuccess }, index) => {
    test(`Validate user OTP - Test Case ${index + 1}`, async ({ request, headers }) => {
        const response = await request.post(endpoints.validate_user, {
            headers,
            data: createLoginData(phone, client_id, type)
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        
        expect(responseBody.status).toEqual('1');
        expect(responseBody.msg).toEqual("Success");
        expect(responseBody.data.mask_phone).toBeDefined();
        console.log(responseBody.data.mask_phone)

    });
});