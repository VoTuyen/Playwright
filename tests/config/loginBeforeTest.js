
let authToken = ''

beforeAll(async (request, headers) => {
    const response_validate_user = await validate_user(request, phone, client_id, type, headers)
    verifyToken = response_validate_user.data.verify_token

    const response_sendOtp = await send_otp(request, phone, client_id, type, verifyToken, headers)
    const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers)
    verify_token_otp = response_verify_Otp.data.verify_token

    const response_login = await login(request, phone, client_id, verify_token_otp, headers)
    access_token = response_login.data.access_token
    access_token_type = response_login.data.access_token_type
    authToken = `${access_token_type} ${access_token}`
});
