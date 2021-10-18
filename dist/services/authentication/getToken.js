"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const errors_1 = __importDefault(require("../../errors"));
// Services
const extractBearer_1 = require("./extractBearer");
const getToken = (req) => {
    const token = (0, extractBearer_1.extractBearer)(req.headers);
    if (!token || token === 'null') {
        throw new errors_1.default(401, 'token invalido');
    }
    return token;
};
exports.getToken = getToken;
