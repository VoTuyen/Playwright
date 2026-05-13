# Hướng dẫn Logic Mapping Gói Dịch Vụ (CMS vs App API)

Tài liệu này ghi chú lại logic đối soát dữ liệu hiển thị màn hình Gói dịch vụ giữa **CMS (Tab Nhóm gói & Gói V5)** và **App API (`/paymentgw/packages`)**. Logic này đã được cập nhật và kiểm chứng đồng bộ 100% với Backend hiện tại (Môi trường Staging).

## 1. Logic lọc Nhóm Gói (Group Filter)

Một **Nhóm gói** chỉ được hiển thị (map) nếu thỏa mãn:
1. Nhóm gói đó được cấu hình có hỗ trợ **Platform hiện tại** (Ví dụ: Web, Mobile, SmartTV...).
2. Có chứa ít nhất 1 gói dịch vụ thỏa mãn điều kiện hiển thị ở phần (2).
*(Lưu ý: API Web tự động ẩn các nhóm không có gói nào, nhưng API iOS/Android có thể vẫn trả về nhóm rỗng tuỳ cấu hình CMS)*

### Đặc thù nền tảng:
- **Nhóm HOME**: Cấu hình hỗ trợ hiển thị trên đa nền tảng (Web, SmartTV, Mobile...).
- **Nhóm FPT Play GO**: Cấu hình CHỈ dành riêng cho nền tảng **iOS/Mobile**. (Các gói V.VIP1, V.VIP2 trên iOS được gán vào nhóm này thay vì nhóm HOME).

## 2. Logic lọc Gói Dịch Vụ (Package Filter)

Một **Gói dịch vụ** bên trong nhóm chỉ được hiển thị nếu thỏa mãn TẤT CẢ các điều kiện sau:

1. Gói thuộc về Nhóm đang xét (`package_group === group.type`).
2. Trạng thái gói trên CMS đang được bật (`status === 1`).
3. Gói được cấu hình hỗ trợ **Platform hiện tại** (có key platform tương ứng trong tab Gói V5).
4. **Logic lọc theo loại tài khoản (is_sub)**:
   - **Mọi gói đều được đối chiếu cứng dựa trên thuộc tính `is_sub`**.
   - Tài khoản **SUB** (is_sub_input = 1): API chỉ trả về các gói có `is_sub = true` (Ví dụ: V.VIP, S.VIP).
   - Tài khoản **SA** và **Guest (Chưa login)** (is_sub_input = 0): API chỉ trả về các gói có `is_sub = false` (Ví dụ: V.VIP1, V.VIP2, Premium, Cine).

*Ghi chú: Đối với tài khoản SA, logic hiển thị màn hình gói hoàn toàn tương tự như khi người dùng chưa đăng nhập (Guest).*

## 3. Tóm tắt kết quả Mapping thực tế

| Loại Tài Khoản | Nền Tảng | Nhóm Gói Hiển Thị | Gói Hiển Thị Bên Trong | Ghi Chú |
| :--- | :--- | :--- | :--- | :--- |
| **Guest / SA** | Web / Mobile Web | FPT Play NOW | Premium, Cine | Gói có `is_sub=false` |
| **Guest / SA** | Web / Mobile Web | FPT Play HOME | V.VIP1, V.VIP2 | Gói có `is_sub=false` |
| **Guest** | iOS | FPT Play NOW | Premium, Cine |
| **Guest** | iOS | FPT Play GO | V.VIP1, V.VIP2 | Trên iOS, gói V.VIP1/2 nằm trong nhóm GO |
| **SUB** | Web | FPT Play HOME | V.VIP, S.VIP | Gói có `is_sub=true`. Ẩn toàn bộ NOW |

---
**Cập nhật lần cuối:** 2026-05-13
**File triển khai Code:** `tests/utils/payment/packageMapper.js`
