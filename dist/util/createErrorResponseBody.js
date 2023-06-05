"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createErrorResponseBody(err, status) {
    if (!err) {
        return handleNoInitError();
    }
    return handleErrorBody(status || "error", err.message || "Sometihng went wrong!");
}
exports.default = createErrorResponseBody;
function handleNoInitError() {
    return {
        status: "error",
        message: "Something went wrong!",
    };
}
function handleErrorBody(status, message) {
    return {
        status,
        message,
    };
}
