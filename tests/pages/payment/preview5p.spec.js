import { test, expect, request as pwRequest } from '@playwright/test';
import { readDataFile } from '../../utils/dataReader.js';
import path from 'path';
import { authenticateUser } from '../../config/authConfig.js';
import { testAccounts } from '../../data/testAccounts.js';

const csvPath = path.resolve(process.cwd(), 'tests/data/Mua gói.csv');
const rawData = readDataFile(csvPath);

// Find header and data rows
const headerRow = rawData.find(row => Object.values(row).some(v => v === 'Endpoint'));

const dataRows = rawData.filter(row => {
    const values = Object.values(row);
    return values.some(v => v && typeof v === 'string' && v.includes('/paymentgw/'));
});

function getVal(row, headerName) {
    if (!headerRow) return undefined;
    const key = Object.keys(headerRow).find(k => {
        const val = (headerRow[k] || '').toString();
        if (headerName === 'Nội dung') return val.includes('dung');
        if (headerName === 'Loại tài khoản') return val.includes('kho') || val.includes('tài khoản');
        if (headerName === 'Giá trị đầu vào cho plan_type ở param') return val.includes('plan_type');
        if (headerName === 'Expected gói đầu ra') return val.includes('Expected');
        return val.toLowerCase() === headerName.toLowerCase();
    });
    return key ? row[key] : undefined;
}

test.describe('API Mua Gói - Data Driven Testing', () => {
    let saToken = '';
    let subToken = '';
    const commonHeaders = { 'X-DID': '20:39:4E:A8:85:99' };

    test.beforeAll(async () => {
        const apiContext = await pwRequest.newContext();
        const sa = testAccounts.CUSTOMER_INFO_USER.payload;
        saToken = await authenticateUser(apiContext, sa.phone, sa.client_id, sa.type, sa.otp_code, { ...commonHeaders, 'Content-Type': 'application/json' }, sa.platform || '_w');

        const sub = testAccounts.PACKAGE_SCREEN_SUB_USER.payload;
        subToken = await authenticateUser(apiContext, sub.phone, sub.client_id, sub.type, sub.otp_code, { ...commonHeaders, 'Content-Type': 'application/json' }, sub.platform || '_w');

        if (!saToken || saToken.includes('undefined')) throw new Error('Failed to authenticate SA user');
        if (!subToken || subToken.includes('undefined')) throw new Error('Failed to authenticate SUB user');
    });

    dataRows.forEach((row, index) => {
        const scenarioName = getVal(row, 'Nội dung') || `Scenario ${index + 1}`;
        const endpoint = getVal(row, 'Endpoint');
        const id = getVal(row, 'ID') || '';
        const domain = getVal(row, 'Domain') || process.env.API_DOMAIN || 'https://api-staging.fptplay.net';
        const paramsTemplate = getVal(row, 'params') || '';
        const headerConfig = getVal(row, 'Headers');
        const accountType = getVal(row, 'Loại tài khoản');
        const inputValue = getVal(row, 'Giá trị đầu vào cho plan_type ở param');
        const expectedResult = getVal(row, 'Expected gói đầu ra');

        if (!endpoint) return;

        test(`[CSV] ${id ? `ID ${id} - ` : ''}${scenarioName} - Case: ${inputValue} (${accountType})`, async ({ request }) => {
            let token = null;
            if (headerConfig && headerConfig.toLowerCase() === 'authorization') {
                token = (accountType === 'SUB') ? subToken : saToken;
            }

            const finalParams = paramsTemplate.replace('{{plan_type}}', inputValue);
            const url = `${domain}${endpoint}${finalParams ? '?' + finalParams : ''}`;

            const response = await request.get(url, {
                headers: { ...commonHeaders, ...(token ? { 'Authorization': token } : {}) }
            });

            const status = response.status();
            const expStr = expectedResult ? expectedResult.toString() : '';

            // 4. Validate Response Status
            if (expStr === '401') {
                expect(status, `Expected 401 for ${scenarioName} but got ${status}`).toBe(401);
                return;
            }

            expect(status, `API ${endpoint} failed with status ${status}`).toBe(200);
            
            const result = await response.json();
            const data = result.msg_data || result.data || result;
            
            expect(data, 'Response data should be defined').toBeDefined();

            // 5. Advanced Validation
            if (expStr.includes('msg_data:')) {
                const expectedTypes = expStr.match(/plan_type: (\S+)/g)?.map(m => m.split(': ')[1]) || [];
                const actualTypes = Array.isArray(data) ? data.map(i => i.plan_type) : [data.plan_type];
                for (const type of expectedTypes) {
                    expect(actualTypes, `Expected plan_type '${type}' not found`).toContain(type);
                }
            } else if ((expStr.includes('type_display') && expStr.includes('7')) || expStr.includes('popup')) {
                expect(data.type_display, 'Expected blocked type_display (7)').toBe(7);
            } else if (expStr && expStr !== '' && expStr !== 'null') {
                const actualType = data.plan_type || (Array.isArray(data) ? data[0]?.plan_type : null);
                if (actualType) {
                    expect(actualType).toBe(expStr);
                } else {
                    expect(JSON.stringify(data)).toContain(expStr);
                }
            }
        });
    });
});
