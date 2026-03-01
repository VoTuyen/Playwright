//import { send_otp, validate_user, verify_OTP, login, get_benefitUser, bearerToken } from '../../fixtures/loginFixture.js';
import { get_benefitUser } from '../../fixtures/paymentFixture.js';
import dataLogins from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { validateResponse } from '../../data/validateResponse.js';  


dataLogins.forEach(({ phone, client_id, type, otp_code, benefit_phone, platform }, index) => {


    baseTest.describe(`Benefit:`, () => {

        let bearerToken = {
            authToken: null,
        }
        
        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers, platform)
        })

        baseTest(`Get benefit of numberphone ${phone}`, async({request}) => {
            console.log(bearerToken.authToken)
            const response = await get_benefitUser(request, bearerToken.authToken, platform)
            //console.log(response)
            // expect(response.msg_code).toEqual('success')
            // expect(response.msg_content).toEqual('thành công')
            expect(response.msg_data.phone).toEqual(benefit_phone)
            // expect(response.msg_data.benefit_info).toBeDefined()

            const result = validateResponse(response)
            if (!result.ok) {
                // In ra chi tiết lỗi để dễ debug
                console.error('Schema validation errors:', result.errors);
            } else {
                console.log('Response is valid according to the schema.');
            }
            expect(true).toBe(result.ok) // Kiểm tra xem response có hợp lệ theo schema hay không

        })
    });   
});

