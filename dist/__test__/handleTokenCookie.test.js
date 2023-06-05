"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleTokenCookie_1 = require("../lib/handleTokenCookie");
const AppError_1 = __importDefault(require("../config/AppError"));
describe("Token Cookie", () => {
    describe("setTokenCookie", () => {
        describe("given empty token", () => {
            it("should thorw a AppError with status 500 and `Internal Server Error` message", () => {
                const mockResponse = {};
                const emptyToken = "";
                const expectedErr = new AppError_1.default("Internal Server Error!", 500);
                expect(() => (0, handleTokenCookie_1.setTokenCookie)(mockResponse, emptyToken)).toThrow(expectedErr);
                try {
                    (0, handleTokenCookie_1.setTokenCookie)(mockResponse, emptyToken);
                }
                catch (e) {
                    const err = e;
                    expect(err).toBeInstanceOf(AppError_1.default);
                    expect(err.name).toBe(expectedErr.name);
                    expect(err.message).toBe(expectedErr.message);
                    expect(err.statusCode).toBe(expectedErr.statusCode);
                }
            });
        });
    });
});
