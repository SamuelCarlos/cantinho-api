"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(statusCode, messages, infos) {
        super();
        this.statusCode = statusCode;
        this.infos = infos;
        this.messages = this.buildMessages(messages);
    }
    buildMessages(messages) {
        if (typeof messages === 'string') {
            return messages;
        }
        return Array.from(messages);
    }
}
exports.default = ErrorHandler;
