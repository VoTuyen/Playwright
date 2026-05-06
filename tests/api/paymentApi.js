import endpoints from '../constants/apiEndpoints.js';

export class PaymentApi {
    constructor(request) {
        this.request = request;
    }

    // Helper nội bộ để xử lý phản hồi JSON an toàn
    async _safeJson(response, methodName) {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error(`[API ERROR] ${methodName} returned non-JSON response:`, text.substring(0, 200));
            return { error: 'Invalid JSON', raw: text, status: response.status() };
        }
    }

    async getBenefitUser(authToken, platform) {
        const response = await this.request.get(endpoints[platform].fetch_user_benefit, {
            headers: { 'Authorization': authToken }
        });
        return await this._safeJson(response, 'getBenefitUser');
    }

    async getPackageScreen(authToken, platform, extraHeaders = {}) {
        const headers = {
            ...extraHeaders,
            ...(authToken ? { 'Authorization': authToken } : {})
        };
        const options = Object.keys(headers).length ? { headers } : {};
        const response = await this.request.get(endpoints[platform].package, options);
        return await this._safeJson(response, 'getPackageScreen');
    }

    async getPackageDetail(authToken, platform, plan_type) {
        const url = new URL(endpoints[platform].package_detail);
        url.searchParams.append('plan_type', plan_type);
        const response = await this.request.get(url.toString(), {
            headers: { 'Authorization': authToken }
        });
        return await this._safeJson(response, 'getPackageDetail');
    }


    async createTransaction(authToken, platform, data) {
        const endpoint = data.payment_gateway_code === 'INTERNATIONAL' 
            ? endpoints[platform].create_transaction_by_pmh 
            : endpoints[platform].create_transaction_by_fpl;

        console.log(endpoint);

        const response = await this.request.post(endpoint, {
            data: data,
            headers: {'Authorization': authToken}
        });
        const result = await this._safeJson(response, 'createTransaction');
        
        // Debug nếu API gặp lỗi nghiêm trọng (404, 500...)
        if (!response.ok()) {
            console.warn(`[API WARN] createTransaction failed with status ${response.status()}`);
        }
        return result;
    }

    async checkTransaction(platform, trans_id, authToken = null) {
        const url = new URL(endpoints[platform].check_transaction);
        url.searchParams.append('trans_id', trans_id);
        const headers = authToken ? { 'Authorization': authToken } : {};
        const response = await this.request.get(url.toString(), { headers });
        return await this._safeJson(response, 'checkTransaction');
    }

    async survey(authToken, platform, data) {
        const response = await this.request.post(endpoints[platform].survey, {
            data: data,
            headers: { 'Authorization': authToken }
        });
        return await this._safeJson(response, 'survey');
    }

    async surveyCustomerInfo(authToken, platform, payload) {
        const headers = {};
        if (authToken) {
            headers['Authorization'] = authToken;
        }
        
        const response = await this.request.post(endpoints[platform].survey, {
            data: payload,
            headers: headers
        });
        
        return {
            status: response.status(),
            body: await this._safeJson(response, 'surveyCustomerInfo')
        };
    }

    async getUserSubscriptions(authToken, platform) {
        const response = await this.request.get(endpoints[platform].user_subscriptions, {
            headers: { 'Authorization': authToken }
        });
        return await this._safeJson(response, 'getUserSubscriptions');
    }
}
