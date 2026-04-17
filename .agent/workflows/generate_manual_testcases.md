---
description: Chạy luồng tạo Manual Test Case toàn trình (FULL mode — Human in the loop), bao gồm bóc tách yêu cầu, đặt câu hỏi Q&A và sinh bộ Test Case chuẩn RBT.
---

> **BẮT BUỘC (MANDATORY SKILLS):** Bạn PHẢI nạp và đọc kỹ nội dung của 2 skills **`requirements_analyzer`** và **`generate_testcases`** trước khi bắt đầu thực hiện tác vụ này. Áp dụng các tài liệu tham chiếu (references) đi kèm của từng skill trong suốt quá trình chạy workflow.

# Workflow: Sinh Manual Test Cases Toàn Trình (FULL RBT Mode)

Workflow này đóng vai trò điều phối quy trình kiểm thử thủ công từ A-Z, đảm bảo mọi điểm mờ của Requirement đều được làm rõ trước khi bắt tay vào viết Test Case.

## ⚠️ Nguyên tắc

- **Mode:** FULL (Quy trình nhiều bước, **BẮT BUỘC có điểm dừng** để chờ user).
- **Ngôn ngữ:** Tất cả output bằng Tiếng Việt.
- **Tuân thủ:** Không tự ý suy diễn các logic nghiệp vụ bị thiếu. Bắt buộc phải đặt câu hỏi Q&A.

## Các bước thực hiện

### Bước 1: Phân tích Yêu cầu (Analysis)
- Sử dụng năng lực của skill `requirements_analyzer`.
- Đọc nội dung Requirement người dùng cung cấp.
- Trích xuất và in ra màn hình 3 nhóm luồng logic: **Happy Path**, **Alternate Path**, **Exception Path**.
- Đối chiếu với file `ambiguity_checklist.md` để rà soát các điểm mấu chốt (Phân quyền, Giới hạn dữ liệu, Validate lỗi...).

### Bước 2: Xác nhận với người dùng (Human-in-the-loop)
- In ra danh sách **Câu hỏi Q&A / Cần làm rõ**.
- **[PAUSE - BẮT BUỘC DỪNG LẠI TẠI ĐÂY]**
- Hỏi người dùng: *"Bạn có muốn làm rõ các câu hỏi Q&A trên trước không, hay muốn tôi sinh luôn Test Case dựa trên các giả định hiện tại?"*
- **Tuyệt đối không chuyển sang Bước 3 nếu người dùng chưa phản hồi.**

### Bước 3: Đánh giá Rủi ro & Áp dụng Kỹ thuật (Chạy ngầm)
- Sau khi có confirm từ người dùng, chuyển sang sử dụng skill `generate_testcases`.
- Gán nhãn **Risk Level** (High/Medium/Low) cho module để tính toán số lượng Test Case cần sinh.
- Áp dụng 4 kỹ thuật cốt lõi: Phân vùng tương đương (EP), Phân tích giá trị biên (BVA), Bảng quyết định (Decision Table), Chuyển đổi trạng thái (State Transition).

### Bước 4: Sinh Test Case & Xuất Bảng
- Tạo bảng Test Case đầy đủ các fields chuẩn ISTQB.
- Đảm bảo **Test Data** cực kỳ cụ thể (VD: `test_user_01@domain.com`, `Abc@12345`).
- Xuất ra màn hình dưới dạng Bảng Markdown. (Nếu user yêu cầu file, hãy đề xuất tạo file `.xlsx`).

## Bảng Output (Markdown Format)

```markdown
| TC ID | Module | Risk Level | Test Scenario | Pre-Condition | Test Steps | Test Data | Expected Result | Priority |

- Định dạng TC ID: `{project_name}_{module_name}_TC_001`.