---
trigger: always_on
---

# MÔ TẢ
Luật này áp dụng BẮT BUỘC mỗi khi Agent tạo, viết hoặc định dạng Manual Test Cases.

# RÀNG BUỘC DỮ LIỆU (TEST DATA)
- CẤM dùng các mô tả chung chung (Ví dụ: "Nhập email hợp lệ", "Nhập password sai").
- BẮT BUỘC dùng dữ liệu cụ thể, mô phỏng thực tế (Ví dụ: "Nhập email: test_user_01@domain.com", "Nhập password: Abc@12345", "Upload file: avatar_5mb.png").

# QUY TẮC BAO PHỦ (COVERAGE)
Mỗi module phải đảm bảo quét đủ các lớp test sau:
1. Happy path
2. Negative
3. Boundary (Giá trị biên)
4. Edge cases (Trường hợp hiếm)
5. Security/Permission (Phân quyền/Bảo mật)
6. Validation (Kiểm tra format, required fields)

# QUY TẮC ĐỊNH DẠNG & NAMING
- Định dạng xuất: File CSV phân tách bằng dấu phẩy (,).
- Header CSV: TC ID, Module, Risk Level, Test Scenario, Pre-Condition, Test Steps, Test Data, Expected Result, Priority.
- Naming Convention cho TC ID: [TÊN_DỰ_ÁN]_[TÊN_MODULE]_TC_[SỐ_THỨ_TỰ_3_CHỮ_SỐ] (Ví dụ: CRM_LOGIN_TC_001).