import path from 'path';
import { fileURLToPath } from 'url';
import { readDataFile } from '../utils/dataReader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper function để tạo cấu trúc Test Case đồng nhất từ dữ liệu thô (CSV).
 */
const createSubscriptionTest = ({
    id,
    desc,
    phone = '0565123455',
    curPkg, // { id, type, name }
    newPkg, // { id, type, name }
    permission,
    btn,
    planId,      // <--- Đổi thứ tự lên trước cho dễ nhập
    groupIdx = 0,
    listIdx = 1,
    notify = false
}) => ({
    tcs_id: id,
    tcs_description: desc,
    account: {
        phone: phone.toString(),
        client_id: '1aTxvUI1kFfTSuHFDObHkEs21sDTgm8bEUOCJs9a',
        platform: '_w',
    },
    current_package: {
        plan_id: curPkg.id,
        plan_type: curPkg.type,
        name: curPkg.name,
    },
    new_package: {
        plan_id: newPkg.id,
        plan_type: newPkg.type,
        name: newPkg.name,
    },
    expected: {
        purchase_permission: permission,
        btn_buy_pack: btn,
        btn_buy_pack_group_index: groupIdx,
        btn_buy_pack_list_index: listIdx,
        subscription_plan_id: planId,
        system_action_notify: notify === true || notify === 'true' || notify === 'TRUE'
    }
});

// 1. Đọc dữ liệu từ file CSV
const csvPath = path.join(__dirname, 'subscription_test_data.csv');
const rawData = readDataFile(csvPath);

// 2. Chuyển đổi dữ liệu và export
export const subscription_upgrade_data = rawData.map(row => {
    let phoneStr = row.phone ? row.phone.toString() : '';
    if (phoneStr && phoneStr.length === 9) {
        phoneStr = '0' + phoneStr;
    }

    return createSubscriptionTest({
        id: Number(row.id),
        desc: row.desc,
        phone: phoneStr,
        curPkg: { id: Number(row.cur_id), type: row.cur_type, name: row.cur_name },
        newPkg: { id: Number(row.new_id), type: row.new_type, name: row.new_name },
        permission: row.permission,
        btn: Number(row.btn),
        planId: Number(row.planId),
        groupIdx: Number(row.groupIdx),
        listIdx: Number(row.listIdx),
        notify: row.notify
    });
});
