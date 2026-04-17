// browserSetup.js
import { chromium } from 'playwright';

let browser;
let context;
let page;

export async function init() {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    return page;
}

export async function close() {
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
}
