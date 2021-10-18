"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.eventSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        required: true,
    },
    sell_type: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    created_at: {
        type: Date,
        required: true,
    },
    product: {
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
    },
});
