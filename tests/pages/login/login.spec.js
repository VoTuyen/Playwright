import {send_otp, validate_user, verify_OTP, login} from '../../fixtures/loginFixture.js';
import dataLogins from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js';

dataLogins.forEach(({ phone, client_id, type, otp_code , platform}, index) => {
    let verifyToken;
    let verify_token_otp;
    
    // Nhóm các test case liên quan đến dữ liệu của user
    baseTest.describe(`Verify login sucess: case ${index + 1}`, () => {
        
        baseTest.beforeEach(async ({ request, headers }) => {
            // Gọi API validate_user và lưu verify_token
            const response_validate_user = await validate_user(request, phone, client_id, type, headers, platform)
            verifyToken = response_validate_user.data.verify_token // Lưu verify_token
            const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers, platform)
            verify_token_otp = response_verify_Otp.data.verify_token

        });

        // Test Case 1: Validate User OTP
        baseTest(`Validate User OTP ${phone}`, async ({ request, headers }) => {
            const response_validate_user = await validate_user(request, phone, client_id, type, headers, platform);
            expect(response_validate_user.status).toEqual('1');
            expect(response_validate_user.data.verify_token).toBeDefined();
            expect(response_validate_user.error_code).toBeDefined();
            expect(response_validate_user.msg).toEqual("Success");
            expect(response_validate_user.data.verify_token).toBeDefined();
            expect(response_validate_user.data.login_type).toBeDefined();
            expect(response_validate_user.data.mask_phone).toBeDefined();
            expect(response_validate_user.data.title).toBeDefined();
            expect(response_validate_user.data.description).toBeDefined();
            expect(response_validate_user.data.text_format).toBeDefined();
            expect(response_validate_user.data.switch_mode).toBeDefined();
            expect(response_validate_user.data.is_queue).toBeDefined();
            expect(response_validate_user.data.access_token).toBeDefined();
            expect(response_validate_user.data.access_token_type).toBeDefined();
            expect(response_validate_user.data.delay_time).toBeDefined();
            expect(response_validate_user.data.alert_notification).toBeDefined();
            expect(response_validate_user.data.login_screen_info).toBeDefined();
            //console.log(response_validate_user.data.verify_token)
            
        });

        // Test Case 2: Send OTP
        baseTest(`Send OTP ${phone}`, async ({ request, headers }) => {
            const response_sendOtp = await send_otp(request, phone, client_id, type, verifyToken, headers, platform)
            expect(response_sendOtp.status).toEqual('1');
            expect(response_sendOtp.error_code).toEqual('0')
            expect(response_sendOtp.msg).toBeDefined()
            expect(response_sendOtp.data.text_format).toBeDefined()
            expect(response_sendOtp.data.email).toBeDefined()
            expect(response_sendOtp.data.mask_phone).toBeDefined()
            expect(response_sendOtp.data.otp_length).toEqual('6')
            expect(response_sendOtp.data.seconds).toBeDefined()
            expect(response_sendOtp.data.title).toBeDefined()
            expect(response_sendOtp.data.switch_mode.title).toBeDefined()
            expect(response_sendOtp.data.switch_mode.description).toBeDefined()
            expect(response_sendOtp.data.switch_mode.default.method).toBeDefined()
            expect(response_sendOtp.data.switch_mode.default.text).toBeDefined()
            expect(response_sendOtp.data.switch_mode.default.icon).toBeDefined()
            expect(response_sendOtp.data.switch_mode.modes).toBeDefined()
            //console.log(sendOtp)
            //console.log(verifyToken)
            console.log('-----------------------')
        });

        //Test Case 3: Verify OTP
        baseTest(`Verify  OTP ${phone}`, async ({ request, headers }) => {
            //const response_sendOtp = await send_otp(request, phone, client_id, type, headers)
            const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers, platform)
            expect(response_verify_Otp.status).toEqual('1')
            expect(response_verify_Otp.error_code).toEqual('0')
            expect(response_verify_Otp.msg).toEqual('Success')
            expect(response_verify_Otp.data.verify_token).toBeDefined()
            expect(response_verify_Otp.data.title).toEqual('Thông báo')
        });

        //Testcase 4: Login sucess
        baseTest(`Login sucess ${phone}`, async ({request, headers}) => {
            const response_login = await login (request, phone, client_id, verify_token_otp, headers, platform)
            expect(response_login.status).toEqual('1')
            expect(response_login.error_code).toEqual('0')
            expect(response_login.msg).toEqual('Đăng nhập thành công')
            expect(response_login.data.access_token_type).toEqual('Bearer')
            expect(response_login.data.access_token).toBeDefined()
        })
    });
});