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
