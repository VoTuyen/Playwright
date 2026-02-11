import { send_otp, validate_user, verify_OTP, login, get_benefitUser, bearerToken } from '../../fixtures/loginFixture.js';
import dataLogins from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';

dataLogins.forEach(({ phone, client_id, type, otp_code, benefit_phone }, index) => {


    baseTest.describe(`Benefit:`, () => {

        let bearerToken = {
            authToken: null,
        }
        
        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers)
        })

        baseTest(`Get benefit of numberphone ${phone}`, async({request}) => {
            //console.log(bearerToken.authToken)
            const response = await get_benefitUser(request, bearerToken.authToken)
            console.log(response)
            expect(response.msg_code).toEqual('success')
            expect(response.msg_content).toEqual('thành công')
            expect(response.msg_data.phone).toEqual(benefit_phone)
            expect(response.msg_data.benefit_info).toBeDefined()
        })
    });   
});

