"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./util/services");
const database_1 = require("../config/database");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app/app"));
const Comment_1 = __importDefault(require("../models/Comment"));
const createErrorResponseBody_1 = __importDefault(require("../util/createErrorResponseBody"));
// TODO: pre-create a comment before that comment is used then delete
// mock comment schema middleware
jest.mock("../schemaHelpers/commentHelpers", () => ({
    async populateCommentAfterCreation() {
        return await this.populate("creator");
    },
    populateCommentRelations() {
        return this.populate("creator");
    },
    deleteAllNestedComments: () => {
        throw new Error("something");
    },
}));
describe("Comment Middlewares", () => {
    beforeAll(async () => {
        await (0, database_1.connectDB)();
    });
    afterAll(async () => {
        await (0, database_1.disconnectDB)();
    });
    describe("Helpers", () => {
        describe("populateCommentRelations", () => {
            describe("when throw Error", () => {
                it("should return status 500 and error response", async () => {
                    // mock populate()
                    jest.spyOn(Comment_1.default, "populate").mockImplementation(() => {
                        throw new Error("something");
                    });
                    const { body } = await (0, supertest_1.default)(app_1.default)
                        .get("/api/v1/comments/all")
                        .expect(500);
                    expect(body).toEqual({
                        status: "error",
                        message: "something",
                    });
                });
            });
        });
    });
    describe("Schema Middlewares", () => {
        describe("populateCommentAfterCreation", () => {
            describe("when populate() throw error", () => {
                it("should return status 500 and error response", async () => {
                    const err = new Error("something");
                    // mock populate()
                    jest.spyOn(Comment_1.default, "populate").mockImplementation(async () => {
                        throw err;
                    });
                    const user = await (0, services_1.getRandomUser)();
                    if (!user)
                        return;
                    const bearerToken = (0, services_1.createBearerToken)(user._id.toString());
                    const tweet = await (0, services_1.getRandomTweet)();
                    const data = {
                        body: "sth",
                        tweetId: tweet?._id.toString(),
                    };
                    const url = "/api/v1/comments";
                    const { body } = await (0, supertest_1.default)(app_1.default)
                        .post(url)
                        .send(data)
                        .set("Authorization", bearerToken)
                        .expect(500);
                    expect(body).toEqual((0, createErrorResponseBody_1.default)(err));
                });
            });
        });
        describe("deleteAllNestedComments", () => {
            it("should return status 500 and error response", async () => {
                const comment = await (0, services_1.getRandomComment)();
                if (!comment) {
                    console.log("no comment!");
                    return;
                }
                const bearerToken = (0, services_1.createBearerToken)(comment.creator._id.toString());
                const url = `/api/v1/comments/${comment._id.toString()}`;
                const { body } = await (0, supertest_1.default)(app_1.default)
                    .delete(url)
                    .set("Authorization", bearerToken)
                    .expect(500);
                expect(body).toEqual({
                    status: "error",
                    message: "something",
                });
            });
        });
    });
    describe("Request Middlewares", () => {
        describe("verifyCommentOwner", () => {
            describe("given invalid comment id", () => {
                it("should throw status 400 and AppError", async () => {
                    const comment = await (0, services_1.getRandomComment)();
                    if (!comment) {
                        console.log("no comment!");
                        return;
                    }
                    const bearerToken = (0, services_1.createBearerToken)(comment.creator._id.toString());
                    const commentId = (0, services_1.createObjectId)();
                    const url = `/api/v1/comments/${commentId}`;
                    const { body } = await (0, supertest_1.default)(app_1.default)
                        .delete(url)
                        .set("Authorization", bearerToken)
                        .expect(400);
                    expect(body).toEqual({
                        status: "fail",
                        message: "Invalid ID!",
                    });
                });
            });
            describe("given wrong owner", () => {
                it("should throw status 401 and AppError", async () => {
                    const user = await (0, services_1.getRandomUser)();
                    if (!user) {
                        return;
                    }
                    const comment = await (0, services_1.getRandomComment)({
                        creator: { $ne: user._id.toString() },
                    });
                    const bearerToken = (0, services_1.createBearerToken)(user._id.toString());
                    const url = `/api/v1/comments/${comment?._id.toString()}`;
                    const { body } = await (0, supertest_1.default)(app_1.default)
                        .delete(url)
                        .set("Authorization", bearerToken)
                        .expect(401);
                    expect(body).toEqual({
                        status: "fail",
                        message: "Unauthorized!",
                    });
                });
            });
        });
    });
});
