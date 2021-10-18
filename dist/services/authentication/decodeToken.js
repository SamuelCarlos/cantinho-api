"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = __importDefault(require("../../errors"));
const decodeToken = (token) => {
    if (process.env.SALT_KEY) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.SALT_KEY);
        }
        catch (error) {
            throw new errors_1.default(401, 'Token inválido');
        }
    }
    throw new errors_1.default(500, 'Internal server error.');
};
exports.decodeToken = decodeToken;
