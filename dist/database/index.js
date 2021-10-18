"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoID = process.env.MONGO_ID;
const mongoPass = process.env.MONGO_PASS;
const mongoDB = process.env.MONGO_DB;
const uri = `mongodb+srv://${mongoID}:${mongoPass}@cluster0.kv7x6.mongodb.net/${mongoDB}?retryWrites=true&w=majority`;
mongoose_1.default.connect(uri);
const connection = mongoose_1.default.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => console.log('MongoDB connected...'));
exports.default = connection;
