import endpoints from '../../data/apiEndpoints.js';
import { createLoginData, send_otp } from '../../fixtures/loginFixture.js';
import testCases from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js';


testCases.forEach(({ phone, client_id, type, expectedSuccess }, index) => {
    baseTest(`Validate user OTP - Test Case ${index + 1}`, async ({ request, headers }) => {
        const response = await request.post(endpoints.validate_user, {
            headers,
            data: createLoginData(phone, client_id, type)
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        console.log(responseBody.data.mask_phone)
        
        expect(responseBody.status).toEqual('1');
        expect(responseBody.error_code).toBeDefined();
        expect(responseBody.msg).toEqual("Success");
        expect(responseBody.data.verify_token).toBeDefined();
        expect(responseBody.data.login_type).toBeDefined();
        expect(responseBody.data.mask_phone).toBeDefined();
        expect(responseBody.data.title).toBeDefined();
        expect(responseBody.data.description).toBeDefined();
        expect(responseBody.data.text_format).toBeDefined();
        expect(responseBody.data.switch_mode).toBeDefined();
        expect(responseBody.data.is_queue).toBeDefined();
        expect(responseBody.data.access_token).toBeDefined();
        expect(responseBody.data.access_token_type).toBeDefined();
        expect(responseBody.data.delay_time).toBeDefined();
        expect(responseBody.data.alert_notification).toBeDefined();
        expect(responseBody.data.login_screen_info).toBeDefined();


    });
});


testCases.forEach(({ phone, client_id, type, expectedSuccess}, index) => {
    baseTest(`Send OTP - Test Case ${index + 1}`, async ({ request, headers, authToken }) => {
        const response = await request.post(endpoints.send_otp, {
            headers,
            data: send_otp(phone, client_id, type, verify_token)            
        });
        const responseBody = await response.json();
        console.log(responseBody);
        expect(response.status()).toBe(200);
        console.log(verify_token)
    });
});
