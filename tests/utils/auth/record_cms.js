import { createCMSContext, CMS_BASE_URL } from './cmsAuthHelper.js';

async function record() {
    console.log('🚀 Đang khởi động trình duyệt CMS với Auth Token của bạn...');
    const { browser, context, page } = await createCMSContext({ headless: false, verify: false });
    
    await page.goto(`${CMS_BASE_URL}/home`);
    
    console.log('\n' + '━'.repeat(60));
    console.log('✅ TRÌNH DUYỆT ĐÃ MỞ!');
    console.log('👉 HƯỚNG DẪN DÀNH CHO BẠN:');
    console.log('1. Một cửa sổ nhỏ tên là "Playwright Inspector" đã xuất hiện.');
    console.log('2. Bấm vào nút "Record" (biểu tượng chấm tròn đỏ) trên Inspector đó.');
    console.log('3. Quay sang trình duyệt CMS và thao tác các bước Ép hết hạn gói (VD: tìm user, đổi ngày).');
    console.log('4. Playwright sẽ TỰ ĐỘNG sinh ra đoạn code click/gõ phím bên trong Inspector.');
    console.log('5. Copy đoạn code đó gửi cho mình, mình sẽ tích hợp vào script chính!');
    console.log('━'.repeat(60) + '\n');
    
    // Tạm dừng vô thời hạn để hiển thị Inspector
    await page.pause();
    
    await browser.close();
}

record().catch(console.error);
