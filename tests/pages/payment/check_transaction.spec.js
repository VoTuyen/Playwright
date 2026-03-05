import { send_otp, validate_user, verify_OTP, login, get_benefitUser, bearerToken } from '../../fixtures/loginFixture.js';
import { purchaseData } from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { package_screen, create_transaction_by_pmh, create_transaction_by_fpl, check_transaction } from '../../fixtures/paymentFixture.js';
import { validateSchema } from '../../data/validateResponse.js';
import { chromium } from 'playwright';

//kiểm tra kiểu dữ liệu của các field trong response body của API check transaction
purchaseData.forEach(({phone, client_id, type, otp_code, benefit_phone, platform }, index) => {


    baseTest.describe('Check transaction', () => {
        let bearerToken = {
            authToken: null,
        }

        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers, platform)
        })

        baseTest(`Kiểm tra kiểu dữ liệu của các field trong response body của API check transaction ${index}`, async({request}) => {

            const browser = await chromium.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();

            const response_create_transation_pmh = await create_transaction_by_pmh(request, bearerToken.authToken)
            const paymentLink = response_create_transation_pmh.msg_data.value_display
            await page.goto(paymentLink)
            await page.waitForTimeout(10000)
            
            const trans_id = response_create_transation_pmh.msg_data.trans_id

            const response_check_transaction = await check_transaction(request, bearerToken.authToken, platform, trans_id)
            console.log('Response from check_transaction API:', response_check_transaction); // In ra response để debug
            
            const result = validateSchema(response_check_transaction, 'check_transaction_schema')
            if (!result.msg_code) {
                // In ra chi tiết lỗi để dễ debug
                console.error('Schema validation errors:', result.msg_code);
            } else {
                console.log('Response is valid according to the schema.');
            }
            expect(result.msg_code).toBe('success')
    })
})
})