"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactivateProduct = void 0;
const getToken_1 = require("../../services/authentication/getToken");
const decodeToken_1 = require("../../services/authentication/decodeToken");
const database_1 = __importDefault(require("../../database"));
const product_1 = require("../../schemas/product");
const Product = database_1.default.model('product', product_1.productSchema);
const ReactivateProduct = async (req, res, next) => {
    const { SKU } = req.params;
    const token = (0, getToken_1.getToken)(req);
    const { userSKU } = (0, decodeToken_1.decodeToken)(token);
    try {
        if (!SKU) {
            return res.status(400).json({ message: 'SKU precisa ser informado' });
        }
        let product = await Product.findOne({ SKU }).exec();
        if (!product)
            return res.status(404).json({ message: 'Não foi encontrado produto com esse SKU' });
        if (product.user_SKU !== userSKU)
            return res.status(401).json({ message: 'Produto não pertence a este usuario' });
        if (product.deleted_at === null)
            return res.status(422).json({ message: 'Produto já ativo' });
        product = Object.assign(product, { updated_at: new Date(), deleted_at: null });
        await product.save();
        return res.status(200).json({ message: 'Produto reativado!' });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.ReactivateProduct = ReactivateProduct;
