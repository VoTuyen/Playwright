import { get_benefitUser } from '../../fixtures/paymentFixture.js';
import benefitData from '../../data/benefitData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { validateSchema } from '../../utils/validateResponse.js'; 


benefitData.forEach(({ phone, client_id, type, otp_code, benefit_phone, platform }, index) => {


    baseTest.describe(`Benefit:`, () => {

        let bearerToken = {
            authToken: null,
        }
        
        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers, platform)
        })

        baseTest(`Get benefit of numberphone ${phone}`, async({request, headers}) => {
            
            let response = await get_benefitUser(request, bearerToken.authToken, platform)

            // [TỰ ĐỘNG LÀM MỚI TOKEN NẾU BỊ 401]
            if (response?.msg_code === 'unauthorized' || response?.status === 401) {
                console.warn(`[401] Token của ${phone} đã hết hạn. Đang thực hiện cấp mới...`);
                const { clearTokenCache } = await import('../../config/authConfig.js');
                clearTokenCache(phone);
                bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers, platform, true);
                response = await get_benefitUser(request, bearerToken.authToken, platform);
            }

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

