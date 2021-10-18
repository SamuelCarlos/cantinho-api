"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProducts = void 0;
const database_1 = __importDefault(require("../../database"));
const getToken_1 = require("../../services/authentication/getToken");
const decodeToken_1 = require("../../services/authentication/decodeToken");
const product_1 = require("../../schemas/product");
const Product = database_1.default.model('product', product_1.productSchema);
const ListProducts = async (req, res, next) => {
    const params = req.query;
    const token = (0, getToken_1.getToken)(req);
    const { userSKU } = (0, decodeToken_1.decodeToken)(token);
    const { search, page, step, with_deleted } = params;
    const parsedParams = {
        search: typeof search === 'string' && search.length > 0 ? search.toString() : null,
        page: Number.isNaN(Number(page)) ? 1 : Number(page),
        step: Number.isNaN(Number(step)) ? 10 : Number(step),
        with_deleted: with_deleted === 'true' ? true : false,
    };
    try {
        let searchParams = {};
        if (parsedParams.search !== null)
            searchParams = { name: { $regex: search, $options: 'i' } };
        if (parsedParams.with_deleted === false)
            searchParams = { ...searchParams, deleted_at: null };
        searchParams = { ...searchParams, user_SKU: userSKU };
        const products = await Product.find(searchParams)
            .skip(parsedParams.step * (parsedParams.page - 1))
            .limit(parsedParams.step)
            .select(['-states', '-__v', '-user_SKU', '-_id'])
            .exec();
        return res.status(200).json({ products });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
};
exports.ListProducts = ListProducts;
