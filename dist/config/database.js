"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    // await mongoose.connect(process.env.DATABASE_URI);
    await mongoose_1.default.connect(process.env.LOCAL_DATABASE_URI);
}
exports.connectDB = connectDB;
async function disconnectDB() {
    await mongoose_1.default.disconnect();
    await mongoose_1.default.connection.close();
}
exports.disconnectDB = disconnectDB;
