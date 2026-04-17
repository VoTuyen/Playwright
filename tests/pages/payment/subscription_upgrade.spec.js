import { test as baseTest, expect } from '../../fixtures/loginFixture.js';
import { subscription_upgrade_data } from '../../data/subscriptionData.js';
import { validate_subscription_upgrade } from '../../config/validate_subscription_upgrade.js';
import { init, close } from '../../fixtures/browserFixture.js';

subscription_upgrade_data.forEach((testCase) => {
    baseTest.describe(`[TC${testCase.tcs_id}] ${testCase.tcs_description}`, () => {

        baseTest('Bắt đầu testcase', async ({ request }) => {
            baseTest.setTimeout(150000); // Custom timeout cực lớn (2 phút rưỡi) cho spec này vì phải chờ payment 2 lần

            const { btnBuyPack, txB, subscriptionRes, planID_subscription } =
                await validate_subscription_upgrade(request, null, testCase);

            // ── Assert 1: btn_buy_pack từ /packages/detail ───────────────────────
            console.log(`[Assert 1] Verify btn Mua ngay taị màn hình Gói dịch vụ: btn_buy_pack: ${btnBuyPack} | expected: ${testCase.expected.btn_buy_pack}`);
            expect(btnBuyPack).toBe(testCase.expected.btn_buy_pack);

            // ── Assert 2: Transaction gói B có bị block không ───────────────────
            const expectedBlocked = testCase.expected.purchase_permission === 'Block';
            console.log(`[Assert 2] Verify trạng thái giao dịch: txB.blocked: ${txB.blocked} | expected Blocked: ${expectedBlocked}`);
            expect(txB.blocked).toBe(expectedBlocked);

            // ── Assert 3: Verify subscription lưu đúng gói (Dạng Single Object Item) ───
            const savedPlanId = planID_subscription;
            console.log(`[Assert 3] Verify subscription gói dịch vụ sau khi thanh toán: plan_id: ${savedPlanId} | expected: ${testCase.expected.subscription_plan_id}`);
            expect(savedPlanId).toBe(testCase.expected.subscription_plan_id);
        });
    });
});
