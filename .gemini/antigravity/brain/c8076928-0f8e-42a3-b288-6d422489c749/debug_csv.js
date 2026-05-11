import { readDataFile } from '../../../../tests/utils/dataReader.js';
import path from 'path';

const csvPath = path.resolve(process.cwd(), 'tests/data/Mua gói.csv');
const rawData = readDataFile(csvPath);

console.log('Total Raw Rows:', rawData.length);
const headerRow = rawData.find(row => Object.values(row).includes('Endpoint'));
console.log('HeaderRow found:', headerRow ? 'Yes' : 'No');
if (headerRow) console.log('HeaderRow keys:', Object.keys(headerRow));

const dataRows = rawData.filter(row => {
    const values = Object.values(row);
    return values.some(v => v && typeof v === 'string' && v.includes('/paymentgw/'));
});
console.log('Total Data Rows:', dataRows.length);
if (dataRows.length > 0) {
    console.log('Sample Data Row (first):', JSON.stringify(dataRows[0], null, 2));
}

function getVal(row, headerName) {
    if (!headerRow) return undefined;
    const key = Object.keys(headerRow).find(k => headerRow[k] === headerName);
    return key ? row[key] : undefined;
}

if (dataRows.length > 0) {
    const row = dataRows[0];
    console.log('Test Mapping:');
    console.log('- Nội dung:', getVal(row, 'Nội dung'));
    console.log('- Endpoint:', getVal(row, 'Endpoint'));
    console.log('- Loại tài khoản:', getVal(row, 'Loại tài khoản'));
    console.log('- Giá trị đầu vào...:', getVal(row, 'Giá trị đầu vào cho plan_type ở param'));
}
