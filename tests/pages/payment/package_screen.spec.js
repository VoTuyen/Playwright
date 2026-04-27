//import { bearerToken } from '../../fixtures/loginFixture.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { package_screen } from '../../fixtures/paymentFixture.js';
import { validateSchema } from '../../utils/validateResponse.js';
import { fetchCMSPackageGroups, fetchCMSPackagesV5, fetchCMSDisplayConfig } from '../../utils/auth/cmsApiHelper.js';
import { mapCMSDataToAppStructure } from '../../utils/payment/packageMapper.js';
import { package_screen_data } from '../../data/paymentData.js';
import {bearerToken} from '../../fixtures/loginFixture.js';

// TC1: Validate response structure & data consistency across different accounts and platforms
package_screen_data.forEach(({ label, phone, client_id, platform, is_sub }, index) => {

    baseTest.describe(`Package Screen: ${label}`, () => {

        let authBearer = { authToken: null };

        baseTest.beforeEach(async ({ request, headers }) => {
            if (phone) {
                authBearer.authToken = await authenticateUser(request, phone, client_id, 'login_fpl', '999999', headers, platform);
            } else {
                authBearer.authToken = null;
            }
        });

        baseTest(`Verify Schema and CMS Data Mapping - ${label}`, async ({ request }) => {
            // 1. Gọi API App
            const response = await package_screen(request, authBearer.authToken, platform);
            
            // 2. [MANDATORY] Kiểm tra Schema API
            const apiResult = validateSchema(response, 'package_screen_schema');
            expect(apiResult.msg_code).toBe('success');

            // 3. Lấy dữ liệu CMS để đối soát
            const [groups, packages, display] = await Promise.all([
                fetchCMSPackageGroups(request),
                fetchCMSPackagesV5(request),
                fetchCMSDisplayConfig(request)
            ]);

            console.log(`[DEBUG_API_RAW] Platform: ${platform}, CMS Raw Groups Count: ${groups.data?.data?.length || 0}`);
            console.log(`[DEBUG] Testing case: ${label}, is_sub_input: ${is_sub}`);
            const isLoggedIn = !!phone;
            const isSA = label.includes('SA');
            const cmsExpected = mapCMSDataToAppStructure(groups, packages, display, platform, isLoggedIn, isSA, is_sub);

            // In ra danh sách gói nhận được từ CMS để đối soát
            console.log(`\n--- CMS EXPECTED PACKAGES for ${label} ---`);
            cmsExpected.subscriber_group.forEach(group => {
                console.log(`Group: ${group.type} (${group.name})`);
                group.packages_list.forEach(pkg => {
                    console.log(`  - Package: ${pkg.package_name.text} (${pkg.type}), Price: ${pkg.price_display}`);
                });
            });
            console.log(`-------------------------------------------\n`);

            // 4.1 Verify Số lượng nhóm gói
            expect(apiResult.msg_data.subscriber_group.length).toBe(cmsExpected.subscriber_group.length);

            cmsExpected.subscriber_group.forEach((expectedGroup) => {
                const actualGroup = apiResult.msg_data.subscriber_group.find(g => g.type === expectedGroup.type);
                
                // Verify thông tin cơ bản của Group (TC3)
                expect(actualGroup).toBeDefined();
                expect(actualGroup.name).toBe(expectedGroup.name);
                
                // 4.2 Verify Danh sách gói trong nhóm (TC4 Logic Filter)
                expect(actualGroup.packages_list.length).toBe(expectedGroup.packages_list.length);
                
                expectedGroup.packages_list.forEach((expectedPack, pIdx) => {
                    const actualPack = actualGroup.packages_list[pIdx];
                    
                    // Verify chi tiết gói (TC3)
                    expect(actualPack.type).toBe(expectedPack.type);
                    expect(actualPack.package_name.text).toBe(expectedPack.package_name.text);
                    expect(actualPack.price_display).toBe(expectedPack.price_display);
                    
                    // Logic Nút mua (TC4)
                    if (!isLoggedIn) {
                        expect(actualPack.btn_buy_pack).toBe(1); // Guest luôn thấy "Mua ngay"
                    }
                });

                // 4.3 Verify Đặc quyền (TC4 Logic Quyền lợi)
                expectedGroup.features_display.forEach(feat => {
                    const actualFeat = actualGroup.features_display?.find(f => f.feature_type === feat.feature_type);
                    // Nếu CMS cấu hình hiện trên nhóm gói, thì nó phải tồn tại trong list feature của nhóm/gói
                    if (feat.type_display === 'check') {
                         // Thực hiện các check logic khác nếu cần
                    }
                });
            });
        });
    });
});
