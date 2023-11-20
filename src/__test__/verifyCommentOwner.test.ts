import supertest from "supertest";
import app from "../app/app";
import { connectDB, disconnectDB } from "../config/database";
import {
	createBearerToken,
	createObjectId,
	getRandomComment,
	getRandomUser,
} from "./util/services";

describe("verifyCommentOwner", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await disconnectDB();
	});

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
				message: "Invalid comment ID!",
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
