"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotFound = void 0;
const errors_1 = __importDefault(require("../errors"));
exports.default = (error, _, res, __) => {
    if (error instanceof errors_1.default) {
        return res.status(error.statusCode).json({
            message: typeof error.messages === 'string' ? [error.messages] : error.messages,
            ...(error.infos && { infos: error.infos }),
        });
    }
    console.error(error);
    if (error instanceof Error) {
        return res.status(500).json({
            message: [error.message],
        });
    }
    return res.status(500).json({ message: 'Unexpected error.', error });
};
const handleNotFound = async (req, res, next) => {
    return res.status(404).json({
        message: `Não foi possível encontrar o recurso: ${req.method} ${req.originalUrl}`,
    });
};
exports.handleNotFound = handleNotFound;
