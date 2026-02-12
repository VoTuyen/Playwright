import { send_otp, validate_user, verify_OTP, login } from '../fixtures/loginFixture.js';

export async function authenticateUser(request, phone, client_id, type, otp_code, headers, platform) {
    try {
        const response_validate_user = await validate_user(request, phone, client_id, type, headers, platform);
            const verifyToken = response_validate_user.data.verify_token;

            const response_sendOtp = await send_otp(request, phone, client_id, type, verifyToken, headers, platform);
            const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers, platform);
            const verify_token_otp = response_verify_Otp.data.verify_token;

            const response_login = await login(request, phone, client_id, verify_token_otp, headers, platform);
            const access_token = response_login.data.access_token;
            const access_token_type = response_login.data.access_token_type;
            return `${access_token_type} ${access_token}`; // Lưu token
    } catch (error) {
        console.error("Error during authentication: ", error);
        throw error; // Ném lỗi ra ngoài nếu có vấn đề
    }   
}
