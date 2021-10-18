"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.productSchema = new mongoose_1.default.Schema({
    SKU: {
        type: String,
        required: true,
    },
    user_SKU: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    buy_price: {
        type: Number,
        required: true,
    },
    sell_price: {
        type: Number,
        required: true,
    },
    sell_price_cash: {
        type: Number,
        required: true,
    },
    inventory: {
        type: Number,
        required: true,
    },
    qr_code: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
    },
    updated_at: {
        type: Date,
        required: false,
    },
    deleted_at: {
        type: Date,
        required: false,
    },
    states: [],
});
