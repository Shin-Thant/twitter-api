"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, status) {
        super(message);
        this.isOperational = true;
        this.name = "AppError";
        this.statusCode = statusCode;
        this._status = status
            ? status
            : statusCode.toString().startsWith("4")
                ? "fail"
                : "error";
        Object.setPrototypeOf(this, AppError.prototype);
    }
    createAppErrorResponseBody() {
        return {
            status: this._status,
            message: this.message,
        };
    }
}
exports.default = AppError;
