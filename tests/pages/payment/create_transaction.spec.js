import { send_otp, validate_user, verify_OTP, login, get_benefitUser, bearerToken } from '../../fixtures/loginFixture.js';
import dataLogins, { purchaseData } from '../../data/loginData.js';
import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
import { authenticateUser } from '../../config/authConfig.js';
import { package_screen, create_transaction_by_pmh, create_transaction_by_fpl } from '../../fixtures/paymentFixture.js';
import { validateResponse } from '../../data/validateResponse.js';


purchaseData.forEach(({phone, client_id, type, otp_code, benefit_phone, platform }, index) => {

    baseTest.describe('Create transaction', () => {
        let bearerToken = {
            authToken: null,
        }

        baseTest.beforeEach(async ({request, headers}) => {
            bearerToken.authToken = await authenticateUser(request, phone, client_id, type, otp_code, headers, platform)
        })

        baseTest(`mua gói PMH thành công ${index}`, async({request}) => {

            const response = await create_transaction_by_pmh(request, bearerToken.authToken)
            console.log(response.msg_data.trans_id)
        })

        baseTest(`Mua gói FPL thành công ${index}`, async({request}) => {

            const reponse = await create_transaction_by_fpl(request, bearerToken.authToken)
            console.log(reponse.msg_data.trans_id)

        })

    })
})