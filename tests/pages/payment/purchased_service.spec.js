import { test as baseTest, expect } from '../../fixtures/loginFixture.js';
import { authenticateUser } from '../../config/authConfig.js';
import { clear_user_data, create_transaction_by_fpl, get_purchased_service } from '../../fixtures/paymentFixture.js';
import { auto_expire_package_via_cms } from '../../utils/auth/cmsAuthHelper.js';
import { PLATFORM } from '../../constants/platforms.js';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

// --- 1. ĐỌC TEST DATA TỪ CSV TỰ ĐỘNG ---
const csvPath = path.resolve('tests/docs/testcases_hien_thi_goi.csv');
const workbook = XLSX.readFile(csvPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Đọc dữ liệu từ dòng 2 (range: 1) để bỏ qua dòng header giả (Column1, Column2)
const testcases = XLSX.utils.sheet_to_json(sheet, { range: 1 });

// Lọc ra các TC đúng format
const activeTestcases = testcases.filter(tc => tc['TC ID'] && tc['TC ID'].startsWith('FPTPLAY_PACKAGE_TC_'));

// --- 2. THÔNG TIN ACCOUNT TEST (DÙNG CHUNG) ---
// Chú ý: Cần setup tài khoản này có thể login tự động qua API
const testAccount = {
    phone: "0565123453", // Đổi sang SĐT chuyên test Foxpay để không bị lỗi 401
    client_id: "1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a", // Client ID thật của Web Staging
    type: 'login_fpl',
    otp_code: '999999',
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

        baseTest(`[${tcId}] ${tc['Test Scenario']}`, async ({ request, page }) => {
            baseTest.setTimeout(90000); // Tăng timeout lên 90s vì có nhiều bước wait và polling
            // ==========================================
            // BƯỚC 1: PRE-CONDITION (SETUP TEST STATE)
            // ==========================================
            console.log(`[Setup] 1. Clear toàn bộ gói của ${testAccount.phone}...`);
            const clearRes = await clear_user_data(request, testAccount.phone);
            console.log(`[Setup] Clear Result:`, JSON.stringify(clearRes));
            await new Promise(r => setTimeout(r, 5000)); // Đợi backend xử lý xoá hoàn toàn

            if (planId) {
                console.log(`[Setup] 2. Tiến hành tự động mua gói: ${planId}...`);
                // Hỗ trợ cả dấu phẩy và dấu chấm phẩy
                const planIds = String(planId).split(/[;,]/).map(id => id.trim()).filter(id => id.length > 0);

                for (const id of planIds) {
                    console.log(`-> Đang mua gói ID: ${id}`);
                    const paymentRes = await create_transaction_by_fpl(request, bearerToken, parseInt(id, 10));
                    console.log(paymentRes);
                    if (!paymentRes.msg_data?.trans_id) {
                        console.error(`[API 400 Error Response cho gói ${id}]:`, JSON.stringify(paymentRes, null, 2));
                    }
                    expect(paymentRes.msg_data?.trans_id, `Tạo giao dịch cho gói ${id} thất bại`).toBeDefined();

                    // 👉 THÊM BƯỚC CLICK LINK THANH TOÁN
                    if (paymentRes.msg_data?.payment_url) {
                        console.log(`-> Đang mở link thanh toán: ${paymentRes.msg_data.payment_url}`);
                        await page.goto(paymentRes.msg_data.payment_url);
                        console.log(`-> Đã mở link thanh toán bằng trình duyệt.`);
                        console.log(`-> Đợi 5 giây để trang thanh toán xử lý...`);
                        await new Promise(r => setTimeout(r, 5000));
                    }

                    // 👉 THÊM DELAY GIỮA CÁC LẦN MUA
                    console.log(`-> Đợi 3 giây trước khi mua gói tiếp theo...`);
                    await new Promise(r => setTimeout(r, 5000));
                }
                await new Promise(r => setTimeout(r, 20000)); // Đợi DB đồng bộ gói vừa mua
            }

            if (isExpiredScenario) {
                console.log(`[Setup] 3. Kịch bản gói hết hạn -> Khởi chạy Robot CMS...`);
                // Gọi hàm Auto Click thao tác trên UI CMS
                await auto_expire_package_via_cms(testAccount.phone);
            }

            // ==========================================
            // BƯỚC 2: ACTION (GỌI API CẦN TEST)
            // ==========================================
            console.log(`[Action] Gọi API lấy danh sách Gói Đang Sử Dụng (Polling)...`);
            let purchasedRes;
            const maxRetries = 5;
            for (let i = 0; i < maxRetries; i++) {
                purchasedRes = await get_purchased_service(request, bearerToken);
                console.log(purchasedRes)
                console.log(`-> Lần ${i + 1}: API trả về ${purchasedRes.msg_data?.packages?.length || 0} gói.`);

                // Nếu là kịch bản mong đợi có gói (không phải Empty State) và đã có gói thì break
                if (!isEmptyScenario && (purchasedRes.msg_data?.packages?.length || 0) > 0) {
                    break;
                }
                // Nếu là kịch bản mong đợi KHÔNG có gói (Empty State), thì không cần loop
                if (isEmptyScenario) {
                    break;
                }

                console.log(`-> Chưa thấy gói nào, đợi thêm 5s...`);
                await new Promise(r => setTimeout(r, 3000));
            }

            // ==========================================
            // BƯỚC 3: ASSERTION (KIỂM TRA ĐÚNG SAI)
            // ==========================================
            expect(purchasedRes, 'Không nhận được response từ API').toBeDefined();
            console.log(`[Result] API trả về ${purchasedRes.data?.length || 0} gói.`);

            // Dùng data bạn điền trong CSV để Assert động
            if (expectedAssertRaw) {
                console.log(`[Assert] Chuỗi Expected_Assert thô: "${expectedAssertRaw}"`);
                let expected = null;
                try {
                    // Dùng Regex để bóc tách phần JSON nằm trong cặp dấu { }
                    const jsonMatch = expectedAssertRaw.match(/\{.*\}/);
                    const cleanJson = jsonMatch ? jsonMatch[0] : expectedAssertRaw.trim();
                    // Tự động chuẩn hóa các ký tự nháy kép thông minh từ Excel/CSV
                    const normalizedJson = cleanJson.replace(/[“”]/g, '"');
                    expected = JSON.parse(normalizedJson);
                } catch (e) {
                    throw new Error(`[Lỗi] Không parse được JSON cột Expected_Assert ("${expectedAssertRaw}"). Vui lòng kiểm tra lại định dạng trong file CSV. Chi tiết: ${e.message}`);
                }

                // Tách phần Assert ra ngoài try-catch để nếu fail thì Playwright báo đúng lỗi
                if (expected.count !== undefined) {
                    expect(purchasedRes.msg_data?.packages?.length || 0).toBe(expected.count);
                }
                if (expected.plan_id) {
                    // Assert 1 gói duy nhất
                    const hasPackage = purchasedRes.msg_data?.packages?.some(p => String(p.plan_id) === String(expected.plan_id));
                    expect(hasPackage, `Không tìm thấy gói ${expected.plan_id} trong kết quả`).toBeTruthy();
                }

                // Hỗ trợ cả plan_ids và plan_type (để tương thích với CSV)
                const planIdsToCheck = expected.plan_ids || expected.plan_type;
                if (planIdsToCheck) {
                    const actualPlanTypes = purchasedRes.msg_data?.packages?.map(p => String(p.plan_type)) || [];

                    console.log(`[Assert] Danh sách plan_type thực tế:`, actualPlanTypes);
                    console.log(`[Assert] Danh sách plan_type mong đợi:`, planIdsToCheck);

                    // Chuẩn hóa planIdsToCheck thành Array để kiểm tra đồng bộ (hỗ trợ cả string lẻ và array)
                    const expectedArray = Array.isArray(planIdsToCheck) 
                        ? planIdsToCheck.map(String) 
                        : [String(planIdsToCheck)];

                    // Kiểm tra độ dài mảng phải khớp nhau
                    expect(actualPlanTypes.length, `Số lượng gói thực tế (${actualPlanTypes.length}) không khớp với số lượng mong đợi trong CSV (${expectedArray.length})`).toBe(expectedArray.length);

                    // Kiểm tra khớp tuyệt đối các phần tử (không phân biệt thứ tự)
                    const sortedActual = [...actualPlanTypes].sort();
                    const sortedExpected = [...expectedArray].sort();

                    expect(sortedActual, `Danh sách plan_type không khớp tuyệt đối với file CSV`).toEqual(sortedExpected);
                }
            } else {
                // Các Assert mặc định thông minh nếu bạn chưa kịp điền data Assert vào CSV
                if (isEmptyScenario) {
                    expect(purchasedRes.msg_data?.packages?.length || 0).toBe(0);
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
