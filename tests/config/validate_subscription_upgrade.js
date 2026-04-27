import { authenticateUser } from './authConfig.js';
import {
    create_transaction_by_pmh,
    create_transaction_by_fpl,
    clear_user_data,
    get_package_detail,
    get_user_subscriptions,
    try_create_transaction, delay,
    package_screen
} from '../fixtures/paymentFixture.js';
import { init, close } from '../fixtures/browserFixture.js';

export async function validate_subscription_upgrade(request, page_null, testCase) {
    const { account, current_package, new_package, expected } = testCase;
    const { phone, client_id, platform } = account;

    // ── Step 1: Login → lấy bearer token ──────────────────────────────────────
    const headers = { 'X-DID': '10:39:4E:A8:85:32', 'Content-Type': 'application/json' };
    const authToken = await authenticateUser(
        request, phone, client_id, 'login_fpl', '999999', headers, platform
    );
    console.log('[Step 1] Login thành công, authToken:', authToken?.substring(0, 30) + '...');

    // ── Step 2: Clear data → reset trạng thái gói ─────────────────────────────
    const clearResult = await clear_user_data(request, phone);
    console.log('[Step 2] clear_user_data:', JSON.stringify(clearResult));

    // ── Step 3: Mua gói đang có (Gói A) → thanh toán thành công ─────────────────────────────
    console.log(`[Step 3] Tạo transaction gói A: ${current_package.name} (plan_id: ${current_package.plan_id})`);
    const txA = await create_transaction_by_fpl(request, authToken, current_package.plan_id);
    console.log(txA);
    const paymentLinkA = txA?.msg_data?.payment_url;
    console.log('[Step 3] paymentLink gói A:', paymentLinkA);
    
    if (paymentLinkA) {
        let browserPageA = await init();
        await browserPageA.goto(paymentLinkA);
        await browserPageA.waitForTimeout(25000);
        await close();  
    } else {
        console.error('[Step 3] FAILED: Không lấy được Link thanh toán gói A.');
        console.error('[DEBUG] API Response txA:', JSON.stringify(txA, null, 2));
    }

    // ── Step 4: GET package screen gói nhỏ (hard data) → lấy btn_buy_pack ───────────────────
    console.log(`[Step 4] Gọi package_screen: plan_type=${new_package.plan_type}`);
    const packageDetailRes = await package_screen(
        request, authToken, platform, new_package.plan_type
    );
    const btnBuyPack = packageDetailRes?.msg_data?.subscriber_group?.[expected.btn_buy_pack_group_index]
        ?.packages_list?.[expected.btn_buy_pack_list_index]?.btn_buy_pack;
    console.log(`expected nhóm: ${expected.btn_buy_pack_group_index}`)
    console.log(`expected gói: ${expected.btn_buy_pack_list_index}`)
    console.log('[Step 4] btn_buy_pack của gói B:', btnBuyPack);

    // ── Step 5: Thử tạo transaction gói B ─────────────────────────────────────
    console.log(`[Step 5] Thử mua gói B: ${new_package.name} (plan_id: ${new_package.plan_id})`);
    const txB = await try_create_transaction(request, authToken, platform, new_package.plan_type);
    console.log('[Step 5] txB.blocked:', txB.blocked, '| type_display:', txB.type_display, '| trans_id:', txB.trans_id);

    //await delay(30000);

    // ── Step 6: Nếu không bị block → tạo giao dịch thật → thanh toán → verify subscription ─────────
    let subscriptionRes = null;
    if (!txB.blocked) {
        console.log('[Step 6] Gói B được phép mua (!txB.blocked) → Tiến hành TẠO GIAO DỊCH mới...');

        // Gọi hàm tạo giao dịch bằng FPL
        const realTxB = await create_transaction_by_fpl(request, authToken, new_package.plan_id);
        const paymentLinkB = realTxB?.msg_data?.payment_url;
        console.log(paymentLinkB);

        if (paymentLinkB) {
            console.log('[Step 6] Có link thanh toán gói B:', paymentLinkB);
            let browserPageB = await init();
            await browserPageB.goto(paymentLinkB);
            await browserPageB.waitForTimeout(25000); // Chờ cho thanh toán hoàn tất
            await close();
        } else {
            console.log('[Step 6] Lỗi: KHÔNG LẤY ĐƯỢC payment_url cho gói B. Log API response:', realTxB);
        }
    } else {
        console.log('[Step 6] Gói B bị Block -> Bỏ qua khâu tạo giao dịch thanh toán.');
    }

    subscriptionRes = await get_user_subscriptions(request, authToken, platform);

    // 👇 Log full response để xác định field path cho assertion
    console.log('[Step 6] user_subscriptions full response:', subscriptionRes);
    const planID_subscription = subscriptionRes?.list?.[0]?.plan_id;
    console.log('[Step 6] planID_subscription:', planID_subscription);
    //console.log(JSON.stringify(subscriptionRes, null, 2));

    return {
        authToken,
        packageDetailRes,
        btnBuyPack,
        txB,
        subscriptionRes,
        planID_subscription
    };
}
