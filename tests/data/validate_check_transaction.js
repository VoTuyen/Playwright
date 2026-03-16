import { create_transaction_by_pmh, create_transaction_by_fpl, survey, clear_user_data } from "../fixtures/paymentFixture.js"
import { authenticateUser } from "../config/authConfig.js";
import { check_transaction } from "../fixtures/paymentFixture.js";

async function clearPackage(request, phone) {
    const clear = await clear_user_data(request, phone)
    return  {survey_success: phone}
}

async function saveSurveyData(is_survey, request, authToken, phone) {
    if (is_survey == true) {
        const response_survey = await survey(request, authToken, phone)   
        return {survey_success: true, phone: phone} 
    } else {
        return {survey_success: false}
    }
}

async function handle_create_transaction(is_PMH, request, authToken, plan_id, over2h) {
    if (over2h) {
        return {
            PMH_success: is_PMH,
            plan_id,
            transaction_id: "1773301888-36417830",  // Thay thế bằng giá trị cứng các bạn muốn
            paymentLink: null  // Không cần paymentLink nếu không phải gọi API
        };
    }
    // Nếu là giao dịch PMH
    if (is_PMH) {
        const response_create_transaction_pmh = await create_transaction_by_pmh(request, authToken, plan_id);
        return {
            PMH_success: true,
            plan_id,
            transaction_id: response_create_transaction_pmh.msg_data.trans_id,
            paymentLink: response_create_transaction_pmh.msg_data.value_display
        };
    } else {
        // Nếu không phải PMH
        const response_create_transaction_fpl = await create_transaction_by_fpl(request, authToken, plan_id);
        return {
            PMH_success: false,
            plan_id,
            transaction_id: response_create_transaction_fpl.msg_data.trans_id,
            paymentLink: response_create_transaction_fpl.msg_data.payment_url
        };
    }
}

async function handle_payment_success(payment_success, page, paymentLink) {
    if (payment_success == true) {

        await page.goto(paymentLink)
        await page.waitForTimeout(25000)
        return {payment_success: true}
    }
}

async function checkTransactionStatus(request, authToken, platform, trans_id) {
    const response_check_transaction = await check_transaction(request, authToken, platform, trans_id)
    return response_check_transaction
}

export async function validate_check_transaction(is_survey, is_PMH, payment_success, plan_id, is_over2h, is_login, request, authToken, page, phone) {
    
    const result = await clearPackage(request, phone);
    console.log(result.survey_success)

    const surveyResult = await saveSurveyData(is_survey, request, authToken, phone);
    console.log('Survey Result:', surveyResult);

    const create_transaction_result = await handle_create_transaction(is_PMH, request, authToken, plan_id, is_over2h);
    console.log('Create Transaction Result:', create_transaction_result);

    const transaction_success = await handle_payment_success(payment_success, page, create_transaction_result.paymentLink);

    const check_transaction_result = await checkTransactionStatus(
        request, 
        is_login ? authToken : null, 
        '_w', 
        create_transaction_result.transaction_id);

    return {
        description : check_transaction_result.msg_data.description,
        payment_hub: check_transaction_result.msg_data.payment_hub,
        export: check_transaction_result.msg_data.info_billing.export,
        title: check_transaction_result.msg_data.info_billing.title,
        message: check_transaction_result.msg_data.info_billing.message,
        status_code: check_transaction_result.msg_data.status_code
    }
}