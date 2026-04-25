// browserSetup.js
import { chromium } from 'playwright';

let browser;
let context;
let page;

export async function init() {
    // Mặc định chạy ngầm (true). Nếu muốn hiện hình thì đặt biến môi trường HEADLESS=false
    const isHeadless = process.env.HEADLESS !== 'false';
    browser = await chromium.launch({ headless: isHeadless });
    context = await browser.newContext();
    page = await context.newPage();
    return page;
}

export async function close() {
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
}
