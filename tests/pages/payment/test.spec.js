import { send_otp, validate_user, verify_OTP, login, get_benefitUser } from '../../fixtures/loginFixture.js';
import dataLogins from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'

dataLogins.forEach(({ phone, client_id, type, otp_code }, index) => {

    baseTest.describe(`Benefit: case ${index + 1}`, () => {
        let authToken;

        baseTest.beforeEach(async ({ request, headers }) => {
        try {
            const response_validate_user = await validate_user(request, phone, client_id, type, headers);
            const verifyToken = response_validate_user.data.verify_token;

            const response_sendOtp = await send_otp(request, phone, client_id, type, verifyToken, headers);
            const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers);
            const verify_token_otp = response_verify_Otp.data.verify_token;

            const response_login = await login(request, phone, client_id, verify_token_otp, headers);
            const access_token = response_login.data.access_token;
            const access_token_type = response_login.data.access_token_type;
            authToken = `${access_token_type} ${access_token}`; // Lưu token



        } catch (error) {
            console.error("Error during authentication: ", error);
            throw error; // Ném lỗi ra ngoài nếu có vấn đề
        }
        });

        baseTest('Get benefit', async({request}) => {
            //console.log(authToken)
            const responeTest = await get_benefitUser(request, authToken)
            console.log(responeTest)
            //expect(responeTest.list).toBeDefined()

        })
    });   
});

