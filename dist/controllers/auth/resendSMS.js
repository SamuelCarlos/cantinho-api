"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendSMS = void 0;
const database_1 = __importDefault(require("../../database"));
const user_1 = require("../../schemas/user");
const sendSMS_1 = __importDefault(require("../../services/SNS/sendSMS"));
const User = database_1.default.model('user', user_1.userSchema);
const ResendSMS = async (req, res, next) => {
    const { phone } = req.body;
    try {
        if (!phone)
            return res.status(400).json({ message: 'É preciso informar telefone' });
        let existentUser = await User.findOne({ phone });
        if (!existentUser)
            return res.status(404).json({ message: 'Não existe usuário com esse telefone.' });
        if (existentUser.is_verified)
            return res.status(422).json({ message: 'Usuário já verificado' });
        const verification_token = Array(6)
            .fill(0)
            .map(() => Math.random().toString(36).charAt(2))
            .join('')
            .toUpperCase();
        existentUser = Object.assign(existentUser, { verification_token, is_verified: false });
        await existentUser.save();
        const phoneNumber = phone.replace(/[^0-9]/g, '');
        await (0, sendSMS_1.default)(`SMS de confirmação de conta Cantinho. Codigo: ${verification_token}`, phoneNumber);
        return res.status(200).json({ message: 'SMS reenviado' });
    }
    catch (error) {
        console.error(error);
    }
};
exports.ResendSMS = ResendSMS;
