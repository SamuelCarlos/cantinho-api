"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const errors_1 = __importDefault(require("../errors"));
const user_1 = require("../schemas/user");
const User = database_1.default.model('user', user_1.userSchema);
// Services
const decodeToken_1 = require("../services/authentication/decodeToken");
const getToken_1 = require("../services/authentication/getToken");
const ensureUserAuthenticated = async (req, res, next) => {
    try {
        const token = (0, getToken_1.getToken)(req);
        const { userSKU, role } = (0, decodeToken_1.decodeToken)(token);
        if (role === 'user') {
            const user = await User.findOne({ SKU: userSKU });
            if (!user) {
                throw new errors_1.default(401, 'token inválido');
            }
        }
        return next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = ensureUserAuthenticated;
