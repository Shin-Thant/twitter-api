"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtVerifyHelpers_1 = require("../util/jwtVerifyHelpers");
const AppError_1 = __importDefault(require("../config/AppError"));
function verifyToken(token, secretKey) {
    const payload = jsonwebtoken_1.default.verify(token, secretKey);
    if (!(0, jwtVerifyHelpers_1.isJWTPayloadValid)(payload)) {
        console.log("invalid payload!");
        throw new AppError_1.default("Unauthorized!", 401);
    }
    return payload;
}
exports.default = verifyToken;
