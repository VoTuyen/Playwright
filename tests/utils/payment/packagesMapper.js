/**
 * Mapper xử lý việc so sánh dữ liệu giữa API và CMS cho màn hình Gói dịch vụ
 */
export const packagesMapper = {
    /**
     * Trích xuất thông tin tóm tắt từ API Response để so sánh
     */
    extractDisplayInfo(apiResponse) {
        const groups = apiResponse?.msg_data?.subscriber_group || [];
        
        return groups.map(group => ({
            group_type: group.type,
            group_name: group.name,
            packages: group.packages_list.map(pkg => ({
                type: pkg.type,
                name: pkg.package_name.text,
                price: pkg.price_display,
                button_text: pkg.btn_buy_pack_text,
                button_state: pkg.btn_buy_pack,
                // Map các feature chính để dễ so sánh
                features: pkg.features_display.reduce((acc, f) => {
                    acc[f.feature_type] = f.is_active;
                    return acc;
                }, {})
            }))
        }));
    },

    /**
     * So sánh 2 bộ dữ liệu và trả về danh sách các trường bị lệch (Discrepancies)
     */
    compare(actual, expected) {
        const diffs = [];
        // Logic so sánh sẽ được triển khai chi tiết trong spec
        return diffs;
    }
};
