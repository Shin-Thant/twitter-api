import supertest from "supertest";
import {
	createBearerToken,
	createObjectId,
	getRandomTweet,
	getRandomUser,
} from "./util/services";
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
		// describe("populateTweetAfterCreation", () => {
		// 	describe("when throws Error", () => {
		// 		it("should return status 500 and error response", async () => {
		// 			const user = await getRandomUser();
		// 			const bearerToken = createBearerToken(
		// 				user?._id?.toString() as string
		// 			);
		// 			const data = { body: "hi" };
		// 			const { body } = await supertest(app)
		// 				.post(BASE_URL)
		// 				.send(data)
		// 				.set("Authorization", bearerToken)
		// 				.expect(500);
		// 			expect(body).toEqual({
		// 				status: "error",
		// 				message: "Something!",
		// 			});
		// 		});
		// 	});

		describe("verifyTweetOwner", () => {
			describe("given random string as tweet id", () => {
				it("should return status 400 and AppError", async () => {
					const tweet = await getRandomTweet();
					const bearerToken = createBearerToken(
						tweet?.owner?._id?.toString() as string
					);
					const tweetId = "just_random_string";
					const url = `/api/v1/tweets/${tweetId}`;
					const { body } = await supertest(app)
						.delete(url)
						.set("Authorization", bearerToken)
						.expect(400);
					expect(body).toEqual({
						status: "fail",
						message: "Invalid ID!",
					});
				});
			});

			describe("given random tweet id", () => {
				it("should return status 400 and AppError", async () => {
					const tweet = await getRandomTweet();
					const bearerToken = createBearerToken(
						tweet?.owner?._id?.toString() as string
					);
					const tweetId = createObjectId();
					const url = `/api/v1/tweets/${tweetId}`;
					const { body } = await supertest(app)
						.delete(url)
						.set("Authorization", bearerToken)
						.expect(400);
					expect(body).toEqual({
						status: "fail",
						message: "Invalid ID!",
					});
				});
			});

			describe("given wrong id and owner", () => {
				it("should throw status 401 and AppError", async () => {
					const tweet = await getRandomTweet();
					const user = await getRandomUser({
						_id: {
							$ne: tweet?.owner,
						},
					});
					const bearerToken = createBearerToken(
						user?._id?.toString() as string
					);
					const url = `/api/v1/tweets/${tweet?._id.toString()}`;
					const { body } = await supertest(app)
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
