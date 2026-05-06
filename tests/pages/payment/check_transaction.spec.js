import { bearerToken } from '../../fixtures/loginFixture.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { validateSchema } from '../../utils/validateResponse.js';
//import { chromium } from 'playwright';
import { init, close } from '../../fixtures/browserFixture.js';
//const testData = require('../../data/data.json') 
import { check_transaction_data } from '../../data/paymentData.js';
import { validate_check_transaction } from '../../config/validate_check_transaction.js';
import { testAccounts } from '../../data/testAccounts.js';

check_transaction_data.forEach(({is_survey, is_PMH, payment_success, plan_id, is_over2h, is_login, expected, id}, index) => {

    baseTest.describe('Validate check transaction response', () => {

        let page;
        baseTest.beforeAll( async () => {
            page = await init();
        })
        baseTest.afterAll(async () => {
            await close();
        })

        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, testAccounts.CHECK_TXN_USER.payload.phone, testAccounts.CHECK_TXN_USER.payload.client_id , 'login_fpl', '999999', headers, '_w')
        })

        baseTest(`Testcase ${id}`, async({request}) => {

            const phone = testAccounts.CHECK_TXN_USER.payload.phone;
            
            const result = await validate_check_transaction(is_survey, is_PMH, payment_success, plan_id, is_over2h, is_login, request, bearerToken.authToken, page, phone)
            const test = validateSchema(result.body, 'check_transaction_schema')
            expect(test.msg_code).toBe('success')
            expect(result.extracted).toEqual(expected)

            
        })
    })
})