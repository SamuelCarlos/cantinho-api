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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const ensureAuthentication_1 = __importDefault(require("../middlewares/ensureAuthentication"));
const handleErrors_1 = __importStar(require("../middlewares/handleErrors"));
const create_1 = require("../controllers/product/create");
const delete_1 = require("../controllers/product/delete");
const list_1 = require("../controllers/product/list");
const update_1 = require("../controllers/product/update");
const read_1 = require("../controllers/product/read");
const reactivate_1 = require("../controllers/product/reactivate");
const sell_1 = require("../controllers/event/sell");
const list_2 = require("../controllers/event/list");
const buy_1 = require("../controllers/event/buy");
const create_2 = require("../controllers/user/create");
const signin_1 = require("../controllers/auth/signin");
const resendSMS_1 = require("../controllers/auth/resendSMS");
const verify_1 = require("../controllers/user/verify");
router.post('/users', create_2.CreateUser);
router.post('/auth/signin', signin_1.Signin);
router.post('/auth/verify', verify_1.VerifyUser);
router.post('/auth/resendSMS', resendSMS_1.ResendSMS);
router.use(ensureAuthentication_1.default);
router.post('/product', create_1.CreateProduct);
router.delete('/product/:SKU', delete_1.DeleteProduct);
router.post('/product/:SKU', reactivate_1.ReactivateProduct);
router.get('/products', list_1.ListProducts);
router.put('/product/:SKU', update_1.UpdateProduct);
router.get('/product/:SKU', read_1.ReadProduct);
router.post('/sell/:SKU', sell_1.SellEvent);
router.post('/buy/:SKU', buy_1.BuyEvent);
router.get('/events', list_2.ListEvents);
router.use(handleErrors_1.default);
router.use(handleErrors_1.handleNotFound);
exports.default = router;
