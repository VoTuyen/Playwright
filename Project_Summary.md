# Tổng hợp các File và Chức năng Hệ thống Test CMS vs App API

Tài liệu này tổng hợp các thành phần mới đã được xây dựng để phục vụ việc tự động hóa đối soát dữ liệu giữa CMS (3 tab chính) và API Gói dịch vụ của App.

---

## 1. Thành phần Logic & Xử lý Dữ liệu

### [cmsApiHelper.js](file:///Users/votuyen/Dự án/playwright/tests/utils/auth/cmsApiHelper.js)
- **Chức năng**: Chứa các hàm `fetch` dữ liệu từ REST API của CMS.
- **Chi tiết**:
    - `fetchCMSPackageGroups`: Lấy thông tin từ tab **Nhóm gói**.
    - `fetchCMSPackagesV5`: Lấy thông tin từ tab **Gói V5**.
    - `fetchCMSDisplayConfig`: Lấy thông tin từ tab **Q/lý quyền lợi gói**.

### [packageMapper.js](file:///Users/votuyen/Dự án/playwright/tests/utils/payment/packageMapper.js) [NEW]
- **Chức năng**: "Trái tim" của hệ thống đối soát. Chuyển đổi dữ liệu hỗn hợp từ 3 API CMS sang cấu trúc JSON chuẩn của App API.
- **Logic xử lý**:
    - **Lọc Platform**: Chỉ lấy các nhóm/gói được bật cho từng nền tảng (Web, Mobile, iOS...).
    - **Lọc User Status**: Tự động ẩn/hiện các gói dịch vụ dựa trên trạng thái `isLoggedIn` và loại tài khoản `isSA`.
        - Guest (Chưa login): Chỉ hiện các gói có `is_sub: false`.
        - SA (Đã có contract): Chỉ hiện các gói `is_sub: true` và ẩn nhóm gói OTT (`fptplay_now`).
    - **Lọc Quyền lợi**: Chỉ cho phép hiển thị các Đặc quyền (`features`) đã được bật trong tab CMS thứ 3.

---

## 2. Thành phần Kiểm thử (Testing)

### [package_screen.spec.js](file:///Users/votuyen/Dự án/playwright/tests/pages/payment/package_screen.spec.js)
- **Chức năng**: Script test chính thực hiện việc so sánh.
- **Quy trình chạy**:
    1. Gọi API App (`/paymentgw/packages`).
    2. Gọi đồng thời 3 API CMS để lấy config hiện tại.
    3. Dùng `packageMapper` để tạo ra "Kết quả mong đợi" từ CMS.
    4. So sánh (Assert) từng field: Số lượng nhóm, Tên nhóm, Danh sách gói, Tên gói, Giá tiền, Trạng thái nút mua...

### [paymentData.js](file:///Users/votuyen/Dự án/playwright/tests/data/paymentData.js)
- **Chức năng**: Quản lý bộ data test cho nhiều loại tài khoản (Guest, SA, SUB) và nhiều platform.
- **Tiện ích**: Giúp chạy một script test duy nhất cho hàng loạt kịch bản khác nhau.

---

## 3. Thành phần Xác thực & Quản lý Config

### [captureCMSAuth.js](file:///Users/votuyen/Dự án/playwright/tests/utils/auth/captureCMSAuth.js) [NEW]
- **Chức năng**: Script hỗ trợ bắt JWT token từ trình duyệt khi user đăng nhập vào CMS.
- **Sử dụng**: Chạy `node captureCMSAuth.js` để cập nhật token mới vào file `cms_auth.json`.

### [cms_auth.json](file:///Users/votuyen/Dự án/playwright/tests/utils/auth/cms_auth.json) [NEW]
- **Chức năng**: Lưu trữ token xác thực CMS để các script API có thể tự động gọi mà không cần đăng nhập lại.

---

## 4. Công cụ Hỗ trợ Debug (Dùng khi cần)

- [dump_all_cms.js](file:///Users/votuyen/Dự án/playwright/dump_all_cms.js): Script nhanh để export dữ liệu CMS ra file JSON phục vụ phân tích.
- [intercept_cms.js](file:///Users/votuyen/Dự án/playwright/intercept_cms.js): Công cụ bắt các request API khi đang thao tác tay trên CMS.

---

> [!TIP]
> Để chạy bộ test này, bạn chỉ cần dùng lệnh:
> `npx playwright test tests/pages/payment/package_screen.spec.js`
