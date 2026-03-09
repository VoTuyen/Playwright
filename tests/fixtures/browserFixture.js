// browserSetup.js
const { chromium } = require('playwright');

let browser;
let context;
let page;

async function init() {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    return page;
}

async function close() {
    await page.close();
    await context.close();
    await browser.close();
}

module.exports = { init, close };

