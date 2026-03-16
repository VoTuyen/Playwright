export const check_transaction_data = [
    {
        tcs_description: "Kiểm tra quá 2h vẫn là KHTN, gọi API check ko có token",
        id: 4, // khả năng hoá đơn đã thu hồi  nên đang báo xuất hoá đơn thất bại
        is_survey: true,
        is_PMH: true, //code check is_over2h trước, nên chỗ này cũng ko có quan trọng lắm
        payment_success: false, //transaction hard không cần chờ thanh toán
        plan_id: 7656,
        is_over2h: true,
        is_login: false,
        expected: {
            description: "Cảm ơn Quý khách đã đăng ký chuyển đổi Combo Internet SKY V.VIP. \nTư vấn viên sẽ sớm liên hệ để xác nhận đơn hàng cho Quý khách.",
            payment_hub: true,
            export: false,
            status_code: "SUCCESS",
            title: "",
            message: ""
        }
    },
    {   
        tcs_description: "Kiểm tra mua gói V.VIP2 ko suvey được xuất hoá đơn bth, gọi api check có token",
        id: 7,
        is_survey: false,
        is_PMH: true,
        payment_success: true,
        plan_id: 7656,
        is_over2h: false,  
        is_login: true, //chỉ check bỏ token cho API check_transaction thôi
        expected: {
            description: "Lưu ý: Quá 2 giờ kể từ thời điểm thanh toán thành công, FPTPlay không hỗ trợ xuất hóa đơn.",
            payment_hub: true,
            export: true,
            status_code : "SUCCESS",
            title: "",
            message: ""
        }
    },
    {
        tcs_description: "Kiểm tra mua gói V.VIP2 có survey là KHTN, gọi api check có token",
        id: 1,
        is_survey: true,
        is_PMH: true,
        payment_success: true,
        plan_id: 7656, //V.VIP2
        is_over2h: false,
        is_login: true,
        expected: {
            description: "Cảm ơn Quý khách đã đăng ký chuyển đổi Combo Internet SKY V.VIP. \nTư vấn viên sẽ sớm liên hệ để xác nhận đơn hàng cho Quý khách.",
            payment_hub: true,
            export: false,
            status_code: "SUCCESS",
            title: "",
            message: ""
        } 
    },
    {
        tcs_description: "Kiểm tra mua gói V.VIP1 có survey ko là KHTN, xuất hoá đơn bth, gọi api check có token",
        id: 2,
        is_survey: true,
        is_PMH: true,
        payment_success: true,
        plan_id: 7100, //V.VIP1
        is_over2h: false,
        is_login: true,
        expected: {
            description: "Lưu ý: Quá 2 giờ kể từ thời điểm thanh toán thành công, FPTPlay không hỗ trợ xuất hóa đơn.",
            payment_hub: true,
            export: true,
            status_code: "SUCCESS",
            title: "",
            message: ""
        }
    },
    {   
        id: 3,
        is_survey: true,
        is_PMH: false,
        payment_success: true,
        plan_id: 7656,
        is_over2h: false,
        is_login: true,
        expected: {
            description: "",
            payment_hub: false,
            export: false,
            status_code: "ERROR",
            title: "",
            message: ""
        }
    },
    {   
        id: 5,
        is_survey: false,
        is_PMH: true,
        payment_success: true,
        plan_id: 7656,
        is_over2h: false, 
        is_login: true,
        expected: {
            description: "Lưu ý: Quá 2 giờ kể từ thời điểm thanh toán thành công, FPTPlay không hỗ trợ xuất hóa đơn.",
            payment_hub: true,
            export: true,
            status_code : "SUCCESS",
            title: "",
            message: ""
        }
    },
    {
        id: 6, //xem lại, khả năng nếu quá 2h nên bổ sung 1 field cho trans_id để truyền transaction vào, ko hard chung bên trong được
        is_survey: false,
        is_PMH: true,
        payment_success: false, //transaction hard không cần chờ thanh toán
        plan_id: 7656,
        is_over2h: true,  // nếu true hard trans_id thoả điều kiện quá 2h
        is_login: true,
        expected: {
            description: "",
            payment_hub: true,
            export: false,
            status_code : "SUCCESS",
            title: "Yêu cầu xuất hóa đơn thất bại.",
            message: "Xuất hóa đơn thất bại do quá thời gian hỗ trợ. Giao dịch này sẽ lập hóa đơn khách hàng lẻ theo quy định của FPT và phù hợp với quy định của pháp luật."

        }
    },
    {
        id: 8,
        is_survey: false,
        is_PMH: true,
        payment_success: false, //không cần chờ timeout
        plan_id: 7656,
        is_over2h: false,  // nếu true hard trans_id thoả điều kiện quá 2h
        is_login: false, //chỉ check bỏ token cho API check_transaction thôi
        expected: {
            description: "",
            payment_hub: false,
            export: false,
            status_code : "PENDING",
            title: "",
            message: ""
        }
    },
];