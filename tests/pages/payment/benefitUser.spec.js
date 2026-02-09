//import benefit_data from '../../data/benefitsData.js';
import { fetch_user_benefit } from '../../fixtures/benefitFixtures.js';
import { send_otp, validate_user, verify_OTP, login } from '../../fixtures/loginFixture.js';
import dataLogins from '../../data/loginData.js';
import { test as baseTest, expect } from '@playwright/test';


dataLogins.forEach(({phone, client_id, otp_code}) => {

    let verifyToken;
    let verify_token_otp;
    let access_token;
    let access_token_type; 


    baseTest.beforeAll(async (request, headers) => {

        const response_validate_user = await validate_user(request, phone, client_id, type, headers)
        verifyToken = response_validate_user.data.verify_token

        const response_sendOtp = await send_otp(request, phone, client_id, type, verifyToken, headers)
        const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers)
        verify_token_otp = response_verify_Otp.data.verify_token

        const response_login = await login(request, phone, client_id, verify_token_otp, headers)
        access_token = response_login.data.access_token
        access_token_type = response_login.data.access_token_type
        authToken = `${access_token_type} ${access_token}`  
    });

    baseTest(`Benefit with phone: ${phone}`, async ({ request, headers }) => {
        const response = await fetch_user_benefit(request, authToken)
        test = response.msg_data.benefit_info
        expect(test).toBeDefined()
    })

})

