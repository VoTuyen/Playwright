import { loadCMSAuthState } from './cmsAuthHelper.js';

const CMS_BASE_API = 'https://cms-api-staging.fbox.fpt.vn/cms/api/v1';

/**
 * Lấy JWT Token từ storage state
 */
function getCMSToken() {
    const storageState = loadCMSAuthState();
    const originData = storageState.origins?.find(o => o.origin === 'https://cms-staging.fbox.fpt.vn');
    const tokenItem = originData?.localStorage?.find(i => i.name === 'jwt_access_token');
    return tokenItem ? tokenItem.value : null;
}

/**
 * Tab: Nhóm gói
 */
export async function fetchCMSPackageGroups(request) {
    const token = getCMSToken();
    const url = `${CMS_BASE_API}/paymentPackage/package_v5/package_groups?limit=50&page=1`;
    const response = await request.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

/**
 * Tab: Gói V5
 */
export async function fetchCMSPackagesV5(request) {
    const token = getCMSToken();
    const url = `${CMS_BASE_API}/paymentPackage/package_v5?limit=100&page=1`;
    const response = await request.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

/**
 * Tab: Q/lý quyền lợi gói
 */
export async function fetchCMSDisplayConfig(request) {
    const token = getCMSToken();
    const url = `${CMS_BASE_API}/paymentPackage/display_package_config_v5?limit=100&page=1`;
    const response = await request.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}
