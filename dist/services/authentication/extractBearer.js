"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractBearer = void 0;
const extractBearer = (headers) => {
    const authHeader = headers.authorization;
    if (!authHeader)
        return null;
    const [, token] = authHeader.split(' ');
    return token;
};
exports.extractBearer = extractBearer;
