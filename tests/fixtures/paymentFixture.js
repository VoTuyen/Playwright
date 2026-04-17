import endpoints from '../constants/apiEndpoints.js';

export async function get_benefitUser(request, authToken, platform) {

    const response = await request.get(endpoints[platform].fetch_user_benefit, {
        headers: {
            //'X-DID': '10:39:4E:A8:85:32',
            'Authorization': authToken
        }
    })
    return await response.json()
}

export async function package_screen(request, authToken, platform) {

    const options = authToken ? {
        headers: {
            'Authorization': authToken
        }
    } : {}

    const response = await request.get(endpoints[platform].package, options)
    return await response.json()
} 

export async function create_transaction_by_pmh(request, authToken, plan_id) {  //xem hard platform là box để create transtion cho tiện
    const platform = "_w"
    const response = await request.post(endpoints[platform].create_transaction_by_pmh, {
        data: {
            number: "5200000000002235",
            cvv: "111",
            month: "12",
            year: "27",
            plan_id: plan_id,
            payment_gateway_code: "INTERNATIONAL",
            display_mode: "REDIRECT_URL",
            return_url: "https://web-v2:fptplay%402022@dev.fptplay.vn/dich-vu/thanh-toan/foxpay_credit",
            is_invoice_required: 0
        },
        headers: {
            'authorization': authToken
        }
    })
    return await response.json()
}

export async function create_transaction_by_fpl(request, authToken, plan_id) {  //xem hard platform là box để create transtion cho tiện
    const platform = "_w"
    const response = await request.post(endpoints[platform].create_transaction_by_fpl, {
        data: {
            card_number: "5200 0000 0000 2235",
            card_cvv: "111",
            card_expiration_month: "12",
            card_expiration_year: "27",
            plan_id: plan_id,
            //payment_gateway_code: "INTERNATIONAL",
            //display_mode: "REDIRECT_URL",
            return_url: "https://web-v2:fptplay%402022@dev.fptplay.vn/dich-vu/thanh-toan/foxpay_credit",
            //is_invoice_required: 0
        },
        headers: {
            'authorization': authToken
        }
    })
    return await response.json()
}

export async function check_transaction(request, authToken, platform, trans_id) {  //xem hard platform là box để create transtion cho tiện

    const url = new URL(endpoints[platform].check_transaction);
    url.searchParams.append('trans_id', trans_id);
    console.log('URL for check_transaction:', url.toString()); // In ra URL để debug

    // const options = {
    //     headers: authToken ? {
    //         'Authorization': authToken
    //     } : {},
    // } 

    //const response = await request.get(url.toString(), options)
    const response = await request.get(url.toString())
    return await response.json()
}

export async function survey(request, authToken, phone) {
    const platform = "_w"
    const response = await request.post(endpoints[platform].survey, {
        headers: {
            'Authorization': authToken
        },
        data: {
            phone: phone,
            address: '',
            is_internet: '1'
        }
    })
    return await response.json()
}   

export async function clear_user_data(request, phone) {
    const response = await request.post('https://staging-api-payment.fptplay.net/api/v1/clear_tester_data', {
        data: {
            phone: [phone]
        }
    })
    return await response.json()
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Subscription helpers ──────────────────────────────────────────────────────

export async function get_package_detail(request, authToken, platform, plan_type) {
    const url = new URL(endpoints[platform].package_detail);
    url.searchParams.append('plan_type', plan_type);
    console.log('[get_package_detail] URL:', url.toString());

    const response = await request.get(url.toString(), {
        headers: { 'Authorization': authToken }
    });
    return await response.json();
}

export async function get_user_subscriptions(request, authToken, platform) {
    const response = await request.get(endpoints[platform].user_subscriptions, {
        headers: { 'Authorization': authToken }
    });
    return await response.json();
}

// Thử mua gói — KHÔNG throw, capture response để assert
// Block khi: msg_data.type_display === 7
export async function try_create_transaction(request, authToken, platform, plan_type) {
    const response = await get_package_detail(request, authToken, platform, plan_type);
    const isBlocked = response?.msg_data?.type_display === 7;
    console.log(isBlocked)
    return {
        blocked:      isBlocked,
        type_display: response?.msg_data?.type_display ?? null,
        plan_id:      response?.msg_data?.plan_id ?? null,
        payment_link: response?.msg_data?.payment_url ?? null,
        raw:          response,
    };
}