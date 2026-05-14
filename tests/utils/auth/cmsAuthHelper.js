/**
 * cmsAuthHelper.js
 * ─────────────────────────────────────────────────────────
 * Utility để tải lại trạng thái đăng nhập CMS đã được lưu
 * bởi script captureCMSAuth.js.
 *
 * Cách dùng trong test:
 *   import { createCMSContext } from '../utils/auth/cmsAuthHelper.js';
 *   const { browser, context, page } = await createCMSContext();
 *   await page.goto('https://cms.fbox.fpt.vn/some-page');
 *   // → đã đăng nhập sẵn, không cần login lại
 *   await browser.close();
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CMS_AUTH_PATH = path.join(__dirname, 'cms_auth.json');
export const CMS_BASE_URL = 'https://cms-staging.fbox.fpt.vn';

/**
 * Kiểm tra xem file cms_auth.json đã tồn tại chưa.
 * @returns {boolean}
 */
export function isCMSAuthAvailable() {
    return fs.existsSync(CMS_AUTH_PATH);
}

/**
 * Đọc và parse file cms_auth.json.
 * @returns {Object} storageState object
 * @throws nếu file không tồn tại hoặc không parse được
 */
export function loadCMSAuthState() {
    if (!isCMSAuthAvailable()) {
        throw new Error(
            `[cmsAuthHelper] Không tìm thấy file auth tại:\n  ${CMS_AUTH_PATH}\n` +
            `👉 Hãy chạy lệnh: node tests/utils/auth/captureCMSAuth.js`
        );
    }
    const raw = fs.readFileSync(CMS_AUTH_PATH, 'utf-8');
    return JSON.parse(raw);
}

/**
 * Tạo một Playwright browser context đã được nạp auth CMS sẵn.
 * Trả về { browser, context, page } để dùng trong test.
 *
 * @param {Object} options
 * @param {boolean} [options.headless=true]  - Chạy headless hay không
 * @param {boolean} [options.verify=true]    - Verify session còn hợp lệ không bằng cách navigate thử
 * @returns {{ browser, context, page }}
 */
export async function createCMSContext({ headless = true, verify = true } = {}) {
    const storageState = loadCMSAuthState();

    const browser = await chromium.launch({ headless });
    const context = await browser.newContext({
        storageState,
        viewport: { width: 1440, height: 900 },
    });

    // Inject localStorage thủ công (fallback cho SPA) trước khi page navigate
    const origin = new URL(CMS_BASE_URL).origin;
    const originData = storageState.origins?.find(o => o.origin === origin);

    const page = await context.newPage();

    if (originData?.localStorage?.length > 0) {
        // Mở trang gốc để set localStorage đúng origin
        await page.goto(CMS_BASE_URL, { waitUntil: 'domcontentloaded' });
        await page.evaluate((items) => {
            items.forEach(({ name, value }) => {
                window.localStorage.setItem(name, value);
            });
        }, originData.localStorage);
        console.log(`[cmsAuthHelper] ✅ Đã inject ${originData.localStorage.length} localStorage key(s) vào context.`);
    }

    // Verify phiên còn hợp lệ không
    if (verify) {
        await page.goto(`${CMS_BASE_URL}/home`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        const currentUrl = page.url();
        const isLoggedIn = currentUrl.includes('/home');

        if (!isLoggedIn) {
            await browser.close();
            throw new Error(
                `[cmsAuthHelper] ❌ Phiên CMS đã hết hạn (redirect về: ${currentUrl}).\n` +
                `👉 Hãy chạy lại: node tests/utils/auth/captureCMSAuth.js`
            );
        }
        console.log(`[cmsAuthHelper] ✅ Phiên CMS hợp lệ (URL: ${currentUrl})`);
    }

    return { browser, context, page };
}

/**
 * Tự động ép hết hạn gói của một user qua UI CMS.
 * Logic được record từ session CMS thực tế.
 *
 * @param {string} phone - Số điện thoại của tài khoản cần ép hết hạn
 */
export async function auto_expire_package_via_cms(phone) {
    console.log(`[CMS Robot] Bắt đầu ép hết hạn gói cho SĐT: ${phone}`);

    const { browser, context, page } = await createCMSContext({ headless: true, verify: false });

    try {
        await page.goto(`${CMS_BASE_URL}/home`, { waitUntil: 'domcontentloaded', timeout: 30_000 });

        // Bước 1: Vào Xử lý nghiệp vụ → tìm user
        await page.getByRole('button', { name: 'Xử lý nghiệp vụ', exact: true }).click();
        await page.getByRole('textbox', { name: 'Điện thoại' }).fill(phone);
        await page.getByRole('button', { name: 'Tìm' }).click();

        // Bước 2: Chuyển sang tab Quản lý gói dịch vụ
        await page.getByRole('tab', { name: 'Quản lý gói dịch vụ' }).click();

        // Bước 3: Click vào nút Edit gói đầu tiên
        await page.getByRole('button').filter({ hasText: 'edit' }).first().click();

        // Bước 4: Mở date picker và chỉnh về ngày trong quá khứ (chọn tháng trước)
        await page.getByRole('button').filter({ hasText: /^$/ }).click(); // Mở datepicker
        await page.getByRole('button').nth(2).click(); // Prev month
        await page.getByRole('button').nth(2).click(); // Prev month lần 2 (về 2 tháng trước)
        await page.locator('div').filter({ hasText: /^1$/ }).first().click(); // Chọn ngày 1

        // Bước 5: Nhập lý do và Lưu
        await page.locator('textarea[name="reason"]').fill('Auto expire for testing');
        await page.getByRole('button', { name: 'Lưu' }).click();
        await page.getByRole('button', { name: 'Lưu' }).click(); // Confirm dialog

        // Đợi CMS xử lý
        await new Promise(r => setTimeout(r, 3000));

        console.log(`[CMS Robot] ✅ Đã ép hết hạn gói thành công cho: ${phone}`);
    } catch (err) {
        console.error(`[CMS Robot] ❌ Lỗi khi ép hết hạn gói: ${err.message}`);
        throw err;
    } finally {
        await browser.close();
    }
}
