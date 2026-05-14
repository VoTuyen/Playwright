import { PLATFORM } from './platforms.js';

// Sử dụng Domain và Version từ biến môi trường
const API_DOMAIN = process.env.API_DOMAIN || 'https://api-staging.fptplay.net';
const API_VERSION = process.env.API_VERSION || 'v7.1';

const API_BASE_URL = `${API_DOMAIN}/api/${API_VERSION}`;

// Sử dụng danh sách platform từ PLATFORM constant
const SUPPORTED_PLATFORMS = Object.values(PLATFORM);

const endpoints = SUPPORTED_PLATFORMS.reduce((acc, platform) => {
    acc[platform] = {
        validate_user: `${API_BASE_URL}${platform}/account/otp/validate_user`,
        fetch_user_benefit: `${API_BASE_URL}${platform}/customergw/fetch_user_benefits`,
        send_otp: `${API_BASE_URL}${platform}/account/otp/send`,
        verify_otp: `${API_BASE_URL}${platform}/account/otp/verify`,
        login: `${API_BASE_URL}${platform}/account/user/login`,
        device_limit_list: `${API_BASE_URL}${platform}/account/device/limit_list`,
        device_remove: `${API_BASE_URL}${platform}/account/device/remove`,
        package: `${API_BASE_URL}${platform}/paymentgw/packages`,
        package_detail: `${API_BASE_URL}${platform}/paymentgw/packages/detail`,
        package_preview: `${API_BASE_URL}${platform}/paymentgw/packages/get_packages_preview`,
        create_transaction_by_pmh: `${API_BASE_URL}${platform}/paymentgw/payment_hub/create_transaction`,
        create_transaction_by_fpl: `${API_BASE_URL}${platform}/paymentgw/foxpay/credit/create`,
        check_transaction: `${API_BASE_URL}${platform}/paymentgw/payment_hub/check_transaction`,
        user_subscriptions: `${API_BASE_URL}${platform}/paymentgw/subscription/user_subscriptions`,
        survey: `${API_BASE_URL}${platform}/paymentgw/survey/customer-info`,
        clear_user_data: `https://staging-api-payment.fptplay.net/api/v1/clear_tester_data`,
        purchased_service: `${API_BASE_URL}${platform}/paymentgw/purchased_service`
    };
    return acc;
}, {});

export default endpoints;
