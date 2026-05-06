import { test as baseTest, expect } from '../../fixtures/loginFixture.js';
import { authenticateUser } from '../../config/authConfig.js';
import { create_transaction_by_pmh, create_transaction_by_fpl } from '../../fixtures/paymentFixture.js';
import { createTransactionData } from '../../data/paymentData.js';

/**
 * Create Transaction Tests
 * - Data (account + plan_id) được quản lý trong paymentData.js → createTransactionData
 * - plan_id dùng chung cho cả PMH và FPL
 * - Spec file không hardcode bất kỳ giá trị nào
 */
createTransactionData.forEach(({ description, account, plan_id }) => {

    baseTest.describe(`Create Transaction — ${description}`, () => {
        let bearerToken = { authToken: null };

        baseTest.beforeEach(async ({ request, headers }) => {
            bearerToken.authToken = await authenticateUser(
                request,
                account.phone,
                account.client_id,
                account.type,
                account.otp_code,
                headers,
                account.platform
            );
        });

        baseTest(`[PMH] Mua gói plan_id=${plan_id} thành công`, async ({ request }) => {
            const response = await create_transaction_by_pmh(request, bearerToken.authToken, plan_id);
            console.log('[PMH] Response:', JSON.stringify(response, null, 2));

            expect(response, 'API phải trả về response').toBeDefined();
            expect(response.msg_data, `API PMH trả về null cho plan_id=${plan_id}`).not.toBeNull();
            expect(response.msg_data?.trans_id, 'trans_id phải tồn tại').toBeDefined();
            console.log('[PMH] trans_id:', response.msg_data?.trans_id);
        });

        baseTest(`[FPL] Mua gói plan_id=${plan_id} thành công`, async ({ request }) => {
            const response = await create_transaction_by_fpl(request, bearerToken.authToken, plan_id);
            console.log('[FPL] Response:', JSON.stringify(response, null, 2));

            expect(response, 'API phải trả về response').toBeDefined();
            expect(response.msg_data, `API FPL trả về null cho plan_id=${plan_id}`).not.toBeNull();
            expect(response.msg_data?.trans_id, 'trans_id phải tồn tại').toBeDefined();
            console.log('[FPL] trans_id:', response.msg_data?.trans_id);
        });
    });
});