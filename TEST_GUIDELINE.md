# Hướng dẫn quy trình viết Testcase mới (Playwright API Testing)

Dựa trên kiến trúc dự án hiện tại, dự án được tổ chức theo mô hình **Data-Driven & Modularized API Testing**. Các thành phần được tách biệt rõ ràng nhằm tối ưu việc dễ đọc, tái sử dụng (re-usability) và dễ thay đổi khi mở rộng.

Khi có yêu cầu kiểm thử cho một **Function/API mới**, bạn hãy tuân theo 5 bước tiêu chuẩn dưới đây:

## 1. Mở rộng / Bổ sung API Endpoints
Mọi đường dẫn (URL) của API phải được khai báo tập trung.
- **Vị trí file:** `tests/data/apiEndpoints.js`
- **Hành động:** Khai báo endpoint mới dựa trên các platform (ví dụ: `_a` - Android, `_w` - Web) để thuận tiện gọi ra tái sử dụng.
  ```javascript
  // Ví dụ
  export default {
      _w: {
          ...,
          new_function_api: 'https://staging-api.example.com/api/v1/new_feature'
      }
  }
  ```

## 2. Chuẩn bị Dữ liệu đầu vào (Test Data)
Không hardcode dữ liệu đầu vào trực tiếp trong các file `.spec.js`. Hãy tách chúng ra để sử dụng vòng lặp kiểm tra được cho nhiều kịch bản (Data-Driven Test).
- **Vị trí thư mục:** `tests/data/` (Tạo file mới ví dụ `<feature>Data.js` hoặc thêm vào file có sẵn).
- **Hành động:** 
  Tạo mảng chứa các object, mỗi object sẽ là 1 bộ testcase hoàn chỉnh bao gồm các config cần test.
  ```javascript
  export const newFeatureData = [
      { phone: '0565123451', client_id: 'xxxx', type: 'login', expect_status: '1' },
      { phone: '0565123454', client_id: 'yyyy', type: 'login', expect_status: '0' }
  ];
  ```

## 3. Tạo Schema phân tích Validations cho API Response (Tùy chọn)
Nếu kết quả API phức tạp với rất nhiều field lồng nhau, thay vì `expect` thủ công từng dòng, ta nên dùng **AJV Json Schema** để check cấu trúc.
- **Vị trí:** `tests/data/<name>_schema.js` & `tests/data/validateResponse.js`
- **Hành động:**
  1. Thêm mô tả Schema mới vào `_schema.js`.
  2. Bổ sung việc Add Schema này trong `validateResponse.js` bằng lệnh: `ajv.addSchema(new_schema, 'new_schema_name');`

## 4. Viết các Helper & Fixtures gọi API
Hạn chế viết trực tiếp hàm `request.post` hay `request.get` chằng chịt trong file `.spec.js`. Hãy đưa các request payload này vào file fixture để đóng gói lại gọn gàng.
- **Vị trí:** `tests/fixtures/<domain>Fixture.js`
- **Hành động:**
  ```javascript
  import endpoints from '../data/apiEndpoints.js';

  export async function handle_new_feature(request, params, headers, platform) {
      const response = await request.post(endpoints[platform].new_function_api, {
          data: params, 
          headers,
      });
      return await response.json(); // Trả thẳng kết quả json
  }
  ```

## 5. Xây dựng Test File (.spec.js)
Đây là phần cuối cùng, nơi bạn lắp ráp Fixtures, Data, và Schema lại với nhau để Playwright thực thi.
- **Vị trí:** `tests/pages/<domain>/<function_name>.spec.js`
- **Hành động:**
  Tạo vòng lặp mảng data để sinh ra các test suite riêng biệt cho từng kịch bản.

```javascript
import { test as baseTest, expect } from '../../fixtures/<domain>Fixture.js';
import { newFeatureData } from '../../data/<feature>Data.js';
import { handle_new_feature } from '../../fixtures/<domain>Fixture.js';
import { validateSchema } from '../../data/validateResponse.js';

newFeatureData.forEach((dataItem, index) => {
    
    baseTest.describe(`Test feature X: case ${index + 1}`, () => {
        
        baseTest(`Should return correct status for ${dataItem.phone}`, async ({ request, headers }) => {
            
            // 1. Gửi request
            const response = await handle_new_feature(
                request, 
                dataItem, 
                headers, 
                dataItem.platform
            );
            
            // 2. Asserts (Kiểm tra logic đơn giản)
            expect(response.status).toEqual(dataItem.expect_status);
            
            // 3. Schema Validators (Đối chiếu với file Schema nếu JSON trả ra dày)
            const isValid = validateSchema(response, 'new_schema_name');
            expect(isValid.msg_code).toBe('success');
            
        });
    });
});
```

> [!TIP]
> **Best Practice cho việc bảo trì:** 
> - Nếu quá trình test sinh ra dữ liệu thừa (rác) trên server Staging, luôn bổ sung một hàm `afterEach` hoặc `afterAll` gọi API dọn dẹp data đó (giống như `clear_user_data` đang được sài). Tránh để Data cũ làm chết Test Cũ.
> - Khi một field trả về trong Response API đôi khi `null` đôi khi giá trị thực, bắt buộc Schema (`ajv`) phải để loại thuộc tính đó nullable nhằm tránh báo lỗi strict! 
