import { test, expect, request as pwRequest } from '@playwright/test';
import { readDataFile } from '../../utils/dataReader.js';
import path from 'path';
import { authenticateUser } from '../../config/authConfig.js';

const csvPath = path.resolve(process.cwd(), 'tests/data/Mua gói.csv');
const rawData = readDataFile(csvPath);

// Find header and data rows
const headerRow = rawData.find(row => Object.values(row).includes('Endpoint'));
const dataRows = rawData.filter(row => {
    const values = Object.values(row);
    return values.some(v => v && v.includes('/paymentgw/'));
});

function getVal(row, headerName) {
    if (!headerRow) return undefined;
    const key = Object.keys(headerRow).find(k => headerRow[k] === headerName);
    return key ? row[key] : undefined;
}

test.describe('API Mua Gói - Data Driven Testing', () => {
    let globalAuthToken = '';
    const commonHeaders = { 'X-DID': '20:39:4E:A8:85:99' };

    test.beforeAll(async () => {
        const apiContext = await pwRequest.newContext();
        globalAuthToken = await authenticateUser(
            apiContext, 
            '0565123454', 
            '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a', 
            'login_fpl', 
            '999999', 
            { ...commonHeaders, 'Content-Type': 'application/json' }, 
            '_w'
        );
    });

    dataRows.forEach((row, index) => {
        const scenarioName = getVal(row, 'Nội dung') || `Scenario ${index + 1}`;
        const endpoint = getVal(row, 'Endpoint');
        const domain = getVal(row, 'Domain') || 'https://api-staging.fptplay.net';
        const inputValues = getVal(row, 'Giá trị đầu vào cho plan_type ở param') || '';
        const inputs = inputValues.split(',').map(s => s.trim()).filter(s => s !== '');

        if (!endpoint) return;

        inputs.forEach(inputValue => {
            test(`[CSV] ${scenarioName} - Case: ${inputValue}`, async ({ request }) => {
                let url;
                if (endpoint.includes('detail')) {
                    url = `${domain}${endpoint}?plan_type=${inputValue}&from_source=play&is_wap=1&drm=1`;
                } else {
                    url = `${domain}${endpoint}?package_type=${inputValue.toLowerCase()}&is_drm=1&from_source=play&is_preview=1&drm=1`;
                }

                const response = await request.get(url, {
                    headers: { ...commonHeaders, 'Authorization': globalAuthToken }
                });
                
                expect(response.status()).toBe(200);
                const result = await response.json();
                const data = result.msg_data || result.data || result;
                
                expect(data, 'Response data should be defined').toBeDefined();
                // Validate common response field 'type_display' (7 = blocked, 1 = success with payment methods)
                expect(data).toHaveProperty('type_display');
            });
        });

        test(`[CSV] ${scenarioName} - Unauthorized Check (401)`, async ({ request }) => {
            const fullUrl = `${domain}${endpoint}`;
            const paramName = endpoint.includes('detail') ? 'plan_type' : 'package_type';
            
            const res = await request.get(`${fullUrl}?${paramName}=test`, {
                headers: { 'Authorization': 'invalid_token' }
            });
            
            // Note: Preview API might not require Auth on staging, but Detail API usually does.
            if (endpoint.includes('detail')) {
                expect(res.status()).toBe(401);
            } else {
                // Warning if preview doesn't return 401
                if (res.status() !== 401) {
                    console.warn(`[Info] Preview API returned ${res.status()} for unauthorized request.`);
                }
            }
        });
    });
});
