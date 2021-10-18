"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
exports.default = (password, hashedPassword) => {
    return (0, bcrypt_1.compare)(password, hashedPassword);
};
