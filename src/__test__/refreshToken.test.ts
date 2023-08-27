import jwt from "jsonwebtoken";
import supertest from "supertest";
import app from "../app/app";
import { connectDB, disconnectDB } from "../config/database";
import createErrorResponseBody from "../util/createErrorResponseBody";
import AppError from "../config/AppError";
import createToken, { getSecretKeyFor } from "../lib/jwt";
import { createObjectId } from "./util/services";

const URL = "/api/v1/auth/refresh";

function createErrorBody(
	message: string,
	statusCode: number,
	status: "fail" | "error"
) {
	return createErrorResponseBody({
		error: new AppError(message, statusCode),
		status,
	});
}

describe("Route /auth/refresh", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await disconnectDB();
	});

	describe("given no cookies", () => {
		it("should return status 401 and `Unauthorized!` message", async () => {
			const { body } = await supertest(app).get(URL).expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});

	describe("given cookie without data", () => {
		it("should return status 401 and `Unauthorized!` message", async () => {
			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", "token=")
				.expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});

	describe("given no refresh token", () => {
		it("should return status 401 and `Unauthorized!` message", async () => {
			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", "other=other-value")
				.expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});

	describe("given invalid refresh token", () => {
		it("should return status 401 and `Unauthorized!` message", async () => {
			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", "token=fake-token-to-hack")
				.expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});

	describe("given refresh token with invalid payload", () => {
		it("should return status 401 and `Unauthorized!` message", async () => {
			const refreshToken = createToken({ name: "hi" }, "refresh_token");

			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", `token=${refreshToken}`)
				.expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});

	describe("given expired refresh token", () => {
		it("should return status 403 and `jwt expired` message", async () => {
			const expiredToken = jwt.sign(
				{ userInfo: { id: "someone-id" } },
				getSecretKeyFor("refresh_token"),
				{ expiresIn: "-1s" }
			);

			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", `token=${expiredToken}`)
				.expect(403);

			expect(body).toEqual(
				createErrorBody("Token expired!", 403, "fail")
			);
		});
	});

	describe("given refresh token with invalid signature", () => {
		it("should return 401 and `Unauthorized!` message", async () => {
			const token = jwt.sign(
				{ userInfo: { id: "someone-id" } },
				"invalid-signature"
			);

			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", `token=${token}`)
				.expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});

	describe("given refresh token with invalid id", () => {
		it("should return status 401 and `Unauthorized!` message", async () => {
			const refreshToken = createToken(
				{ userInfo: { id: "20fkajg30282jfl2952jfla;" } },
				"refresh_token"
			);

			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", `token=${refreshToken}`)
				.expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});

	describe("given token with invalid userId", () => {
		it("should return status 401 and `Unauthorized` message", async () => {
			const userId = createObjectId();
			const refreshToken = createToken(
				{ userInfo: { id: userId } },
				"refresh_token"
			);

			const { body } = await supertest(app)
				.get(URL)
				.set("Cookie", `token=${refreshToken}`)
				.expect(401);

			expect(body).toEqual(createErrorBody("Unauthorized!", 401, "fail"));
		});
	});
});
