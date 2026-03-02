import { send_otp, validate_user, verify_OTP, login, get_benefitUser, bearerToken } from '../../fixtures/loginFixture.js';
import dataLogins from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { package_screen } from '../../fixtures/paymentFixture.js';
import { validateResponse } from '../../data/validateResponse.js';

dataLogins.forEach(({ phone, client_id, type, otp_code, benefit_phone, platform }, index) => {

    baseTest.describe('Package screen', () => {
        let bearerToken = {
            authToken: null,
        }
        
        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers, platform)
        })

        baseTest(`Get info package screen with ${phone}`, async({request}) => {

            const reponse = await package_screen(request, bearerToken.authToken, platform)

            expect(reponse.msg_code).toEqual("success")
            expect(reponse.msg_content).toEqual("Lấy danh sách gói thành công") //so sánh giá trị và cấu trúc
            expect(reponse.msg_data).toBeDefined()
            expect(reponse.msg_data.subscriber_group).toBeDefined()
            expect(reponse.msg_data.subscriber_group).toBeInstanceOf(Array)
            expect(reponse.msg_data.subscriber_group[0].type).toBe("fptplay_now") //so sánh tham chiếu, sử dụng === để so sánh
            expect(reponse.msg_data.subscriber_group[0].name).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0]['sub-text']).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].background).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.image).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.background).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.inactive_background).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.background_image).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.color_code).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.color_code_web).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.background_image_table).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.background_image_mobile).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].block_highlight.footer_banners).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].is_focus).toBe(0)
            expect(reponse.msg_data.subscriber_group[0].is_app_review).toBe(0)
            expect(reponse.msg_data.subscriber_group[0].packages_list).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].packages_list[0].package_name).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].packages_list[0].package_name.image_url).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].packages_list[0].package_name.text).toEqual("Gói Premium")
            expect(reponse.msg_data.subscriber_group[0].packages_list[0].is_highlight).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].packages_list[0].is_promotion).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].packages_list[0].block_highlight).toBeDefined()
            expect(reponse.msg_data.subscriber_group[0].packages_list[0].block_highlight.image_url).toBeDefined()

            

            // const v = validateResponse(reponse);
            // if (v.ok) {
            // expect(true).toBeTruthy();
            // } else {
            // // Không hợp lệ: in chi tiết lỗi và fail test
            // console.log("Validation errors:", v.errors);
            // // ép test thất bại với thông báo chi tiết
            // // Bạn có thể gắn từng trường vào expect để dễ đọc
            // const msgs = v.errors.map(e => `Field ${e.field}: ${e.message}`).join('; ');
            // fail(`Schema validation failed: ${msgs}`);
            // }

        })

    })
})