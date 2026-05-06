import { send_otp, validate_user, verify_OTP, login, device_limit_list, device_remove } from '../fixtures/loginFixture.js';
import fs from 'fs';
import path from 'path';

/**
 * Hàm xóa cache token của một số điện thoại
 */
export function clearTokenCache(phone) {
    const cacheFile = path.resolve(process.cwd(), '.auth', `token_${phone}.txt`);
    if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
        console.log(`[Cache] Đã xóa token cũ của ${phone} do hết hạn hoặc lỗi.`);
    }
}

export async function authenticateUser(request, phone, client_id, type, otp_code, headers, platform, forceRefresh = false) {
    const cacheDir = path.resolve(process.cwd(), '.auth');
    const cacheFile = path.resolve(cacheDir, `token_${phone}.txt`);

    // 1. Kiểm tra cache trước, nếu đã có token và không yêu cầu refresh thì dùng lại
    if (!forceRefresh && fs.existsSync(cacheFile)) {
        return fs.readFileSync(cacheFile, 'utf8');
    }

    try {
        const response_validate_user = await validate_user(request, phone, client_id, type, headers, platform);
        const verifyToken = response_validate_user.data?.verify_token;

        const response_sendOtp = await send_otp(request, phone, client_id, type, verifyToken, headers, platform);
        const response_verify_Otp = await verify_OTP(request, phone, client_id, type, otp_code, headers, platform);
        const verify_token_otp = response_verify_Otp.data?.verify_token;

        const response_login = await login(request, phone, client_id, verify_token_otp, headers, platform);
    
        let finalToken = '';

        if (response_login.error_code == 7) {
            const verify_token_device_limit_list = response_login.data.verify_token;
            const response_device_limit_list = await device_limit_list(request, verify_token_device_limit_list, headers, platform);
            
            const device_id = response_device_limit_list.data.devices[1]?.id || response_device_limit_list.data.devices[0]?.id;
            const verify_token_remove_device = response_device_limit_list.data.verify_token;

            const response_device_remove = await device_remove(request, device_id, verify_token_remove_device, headers, platform);
            const access_token = response_device_remove.data?.access_token;
            const access_token_type = response_device_remove.data?.access_token_type || 'Bearer';

            finalToken = `${access_token_type} ${access_token}`; 
        } else {
            const access_token = response_login.data?.access_token;
            const access_token_type = response_login.data?.access_token_type || 'Bearer';
            finalToken = `${access_token_type} ${access_token}`; 
        }

        // 2. Lưu token vừa lấy được vào file cache để các test khác dùng chung
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        if (finalToken && !finalToken.includes('undefined') && !finalToken.endsWith('null')) {
            fs.writeFileSync(cacheFile, finalToken);
        } else {
            // Nếu login không thành công (token null/undefined), đảm bảo xóa cache cũ
            clearTokenCache(phone);
        }

        return finalToken;
    } catch (error) {
        console.error(`[Auth Error] ${phone}:`, error.message);
        clearTokenCache(phone); // Xóa cache nếu có lỗi xảy ra trong quá trình auth
        throw error; 
    }   
}


