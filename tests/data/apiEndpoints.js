import dataLogins from "../data/loginData";


const API_BASE_URL = 'https://api-staging.fptplay.net/api/v7.1';
//const platform1 = '_w';

// const endpoints1 = {
//     validate_user: `${API_BASE_URL}${platform1}/account/otp/validate_user`,
//     //fetch_user_benefit: `${API_BASE_URL}${platform}/customergw/fetch_user_benefits`,
//     send_otp: `${API_BASE_URL}${platform1}/account/otp/send`,
//     verify_otp: `${API_BASE_URL}${platform1}/account/otp/verify`,
//     login: `${API_BASE_URL}${platform1}/account/user/login`
// };


const endpoints = dataLogins.reduce((acc, {platform})=> {
    if (platform) {
        acc[platform] = {
            validate_user: `${API_BASE_URL}${platform}/account/otp/validate_user`,
            fetch_user_benefit: `${API_BASE_URL}${platform}/customergw/fetch_user_benefits`,
            send_otp: `${API_BASE_URL}${platform}/account/otp/send`,
            verify_otp: `${API_BASE_URL}${platform}/account/otp/verify`,
            login: `${API_BASE_URL}${platform}/account/user/login`
        }
    }
    return acc
}, {});

export default endpoints;
//export  {endpoints1};

