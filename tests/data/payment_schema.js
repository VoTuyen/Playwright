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
          type: "object",
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

export const package_screen_schema = {
  type: "object",
  properties: {
    msg_code: { type: "string" },
    msg_content: { type: "string" },
    msg_data: {
      type: "object",
      properties: {
        subscriber_group: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              name: { type: "string" },
              "sub-text": { type: "string" },
              background: { type: "string" },
              block_highlight: {
                type: "object",
                properties: {
                  image: { type: "string" },
                  background: { type: "string" },
                  inactive_background: { type: "string" },
                  background_image: { type: "string" },
                  color_code: { type: "string" },
                  color_code_web: { type: "string" },
                  background_image_table: { type: "string" },
                  background_image_mobile: { type: "string" },
                  footer_banners: {
                    type: ["array", "null"],
                    //items: { type: "string" }
                  }
                },
                required: ["image", "background", "inactive_background", "background_image", "color_code", "color_code_web", "background_image_table", "background_image_mobile"],
                additionalProperties: true
              },
              is_focus: { anyOf: [{ type: "integer" }, { type: "number" }] },
              is_app_review: { anyOf: [{ type: "integer" }, { type: "number" }] },
              packages_list: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    package_name: {
                      type: "object",
                      properties: {
                        image_url: { type: "string" },
                        text: { type: "string" },
                        image_gif: { type: "string" }
                      },
                      required: ["image_url", "text", "image_gif"],
                      additionalProperties: true
                    },
                    is_highlight: { type: "boolean" },
                    is_promotion: { type: "boolean" },
                    block_highlight: {
                      type: "object",
                      properties: {
                        image_url: { type: "string" }
                      },
                      required: ["image_url"],
                      additionalProperties: false
                    },
                    price_display: { type: "string" },
                    price_display_duration: { type: "string" },
                    promo: {
                      type: "object",
                      properties: {
                        base_price: { type: "string" },
                        description: { type: "string" }
                      },
                      required: ["base_price", "description"],
                      additionalProperties: true
                    },
                    drm_system_type: { type: "string" },
                    lbl_state: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        image_url: { type: "string" }
                      },
                      additionalProperties: true
                    },
                    package_label: { type: "string" },
                    type: { type: "string" },
                    features_display: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          feature_type: { type: "string" },
                          is_active: { anyOf: [{ type: "integer" }, { type: "number" }] },
                          value: {
                            type: "object",
                            properties: {
                              image_url: { type: "string" },
                              text: { type: "string" },
                              extra_text: { type: "string" }
                            },
                            required: [],//có nhiều kiểu khác nhau nên ko bắt buộc
                            additionalProperties: false
                          }
                        },
                        required: ["feature_type", "is_active", "value"],
                        additionalProperties: true
                      }
                    },
                    btn_buy_pack: { anyOf: [{ type: "integer" }, { type: "number" }] },
                    btn_buy_pack_text: { type: "string" },
                    position: { anyOf: [{ type: "integer" }, { type: "number" }] },
                    service_id: { type: "string" }
                  },
                  required: ["package_name", "is_highlight", "is_promotion", "price_display", "price_display_duration", "promo", "lbl_state", "type", "features_display", "btn_buy_pack", "btn_buy_pack_text", "position", "service_id"],
                  additionalProperties: true
                }
              },
              features_display: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    position: { anyOf: [{ type: "integer" }, { type: "number" }] },
                    name: { type: "string" },
                    feature_type: { type: "string" },
                    value: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        color_code: { type: "string" },
                        redirect_link: { type: "string" },
                        is_tab: { type: "string" },
                        description: { type: "string" },
                        image_url: { type: "string" }
                      },
                      required: [],
                      additionalProperties: true
                    }
                  },
                  required: ["position", "name", "feature_type", "value"],
                  additionalProperties: true
                }
              },
              desc_page_payment: {
                type: "object",
                properties: {
                  text: {
                    type: "array",
                    items: { type: "string" }
                  },
                  icon: {
                    type: "array",
                    items: { type: "string" }
                  },
                  platform_text: { type: "string" }
                },
                required: ["text", "icon", "platform_text"],
                additionalProperties: true
              }
            },
            required: ["type", "name", "packages_list", "features_display", "desc_page_payment"],
            additionalProperties: true
          }
        }
      },
      required: ["subscriber_group"],
      additionalProperties: false
    }
  },
  required: ["msg_code", "msg_content", "msg_data"],
  additionalProperties: true
};

