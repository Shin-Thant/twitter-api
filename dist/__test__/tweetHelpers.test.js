"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const services_1 = require("./util/services");
const app_1 = __importDefault(require("../app/app"));
const database_1 = require("../config/database");
// TODO: pre-create a user before user is used in some suite then delete
jest.mock("../schemaHelpers/tweetHelpers", () => ({
    async populateTweetAfterCreation() {
        throw new Error("Something!");
    },
}));
const BASE_URL = "/api/v1/tweets";
describe("Tweet Helpers and Middlewares", () => {
    beforeAll(async () => {
        await (0, database_1.connectDB)();
    });
    afterAll(async () => {
        await (0, database_1.disconnectDB)();
    });
    describe("middlewares", () => {
        describe("populateTweetAfterCreation", () => {
            describe("when throws Error", () => {
                it("should return status 500 and error response", async () => {
                    const user = await (0, services_1.getRandomUser)();
                    if (!user) {
                        console.log("no user");
                        return;
                    }
                    const bearerToken = (0, services_1.createBearerToken)(user._id.toString());
                    const data = { body: "hi" };
                    const { body } = await (0, supertest_1.default)(app_1.default)
                        .post(BASE_URL)
                        .send(data)
                        .set("Authorization", bearerToken)
                        .expect(500);
                    expect(body).toEqual({
                        status: "error",
                        message: "Something!",
                    });
                });
            });
        });
    });
});
