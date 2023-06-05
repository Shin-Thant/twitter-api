"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCookie = exports.clearTokenCookie = exports.setTokenCookie = void 0;
const AppError_1 = __importDefault(require("../config/AppError"));
const TOKEN_COOKIE_NAME = "token";
function setTokenCookie(res, token) {
    if (!token) {
        throw new AppError_1.default("Internal Server Error!", 500);
    }
    const maxAgeInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days
    const cookieOptions = {
        httpOnly: true,
        maxAge: maxAgeInMilliseconds,
        sameSite: "none",
        secure: true,
    };
    res.cookie(TOKEN_COOKIE_NAME, token, cookieOptions);
}
exports.setTokenCookie = setTokenCookie;
function clearTokenCookie(res) {
    const cookieOptions = {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };
    res.clearCookie(TOKEN_COOKIE_NAME, cookieOptions);
}
exports.clearTokenCookie = clearTokenCookie;
function isValidCookie(cookies) {
    return (typeof cookies === "object" &&
        !!cookies &&
        "token" in cookies &&
        typeof cookies.token === "string" &&
        !!cookies.token);
}
exports.isValidCookie = isValidCookie;
