import { get_benefitUser } from '../../fixtures/paymentFixture.js';
import dataLogins from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { validateSchema } from '../../data/validateResponse.js'; 


dataLogins.forEach(({ phone, client_id, type, otp_code, benefit_phone, platform }, index) => {


    baseTest.describe(`Benefit:`, () => {

        let bearerToken = {
            authToken: null,
        }
        
        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers, platform)
        })

        baseTest(`Get benefit of numberphone ${phone}`, async({request}) => {
            
            const response = await get_benefitUser(request, bearerToken.authToken, platform)

            const result = validateSchema(response, 'benefit_schema')
            console.log('Validation result:', result);
            if (!result.msg_code) {
                // In ra chi tiết lỗi để dễ debug
                console.error('Schema validation errors:', result.errors);
            } else {
                console.log('Response is valid according to the schema.');
            }
            expect(result.msg_code).toBe('success')
            expect(result.msg_data.phone).toEqual(benefit_phone)

        })
    });   
});

