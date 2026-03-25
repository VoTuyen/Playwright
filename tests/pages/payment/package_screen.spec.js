//import { bearerToken } from '../../fixtures/loginFixture.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { package_screen } from '../../fixtures/paymentFixture.js';
import { validateSchema } from '../../data/validateResponse.js';
import {package_screen_data} from '../../data/paymentData.js';
import {bearerToken} from '../../fixtures/loginFixture.js';

//TC1: Validate response structure with nhiều loại tài khoản khác nhau (có token, không token, token hết hạn, tài khoản SA, tài khoản SUB...)
package_screen_data.forEach(({phone, client_id, platform}, index) => {

    baseTest.describe('Validate package screen response', () => {

        let bearerToken = {
            authToken: null,
        }
        
        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id , 'login_fpl', '999999', headers, platform)
            console.log("Bearer Token:", bearerToken.authToken)
        })      

        baseTest(`Testcase ${index + 1}:`, async({request}) => {

            const response = await package_screen(request, bearerToken.authToken, platform)
            const test = validateSchema(response, 'package_screen_schema')
            console.log(test.msg_data.subscriber_group[0].type)
            //console.log(test.msg_data.subscriber_group[1].type)
            expect(test.msg_code).toBe('success')
            // expect(test.msg_data.subscriber_group[0].type).toBe("fptplay_now")            
            // expect(test.msg_data.subscriber_group[1].type).toBe("fptplay_home")
            
        })
})
})
    

//TC2: Validate response structure với các platform khác nhau (web, box, mobile)
//TC3: Validate value của các field quan trọng trong response (msg_code, msg_content, subscriber_group.type, subscriber_group.name, subscriber_group.sub-text, subscriber_group.background, subscriber_group.block_highlight.image, subscriber_group.block_highlight.background, subscriber_group.block_highlight.inactive_background, subscriber_group.block_highlight.background_image, subscriber_group.block_highlight.color_code, subscriber_group.block_highlight.color_code_web, subscriber_group.block_highlight.background_image_table, subscriber_group.block_highlight.background_image_mobile, subscriber_group.block_highlight.footer_banners, subscriber_group.is_focus, subscriber_group.is_app_review, subscriber_group.packages_list.package_name.text...)
//TC4: Validate logic của 1 số field quy định BE tính 



            //expect(reponse.msg_code).toEqual("success")
            // expect(reponse.msg_content).toEqual("Lấy danh sách gói thành công") //so sánh giá trị và cấu trúc
            // expect(reponse.msg_data).toBeDefined()
            // expect(reponse.msg_data.subscriber_group).toBeDefined()
            // expect(reponse.msg_data.subscriber_group).toBeInstanceOf(Array)
            // expect(reponse.msg_data.subscriber_group[0].type).toBe("fptplay_now") //so sánh tham chiếu, sử dụng === để so sánh
            // expect(reponse.msg_data.subscriber_group[0].name).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0]['sub-text']).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].background).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.image).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.background).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.inactive_background).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.background_image).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.color_code).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.color_code_web).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.background_image_table).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.background_image_mobile).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].block_highlight.footer_banners).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].is_focus).toBe(0)
            // expect(reponse.msg_data.subscriber_group[0].is_app_review).toBe(0)
            // expect(reponse.msg_data.subscriber_group[0].packages_list).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].packages_list[0].package_name).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].packages_list[0].package_name.image_url).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].packages_list[0].package_name.text).toEqual("Gói Premium")
            // expect(reponse.msg_data.subscriber_group[0].packages_list[0].is_highlight).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].packages_list[0].is_promotion).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].packages_list[0].block_highlight).toBeDefined()
            // expect(reponse.msg_data.subscriber_group[0].packages_list[0].block_highlight.image_url).toBeDefined()
