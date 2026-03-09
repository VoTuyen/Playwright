
import endpoints from '../data/apiEndpoints.js';

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

export async function create_transaction_by_pmh(request, authToken) {  //xem hard platform là box để create transtion cho tiện
    const platform = "_w"
    const response = await request.post(endpoints[platform].create_transaction_by_pmh, {
        data: {
            number: "5200000000002235",
            cvv: "111",
            month: "12",
            year: "27",
            plan_id: 6598,
            payment_gateway_code: "INTERNATIONAL",
            display_mode: "REDIRECT_URL",
            return_url: "https://dev.fptplay.vn/dich-vu/thanh-toan/foxpay_credit",
            is_invoice_required: 0
        },
        headers: {
            'authorization': authToken
        }
    })
    return await response.json()
}

export async function create_transaction_by_fpl(request, authToken) {  //xem hard platform là box để create transtion cho tiện
    const platform = "_w"
    const response = await request.post(endpoints[platform].create_transaction_by_fpl, {
        data: {
            card_number: "5200 0000 0000 2235",
            card_cvv: "111",
            card_expiration_month: "12",
            card_expiration_year: "27",
            plan_id: 6598,
            //payment_gateway_code: "INTERNATIONAL",
            //display_mode: "REDIRECT_URL",
            return_url: "https://dev.fptplay.vn/dich-vu/thanh-toan/foxpay_credit",
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

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}