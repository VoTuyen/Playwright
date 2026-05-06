import { test as baseTest, expect } from '../../fixtures/loginFixture.js';
import { subscription_upgrade_data } from '../../data/subscriptionData.js';
import { validate_subscription_upgrade } from '../../config/validate_subscription_upgrade.js';
import { init, close } from '../../fixtures/browserFixture.js';
import { testAccounts } from '../../data/testAccounts.js';

/**
 * CHIẾN LƯỢC SONG SONG:
 * - 32 TC được chia thành 6 nhóm, mỗi nhóm dùng 1 phone riêng biệt
 * - Mỗi nhóm chạy SERIAL bên trong (để tránh tranh nhau subscription state)
 * - 6 nhóm chạy SONG SONG với nhau qua 6 workers → tiết kiệm ~5x thời gian
 */
const SUBSCRIPTION_PHONES = [
    testAccounts.SUBSCRIPTION_USER_1.payload.phone, // 0565123455 → TC1-6
    testAccounts.SUBSCRIPTION_USER_2.payload.phone, // 0565123457 → TC7-12
    testAccounts.SUBSCRIPTION_USER_3.payload.phone, // 0565123458 → TC13-18
    testAccounts.SUBSCRIPTION_USER_4.payload.phone, // 0565123459 → TC19-24
    testAccounts.SUBSCRIPTION_USER_5.payload.phone, // 0565123411 → TC25-30
    testAccounts.SUBSCRIPTION_USER_6.payload.phone, // 0565123412 → TC31-32
];

const BATCH_SIZE = Math.ceil(subscription_upgrade_data.length / SUBSCRIPTION_PHONES.length);

// Chia 32 TC thành 6 nhóm
const groups = SUBSCRIPTION_PHONES.map((phone, groupIndex) => ({
    phone,
    tests: subscription_upgrade_data.slice(groupIndex * BATCH_SIZE, (groupIndex + 1) * BATCH_SIZE)
}));

groups.forEach(({ phone, tests }, groupIndex) => {
    // Mỗi group là 1 describe chạy SERIAL bên trong
    baseTest.describe(`Subscription Group ${groupIndex + 1} (${phone})`, () => {
        baseTest.describe.configure({ mode: 'serial' });

        tests.forEach((testCase) => {
            // Override phone từ CSV bằng phone của nhóm
            const tc = { ...testCase, account: { ...testCase.account, phone } };

            baseTest.describe(`[TC${tc.tcs_id}] ${tc.tcs_description}`, () => {
                baseTest('Bắt đầu testcase', async ({ request }) => {
                    baseTest.setTimeout(150000);

                    const { btnBuyPack, txB, subscriptionRes, planID_subscription } =
                        await validate_subscription_upgrade(request, null, tc);

                    // ── Assert 1: btn_buy_pack từ /packages/detail ────────────────
                    console.log(`[Assert 1] btn_buy_pack: ${btnBuyPack} | expected: ${tc.expected.btn_buy_pack}`);
                    expect(btnBuyPack).toBe(tc.expected.btn_buy_pack);

                    // ── Assert 2: Transaction gói B có bị block không ─────────────
                    const expectedBlocked = tc.expected.purchase_permission === 'Block';
                    console.log(`[Assert 2] txB.blocked: ${txB.blocked} | expected Blocked: ${expectedBlocked}`);
                    expect(txB.blocked).toBe(expectedBlocked);

                    // ── Assert 3: Subscription lưu đúng gói ──────────────────────
                    console.log(`[Assert 3] plan_id: ${planID_subscription} | expected: ${tc.expected.subscription_plan_id}`);
                    expect(planID_subscription).toBe(tc.expected.subscription_plan_id);
                });
            });
        });
    });
});
