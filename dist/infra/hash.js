"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
exports.default = (password, saltRounds = 12) => {
    return (0, bcrypt_1.hash)(password, saltRounds);
};
