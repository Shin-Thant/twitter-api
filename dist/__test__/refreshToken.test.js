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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app/app"));
const database_1 = require("../config/database");
const createErrorResponseBody_1 = __importDefault(require("../util/createErrorResponseBody"));
const AppError_1 = __importDefault(require("../config/AppError"));
const createToken_1 = __importStar(require("../lib/createToken"));
const services_1 = require("./util/services");
const URL = "/api/v1/auth/refresh";
function createErrorBody(message, statusCode, status) {
    return (0, createErrorResponseBody_1.default)(new AppError_1.default(message, statusCode), status);
}
describe("Route /auth/refresh", () => {
    beforeAll(async () => {
        await (0, database_1.connectDB)();
    });
    afterAll(async () => {
        await (0, database_1.disconnectDB)();
    });
    describe("given no cookies", () => {
        it("should return status 401 and `Unauthorized!` message", async () => {
            const { body } = await (0, supertest_1.default)(app_1.default).get(URL).expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
    describe("given cookie without data", () => {
        it("should return status 401 and `Unauthorized!` message", async () => {
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", "token=")
                .expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
    describe("given no refresh token", () => {
        it("should return status 401 and `Unauthorized!` message", async () => {
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", "other=other-value")
                .expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
    describe("given invalid refresh token", () => {
        it("should return status 401 and `Unauthorized!` message", async () => {
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", "token=fake-token-to-hack")
                .expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
    describe("given refresh token with invalid payload", () => {
        it("should return status 401 and `Unauthorized!` message", async () => {
            const refreshToken = (0, createToken_1.default)({ name: "hi" }, "refresh");
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", `token=${refreshToken}`)
                .expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
    describe("given expired refresh token", () => {
        it("should return status 403 and `jwt expired` message", async () => {
            const expiredToken = jsonwebtoken_1.default.sign({ userInfo: { id: "someone-id" } }, (0, createToken_1.getSecretKey)("refresh"), { expiresIn: "-1s" });
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", `token=${expiredToken}`)
                .expect(403);
            expect(body).toEqual(createErrorBody("Token expired!", 403, "fail"));
        });
    });
    describe("given refresh token with invalid signature", () => {
        it("should return 401 and `Unauthorized!` message", async () => {
            const token = jsonwebtoken_1.default.sign({ userInfo: { id: "someone-id" } }, "invalid-signature");
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", `token=${token}`)
                .expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
    describe("given refresh token with invalid id", () => {
        it("should return status 401 and `Unauthorized!` message", async () => {
            const refreshToken = (0, createToken_1.default)({ userInfo: { id: "20fkajg30282jfl2952jfla;" } }, "refresh");
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", `token=${refreshToken}`)
                .expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
    describe('given token with invalid userId', () => {
        it('should return status 401 and `Unauthorized` message', async () => {
            const userId = (0, services_1.createObjectId)();
            const refreshToken = (0, createToken_1.default)({ userInfo: { id: userId } }, 'refresh');
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(URL)
                .set("Cookie", `token=${refreshToken}`)
                .expect(401);
            expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
        });
    });
});
