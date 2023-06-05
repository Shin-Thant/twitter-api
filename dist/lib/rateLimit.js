"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const AppError_1 = __importDefault(require("../config/AppError"));
const rateLimiter = (maxCount, rememberTimeInMs) => {
    return (0, express_rate_limit_1.default)({
        max: maxCount,
        windowMs: rememberTimeInMs,
        handler: rateLimitExceedHandler,
    });
};
exports.default = rateLimiter;
const rateLimitExceedHandler = (req, res, next, options) => {
    const exceedLimitErr = new AppError_1.default(options.message, options.statusCode);
    res.status(options.statusCode).json(exceedLimitErr.createAppErrorResponseBody());
};
