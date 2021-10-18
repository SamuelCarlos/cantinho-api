"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("../../config/aws");
const sendSMS = async (message, phone) => {
    try {
        await aws_1.sns
            .setSMSAttributes({
            attributes: {
                DefaultSMSType: 'Transactional',
            },
        })
            .promise();
        await aws_1.sns
            .publish({
            Message: message,
            PhoneNumber: `+55${phone}`,
        })
            .promise();
    }
    catch (err) {
        console.error(err);
    }
};
exports.default = sendSMS;
