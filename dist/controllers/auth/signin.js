"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signin = void 0;
const database_1 = __importDefault(require("../../database"));
const compare_1 = __importDefault(require("../../infra/compare"));
const user_1 = require("../../schemas/user");
const generateToken_1 = require("../../services/authentication/generateToken");
const User = database_1.default.model('user', user_1.userSchema);
const Signin = async (req, res, next) => {
    const { phone, password } = req.body;
    try {
        if (!phone || !password)
            return res.status(400).json({ message: 'É preciso informar telefone e senha' });
        const existentUser = await User.findOne({ phone });
        if (!existentUser)
            return res.status(404).json({ message: 'Usuário não existente' });
        if (!existentUser.is_verified)
            return res.status(422).json({ message: 'Usuário não verificado' });
        const isEqualPassword = await (0, compare_1.default)(password, existentUser.password);
        if (!isEqualPassword)
            return res.status(400).json({ message: 'E-mail ou senha incorretos' });
        const token = await (0, generateToken_1.generateToken)(existentUser);
        return res.status(200).json({ message: 'Usuário logado com sucesso', token });
    }
    catch (error) {
        console.error(error);
    }
};
exports.Signin = Signin;
