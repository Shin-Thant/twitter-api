"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiresTimeString = exports.getSecretKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../config/AppError"));
// TODO: write test that check payload is a object containing `userInfo: {id: string}`
const createToken = (payload, tokenType) => {
    if (Object.keys(payload).length < 1) {
        throw new AppError_1.default("Invalid jwt payload!", 500);
    }
    const secretKey = (0, exports.getSecretKey)(tokenType);
    if (!secretKey || !secretKey.length) {
        throw new AppError_1.default("No secret key!", 500);
    }
    const expiresIn = (0, exports.getExpiresTimeString)(tokenType);
    return jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn,
    });
};
const getSecretKey = (tokenType) => {
    if (tokenType === "access") {
        return (process.env.ACCESS_TOKEN_SECRET_KEY || "unique-access-token-secret");
    }
    return process.env.REFRESH_TOKEN_SECRET_KEY || "unique-access-token-secret";
};
exports.getSecretKey = getSecretKey;
const getExpiresTimeString = (tokenType) => {
    return tokenType === "access" ? "15m" : "7d";
};
exports.getExpiresTimeString = getExpiresTimeString;
exports.default = createToken;
