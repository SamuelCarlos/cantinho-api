"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProduct = void 0;
const database_1 = __importDefault(require("../../database"));
const getToken_1 = require("../../services/authentication/getToken");
const decodeToken_1 = require("../../services/authentication/decodeToken");
const product_1 = require("../../schemas/product");
const Product = database_1.default.model('product', product_1.productSchema);
const UpdateProduct = async (req, res, next) => {
    const { SKU } = req.params;
    const { name, buy_price, sell_price, sell_price_cash, inventory, created_at } = req.body;
    const token = (0, getToken_1.getToken)(req);
    const { userSKU } = (0, decodeToken_1.decodeToken)(token);
    try {
        let product = await Product.findOne({ SKU }).exec();
        if (!product)
            return res.status(404).json({ message: 'Produto não encontrado' });
        if (product.user_SKU !== userSKU)
            return res.status(401).json({ message: 'Produto não pertence a este usuario' });
        if (product.deleted_at !== null)
            return res.status(422).json({ message: 'Produto não pode ser alterado' });
        let newProductData = {};
        if (name)
            newProductData = { ...newProductData, name };
        if (buy_price)
            newProductData = { ...newProductData, buy_price };
        if (sell_price)
            newProductData = { ...newProductData, sell_price };
        if (sell_price_cash)
            newProductData = { ...newProductData, sell_price_cash };
        if (inventory)
            newProductData = { ...newProductData, inventory };
        if (created_at)
            newProductData = { ...newProductData, created_at };
        if (Object.keys(newProductData).length === 0)
            return res.status(400).json({ message: 'É necessário atualizar ao menos um campo' });
        newProductData = { ...newProductData, updated_at: new Date() };
        newProductData = {
            ...newProductData,
            states: [
                ...product.states,
                {
                    name: name || product.name,
                    buy_price: buy_price || product.buy_price,
                    sell_price: sell_price || product.sell_price,
                    sell_price_cash: sell_price_cash || product.sell_price_cash,
                    created_at: created_at || product.created_at,
                    deleted_at: null,
                },
            ],
        };
        product = Object.assign(product, newProductData);
        product = await product.save();
        return res.status(200).json({ message: 'Produto atualizado com sucesso!' });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.UpdateProduct = UpdateProduct;
