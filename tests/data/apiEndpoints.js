
const API_BASE_URL = 'https://api-staging.fptplay.net/api/v7.1';
const platform = '_w';

const endpoints = {
    validate_user: `${API_BASE_URL}${platform}/account/otp/validate_user`,
    fetch_user_benefit: `${API_BASE_URL}${platform}/customergw/fetch_user_benefits`,
    send_otp: `${API_BASE_URL}${platform}/account/otp/send`,
};

export default endpoints;
