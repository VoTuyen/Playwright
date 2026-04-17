# DANH SÁCH KIỂM TRA ĐIỂM MỜ YÊU CẦU (AMBIGUITY CHECKLIST)

Khi phân tích Requirement, hãy đối chiếu với danh sách các "điểm mù" thường gặp dưới đây để đặt câu hỏi Q&A. Nếu Requirement KHÔNG đề cập đến các yếu tố này, đó chính là một điểm mờ (Ambiguity).

## 1. Ràng buộc dữ liệu (Data Validation)
- **Giới hạn độ dài:** Các trường nhập liệu (text box) có quy định rõ số ký tự tối đa (max-length) và tối thiểu (min-length) không?
- **Định dạng & Ký tự:** Có cho phép nhập ký tự đặc biệt, khoảng trắng ở đầu/cuối, hay emoji không? (VD: Tên người dùng có được chứa số không?)
- **Bắt buộc/Tùy chọn:** Đã xác định rõ field nào là bắt buộc (mandatory), field nào là tùy chọn (optional) chưa?
- **Giá trị mặc định:** Khi form vừa mở lên, có trường nào cần điền sẵn giá trị mặc định (default value) không?

## 2. Luồng nghiệp vụ (Business Logic & State)
- **Xung đột điều kiện:** Có quy tắc nào mâu thuẫn với nhau không? (VD: Quy tắc A nói "Giảm 10%", Quy tắc B nói "Không áp dụng cho hàng sale", vậy hàng sale có được giảm không?)
- **Trạng thái trước/sau:** Khi hoàn thành một hành động, trạng thái của đối tượng thay đổi như thế nào? (VD: Đơn hàng thanh toán xong thì trạng thái là Paid hay Processing?)
- **Hành động đồng thời (Concurrency):** Chuyện gì xảy ra nếu 2 người dùng cùng thao tác trên 1 đối tượng cùng một lúc? (VD: 2 người cùng mua món hàng cuối cùng trong kho).
- **Hủy/Quay lại:** Người dùng có thể Hủy (Cancel) thao tác giữa chừng không? Nếu có, dữ liệu có được khôi phục (rollback) về trạng thái cũ không?

## 3. Phân quyền & Bảo mật (Security & Roles)
- **Role-based Access:** Những User Role (vai trò) nào được phép nhìn thấy/thao tác tính năng này? Role nào bị chặn?
- **Trạng thái đăng nhập:** Người dùng chưa đăng nhập (Guest) nhấn vào tính năng này thì hệ thống xử lý thế nào (đẩy ra màn hình Login hay báo lỗi)?
- **Giới hạn thao tác (Rate Limit):** Có giới hạn số lần thao tác không? (VD: Nhập sai mật khẩu bao nhiêu lần thì khóa tài khoản? Nhấn gửi OTP liên tục thì có bị chặn không?)

## 4. Xử lý lỗi & Ngoại lệ (Error Handling & Exceptions)
- **Thông báo lỗi (Error Messages):** Khi người dùng làm sai, hệ thống hiển thị câu thông báo lỗi cụ thể là gì? (Hay chỉ báo chung chung "Đã có lỗi xảy ra"?).
- **Mất kết nối:** Chuyện gì xảy ra nếu mạng rớt (offline) đúng lúc đang submit form/thanh toán?
- **Timeout:** Chờ hệ thống bên thứ 3 (API đối tác, Cổng thanh toán) bao lâu thì bị coi là timeout?

## 5. Giao diện (UI/UX - Dành cho Web/Mobile)
- **Phân trang (Pagination/Load more):** Nếu danh sách trả về có 1000 items, hệ thống hiển thị phân trang hay cuộn tải thêm? Giới hạn mỗi trang là bao nhiêu?
- **Responsive/Độ phân giải:** Tính năng này hiển thị như thế nào trên màn hình nhỏ (mobile) hoặc khi xoay ngang màn hình?
- **Trạng thái rỗng (Empty State):** Lần đầu tiên vào trang khi chưa có dữ liệu nào, màn hình sẽ hiển thị gì?