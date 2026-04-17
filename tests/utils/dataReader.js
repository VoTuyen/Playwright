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
        // Thêm FS: ';' để nhận diện đúng định dạng dấu chấm phẩy của bạn
        const workbook = XLSX.read(content, { type: 'string', FS: ';' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Chuyển đổi sang JSON. { defval: "" } giúp tránh bỏ sót cell trống.
        return XLSX.utils.sheet_to_json(worksheet, { 
            raw: false, 
            defval: "" 
        });
    } catch (error) {
        console.error(`[dataReader] Lỗi khi đọc file tại ${filePath}:`, error.message);
        return [];
    }
}
