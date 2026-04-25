//import { bearerToken } from '../../fixtures/loginFixture.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { package_screen } from '../../fixtures/paymentFixture.js';
import { validateSchema } from '../../utils/validateResponse.js';
import { fetchCMSPackageGroups, fetchCMSPackagesV5, fetchCMSDisplayConfig } from '../../utils/auth/cmsApiHelper.js';
import { mapCMSDataToAppStructure } from '../../utils/payment/packageMapper.js';
import { package_screen_data } from '../../data/paymentData.js';
import {bearerToken} from '../../fixtures/loginFixture.js';

//TC1: Validate response structure with nhiều loại tài khoản khác nhau (có token, không token, token hết hạn, tài khoản SA, tài khoản SUB...)
package_screen_data.forEach(({label, phone, client_id, platform}, index) => {

    baseTest.describe('Validate package screen response', () => {

        let bearerToken = {
            authToken: null,
        }
        
        baseTest.beforeEach(async ({request, headers}) => {
            if (phone) {
                bearerToken.authToken = await authenticateUser(request, phone, client_id , 'login_fpl', '999999', headers, platform)
            } else {
                bearerToken.authToken = null
            }
            console.log("Bearer Token:", bearerToken.authToken)
        })      

        baseTest(`Testcase ${index + 1} - ${label}:`, async({request}) => {

            const response = await package_screen(request, bearerToken.authToken, platform)
            const test = validateSchema(response, 'package_screen_schema')
            
            //Log kết quả trả về từ App API để quan sát
            console.log(`[App API Response] Label: ${label}`);
            console.log(JSON.stringify(test.msg_data, null, 2));

            expect(test.msg_code).toBe('success')
            
            // 1. GỌI 3 API CMS ĐỂ LẤY CONFIG GỐC
            const [groups, packages, display] = await Promise.all([
                fetchCMSPackageGroups(request),
                fetchCMSPackagesV5(request),
                fetchCMSDisplayConfig(request)
            ]);

            const isLoggedIn = !!phone;
            const isSA = label.includes('SA');
            // Map data CMS về cấu trúc App
            const cmsExpected = mapCMSDataToAppStructure(groups, packages, display, platform, isLoggedIn, isSA);
            const apiResult = test.msg_data;

            if (apiResult.subscriber_group.length !== cmsExpected.subscriber_group.length) {
                console.log("FULL API RESULT:", JSON.stringify(apiResult, null, 2));
            }

                // 2. VERIFY: Số lượng nhóm gói hiển thị phải khớp
                if (apiResult.subscriber_group.length !== cmsExpected.subscriber_group.length) {
                    console.log(`[Mismatch Count] Groups`);
                    console.log(`Expected (${cmsExpected.subscriber_group.length}):`, cmsExpected.subscriber_group.map(g => g.type));
                    console.log(`Actual (${apiResult.subscriber_group.length}):`, apiResult.subscriber_group.map(g => g.type));
                }
                expect(apiResult.subscriber_group.length).toBe(cmsExpected.subscriber_group.length);

                cmsExpected.subscriber_group.forEach((expectedGroup, gIdx) => {
                    const actualGroup = apiResult.subscriber_group.find(g => g.type === expectedGroup.type);
                    
                    // Verify Thông tin Group
                    expect(actualGroup).toBeDefined();
                    expect(actualGroup.name).toBe(expectedGroup.name);
                    
                    // Verify Danh sách gói trong group (chỉ những gói status=1 mới hiện)
                    if (actualGroup.packages_list.length !== expectedGroup.packages_list.length) {
                        console.log(`[Mismatch] Group: ${expectedGroup.type}`);
                        console.log(`Expected (${expectedGroup.packages_list.length}):`, expectedGroup.packages_list.map(p => p.name));
                        console.log(`Actual (${actualGroup.packages_list.length}):`, actualGroup.packages_list.map(p => p.package_name.text));
                    }
                    expect(actualGroup.packages_list.length).toBe(expectedGroup.packages_list.length);
                    
                    expectedGroup.packages_list.forEach((expectedPack, pIdx) => {
                        const actualPack = actualGroup.packages_list[pIdx];
                        expect(actualPack.type).toBe(expectedPack.type);
                        expect(actualPack.package_name.text).toBe(expectedPack.name);
                        
                        // Rule btn_buy_pack: chưa login thì luôn = 1 (Mua ngay)
                        if (!isLoggedIn) {
                            expect(actualPack.btn_buy_pack).toBe(1);
                        }
                    });

                    // Verify Đặc quyền (Features) ở từng gói
                    expectedGroup.packages_list.forEach((expectedPack, pIdx) => {
                        const actualPack = actualGroup.packages_list[pIdx];
                        
                        // Lấy danh sách feature đang active từ CMS cho gói này
                        const activeFeaturesInCMS = expectedGroup.features; // Đây là list keys được phép hiện

                        expectedGroup.features.forEach(featKey => {
                            const actualFeat = actualPack.features_display.find(f => f.feature_type === featKey);
                            // Nếu CMS bật hiển thị quyền lợi này cho Nhóm gói, thì nó phải xuất hiện trong gói (nếu gói đó có data cho feature đó)
                            // expect(actualFeat).toBeDefined(); 
                        });
                    });
            });
        })
})
})
    

//TC2: Validate response structure với các platform khác nhau (web, box, mobile)
//TC3: Validate value của các field quan trọng trong response (msg_code, msg_content, subscriber_group.type, subscriber_group.name, subscriber_group.sub-text, subscriber_group.background, subscriber_group.block_highlight.image, subscriber_group.block_highlight.background, subscriber_group.block_highlight.inactive_background, subscriber_group.block_highlight.background_image, subscriber_group.block_highlight.color_code, subscriber_group.block_highlight.color_code_web, subscriber_group.block_highlight.background_image_table, subscriber_group.block_highlight.background_image_mobile, subscriber_group.block_highlight.footer_banners, subscriber_group.is_focus, subscriber_group.is_app_review, subscriber_group.packages_list.package_name.text...)
//TC4: Validate logic của 1 số field quy định BE tính 
