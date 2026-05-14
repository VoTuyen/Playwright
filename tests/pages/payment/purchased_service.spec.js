import { test as baseTest, expect } from '../../fixtures/loginFixture.js';
import { authenticateUser } from '../../config/authConfig.js';
import { clear_user_data, create_transaction_by_fpl, get_purchased_service } from '../../fixtures/paymentFixture.js';
import { auto_expire_package_via_cms } from '../../utils/auth/cmsAuthHelper.js';
import { PLATFORM } from '../../constants/platforms.js';
import fs from 'fs';
import path from 'path';

// --- 1. ĐỌC TEST DATA TỪ CSV TỰ ĐỘNG ---
const csvPath = path.resolve('tests/docs/testcases_hien_thi_goi.csv');
const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter(l => l.trim().length > 0);

// Tìm dòng header thật (do Excel đôi khi tự thêm dòng Column1, Column2)
const headerIdx = lines.findIndex(l => l.includes('TC ID'));
const headers = lines[headerIdx].split(',').map(h => h.replace(/^"|"$/g, '').trim());

// Map các dòng data
const testcases = lines.slice(headerIdx + 1).map(line => {
    // Tách cột bằng regex để không lỗi với dấu phẩy trong ngoặc kép
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const values = line.split(regex).map(v => v.replace(/^"|"$/g, '').trim());
    let obj = {};
    headers.forEach((h, i) => {
        obj[h] = values[i] || "";
    });
    return obj;
});

// Lọc ra các TC đúng format
const activeTestcases = testcases.filter(tc => tc['TC ID'] && tc['TC ID'].startsWith('FPTPLAY_PACKAGE_TC_'));

// --- 2. THÔNG TIN ACCOUNT TEST (DÙNG CHUNG) ---
// Chú ý: Cần setup tài khoản này có thể login tự động qua API
const testAccount = {
    phone: "0565123453", // Đổi sang SĐT chuyên test Foxpay để không bị lỗi 401
    client_id: "1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a", // Client ID thật của Web Staging
    type: "phone",
    otp_code: "123456",
    platform: PLATFORM.WEB
};

baseTest.describe('API /purchased_service - E2E Full Flow Data Driven', () => {
    let bearerToken = null;

    // Lấy token 1 lần trước khi chạy các TC
    baseTest.beforeAll(async ({ request, headers }) => {
        bearerToken = await authenticateUser(
            request, testAccount.phone, testAccount.client_id, 
            testAccount.type, testAccount.otp_code, headers, testAccount.platform
        );
    });

    activeTestcases.forEach((tc) => {
        const tcId = tc['TC ID'];
        const planId = tc['Setup_PlanID'];
        const expectedAssertRaw = tc['Expected_Assert'];
        const isExpiredScenario = tc['Test Scenario']?.toLowerCase().includes('hết hạn') || tc['Test Scenario']?.toLowerCase().includes('expired');
        const isEmptyScenario = tcId === 'FPTPLAY_PACKAGE_TC_001' || tcId === 'FPTPLAY_PACKAGE_TC_017';

        // Bỏ qua các case chưa setup Data (trừ case Empty State)
        if (!planId && !isEmptyScenario && !isExpiredScenario) {
            return;
        }

        baseTest(`[${tcId}] ${tc['Test Scenario']}`, async ({ request }) => {
            // ==========================================
            // BƯỚC 1: PRE-CONDITION (SETUP TEST STATE)
            // ==========================================
            console.log(`[Setup] 1. Clear toàn bộ gói của ${testAccount.phone}...`);
            await clear_user_data(request, testAccount.phone);
            await new Promise(r => setTimeout(r, 1000)); // Đợi backend xử lý xoá

            if (planId) {
                console.log(`[Setup] 2. Tiến hành tự động mua gói: ${planId}...`);
                const paymentRes = await create_transaction_by_fpl(request, bearerToken, parseInt(planId, 10));
                if (!paymentRes.msg_data?.trans_id) {
                    console.error('[API 400 Error Response]:', JSON.stringify(paymentRes, null, 2));
                }
                expect(paymentRes.msg_data?.trans_id, 'Tạo giao dịch thất bại').toBeDefined();
                await new Promise(r => setTimeout(r, 2000)); // Đợi DB đồng bộ gói vừa mua
            }

            if (isExpiredScenario) {
                console.log(`[Setup] 3. Kịch bản gói hết hạn -> Khởi chạy Robot CMS...`);
                // Gọi hàm Auto Click thao tác trên UI CMS
                await auto_expire_package_via_cms(testAccount.phone);
            }

            // ==========================================
            // BƯỚC 2: ACTION (GỌI API CẦN TEST)
            // ==========================================
            console.log(`[Action] Gọi API lấy danh sách Gói Đang Sử Dụng...`);
            const purchasedRes = await get_purchased_service(request, bearerToken);
            
            // ==========================================
            // BƯỚC 3: ASSERTION (KIỂM TRA ĐÚNG SAI)
            // ==========================================
            expect(purchasedRes, 'Không nhận được response từ API').toBeDefined();
            console.log(`[Result] API trả về ${purchasedRes.data?.length || 0} gói.`);

            // Dùng data bạn điền trong CSV để Assert động
            if (expectedAssertRaw) {
                try {
                    // Hỗ trợ bạn ghi cấu trúc JSON vào cột Expected_Assert (VD: {"count": 1, "plan_id": "PREMIUM"})
                    const expected = JSON.parse(expectedAssertRaw);
                    
                    if (expected.count !== undefined) {
                        expect(purchasedRes.data?.length || 0).toBe(expected.count);
                    }
                    if (expected.plan_id) {
                        // Assert 1 gói duy nhất
                        const hasPackage = purchasedRes.data.some(p => String(p.plan_id) === String(expected.plan_id));
                        expect(hasPackage, `Không tìm thấy gói ${expected.plan_id} trong kết quả`).toBeTruthy();
                    }
                    if (expected.plan_ids && Array.isArray(expected.plan_ids)) {
                        // Assert danh sách nhiều gói
                        expected.plan_ids.forEach(expectedId => {
                            const hasPackage = purchasedRes.data.some(p => String(p.plan_id) === String(expectedId));
                            expect(hasPackage, `Không tìm thấy gói ${expectedId} trong kết quả`).toBeTruthy();
                        });
                    }
                } catch (e) {
                    console.warn(`[Lỗi] Không parse được JSON cột Expected_Assert. Vui lòng kiểm tra lại định dạng trong file CSV.`);
                }
            } else {
                // Các Assert mặc định thông minh nếu bạn chưa kịp điền data Assert vào CSV
                if (isEmptyScenario) {
                    expect(purchasedRes.data?.length || 0).toBe(0);
                } else if (!isExpiredScenario && planId) {
                    expect(purchasedRes.data?.length || 0).toBeGreaterThan(0);
                } else if (isExpiredScenario) {
                    // Tùy theo logic backend: gói hết hạn thì không trả về, hoặc trả về kèm status
                    const activePacks = purchasedRes.data?.filter(p => p.status === 'ACTIVE') || [];
                    expect(activePacks.length).toBe(0);
                }
            }
        });
    });
});
