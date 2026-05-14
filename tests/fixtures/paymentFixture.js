import { PaymentApi } from '../api/paymentApi.js';
import endpoints from '../constants/apiEndpoints.js';
import { PLATFORM } from '../constants/platforms.js';

// Khởi tạo instance của PaymentApi để dùng chung trong fixture
const getApi = (request) => new PaymentApi(request);

export async function get_benefitUser(request, authToken, platform) {
    return await getApi(request).getBenefitUser(authToken, platform);
}

export async function package_screen(request, authToken, platform, extraHeaders = {}, paymentVersion = null) {
    return await getApi(request).getPackageScreen(authToken, platform, extraHeaders, paymentVersion);
}

export async function get_user_subscriptions(request, authToken, platform) {
    return await getApi(request).getUserSubscriptions(authToken, platform);
}

// Bổ sung để tương thích với validate_subscription_upgrade.js
export async function get_package_detail(request, authToken, platform, plan_type) {
    return await getApi(request).getPackageDetail(authToken, platform, plan_type);
}

export async function get_package_preview(request, authToken, platform, package_type) {
    return await getApi(request).getPackagePreview(authToken, platform, package_type);
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOWS / BUSINESS LOGIC
// ─────────────────────────────────────────────────────────────────────────────

export async function try_create_transaction(request, authToken, platform, plan_type) {
    const api = getApi(request);
    const response = await api.getPackageDetail(authToken, platform, plan_type);
    
    const isBlocked = response?.msg_data?.type_display === 7;
    console.log(`[Flow] Checking Purchase Permission: ${isBlocked ? 'BLOCKED' : 'ALLOWED'}`);

    return {
        blocked:      isBlocked,
        type_display: response?.msg_data?.type_display ?? null,
        plan_id:      response?.msg_data?.plan_id ?? null,
        payment_link: response?.msg_data?.payment_url ?? null,
        raw:          response,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY COMPATIBILITY (Các hàm hỗ trợ tương thích ngược)
// ─────────────────────────────────────────────────────────────────────────────

export async function create_transaction_by_pmh(request, authToken, plan_id) {
    const data = {
        number: "5200000000002235", cvv: "111", month: "12", year: "27",
        plan_id: plan_id, payment_gateway_code: "INTERNATIONAL",
        display_mode: "REDIRECT_URL", return_url: "https://dev.fptplay.vn/dich-vu/thanh-toan/foxpay_credit"
    };
    const headers = { 'X-DID': '20:39:4E:A8:85:99', 'Content-Type': 'application/json' };
    return await getApi(request).createTransaction(authToken, PLATFORM.WEB, data, headers);
}

export async function create_transaction_by_fpl(request, authToken, plan_id) {
    const data = {
        card_number: "5200000000002235", card_cvv: "111", card_expiration_month: "12", card_expiration_year: "27",
        plan_id: plan_id, return_url: "https://dev.fptplay.vn/dich-vu/thanh-toan/foxpay_credit"
    };
    const headers = { 'X-DID': '20:39:4E:A8:85:99', 'Content-Type': 'application/json' };
    return await getApi(request).createTransaction(authToken, PLATFORM.WEB, data, headers);
}


export async function survey(request, authToken, phone) {
    const data = {
        options: [{ id: 11, note: "" }],
        phone: phone,
        question_id: 4
    };
    return await getApi(request).survey(authToken, "_w", data);
}

export async function survey_customer_info(request, authToken, payload) {
    return await getApi(request).surveyCustomerInfo(authToken, "_w", payload);
}

export async function check_transaction(request, authToken, platform, trans_id) {
    // Lưu ý: check_transaction API thường dùng để check trạng thái sau thanh toán
    return await getApi(request).checkTransaction(platform, trans_id, authToken);
}

export async function clear_user_data(request, phone) {
    const response = await request.post('https://staging-api-payment.fptplay.net/api/v1/clear_tester_data', {
        data: { phone: [phone] }
    });
    return await response.json();
}

export async function get_purchased_service(request, authToken, platform = '_w') {
    return await getApi(request).getPurchasedService(authToken, platform);
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}