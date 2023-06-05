"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app/app"));
const database_1 = require("../config/database");
const User_1 = __importDefault(require("../models/User"));
jest.mock("../lib/rateLimit", () => (_arg1, _arg2) => {
    return (_req, _res, next) => {
        return next();
    };
});
describe("/auth", () => {
    beforeAll(async () => {
        await (0, database_1.connectDB)();
    });
    afterAll(async () => {
        await (0, database_1.disconnectDB)();
    });
    describe("/login", () => {
        describe("given invalid request body", () => {
            it("should return status 400 and a message", async () => {
                const requestBodyArr = [
                    {},
                    { email: "hello@gmail.com" },
                    { password: "hello@gmail.com" },
                ];
                const responseBody = {
                    message: "All fields are required!",
                    status: "fail",
                };
                for (const reqBody of requestBodyArr) {
                    const { body } = await (0, supertest_1.default)(app_1.default)
                        .post("/api/v1/auth/login")
                        .send(reqBody)
                        .expect(400);
                    expect(body).toEqual(responseBody);
                }
            });
        });
        describe("given invalid email", () => {
            it("should return status 400 and a 'Invalid email or password!' message", async () => {
                const reqBody = {
                    email: "invalid@mail.com",
                    password: "randomstr",
                };
                const responseBody = {
                    message: "Invalid email or password!",
                    status: "fail",
                };
                const { body } = await (0, supertest_1.default)(app_1.default)
                    .post("/api/v1/auth/login")
                    .send(reqBody)
                    .expect(400);
                expect(body).toEqual(responseBody);
            });
        });
        describe("given invalid password", () => {
            it("should return status 400 and a 'Invalid email or password!' message", async () => {
                const reqBody = {
                    email: "Ada_Schultz36@test.com",
                    password: "randomstr",
                };
                const responseBody = {
                    message: "Invalid email or password!",
                    status: "fail",
                };
                const { body } = await (0, supertest_1.default)(app_1.default)
                    .post("/api/v1/auth/login")
                    .send(reqBody)
                    .expect(400);
                expect(body).toEqual(responseBody);
            });
        });
        describe("given valid email and password", () => {
            let user;
            beforeAll(async () => {
                const foundUser = await User_1.default.findOne()
                    .populate("followers")
                    .lean()
                    .exec();
                user = foundUser;
            });
            it("should return user and access token", async () => {
                const reqBody = {
                    email: user.email,
                    password: "password123",
                };
                const { body } = await (0, supertest_1.default)(app_1.default)
                    .post("/api/v1/auth/login")
                    .send(reqBody)
                    .expect(200);
                expect(body).toEqual({
                    accessToken: expect.any(String),
                    user: {
                        _id: user._id.toString(),
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar,
                        following: user.following,
                        followers: user.followers,
                        counts: user.counts,
                        updatedAt: expect.any(String),
                        createdAt: expect.any(String),
                    },
                });
            });
        });
    });
});
