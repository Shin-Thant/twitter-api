"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../config/AppError"));
function throwAppError() {
    throw new AppError_1.default("app error", 404);
}
describe("AppError when called", () => {
    it("should throw AppError", () => {
        expect(() => throwAppError()).toThrow(AppError_1.default);
    });
    const appError = new AppError_1.default("app error", 404);
    describe("isOperational property", () => {
        it("should be existed", () => {
            expect("isOperational" in appError).toBe(true);
        });
        it("should be true", () => {
            expect(appError.isOperational).toBe(true);
        });
    });
    it("message should be same as argument", () => {
        expect(appError.message).toEqual("app error");
    });
    it("should not have `status` property", () => {
        expect("status" in appError).toBe(false);
    });
    describe("statusCode property", () => {
        it("should be existed", () => {
            expect("statusCode" in appError).toBe(true);
        });
        it("should be number", () => {
            expect(typeof appError.statusCode).toBe("number");
        });
    });
    describe("createAppErrorResponseBody method", () => {
        it("should be existed", () => {
            expect("createAppErrorResponseBody" in appError).toBe(true);
        });
        it("should return error response object", () => {
            const returnValue = {
                status: "fail",
                message: "app error",
            };
            const errorResponseObj = appError.createAppErrorResponseBody();
            expect(errorResponseObj).toEqual(returnValue);
        });
    });
});
