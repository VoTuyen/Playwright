import { send_otp, validate_user, verify_OTP, login, get_benefitUser, bearerToken } from '../../fixtures/loginFixture.js';
import { purchaseData } from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { package_screen, create_transaction_by_pmh, create_transaction_by_fpl, check_transaction, delay, clear_user_data } from '../../fixtures/paymentFixture.js';
import { validateSchema } from '../../data/validateResponse.js';
import { chromium } from 'playwright';
import { init, close } from '../../fixtures/browserFixture.js';
const testData = require('../../data/data.json') 
import { check_transaction_data } from '../../data/paymentData.js';
import { validate_check_transaction } from '../../data/validate_check_transaction.js';

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
            bearerToken.authToken = await authenticateUser(request, '0565123452', '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a' , 'login_fpl', '999999', headers, '_w')
        })

        baseTest(`Testcase ${id}`, async({request}) => {

            const phone = '0565123452';
            
            const result = await validate_check_transaction(is_survey, is_PMH, payment_success, plan_id, is_over2h, is_login, request, bearerToken.authToken, page, phone)
            expect(result).toEqual(expected)
        })
    })
})