import endpoints from '../../data/apiEndpoints.js';
import { createLoginData, send_otp, fetchUserInfo } from '../../fixtures/loginFixture.js';
import testCases from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js';

testCases.forEach(({ phone, client_id, type }, index) => {
    let verifyToken;
    let responseBody;
    
    // Nhóm các test case liên quan đến dữ liệu của user
    baseTest.describe(`User API Tests for Case ${index + 1}`, () => {
        
        baseTest.beforeAll(async ({ request, headers }) => {
            // Gọi API validate_user và lưu verify_token
            const response = await request.post(endpoints.validate_user, {
                headers,
                data: createLoginData(phone, client_id, type),
            });
            responseBody = await response.json();
            verifyToken = responseBody.data.verify_token; // Lưu verify_token
        });

        // Test Case 1: Validate User OTP
        baseTest(`Validate User OTP`, async ({ request, headers }) => {
            // const response = await request.post(endpoints.validate_user, {
            //     headers,
            //     data: createLoginData(phone, client_id, type),
            // });

            //expect(response.status()).toBe(200);
            expect(responseBody.status).toEqual('1');
            expect(responseBody.data.verify_token).toBeDefined();
            
        });

        // Test Case 2: Send OTP
        baseTest(`Send OTP`, async ({ request, headers }) => {
            const response = await request.post(endpoints.send_otp, {
                headers,
                data: send_otp(phone, client_id, type, verifyToken),
            });

            const responseBody = await response.json();
            expect(response.status()).toBe(200);
            expect(responseBody.status).toEqual('1');
            console.log("dòng 2")
            // Thêm các kiểm tra khác...
        });

        // Test Case 3: Fetch User Info
        // baseTest(`Fetch User Info`, async ({ request, headers }) => {
        //     const response = await request.get(endpoints.user_info, {
        //         headers: {
        //             ...headers,
        //             'Authorization': `Bearer ${verifyToken}`, // Sử dụng verify_token để xác thực
        //         },
        //     });

        //     expect(response.status()).toBe(200);
        //     const responseBody = await response.json();
        //     expect(responseBody.status).toEqual('1');
        //     // Thêm các kiểm tra khác...
        // });
    });
});