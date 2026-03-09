import Ajv from 'ajv';
const ajv = new Ajv();

// schema mẫu: 
export const benefit_schema = {
  type: "object",
  properties: {
    msg_code: { type: "string" },
    msg_content: { type: "string" },
    msg_data: {
      type: "object",
      properties: {
        phone: { type: "string" },
        benefit_info: { type: "string" }
      },
      required: ["phone", "benefit_info"],
      additionalProperties: false
    }
  },
  required: ["msg_code", "msg_content", "msg_data"],
  additionalProperties: false
};

export const check_transaction_schema = {    
  type: "object",
  properties: {
    msg_code: { type: "string" },
    msg_content: { type: "string" },
    msg_data: {
      type: "object",
      properties: {
        description: { type: "string" },
        payment_hub: { type: "boolean" },
        info_billing: {
           type: "object" ,
            properties: {
               export: { type: "boolean" },
               title: { type: "string" },
               message: { type: "string" },
            },
            required: ["export", "title", "message"],
            additionalProperties: false
        },
        status_code: { type: "string" }
      },
      required: ["description", "payment_hub", "info_billing", "status_code"],
      additionalProperties: false
    }
  },
  required: ["msg_code", "msg_content", "msg_data"],
  additionalProperties: false
}

