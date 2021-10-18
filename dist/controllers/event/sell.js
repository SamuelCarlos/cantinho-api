"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellEvent = void 0;
const database_1 = __importDefault(require("../../database"));
const event_1 = require("../../schemas/event");
const product_1 = require("../../schemas/product");
const getToken_1 = require("../../services/authentication/getToken");
const decodeToken_1 = require("../../services/authentication/decodeToken");
const Event = database_1.default.model('event', event_1.eventSchema);
const Product = database_1.default.model('product', product_1.productSchema);
const SellEvent = async (req, res, next) => {
    const { SKU } = req.params;
    const { quantity = 1, discount = 0, sell_type = 'cash' } = req.body;
    const token = (0, getToken_1.getToken)(req);
    const { userSKU } = (0, decodeToken_1.decodeToken)(token);
    try {
        let product = await Product.findOne({ SKU }).exec();
        if (!product)
            return res.status(404).json({ message: 'Produto não encontrado' });
        if (product.user_SKU !== userSKU)
            return res.status(401).json({ message: 'Produto não pertence a este usuario' });
        if (quantity <= 0)
            return res.status(400).json({ message: 'Quantity deve ser maior que 0' });
        if (product.inventory < quantity || product.inventory === 0)
            return res.status(422).json({ message: 'Não existe essa quantidade disponível em estoque' });
        if (sell_type !== 'cash' && sell_type !== 'portion')
            return res.status(422).json({ message: 'Tipo de venda deve ser cash ou portion' });
        const newEvent = await new Event({
            type: 'sell',
            sell_type,
            quantity,
            discount,
            created_at: new Date(),
            product: {
                SKU: product.SKU,
                user_SKU: userSKU,
                name: product.name,
                buy_price: product.buy_price,
                sell_price: product.sell_price,
                sell_price_cash: product.sell_price_cash,
                inventory: product.inventory,
                qr_code: product.qr_code,
            },
        });
        product = Object.assign(product, { inventory: product.inventory - quantity });
        await product.save();
        await newEvent.save();
        return res.status(201).json({ message: 'Evento gerado com sucesso!' });
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
exports.SellEvent = SellEvent;
