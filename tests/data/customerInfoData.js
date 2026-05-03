import path from 'path';
import { fileURLToPath } from 'url';
import { readDataFile } from '../utils/dataReader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Đọc dữ liệu từ file CSV
const csvPath = path.join(__dirname, '../../customer_info_api_testcases.csv');
const rawData = readDataFile(csvPath);

// 2. Chuyển đổi dữ liệu và export
export const customer_info_data = rawData.map(row => {
    let payloadStr = row['Test Data (Payload / Input)'];
    let payload = {};
    if (payloadStr && payloadStr.startsWith('{')) {
        try {
            payload = JSON.parse(payloadStr);
        } catch (e) {
            console.error(`Lỗi parse JSON payload cho TC ${row['TC ID']}`);
        }
    }
    
    // Mặc định expected status là 200 theo quy định mới
    let expectedStatus = 200;
    if (row['Expected Result'].includes('HTTP 401')) expectedStatus = 401;

    let expectedMessage = null;
    if (row['Expected Result'].includes('Số điện thoại không hợp lệ')) {
        expectedMessage = 'Số điện thoại không hợp lệ';
    } else if (row['Expected Result'].includes('Thiếu số điện thoại')) {
        expectedMessage = 'Thiếu số điện thoại';
    }

    return {
        tc_id: row['TC ID'],
        description: row['Test Scenario'],
        payload: payload,
        pre_condition: row['Pre-Condition'],
        expected: {
            status: expectedStatus,
            message: expectedMessage,
            raw_expected_result: row['Expected Result']
        }
    };
});
