import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

/**
 * Đọc dữ liệu từ file (Hỗ trợ .xlsx, .csv).
 * @param {string} filePath - Đường dẫn đến file.
 * @returns {Array<Object>}
 */
export function readDataFile(filePath) {
    try {
        const fs = require('fs');
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Thử đọc với dấu chấm phẩy trước
        let workbook = XLSX.read(content, { type: 'string', FS: ';' });
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });

        // Nếu không ra dữ liệu hoặc chỉ có 1 cột (có thể do sai delimiter), thử với dấu phẩy
        if (data.length > 0 && Object.keys(data[0]).length <= 1) {
            workbook = XLSX.read(content, { type: 'string' }); // Default (comma)
            worksheet = workbook.Sheets[workbook.SheetNames[0]];
            data = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });
        }
        
        return data;
    } catch (error) {
        console.error(`[dataReader] Lỗi khi đọc file tại ${filePath}:`, error.message);
        return [];
    }
}
