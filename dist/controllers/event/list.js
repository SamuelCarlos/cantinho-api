"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEvents = void 0;
const database_1 = __importDefault(require("../../database"));
const event_1 = require("../../schemas/event");
const getToken_1 = require("../../services/authentication/getToken");
const decodeToken_1 = require("../../services/authentication/decodeToken");
const Event = database_1.default.model('event', event_1.eventSchema);
const ListEvents = async (req, res, next) => {
    const { startDate = null, endDate = null, type = null } = req.body;
    let params = {};
    const token = (0, getToken_1.getToken)(req);
    const { userSKU } = (0, decodeToken_1.decodeToken)(token);
    try {
        if (startDate && !endDate)
            params = {
                ...params,
                created_at: { $gte: new Date(startDate) },
            };
        if (endDate && !startDate)
            params = {
                ...params,
                created_at: { $lte: new Date(endDate) },
            };
        if (endDate && startDate)
            params = {
                created_at: { $gte: new Date(startDate), $lte: new Date(endDate) },
            };
        if (type && type !== 'buy' && type !== 'sell') {
            return res.status(400).json({ message: "Tipo não existe, deve ser 'buy', 'sell' ou null " });
        }
        if (type)
            params = { ...params, type };
        params = { ...params, product: { user_SKU: userSKU } };
        const events = await Event.find(params);
        return res.status(200).json(events);
    }
    catch (error) {
        console.error(error);
    }
};
exports.ListEvents = ListEvents;
