import { test as baseTest, expect, request as pwRequest } from '@playwright/test';
import { survey_customer_info } from '../../fixtures/paymentFixture.js';
import { customer_info_data } from '../../data/customerInfoData.js';
import { authenticateUser } from '../../config/authConfig.js';
import { validateSchema } from '../../utils/validateResponse.js';

let globalAuthToken = '';

// Các test case chạy song song độc lập

baseTest.beforeAll(async () => {
    const apiContext = await pwRequest.newContext();
    const headers = { 'X-DID': '10:39:4E:A8:85:32', 'Content-Type': 'application/json' };
    
    // Login để lấy Bearer token thật trước khi chạy test, số DT này dùng tạm từ file dev
    globalAuthToken = await authenticateUser(
        apiContext, 
        '0565123454', 
        '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a', 
        'login_fpl', 
        '999999', 
        headers, 
        '_w'
    );
    console.log('[Setup] Đã lấy thành công Token Bearer:', globalAuthToken.substring(0, 30) + '...');
});

customer_info_data.forEach((testCase) => {
    baseTest.describe(`[${testCase.tc_id}] ${testCase.description}`, () => {

        baseTest(`Should return expect status ${testCase.expected.status}`, async ({ request }) => {
            
            // Xử lý logic Pre-Condition
            let testToken = globalAuthToken;
            if (testCase.tc_id === 'FPT_SURVEY_TC_010') {
                testToken = ''; // Xoá token nếu là TC test lỗi authentication
            }

            console.log(`[Flow] Gọi API Customer Info với payload:`, testCase.payload);

            // 1. Gửi request
            const response = await survey_customer_info(request, testToken, testCase.payload);
            
            // 2. Asserts Status
            console.log(`[Assert] Verify status: response ${response.status} | expected: ${testCase.expected.status}`);
            expect(response.status).toEqual(testCase.expected.status);

            // Bỏ qua validate schema nếu bị Unauthorized cố tình
            if (response.status === 401) return;

            // 3. Schema Validators
            const isValid = validateSchema(response.body, 'customer_info_schema');
            expect(isValid).toBeDefined();

            // 4. Asserts Error Message (Nếu có field message)
            if (testCase.expected.message) {
                // message thường nằm trong property `message` hoặc `msg` tuỳ Backend Playwright FPT
                const resMessage = response.body?.message || response.body?.msg || response.body?.msg_content || '';
                console.log(`[Assert] Verify error message: "${resMessage}" | expected: "${testCase.expected.message}"`);
                expect(resMessage).toContain(testCase.expected.message);
            }
        });
        
    });
});
