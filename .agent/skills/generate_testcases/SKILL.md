---
name: generate_testcases
description: Kỹ năng đánh giá rủi ro (Risk-Based Testing) và thiết kế bộ Test Case hoàn chỉnh từ tài liệu Yêu cầu (Requirements Document).
---

# Kỹ năng Thiết kế Test Case (Test Case Generator)

Kỹ năng này cung cấp năng lực tư duy của một Senior QA Engineer, giúp AI (Antigravity) có thể chuyển đổi các tài liệu Yêu cầu (Requirements/User Stories) thành bộ Test Case tối ưu: ít trùng lặp, bao phủ cao và sát thực tế.

## 1. Mục tiêu cốt lõi
- Xây dựng bộ Test Case với dữ liệu cụ thể (Test Data), có thể dùng để test Manual hoặc làm đầu vào cho script Automation.
- Áp dụng phương pháp Kiểm thử Dựa trên Rủi ro (Risk-Based Testing - RBT) để phân bổ số lượng test case hợp lý.
- Vận dụng các kỹ thuật thiết kế test case chuẩn ISTQB để đảm bảo quét sạch lỗi mà không dư thừa kịch bản.

## 2. Quy trình thiết kế Test Case
Khi được yêu cầu tạo Test Case từ một Requirement hoặc User Story:
1. **Đánh giá Rủi ro (Risk Assessment):**
   - **High Risk** (Core business, Thanh toán, Auth): Thiết kế chi tiết (8-15+ TCs).
   - **Medium Risk** (CRUD, tính năng phụ trợ): Thiết kế vừa phải (4-8 TCs).
   - **Low Risk** (UI/UX, Text tĩnh): Thiết kế cơ bản (2-4 TCs).
2. **Xác định Luồng (Path Mapping):**
   - Liệt kê Happy Path (Luồng thành công).
   - Liệt kê Alternate Path (Luồng thay thế/phím tắt).
   - Liệt kê Exception Path (Luồng ngoại lệ, văng lỗi, bị từ chối).
3. **Áp dụng Kỹ thuật Thiết kế (Test Design Techniques):**
   - **Phân vùng tương đương (EP):** Nhóm các dữ liệu có cùng logic xử lý để viết 1 đại diện, tránh viết 10 test case có chung một kết quả.
   - **Phân tích giá trị biên (BVA):** Tập trung sinh test case tại các mốc `min`, `max`, `min-1`, `max+1`.
   - **Bảng quyết định (Decision Table):** Áp dụng cho các tính năng có từ 2 điều kiện logic ràng buộc nhau trở lên.
   - **Chuyển đổi trạng thái (State Transition):** Dành cho các đối tượng có vòng đời (Ví dụ: Đơn hàng từ Draft -> Pending -> Approved).
4. **Sinh Dữ liệu Test (Test Data Generation):**
   - Khởi tạo dữ liệu mô phỏng sát thực tế dựa trên Validation Rules của requirement.

## 3. Cấu trúc Đầu ra (Output Format)
Xuất kết quả dưới định dạng bảng Markdown (hoặc Artifact dạng `.csv` nếu được yêu cầu). 

**Các cột bắt buộc trong bảng Test Case:**
- **TC ID:** [TÊN_DỰ_ÁN]_[TÊN_MODULE]_TC_[SỐ_THỨ_TỰ] (Vd: CRM_LOGIN_TC_001).
- **Test Scenario:** Kịch bản kiểm thử (ngắn gọn).
- **Pre-Condition:** Điều kiện tiền quyết.
- **Test Steps:** Các bước thực hiện (đánh số 1, 2, 3...).
- **Test Data:** Dữ liệu sử dụng cho các bước.
- **Expected Result:** Kết quả mong đợi (phải kiểm chứng được).
- **Priority:** High / Medium / Low.

## 4. Bắt buộc (Strict Rules)
- Luôn viết bằng **Tiếng Việt**.
- **CẤM** sử dụng các mô tả dữ liệu chung chung như: "Nhập email hợp lệ", "Nhập password sai", "Nhập chuỗi quá dài".
- **BẮT BUỘC** dùng dữ liệu cụ thể: "Nhập email: user_test@gmail.com", "Nhập chuỗi 256 ký tự 'A'".
- Đảm bảo bao phủ đủ: Positive (Luồng đúng), Negative (Luồng sai), Boundary (Biên), và UI/Validation.
- Nếu Requirement đầu vào quá sơ sài hoặc có điểm logic vô lý, hãy tạm dừng việc sinh Test Case và liệt kê các "Câu hỏi/Làm rõ với PO/BA" trước.