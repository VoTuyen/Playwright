import { test, expect } from '@playwright/test';
import { PaymentApi } from '../../api/paymentApi.js';
import { authenticateUser } from '../../config/authConfig.js';
import { testAccounts } from '../../data/testAccounts.js';
import { packagesMapper } from '../../utils/payment/packagesMapper.js';
import { validateSchema } from '../../utils/validateResponse.js';
import { packagesSchema } from '../../schema/packagesSchema.js';

test.describe('Validate Packages API vs CMS Setup', () => {
    let paymentApi;
    let authToken;
    const user = testAccounts.PACKAGE_SCREEN_SA_USER; // Dùng tài khoản SA làm mẫu

    test.beforeAll(async ({ request }) => {
        paymentApi = new PaymentApi(request);
        // Lấy token để gọi API (có thể dùng cache)
        authToken = await authenticateUser(
            request,
            user.payload.phone,
            user.payload.client_id,
            user.payload.type,
            user.payload.otp_code,
            {},
            '_w'
        );
    });

    test('Check all fields in /packages API match CMS expectations', async ({ request }) => {
        // Các tham số query từ curl của bạn
        const params = {
            st: '35IKOG4Jko9bajrdtQz2xw',
            e: '1778051697',
            device: 'Google+Chrome(version%3A147.0.7727.138)',
            drm: '1'
        };

        const headers = {
            'Authorization': authToken,
            'x-did': '42F74A7E6A9C8C7E'
        };

        // 1. Gọi API
        const response = await request.get('https://api-staging.fptplay.net/api/v7.1_w/paymentgw/packages', {
            params: params,
            headers: headers
        });
        
        const result = await response.json();
        expect(response.status()).toBe(200);

        // 2. Validate Cấu trúc Schema (Đảm bảo không mất field)
        validateSchema(result, packagesSchema);

        // 3. Trích xuất dữ liệu thực tế từ API để đối soát
        const actualData = packagesMapper.extractDisplayInfo(result);
        console.log('--- ACTUAL DATA FROM API ---');
        console.log(JSON.stringify(actualData, null, 2));

        // 4. Ví dụ kiểm tra một số field cụ thể khớp với CMS (Bạn có thể thêm nhiều hơn)
        // Kiểm tra nhóm FPT Play NOW
        const nowGroup = actualData.find(g => g.group_type === 'fptplay_now');
        expect(nowGroup).toBeDefined();
        expect(nowGroup.name).toBe('FPT Play NOW');

        // Kiểm tra gói Premium trong nhóm NOW
        const premiumPkg = nowGroup.packages.find(p => p.type === 'premium');
        expect(premiumPkg.name).toBe('Premium');
        expect(premiumPkg.price).toBe('75.00₫'); // Khớp với JSON bạn gửi
        expect(premiumPkg.button_text).toBe('Mua ngay');

        // Kiểm tra các Feature của gói Premium
        expect(premiumPkg.features['platform_support']).toBe(1); // Active
        expect(premiumPkg.features['phim_au_my']).toBe(0);      // Inactive
    });
});
