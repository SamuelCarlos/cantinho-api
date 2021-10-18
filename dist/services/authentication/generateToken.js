"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = __importDefault(require("../../errors"));
const generateToken = async (user) => {
    const role = 'user';
    if (!user || !user.SKU) {
        throw new errors_1.default(400, 'User not found');
    }
    if (!process.env.SALT_KEY) {
        throw new errors_1.default(500, 'Internal server error, no salt key');
    }
    const token = jsonwebtoken_1.default.sign({
        userSKU: user.SKU,
        role,
    }, process.env.SALT_KEY, {
        expiresIn: '365 d',
    });
    return token;
};
exports.generateToken = generateToken;
