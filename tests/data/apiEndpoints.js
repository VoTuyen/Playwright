import dataLogins from "../data/loginData";
import { create_transaction_by_pmh } from "../fixtures/paymentFixture";

const API_BASE_URL = 'https://api-staging.fptplay.net/api/v7.1';

const endpoints = dataLogins.reduce((acc, {platform})=> {
    if (platform) {
        acc[platform] = {
            validate_user: `${API_BASE_URL}${platform}/account/otp/validate_user`,
            fetch_user_benefit: `${API_BASE_URL}${platform}/customergw/fetch_user_benefits`,
            send_otp: `${API_BASE_URL}${platform}/account/otp/send`,
            verify_otp: `${API_BASE_URL}${platform}/account/otp/verify`,
            login: `${API_BASE_URL}${platform}/account/user/login`,
            device_limit_list: `${API_BASE_URL}${platform}/account/device/limit_list`,
            device_remove: `${API_BASE_URL}${platform}/account/device/remove`,
            package: `${API_BASE_URL}${platform}/paymentgw/packages`,
            create_transaction_by_pmh: `${API_BASE_URL}${platform}/paymentgw/payment_hub/create_transaction`,
            create_transaction_by_FPL: `${API_BASE_URL}${platform}/paymentgw/foxpay/credit/create`
        }
    }
    return acc
}, {});

export default endpoints;
//export  {endpoints1};

