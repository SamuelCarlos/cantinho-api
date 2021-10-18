"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sns = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.credentials = new aws_sdk_1.default.Credentials(process.env.AWS_ACCESS_ID || '', process.env.AWS_ACCESS_SECRET || '');
aws_sdk_1.default.config.update({ region: process.env.AWS_REGION || '' });
const sns = new aws_sdk_1.default.SNS({
    region: 'us-east-2',
});
exports.sns = sns;
