import { PLATFORM } from '../../constants/platforms.js';

/**
 * Logic mapper để chuyển đổi data từ CMS REST API sang cấu trúc giống App API (paymentgw)
 */

export function mapCMSDataToAppStructure(groupsData, packagesData, displayConfigData, platformArg = 'web', isLoggedIn = false, isSA = false, is_sub_input = 0) {
    const rawGroups = groupsData.data?.data || [];
    const rawPackages = packagesData.data?.data || [];
    const rawDisplay = displayConfigData.data?.data || [];

    // Chuẩn hóa platform truyền vào. Mặc định là WEB (_w)
    const platform = platformArg === 'web' ? PLATFORM.WEB : platformArg;

    const PLATFORM_CONFIG = {
        [PLATFORM.WEB]:     { groups: ['web', 'smarttv_html'], visibilityKeys: ['web-playfpt', 'web'], priceKey: 'web-playfpt' },
        [PLATFORM.ANDROID]: { groups: ['mobile', 'android'], visibilityKeys: ['android', 'mobile'], priceKey: 'mobile' },
        [PLATFORM.IOS]:     { groups: ['mobile', 'ios'], visibilityKeys: ['ios', 'mobile'], priceKey: 'mobile' }
    };

    const currentCfg = PLATFORM_CONFIG[platform] || { groups: ['web', 'mobile'], visibilityKeys: ['default'], priceKey: 'default' };

    const result = {
        subscriber_group: rawGroups
            .filter(group => {
                const platforms = group.config?.platform || [];
                const isGroupVisible = platforms.some(p => {
                    if (!currentCfg.groups.includes(p.group)) return false;
                    const setupKeys = Object.keys(p.type || {});
                    const hasTag = currentCfg.visibilityKeys.some(key => setupKeys.includes(key)) || setupKeys.includes('default');
                    return hasTag;
                });
                return isGroupVisible;
            })
            .map(group => {
                const packagesInGroup = rawPackages
                    .filter(p => {
                        if (p.package_group !== group.type || p.status !== 1) return false;
                        
                        const pPlatforms = p.config?.platform || [];
                        const isPkgVisible = pPlatforms.some(pg => {
                            if (!currentCfg.groups.includes(pg.group)) return false;
                            const pSetupKeys = Object.keys(pg.type || {});
                            return currentCfg.visibilityKeys.some(key => pSetupKeys.includes(key)) || pSetupKeys.includes('default');
                        });

                        if (!isPkgVisible) return false;

                        const isSubPackageOnCMS = (p.config?.is_sub === true || p.config?.is_iptv === true);
                        // SUB user (ký hợp đồng): thấy gói is_sub=true (V.VIP, VIP...)
                        // SA user (mua lẻ): thấy gói is_sub=false (V.VIP1, V.VIP2...)
                        if (is_sub_input === 1) return isSubPackageOnCMS;
                        return !isSubPackageOnCMS;
                    })
                    .sort((a, b) => (a.position || 0) - (b.position || 0))
                    .map(p => {
                        const pConfig = p.config?.config_data?.[currentCfg.priceKey] || p.config?.config_data?.['default'] || {};
                        return {
                            type: p.plan_type,
                            package_name: { text: pConfig.package_name?.text || p.package_name, color: "" },
                            price_display: pConfig.price_display,
                            btn_buy_pack: p.config?.btn_buy_pack || 1,
                            btn_buy_pack_text: pConfig.btn_buy_pack_text || "Mua ngay",
                        };
                    });

                return {
                    type: group.type,
                    name: group.name,
                    sub_text: group.sub_text || "",
                    packages_list: packagesInGroup,
                    features_display: group.config?.feature_display || []
                };
            })
            .filter(g => {
                // ĐẶC BIỆT: App API trên Web tự động ẩn nhóm rỗng, nhưng trên iOS/Android thì giữ lại nhóm rỗng
                if (platform === PLATFORM.WEB) {
                    return g.packages_list.length > 0;
                }
                return true; 
            })
    };

    return result;
}
