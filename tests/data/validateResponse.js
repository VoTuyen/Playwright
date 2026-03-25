// Import AJV
import Ajv from 'ajv';
import { benefit_schema, check_transaction_schema, package_screen_schema } from './payment_schema.js';

 
// Khởi tạo AJV
const ajv = new Ajv();
ajv.addSchema(benefit_schema, 'benefit_schema'); // Đăng ký schema với tên 'benefit_schema'
ajv.addSchema(check_transaction_schema, 'check_transaction_schema'); // Đăng ký schema với tên 'check_transaction_schema'
ajv.addSchema(package_screen_schema, 'package_screen_schema'); // Đăng ký schema với tên 'package_screen_schema'

function validateSchema(data, schemaName) {
    const validate = ajv.getSchema(schemaName);

    if (!validate) {
          throw new Error(`Schema "${schemaName}" không tìm thấy.`);
      }

    const valid = validate(data);
   
    if (!valid) {
        throw new Error(`Validation error: ${JSON.stringify(validate.errors)}`);
    }
 
    return data; // Trả về dữ liệu đã xác thực
}
 
module.exports = {validateSchema}