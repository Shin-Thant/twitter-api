"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJWTPayloadValid = void 0;
function isJWTPayloadValid(payload) {
    return (!!payload &&
        typeof payload === "object" &&
        "userInfo" in payload &&
        typeof payload.userInfo === "object" &&
        "id" in payload.userInfo);
}
exports.isJWTPayloadValid = isJWTPayloadValid;
