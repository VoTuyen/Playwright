import { send_otp, validate_user, verify_OTP, login, device_limit_list, device_remove } from '../fixtures/loginFixture.js';

export async function authenticateUser(request, phone, client_id, type, otp_code, headers, platform) {
    try {
        const response_validate_user = await validate_user(request, phone, client_id, type, headers, platform);
        const verifyToken = response_validate_user.data.verify_token;

        const response_sendOtp = await send_otp(request, phone, client_id, type, verifyToken, headers, platform);
        const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers, platform);
        const verify_token_otp = response_verify_Otp.data.verify_token;

        const response_login = await login(request, phone, client_id, verify_token_otp, headers, platform);
    
        if (response_login.error_code == 7){
            const verify_token_device_limit_list = response_login.data.verify_token;

            const response_device_limit_list = await device_limit_list(request, verify_token_device_limit_list, headers, platform);
            const device_id = response_device_limit_list.data.devices[0].id;
            console.log("Device ID to remove: ", device_id);
            const verify_token_remove_device = response_device_limit_list.data.verify_token;
            console.log("Verify token for device removal: ", verify_token_remove_device);

            const response_device_remove = await device_remove(request, device_id, verify_token_remove_device, headers, platform);
            const access_token = response_device_remove.data.access_token;
            console.log("Access token after device removal: ", access_token);
            const access_token_type = response_device_remove.data.access_token_type;

            return `${access_token_type} ${access_token}`; 

        } else {
            const access_token = response_login.data.access_token;
            const access_token_type = response_login.data.access_token_type;
            return `${access_token_type} ${access_token}`; 
        }
    } catch (error) {
        console.error("Error during authentication: ", error);
        throw error; // Ném lỗi ra ngoài nếu có vấn đề
    }   
}
