import {
	CommentPostThis,
	CommentQueryHelperThis,
} from "../models/types/commentTypes";
import {
	createBearerToken,
	createObjectId,
	getRandomComment,
	getRandomTweet,
	getRandomUser,
} from "./util/services";
import { connectDB, disconnectDB } from "../config/database";
import supertest from "supertest";
import app from "../app/app";
import Comment from "../models/Comment";
import createErrorResponseBody from "../util/createErrorResponseBody";
import { TweetDoc } from "../models/types/tweetTypes";

// TODO: pre-create a comment before that comment is used then delete

// mock comment schema middleware
jest.mock("../schemaHelpers/commentHelpers", () => ({
	async populateCommentAfterCreation(this: CommentPostThis) {
		return await this.populate("creator");
	},
	populateCommentRelations(this: CommentQueryHelperThis) {
		// return this.populate("creator");
		throw new Error("something");
	},
	deleteAllNestedComments: () => {
		throw new Error("something");
	},
}));

describe("Comment Middlewares", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await disconnectDB();
	});

	describe("Schema Middlewares", () => {
		describe("populateCommentAfterCreation", () => {
			describe("when populate() throw error", () => {
				it("should return status 500 and error response", async () => {
					const err = new Error("something");
					// mock populate()
					jest.spyOn(Comment, "populate").mockImplementation(
						async () => {
							throw err;
						}
					);

					const randomUser = await getRandomUser();
					if (!randomUser) return;

					const bearerToken = createBearerToken(
						randomUser._id.toString()
					);
					const tweet = (await getRandomTweet()) as TweetDoc;
					const data = {
						body: "sth",
					};

					const url = `/api/v1/tweets/${tweet?._id.toString()}/comments`;
					const { body } = await supertest(app)
						.post(url)
						.send(data)
						.set("Authorization", bearerToken)
						.expect(500);

					expect(body).toEqual(
						createErrorResponseBody({ error: err, status: "error" })
					);
				});
			});
		});

		describe("deleteAllNestedComments", () => {
			it("should return status 500 and error response", async () => {
				const comment = await getRandomComment();

				const bearerToken = createBearerToken(
					comment?.owner?._id?.toString() as string
				);

				const url = `/api/v1/comments/${comment?._id.toString()}`;
				const { body } = await supertest(app)
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
			describe("given random string as comment id", () => {
				it("should return status 400 and AppError", async () => {
					const comment = await getRandomComment();

					const bearerToken = createBearerToken(
						comment?.owner?._id?.toString() as string
					);

					const commentId = "just_random_string";
					const url = `/api/v1/comments/${commentId}`;

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

			describe("given random comment id", () => {
				it("should throw status 400 and AppError", async () => {
					const comment = await getRandomComment();

					const bearerToken = createBearerToken(
						comment?.owner?._id?.toString() as string
					);

					const commentId = createObjectId();
					const url = `/api/v1/comments/${commentId}`;

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

			describe("given wrong owner", () => {
				it("should throw status 401 and AppError", async () => {
					const comment = await getRandomComment();

					const user = await getRandomUser({
						_id: {
							$ne: comment?.owner,
						},
					});

					const bearerToken = createBearerToken(
						user?._id?.toString() as string
					);

					const url = `/api/v1/comments/${comment?._id.toString()}`;
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
