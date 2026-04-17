# HƯỚNG DẪN KỸ THUẬT THIẾT KẾ TEST CASE (TEST DESIGN TECHNIQUES)

Tài liệu này cung cấp định nghĩa và cách vận dụng 4 kỹ thuật thiết kế Test Case cốt lõi. BẮT BUỘC áp dụng các kỹ thuật này khi sinh Test Steps và Test Data để tối ưu hóa số lượng Test Case nhưng vẫn đảm bảo độ bao phủ tối đa.

---

## 1. Phân vùng tương đương (Equivalence Partitioning - EP)
**Mục đích:** Giảm thiểu số lượng Test Case bằng cách loại bỏ các dữ liệu kiểm thử có cùng một luồng logic xử lý.
**Quy tắc:**
- Chia dữ liệu đầu vào thành các nhóm (vùng) tương đương nhau.
- Nguyên lý: Nếu một giá trị đại diện trong vùng này Pass/Fail, thì tất cả các giá trị khác trong vùng đó cũng sẽ Pass/Fail.
- Chỉ chọn **1 giá trị đại diện** cho mỗi vùng Hợp lệ (Valid) và Không hợp lệ (Invalid).

**Ví dụ thực tế:**
Requirement: "Ô nhập số lượng mua hàng cho phép nhập từ 1 đến 10".
- Vùng Invalid 1 (Nhỏ hơn 1): Khuyên dùng `-5` hoặc `0`.
- Vùng Valid (Từ 1 đến 10): Khuyên dùng `5`. (KHÔNG tạo 10 test case nhập từ 1, 2, 3... đến 10).
- Vùng Invalid 2 (Lớn hơn 10): Khuyên dùng `15`.

---

## 2. Phân tích giá trị biên (Boundary Value Analysis - BVA)
**Mục đích:** Bắt các lỗi thường xuyên xảy ra ở ranh giới (giới hạn) của các vùng tương đương (lỗi do dev dùng sai dấu `>`, `<`, `>=`, `<=`).
**Quy tắc:**
- Sinh test data tập trung trực tiếp vào các mốc giới hạn.
- Áp dụng kỹ thuật biên 3 giá trị: Lấy giá trị tại biên, ngay dưới biên và ngay trên biên. (Tức là `min-1`, `min`, `min+1` và `max-1`, `max`, `max+1`).

**Ví dụ thực tế:**
Requirement: "Mật khẩu yêu cầu từ 8 đến 15 ký tự".
- Các giá trị test cần sinh ra: `7` ký tự (min-1), `8` ký tự (min), `9` ký tự (min+1), `14` ký tự (max-1), `15` ký tự (max), `16` ký tự (max+1).

---

## 3. Bảng quyết định (Decision Table)
**Mục đích:** Xử lý các luồng nghiệp vụ phức tạp, nơi mà kết quả cuối cùng phụ thuộc vào sự kết hợp của 2 hoặc nhiều điều kiện (Conditions) khác nhau.
**Quy tắc:**
- Xác định tất cả các Điều kiện (Input) và Hành động (Output/Action).
- Lập bảng kết hợp các giá trị True/False (hoặc Yes/No) của các điều kiện.
- Mỗi cột (Rule) trong bảng sẽ trở thành 1 Test Case.

**Ví dụ thực tế:**
Requirement: "Khách hàng được giảm 20% nếu là thành viên VIP VÀ mua đơn hàng > 500k. Nếu chỉ mua > 500k nhưng không phải VIP thì giảm 10%. Các trường hợp khác không giảm".
- Điều kiện 1: Khách VIP? (T/F)
- Điều kiện 2: Đơn > 500k? (T/F)
*=> Sinh ra 4 Test Cases:*
- TC1: VIP = T, > 500k = T -> Expected: Giảm 20%.
- TC2: VIP = T, > 500k = F -> Expected: Không giảm.
- TC3: VIP = F, > 500k = T -> Expected: Giảm 10%.
- TC4: VIP = F, > 500k = F -> Expected: Không giảm.

---

## 4. Chuyển đổi trạng thái (State Transition)
**Mục đích:** Kiểm tra hành vi của hệ thống có các đối tượng thay đổi trạng thái theo thời gian (Workflow / Lifecycle).
**Quy tắc:**
- Xác định các Trạng thái hợp lệ (States) và Sự kiện (Triggers/Actions) làm thay đổi trạng thái đó.
- Viết Test Case cho luồng chuyển trạng thái hợp lệ (Happy Path).
- **ĐẶC BIỆT CHÚ Ý:** Phải viết các Test Case cố tình thực hiện các chuyển đổi KHÔNG hợp lệ (Negative Path).

**Ví dụ thực tế:**
Requirement: Vòng đời đơn hàng: `Mới đặt (New)` -> `Đã thanh toán (Paid)` -> `Đang giao (Shipping)` -> `Hoàn thành (Done)`. Khách chỉ được Hủy (Cancel) khi ở trạng thái New.
- TC Hợp lệ 1: Thanh toán thành công khi đơn ở trạng thái `New` -> Trạng thái đổi thành `Paid`.
- TC Hợp lệ 2: Bấm nút Hủy khi đơn ở trạng thái `New` -> Trạng thái đổi thành `Canceled`.
- TC Ngoại lệ 1 (Bắt buộc có): Cố gắng gọi API/bấm nút Hủy khi đơn đã ở trạng thái `Paid` hoặc `Shipping` -> Expected: Hệ thống chặn lại, báo lỗi không được phép hủy.