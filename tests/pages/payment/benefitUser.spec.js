<<<<<<< HEAD
const { test, expect } = require('@playwright/test');
import benefit_data from '../../data/benefitsData.js';
import { headers_benefit } from '../../fixtures/benefitFixtures.js';
import endpoints from '../../data/apiEndpoints.js';

test.describe('Fetch user benefits with different tokens', () => {
    benefit_data.forEach(({token, expect_benefit_info, expect_phonenumber}, index) => {
        test(`Benefit with user ${index + 1}:`, async ({ request }) => {
            const response = await request.get(endpoints.fetch_user_benefit, {
                headers: headers_benefit(token) 
            });
            const responseData = await response.json();
            console.log(`Response data of benefits user:`, responseData);
            expect(response.status()).toBe(200);
            expect(responseData.msg_data.phone).toEqual(expect_phonenumber);
            expect(responseData.msg_data.benefit_info).toEqual(expect_benefit_info);
        });
    });
});
=======
const { test, expect } = require('@playwright/test');
import benefit_data from '../../data/benefitsData.js';
import { headers_benefit } from '../../fixtures/benefitFixtures.js';
import endpoints from '../../data/apiEndpoints.js';

test.describe('Fetch user benefits with different tokens', () => {
    benefit_data.forEach(({token, expect_benefit_info, expect_phonenumber}, index) => {
        test(`Benefit with user ${index + 1}:`, async ({ request }) => {
            const response = await request.get(endpoints.fetch_user_benefit, {
                headers: headers_benefit(token) 
            });
            const responseData = await response.json();
            console.log(`Response data of benefits user:`, responseData);
            expect(response.status()).toBe(200);
            expect(responseData.msg_data.phone).toEqual(expect_phonenumber);
            expect(responseData.msg_data.benefit_info).toEqual(expect_benefit_info);
        });
    });
});
>>>>>>> b7b891316aad36368088a492266bbc36b8537a7a
