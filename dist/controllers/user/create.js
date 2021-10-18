"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
const database_1 = __importDefault(require("../../database"));
const uuid_1 = require("uuid");
const hash_1 = __importDefault(require("../../infra/hash"));
const user_1 = require("../../schemas/user");
const sendSMS_1 = __importDefault(require("../../services/SNS/sendSMS"));
const User = database_1.default.model('user', user_1.userSchema);
const CreateUser = async (req, res, next) => {
    const { phone, password } = req.body;
    try {
        if (!phone || !password)
            return res.status(400).json({ message: 'É preciso informar telefone e senha' });
        const existentUser = await User.findOne({ phone, deleted_at: null });
        if (existentUser)
            return res.status(422).json({ message: 'Usuário já cadastrado' });
        const verification_token = Array(6)
            .fill(0)
            .map(() => Math.random().toString(36).charAt(2))
            .join('')
            .toUpperCase();
        const newUser = new User({
            SKU: (0, uuid_1.v4)(),
            phone,
            password: await (0, hash_1.default)(password, 12),
            is_verified: false,
            verification_token,
            created_at: new Date(),
        });
        const phoneNumber = phone.replace(/[^0-9]/g, '');
        await (0, sendSMS_1.default)(`SMS de confirmação de conta Cantinho. Codigo: ${verification_token}`, phoneNumber);
        await newUser.save();
        return res.status(201).json({ message: 'Usuário criado com sucesso' });
    }
    catch (error) {
        console.error(error);
    }
};
exports.CreateUser = CreateUser;
