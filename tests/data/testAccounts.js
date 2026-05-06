/**
 * File tổng hợp toàn bộ các Account (Số điện thoại) dùng để Login 
 * và thực hiện test các chức năng trong toàn bộ dự án.
 * 
 * NGUYÊN TẮC: Mỗi spec file dùng 1 phone riêng để tránh conflict khi chạy song song.
 * 
 * Cách dùng: Import file này vào các file test hoặc data builder.
 * Ví dụ: import { testAccounts } from '../data/testAccounts.js';
 */

export const testAccounts = {
    // ==========================================
    // 1. TÀI KHOẢN DÙNG CHO CHỨC NĂNG LOGIN
    //    File: tests/pages/login/login.spec.js
    // ==========================================
    LOGIN_USER_1: {
        description: "Tài khoản thường, dùng cho các case login cơ bản",
        payload: {
            phone: '0974303989',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: 'SGH796959',
            platform: '_w'
        }
    },
    LOGIN_USER_2: {
        description: "Tài khoản phụ cho login",
        payload: {
            phone: '0565123451',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '056***3451',
            platform: '_a'
        }
    },

    // ==========================================
    // 2. TÀI KHOẢN DÙNG CHO CHECK_TRANSACTION
    //    File: tests/pages/payment/check_transaction.spec.js
    // ==========================================
    CHECK_TXN_USER: {
        description: "Tài khoản riêng cho check_transaction (tránh trùng với file khác)",
        payload: {
            phone: '0565123452',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '',
            platform: '_w'
        }
    },

    // ==========================================
    // 3. TÀI KHOẢN DÙNG CHO CREATE_TRANSACTION
    //    File: tests/pages/payment/create_transaction.spec.js
    // ==========================================
    CREATE_TXN_USER: {
        description: "Tài khoản riêng cho create_transaction",
        payload: {
            phone: '0565123453',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '',
            platform: '_w'
        }
    },

    // ==========================================
    // 4. TÀI KHOẢN DÙNG CHO CUSTOMER_INFO
    //    File: tests/pages/payment/customer_info.spec.js
    // ==========================================
    CUSTOMER_INFO_USER: {
        description: "Tài khoản riêng cho customer_info (có benefit để test đủ luồng)",
        payload: {
            phone: '0565123454',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '056***3454',
            platform: '_w'
        }
    },

    // ==========================================
    // 5. TÀI KHOẢN DÙNG CHO FETCH USER BENEFITS
    //    File: tests/pages/payment/fetch_user_benefits.spec.js
    // ==========================================
    BENEFIT_USER_1: {
        description: "Tài khoản 1 cho fetch_user_benefits",
        payload: {
            phone: '0974303989', // NOTE: Bạn có thể đổi SĐT khác ở đây
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: 'SGH796959',
            platform: '_w'
        }
    },
    BENEFIT_USER_2: {
        description: "Tài khoản 2 cho fetch_user_benefits",
        payload: {
            phone: '0565123451', // NOTE: Bạn có thể đổi SĐT khác ở đây
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '056***3451',
            platform: '_a'
        }
    },

    // ==========================================
    // 6. TÀI KHOẢN DÙNG CHO PACKAGE SCREEN
    //    File: tests/pages/payment/package_screen.spec.js
    // ==========================================
    PACKAGE_SCREEN_SA_USER: {
        description: "Tài khoản SA (Stand Alone) cho package_screen",
        payload: {
            phone: '0565123452', // NOTE: Bạn có thể đổi SĐT khác ở đây
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },
    PACKAGE_SCREEN_SUB_USER: {
        description: "Tài khoản SUB (có hợp đồng) cho package_screen",
        payload: {
            phone: '0974303989', // NOTE: Bạn có thể đổi SĐT khác ở đây
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },

    // ==========================================
    // 7. TÀI KHOẢN DÙNG CHO SUBSCRIPTION (6 phone riêng biệt)
    //    File: tests/pages/payment/subscription_upgrade.spec.js
    //    Mỗi phone phụ trách ~5-6 TC để 6 workers chạy song song
    // ==========================================
    SUBSCRIPTION_USER_1: {
        description: "Subscription Worker 1 — TC1 đến TC6",
        payload: {
            phone: '0565123455',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },
    SUBSCRIPTION_USER_2: {
        description: "Subscription Worker 2 — TC7 đến TC12",
        payload: {
            phone: '0565123457',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },
    SUBSCRIPTION_USER_3: {
        description: "Subscription Worker 3 — TC13 đến TC18",
        payload: {
            phone: '0565123458',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },
    SUBSCRIPTION_USER_4: {
        description: "Subscription Worker 4 — TC19 đến TC24",
        payload: {
            phone: '0565123459',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },
    SUBSCRIPTION_USER_5: {
        description: "Subscription Worker 5 — TC25 đến TC30",
        payload: {
            phone: '0565123411',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },
    SUBSCRIPTION_USER_6: {
        description: "Subscription Worker 6 — TC31 đến TC32",
        payload: {
            phone: '0565123412',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },

    // Alias cũ — giữ để không breaking change
    SUBSCRIPTION_USER: {
        description: "[Alias cũ] → Dùng SUBSCRIPTION_USER_1 thay thế",
        payload: {
            phone: '0565123455',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            platform: '_w'
        }
    },

    // ==========================================
    // GIỮ LẠI CÁC ALIAS CŨ để không breaking change
    // ==========================================
    PURCHASE_USER_HAS_BENEFIT: {
        description: "[Alias cũ] → Dùng CUSTOMER_INFO_USER thay thế",
        payload: {
            phone: '0565123454',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '056***3454',
            platform: '_w'
        }
    },
    PURCHASE_USER_NO_BENEFIT: {
        description: "[Alias cũ] → Dùng CHECK_TXN_USER hoặc CREATE_TXN_USER thay thế",
        payload: {
            phone: '0565123452',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '',
            platform: '_w'
        }
    },
    PAYMENT_NEW_USER: {
        description: "[Alias cũ] Tài khoản phát sinh giao dịch Payment mới",
        payload: {
            phone: '0986745978',
            client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
            type: 'login_fpl',
            otp_code: '999999',
            benefit_phone: '',
            platform: '_w'
        }
    }
};

export default testAccounts;
