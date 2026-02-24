import dataLogins from "../data/loginData";

const API_BASE_URL = 'https://api-staging.fptplay.net/api/v7.1';

const endpoints = dataLogins.reduce((acc, {platform})=> {
    if (platform) {
        acc[platform] = {
            validate_user: `${API_BASE_URL}${platform}/account/otp/validate_user`,
            fetch_user_benefit: `${API_BASE_URL}${platform}/customergw/fetch_user_benefits`,
            send_otp: `${API_BASE_URL}${platform}/account/otp/send`,
            verify_otp: `${API_BASE_URL}${platform}/account/otp/verify`,
            login: `${API_BASE_URL}${platform}/account/user/login`,
            package: `${API_BASE_URL}${platform}/paymentgw/packages`
        }
    }
    return acc
}, {});

export default endpoints;
//export  {endpoints1};

