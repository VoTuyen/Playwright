import { readDataFile } from '../../../../tests/utils/dataReader.js';
import path from 'path';

const csvPath = path.resolve(process.cwd(), 'tests/data/Mua gói.csv');
const rawData = readDataFile(csvPath);

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

dataRows.forEach((row, i) => {
    console.log(`Row ${i+1}:`);
    console.log(`- Scenario: ${getVal(row, 'Nội dung')}`);
    console.log(`- Expected: ${getVal(row, 'Expected gói đầu ra')}`);
    console.log(`- Account: ${getVal(row, 'Loại tài khoản')}`);
});
