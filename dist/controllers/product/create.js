"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProduct = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const qrcode_1 = __importDefault(require("qrcode"));
const uuid_1 = require("uuid");
const yup = __importStar(require("yup"));
const database_1 = __importDefault(require("../../database"));
const product_1 = require("../../schemas/product");
const getToken_1 = require("../../services/authentication/getToken");
const decodeToken_1 = require("../../services/authentication/decodeToken");
const index_1 = __importDefault(require("../../errors/index"));
const Product = database_1.default.model('product', product_1.productSchema);
const CreateProductSchema = yup.object().shape({
    name: yup.string().required(),
    buy_price: yup.string().required(),
    sell_price: yup.string().required(),
    sell_price_cash: yup.string().required(),
    inventory: yup.number().required(),
});
const generateQR = async (text) => {
    try {
        return await qrcode_1.default.toDataURL(text, { width: 600 });
    }
    catch (err) {
        console.error(err);
    }
};
const uploadQR = async (SKU) => {
    const qr_code = await generateQR(SKU);
    if (!qr_code) {
        throw new index_1.default(500, 'Internal server error');
    }
    const buf = Buffer.from(qr_code.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const S3 = new aws_sdk_1.default.S3();
    const data = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `qr-${SKU}.png`,
        Body: buf,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/png',
    };
    try {
        const { Location } = await S3.upload(data).promise();
        return Location;
    }
    catch (err) {
        console.error(err);
    }
};
const CreateProduct = async (req, res, next) => {
    const { name, buy_price, sell_price, sell_price_cash, inventory } = req.body;
    const token = (0, getToken_1.getToken)(req);
    const { userSKU } = (0, decodeToken_1.decodeToken)(token);
    try {
        await CreateProductSchema.validate({ name, buy_price, sell_price, sell_price_cash, inventory })
            .then()
            .catch((error) => {
            return res.status(422).json({ [error.path]: error.message });
        });
        const created_at = new Date();
        const SKU = (0, uuid_1.v4)();
        const qr = await uploadQR(SKU);
        const ProductData = {
            SKU,
            user_SKU: userSKU,
            name,
            buy_price,
            sell_price,
            sell_price_cash,
            inventory,
            qr_code: qr,
            created_at,
            updated_at: null,
            deleted_at: null,
        };
        const NewProduct = await new Product({
            ...ProductData,
            states: [{ name, buy_price, sell_price, sell_price_cash, created_at, deleted_at: null }],
        });
        await NewProduct.save();
        return res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
    }
    catch (error) {
        console.error(error);
    }
};
exports.CreateProduct = CreateProduct;
