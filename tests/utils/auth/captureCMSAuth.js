import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CMS_URL = 'https://cms-staging.fbox.fpt.vn/home';
const AUTH_PATH = path.join(__dirname, 'cms_auth.json');

async function captureAuth() {
    console.log('🚀 Đang khởi động trình duyệt...');
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized'],
        // Cho phép popup của Google OAuth hoạt động
        ignoreDefaultArgs: ['--disable-popup-blocking'],
    });

    const context = await browser.newContext({
        viewport: null,
        // Bật permission cho popup
        permissions: [],
    });

    const page = await context.newPage();

    console.log(`🔗 Đang mở trang CMS: ${CMS_URL}`);

    // Dùng 'commit' thay 'domcontentloaded' để không bị lỗi khi CMS redirect sang Google
    await page.goto(CMS_URL, { waitUntil: 'commit', timeout: 30_000 });

    console.log('─'.repeat(60));
    console.log('👉 HÀNH ĐỘNG CỦA BẠN:');
    console.log('  1. Nhấn nút "Sign in with Google" trên cửa sổ CMS.');
    console.log('  2. Đăng nhập Google trên popup vừa hiện ra.');
    console.log('  3. Sau khi popup đóng lại → script sẽ TỰ ĐỘNG lưu.');
    console.log('  ⏰ Bạn có tối đa 5 phút.');
    console.log('─'.repeat(60));

    try {
        // ── Lắng nghe sự kiện popup Google OAuth ──────────────────────────────
        console.log('\n⏳ Đang chờ bạn click Sign in with Google...');
        const googlePopup = await page.waitForEvent('popup', { timeout: 300_000 });
        console.log('✅ Popup Google OAuth đã mở! URL:', googlePopup.url().substring(0, 80) + '...');
        console.log('   → Hãy hoàn tất đăng nhập Google trong popup...');

        // ── Chờ popup đóng lại (sau khi đăng nhập Google xong) ────────────────
        await googlePopup.waitForEvent('close', { timeout: 300_000 });
        console.log('✅ Popup Google đã đóng!');

        // ── Chờ CMS xử lý token và render giao diện chính ─────────────────────
        console.log('⏳ Đang chờ CMS load xong sau khi đăng nhập...');
        await page.waitForTimeout(5000); // Cho CMS thời gian set cookies/localStorage

        // Thử chờ URL ổn định về home (không bắt buộc, có timeout ngắn)
        try {
            await page.waitForURL('**/home**', { timeout: 15_000 });
        } catch {
            console.log(`   (URL hiện tại: ${page.url()} — tiếp tục lưu...)`);
        }

        // ── Đọc localStorage ───────────────────────────────────────────────────
        const localStorageData = await page.evaluate(() => {
            const data = {};
            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                data[key] = window.localStorage.getItem(key);
            }
            return data;
        });

        const sessionStorageData = await page.evaluate(() => {
            const data = {};
            for (let i = 0; i < window.sessionStorage.length; i++) {
                const key = window.sessionStorage.key(i);
                data[key] = window.sessionStorage.getItem(key);
            }
            return data;
        });

        // ── Lấy storageState (cookies) từ Playwright ──────────────────────────
        const playwrightState = await context.storageState();

        // Log cookies để debug
        const allCookies = playwrightState.cookies || [];
        console.log(`\n🍪 Cookies đã capture: ${allCookies.length} cookie(s):`);
        allCookies.forEach(c => {
            console.log(`   • [${c.domain}] ${c.name}: ${c.value.substring(0, 50)}${c.value.length > 50 ? '...' : ''}`);
        });

        // Log localStorage
        const lsKeys = Object.keys(localStorageData);
        console.log(`\n📦 localStorage: ${lsKeys.length} key(s):`);
        lsKeys.forEach(k => {
            const preview = (localStorageData[k] || '').substring(0, 80);
            console.log(`   • ${k}: ${preview}${localStorageData[k]?.length > 80 ? '...' : ''}`);
        });

        // Log sessionStorage
        const ssKeys = Object.keys(sessionStorageData);
        if (ssKeys.length > 0) {
            console.log(`\n📦 sessionStorage: ${ssKeys.length} key(s):`);
            ssKeys.forEach(k => {
                const preview = (sessionStorageData[k] || '').substring(0, 80);
                console.log(`   • ${k}: ${preview}${sessionStorageData[k]?.length > 80 ? '...' : ''}`);
            });
        }

        // ── Merge localStorage vào storageState ───────────────────────────────
        if (lsKeys.length > 0) {
            const origin = new URL(CMS_URL).origin;
            let targetOrigin = playwrightState.origins?.find(o => o.origin === origin);
            if (!targetOrigin) {
                if (!playwrightState.origins) playwrightState.origins = [];
                targetOrigin = { origin, localStorage: [] };
                playwrightState.origins.push(targetOrigin);
            }
            targetOrigin.localStorage = Object.entries(localStorageData).map(([name, value]) => ({
                name,
                value,
            }));
        }

        // ── Ghi ra file JSON ───────────────────────────────────────────────────
        fs.writeFileSync(AUTH_PATH, JSON.stringify(playwrightState, null, 2), 'utf-8');

        if (allCookies.length === 0 && lsKeys.length === 0) {
            console.log('\n⚠️  CẢNH BÁO: Không capture được cookie hoặc localStorage nào!');
            console.log('   Có thể đăng nhập chưa hoàn tất hoặc CMS dùng cơ chế khác.');
            console.log('   Kiểm tra file cms_auth.json và thử lại nếu cần.');
        } else {
            console.log(`\n🎉 Đã lưu CMS auth tại:\n   ${AUTH_PATH}`);
            console.log('   → Bây giờ bạn có thể dùng cmsAuthHelper.js trong test!');
        }

    } catch (error) {
        console.error('\n❌ Lỗi:', error.message);
        if (error.message.includes('Timeout')) {
            console.log('💡 Gợi ý: Script đã chờ quá 5 phút. Hãy chạy lại và đăng nhập nhanh hơn.');
        }
    } finally {
        await browser.close();
    }
}

captureAuth();
