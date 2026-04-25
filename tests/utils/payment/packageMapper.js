/**
 * Logic mapper để chuyển đổi data từ CMS REST API sang cấu trúc giống App API (paymentgw)
 */

export function mapCMSDataToAppStructure(groupsData, packagesData, displayConfigData, platform = 'web', isLoggedIn = false, isSA = false) {
    const rawGroups = groupsData.data?.data || [];
    const rawPackages = packagesData.data?.data || [];
    const rawDisplay = displayConfigData.data?.data || [];

    // 1. Lấy danh sách các quyền lợi được phép hiển thị trên nhóm gói
    const activeFeatureKeys = rawDisplay
        .filter(d => d.is_display_on_package_group === true)
        .map(d => d.key);

    // Map platform của CMS sang key trong config_data
    // Web -> web-playfpt, Mobile -> mobile, default -> default
    let platformKey = 'web-playfpt';
    if (platform === '_ios' || platform === '_m') platformKey = 'mobile';

    const result = {
        subscriber_group: rawGroups
            .filter(group => {
                // 1. Lọc Group theo Platform
                const platforms = group.config?.platform || [];
                const targetGroup = platforms.find(p => {
                    if (platformKey === 'web-playfpt') return p.group === 'web' || p.group === 'smarttv_html'; 
                    if (platformKey === 'mobile') return p.group === 'mobile';
                    return false;
                });
                if (!targetGroup) return false;

                // 1.1 Logic cho SA: Ẩn nhóm fptplay_now (OTT) nếu đã có Home contract
                if (isSA && group.type === 'fptplay_now') return false;

                return targetGroup.type[platformKey] === "1" || targetGroup.type['default'] === "1";
            })
            .map(group => {
                // 2. Lọc các gói (Packages) thuộc nhóm này
                const packagesInGroup = rawPackages
                    .filter(p => {
                        // a. Đúng nhóm gói và đang bật (status=1)
                        if (p.package_group !== group.type || p.status !== 1) return false;

                        // b. Lọc Package theo Platform
                        const pPlatforms = p.config?.platform || [];
                        const pTargetGroup = pPlatforms.find(pg => {
                            if (platformKey === 'web-playfpt') {
                                return (pg.group === 'web' || pg.group === 'smarttv_html') && 
                                       (pg.type[platformKey] === "1" || pg.type['default'] === "1");
                            }
                            if (platformKey === 'mobile') {
                                return pg.group === 'mobile' && 
                                       (pg.type[platformKey] === "1" || pg.type['default'] === "1");
                            }
                            return false;
                        });
                        
                        // Nếu gói không cấu hình platform này thì ẩn
                        if (!pTargetGroup) return false;

                        // c. Logic ẩn gói dựa trên trạng thái Login & is_sub/is_iptv
                        const isSubPackage = (p.config?.is_sub === true || p.config?.is_iptv === true);
                        if (isLoggedIn) {
                            // User đã login (ví dụ SA) -> Thường chỉ xem các gói Sub/IPTV, ẩn các gói Guest-only
                            if (!isSubPackage) return false;
                        } else {
                            // Guest -> Ẩn các gói Sub/IPTV
                            if (isSubPackage) return false;
                        }

                        return true;
                    })
                    .sort((a, b) => (a.position || 0) - (b.position || 0))
                    .map(p => {
                        const pConfig = p.config?.config_data?.[platformKey] || p.config?.config_data?.['default'] || {};
                        return {
                            id: p.id,
                            type: p.plan_type,
                            name: pConfig.package_name?.text || p.package_name,
                            price_display: pConfig.price_display,
                            btn_buy_pack: p.config?.btn_buy_pack,
                            btn_buy_pack_text: pConfig.btn_buy_pack_text || "Mua ngay",
                        };
                    });

            // 3. Lọc quyền lợi (features) cho nhóm gói dựa trên tab Q/lý quyền lợi
            const groupFeatures = (group.config?.feature_display || [])
                .filter(f => activeFeatureKeys.includes(f.feature_type))
                .map(f => ({
                    feature_name: f.feature_name,
                    feature_type: f.feature_type,
                    type_display: f.type_display
                }));

            return {
                id: group.id,
                type: group.type,
                name: group.name,
                sub_text: group.sub_text,
                packages_list: packagesInGroup,
                features: groupFeatures
            };
        }).filter(g => g.packages_list.length > 0) // CHỈ HIỂN THỊ NHÓM CÓ GÓI
    };

    return result;
}
