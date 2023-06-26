import supertest from "supertest";
import { createBearerToken, getRandomUser } from "./util/services";
import app from "../app/app";
import { connectDB, disconnectDB } from "../config/database";
import { TweetPostThis } from "../models/types/tweetTypes";

// TODO: pre-create a user before user is used in some suite then delete

jest.mock("../schemaHelpers/tweetHelpers", () => ({
	async populateTweetAfterCreation(this: TweetPostThis) {
		throw new Error("Something!");
	},
}));

const BASE_URL = "/api/v1/tweets";

describe("Tweet Helpers and Middlewares", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await disconnectDB();
	});

	describe("middlewares", () => {
		describe("populateTweetAfterCreation", () => {
			describe("when throws Error", () => {
				it("should return status 500 and error response", async () => {
					const user = await getRandomUser();
					const bearerToken = createBearerToken(
						user?._id?.toString() as string
					);

					const data = { body: "hi" };
					const { body } = await supertest(app)
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
