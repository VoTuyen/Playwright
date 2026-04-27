/**
 * Định nghĩa tập trung các Platform ID dùng chung toàn dự án.
 * Việc sử dụng object này giúp tránh sai sót khi gõ phím (Typo) 
 * và dễ dàng bảo trì khi có sự thay đổi về naming convention.
 */
export const PLATFORM = {
    WEB: '_w',
    ANDROID: '_a',
    IOS: '_ios',
    BOX: '_box_sei21',
};

// Map ngược lại để lấy tên hiển thị nếu cần
export const PLATFORM_NAMES = {
    [PLATFORM.WEB]: 'Web Desktop',
    [PLATFORM.ANDROID]: 'Android Mobile',
    [PLATFORM.IOS]: 'iOS Mobile',
    [PLATFORM.BOX]: 'FPT Play Box',
};
