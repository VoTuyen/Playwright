export const packagesSchema = {
    type: 'object',
    required: ['msg_code', 'msg_data'],
    properties: {
        msg_code: { type: 'string', const: 'success' },
        msg_data: {
            type: 'object',
            required: ['subscriber_group'],
            properties: {
                subscriber_group: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['type', 'name', 'packages_list'],
                        properties: {
                            type: { type: 'string' },
                            name: { type: 'string' },
                            packages_list: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    required: ['type', 'package_name', 'price_display'],
                                    properties: {
                                        type: { type: 'string' },
                                        package_name: {
                                            type: 'object',
                                            properties: {
                                                text: { type: 'string' }
                                            }
                                        },
                                        price_display: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
