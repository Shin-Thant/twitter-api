import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/database";
import supertest from "supertest";
import app from "../app/app";
import Comment from "../models/Comment";
import createToken from "../lib/createToken";
import User from "../models/User";
import { CommentQueryHelperThis } from "../models/types/commentTypes";

async function getRandomComment(query?: object) {
	return await Comment.findOne(query);
}
async function getRandomUser() {
	return await User.findOne();
}

function createBearerToken(userId: string) {
	const payload = {
		userInfo: { id: userId },
	};
	const token = createToken(payload, "access");
	const bearerToken = `Bearer ${token}`;
	return bearerToken;
}

function createObjectId() {
	return new mongoose.Types.ObjectId().toString();
}

// mock comment schema middleware
jest.mock("../schemaMiddlewares/commentMiddlewares", () => ({
	populateCommentRelations(this: CommentQueryHelperThis) {
		return this.populate("creator");
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

	describe("schema middlewares", () => {
		describe("populateCommentRelations", () => {
			describe("when throw Error", () => {
				it("should return status 500 and error response", async () => {
					// mock populate()
					jest.spyOn(Comment, "populate").mockImplementation(() => {
						throw new Error("something");
					});

					const { body } = await supertest(app)
						.get("/api/v1/comments/all")
						.expect(500);

					expect(body).toEqual({
						status: "error",
						name: "Error",
						message: "something",
					});
				});
			});
		});

		describe("delete all nested comment", () => {
			it("should return status 500", async () => {
				const comment = await getRandomComment();
				if (!comment) {
					console.log("no comment!");
					return;
				}

				const bearerToken = createBearerToken(
					comment.creator._id.toString()
				);

				const url = `/api/v1/comments/${comment._id.toString()}`;
				const { body } = await supertest(app)
					.delete(url)
					.set("Authorization", bearerToken)
					.expect(500);

				expect(body).toEqual({
					status: "error",
					name: "Error",
					message: "something",
				});
			});
		});
	});

	describe("Request middleware", () => {
		describe("verifyCommentOwner", () => {
			describe("given invalid comment id", () => {
				it("should throw status 400 and AppError", async () => {
					const comment = await getRandomComment();
					if (!comment) {
						console.log("no comment!");
						return;
					}

					const bearerToken = createBearerToken(
						comment?.creator._id.toString()
					);

					const commentId = createObjectId();
					const url = `/api/v1/comments/${commentId}`;

					const { body } = await supertest(app)
						.delete(url)
						.set("Authorization", bearerToken)
						.expect(400);

					expect(body).toEqual({
						status: "fail",
						name: "AppError",
						message: "Invalid ID!",
					});
				});
			});

			describe("given wrong owner", () => {
				it("should throw status 400 and AppError", async () => {
					const user = await getRandomUser();
					if (!user) {
						return;
					}
					const comment = await getRandomComment({
						creator: { $ne: user._id.toString() },
					});

					const bearerToken = createBearerToken(user._id.toString());

					const url = `/api/v1/comments/${comment?._id.toString()}`;
					const { body } = await supertest(app)
						.delete(url)
						.set("Authorization", bearerToken)
						.expect(401);

					expect(body).toEqual({
						status: "fail",
						name: "AppError",
						message: "Unauthorized!",
					});
				});
			});
		});
	});
});
