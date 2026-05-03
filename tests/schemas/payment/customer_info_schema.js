export const customer_info_schema = {
  type: "object",
  properties: {
    message: { type: "string" },
    msg_code: { type: "string" },
    msg_content: { type: "string" },
    msg_data: { type: ["object", "null"] },
    // Một số API CMS thường response 'msg', hỗ trợ thêm để pass validate linh động
    msg: { type: "string" }
  },
  anyOf: [
    { required: ["message"] },
    { required: ["msg_code"] }
  ],
  additionalProperties: true
};
