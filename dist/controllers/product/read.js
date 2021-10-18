"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadProduct = void 0;
const database_1 = __importDefault(require("../../database"));
const getToken_1 = require("../../services/authentication/getToken");
const decodeToken_1 = require("../../services/authentication/decodeToken");
const product_1 = require("../../schemas/product");
const Product = database_1.default.model('product', product_1.productSchema);
const ReadProduct = async (req, res, next) => {
    const { SKU } = req.params;
    const token = (0, getToken_1.getToken)(req);
    const { userSKU } = (0, decodeToken_1.decodeToken)(token);
    try {
        const product = await Product.findOne({ SKU }).exec();
        if (!product)
            return res.status(404).json({ message: 'Produto não encontrado' });
        if (product.user_SKU !== userSKU)
            return res.status(401).json({ message: 'Produto não pertence a este usuario' });
        return res.status(200).json({ product });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.ReadProduct = ReadProduct;
