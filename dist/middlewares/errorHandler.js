"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../config/AppError"));
const createErrorResponseBody_1 = __importDefault(require("../util/createErrorResponseBody"));
const errorHandler = (err, _req, res, _next) => {
    if (err.name === "CastError") {
        console.log({ err });
        const badRequest = new Error("Bad Request!");
        return res
            .status(400)
            .json((0, createErrorResponseBody_1.default)(badRequest, "fail"));
    }
    // token expired error
    if (err.name === "TokenExpiredError") {
        const tokenExpiredErr = new AppError_1.default("Token expired!", 403);
        return res
            .status(403)
            .json(tokenExpiredErr.createAppErrorResponseBody());
    }
    // jwt error
    if (err.name === "JsonWebTokenError") {
        console.log("invalid!!!");
        const invalidTokenErr = new AppError_1.default("Unauthorized!", 401);
        return res
            .status(401)
            .json(invalidTokenErr.createAppErrorResponseBody());
    }
    // joi validation error
    if (err.name === "ValidationError") {
        console.log(err);
        return res.status(400).json((0, createErrorResponseBody_1.default)(err, "fail"));
    }
    if (err instanceof AppError_1.default) {
        return res
            .status(err.statusCode)
            .json(err.createAppErrorResponseBody());
    }
    // *this condition always has to be behind the `AppError` condition because `AppError` inherit `Error`
    res.status(500).json((0, createErrorResponseBody_1.default)(err));
};
// *handler each error with separate functions
/*
    validation error
    cast error
*/
exports.default = errorHandler;
