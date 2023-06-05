"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../config/AppError"));
const createToken_1 = __importStar(require("../lib/createToken"));
const verifyJWT_1 = __importDefault(require("../middlewares/verifyJWT"));
const services_1 = require("./util/services");
const database_1 = require("../config/database");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app/app"));
describe("JWT token", () => {
    describe("token creation", () => {
        describe("given empty payload", () => {
            const mockJwtTokenSign = jest.spyOn(jsonwebtoken_1.default, "sign");
            it("should throw AppError", () => {
                expect(() => (0, createToken_1.default)({}, "access")).toThrow(AppError_1.default);
                expect(() => (0, createToken_1.default)({}, "access")).toThrow("Invalid jwt payload!");
            });
            it("should not call jwt.sign", () => {
                expect(mockJwtTokenSign).not.toHaveBeenCalled();
            });
        });
        describe("given valid payload", () => {
            it("should return token string", () => {
                const mockJwtTokenSign = jest
                    .spyOn(jsonwebtoken_1.default, "sign")
                    .mockImplementation(() => "mock jwt token");
                const secretKey = (0, createToken_1.getSecretKey)("access");
                const expiresIn = (0, createToken_1.getExpiresTimeString)("access");
                const token = (0, createToken_1.default)({ name: "john" }, "access");
                expect(mockJwtTokenSign).toHaveBeenCalled();
                expect(mockJwtTokenSign).toHaveBeenCalledWith({ name: "john" }, secretKey, {
                    expiresIn: expiresIn,
                });
                expect(token).toBe("mock jwt token");
            });
        });
    });
    describe("verify token middleware", () => {
        beforeAll(async () => {
            await (0, database_1.connectDB)();
        });
        afterAll(async () => {
            await (0, database_1.disconnectDB)();
        });
        const mockFn = jest.fn().mockImplementation((err) => err);
        let mockRequest;
        const mockResponse = {};
        const nextFunction = mockFn;
        function runVerifyJWT(req) {
            (0, verifyJWT_1.default)(req, mockResponse, nextFunction);
        }
        beforeEach(() => {
            mockRequest = {};
        });
        describe("given empty request header", () => {
            it("should return status 403 and `Missing request header!` message", () => {
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new AppError_1.default("Missing request headers!", 403);
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.statusCode).toBe(expectedErr.statusCode);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
        describe("given no Authorization header", () => {
            it("should return status 403 and `Missing authorization header!` message", () => {
                mockRequest = { headers: {} };
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new AppError_1.default("Missing authorization header!", 403);
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.statusCode).toBe(expectedErr.statusCode);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
        describe("given no token", () => {
            it("should return status 403 and `Missing token in authorization header!` message", () => {
                mockRequest = { headers: { authorization: "" } };
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new AppError_1.default("Missing token in authorization header!", 403);
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.statusCode).toBe(expectedErr.statusCode);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
        describe("given invalid token", () => {
            it("should return status 403 and `Invalid token` message", () => {
                mockRequest = {
                    headers: { authorization: "Bearer fake-token" },
                };
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new jsonwebtoken_1.JsonWebTokenError("jwt malformed");
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.name).toBe(expectedErr.name);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
        describe("given token without payload", () => {
            it("should return status 401 and `Unauthorized!` message", () => {
                const token = jsonwebtoken_1.default.sign({}, (0, createToken_1.getSecretKey)("access"));
                mockRequest = {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                };
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new AppError_1.default("Unauthorized!", 401);
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.statusCode).toBe(expectedErr.statusCode);
                expect(arg.name).toBe(expectedErr.name);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
        describe("given token with invalid payload", () => {
            it("should return status 401 and `Unauthorized!` message", () => {
                const token = (0, createToken_1.default)({ payload: "invalid payload" }, "access");
                mockRequest = {
                    headers: { authorization: `Bearer ${token}` },
                };
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new AppError_1.default("Unauthorized!", 401);
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.statusCode).toBe(expectedErr.statusCode);
                expect(arg.name).toBe(expectedErr.name);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
        describe("given token without valid user", () => {
            it("should return status 403 and `Invalid token!` message", async () => {
                const id = (0, services_1.createObjectId)();
                const bearerToken = (0, services_1.createBearerToken)(id);
                const { body } = await (0, supertest_1.default)(app_1.default)
                    .post("/api/v1/tweets")
                    .set("Authorization", bearerToken)
                    .expect(403);
                expect(body).toEqual({
                    status: "fail",
                    message: "Forbidden!",
                });
            });
        });
        describe("given expired token", () => {
            it("shouold return status 403 and `jwt expired!` message", async () => {
                const user = await (0, services_1.getRandomUser)();
                const token = jsonwebtoken_1.default.sign({ userInfo: { id: user?._id?.toString() } }, (0, createToken_1.getSecretKey)("access"), { expiresIn: "-1s" });
                mockRequest = {
                    headers: { authorization: `Bearer ${token}` },
                };
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new jsonwebtoken_1.TokenExpiredError("jwt expired", new Date("2023-05-04"));
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.name).toBe(expectedErr.name);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
        describe("given token with invalid signature", () => {
            it("should return status 403 and `Forbidden` message", () => {
                const token = jsonwebtoken_1.default.sign({}, "invalid-signature");
                mockRequest = {
                    headers: { authorization: `Bearer ${token}` },
                };
                runVerifyJWT(mockRequest);
                const arg = mockFn.mock.calls[0][0];
                const expectedErr = new jsonwebtoken_1.JsonWebTokenError("invalid signature");
                expect(nextFunction).toHaveBeenCalledWith(expectedErr);
                expect(arg.name).toBe(expectedErr.name);
                expect(arg.message).toBe(expectedErr.message);
            });
        });
    });
});
