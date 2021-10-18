"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUser = void 0;
const database_1 = __importDefault(require("../../database"));
const user_1 = require("../../schemas/user");
const generateToken_1 = require("../../services/authentication/generateToken");
const User = database_1.default.model('user', user_1.userSchema);
const VerifyUser = async (req, res, next) => {
    const { verification_token, phone } = req.body;
    try {
        if (!phone || !verification_token)
            return res.status(400).json({ message: 'É preciso informar telefone e token' });
        let existentUser = await User.findOne({ phone });
        if (!existentUser)
            return res.status(404).json({ message: 'Não existe usuário com esse telefone.' });
        if (existentUser.verification_token !== verification_token)
            return res.status(422).json({ message: 'Token incorreto.' });
        existentUser = Object.assign(existentUser, { is_verified: true, verification_token: null });
        await existentUser.save();
        const token = await (0, generateToken_1.generateToken)(existentUser);
        return res.status(200).json({ message: 'Usuário verificado com sucesso', token });
    }
    catch (error) {
        console.error(error);
    }
};
exports.VerifyUser = VerifyUser;
