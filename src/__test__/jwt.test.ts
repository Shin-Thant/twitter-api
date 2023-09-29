import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import supertest from "supertest";
import app from "../app/app";
import AppError from "../config/AppError";
import { connectDB, disconnectDB } from "../config/database";
import verifyJWT from "../middlewares/verifyJWT";
import {
	createJwtToken,
	getEmailTokenExpireTimeNumber,
	getSecretKeyFor,
	getTokenExpireTime,
} from "../util/jwt";
import {
	createBearerToken,
	createObjectId,
	getRandomUser,
} from "./util/services";

describe("JWT token", () => {
	describe("createJwtToken", () => {
		describe("given payload", () => {
			it("should return string", () => {
				const token = createJwtToken({
					payload: { id: "string" },
					secretKey: "random_sec",
				});
				expect(token).not.toBe("");
				expect(token).toStrictEqual(expect.any(String));
			});
		});
	});

	describe("verifyJwtToken", () => {
		beforeAll(async () => {
			await connectDB();
		});
		afterAll(async () => {
			await disconnectDB();
		});

		const mockFn = jest.fn().mockImplementation((err) => err);
		let mockRequest: Partial<Request>;
		const mockResponse: Partial<Response> = {};
		const nextFunction: NextFunction = mockFn;

		function runVerifyJWT(req: Request) {
			verifyJWT(req, mockResponse as Response, nextFunction);
		}

		beforeEach(() => {
			mockRequest = {};
		});

		describe("given no Authorization header", () => {
			it("should return status 403 and `Missing authorization header!` message", () => {
				mockRequest = { headers: {} };
				runVerifyJWT(mockRequest as Request);

				const arg: AppError = mockFn.mock.calls[0][0];
				const expectedErr = new AppError(
					"Missing authorization header!",
					403
				);

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.statusCode).toBe(expectedErr.statusCode);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given no token", () => {
			it("should return status 403 and `Missing token in authorization header!` message", () => {
				mockRequest = { headers: { authorization: "" } };
				runVerifyJWT(mockRequest as Request);

				const arg: AppError = mockFn.mock.calls[0][0];
				const expectedErr = new AppError(
					"Missing token in authorization header!",
					403
				);

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.statusCode).toBe(expectedErr.statusCode);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given invalid token", () => {
			it("should return status 403 and `Invalid token` message", () => {
				mockRequest = {
					headers: { authorization: "Bearer fake-token" },
				};
				runVerifyJWT(mockRequest as Request);

				const arg: JsonWebTokenError = mockFn.mock.calls[0][0];
				const expectedErr = new JsonWebTokenError("jwt malformed");

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);

				expect(arg.name).toBe(expectedErr.name);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given token without payload", () => {
			it("should return status 403 and `Forbidden!` message", () => {
				const token = createJwtToken({
					payload: {},
					secretKey: getSecretKeyFor("access_token"),
				});

				mockRequest = {
					headers: {
						authorization: `Bearer ${token}`,
					},
				};
				runVerifyJWT(mockRequest as Request);

				const arg: AppError = mockFn.mock.calls[0][0];
				const expectedErr = new AppError("Forbidden!", 403);

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.statusCode).toBe(expectedErr.statusCode);
				expect(arg.name).toBe(expectedErr.name);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given token with invalid payload", () => {
			it("should return status 403 and `Forbidden!` message", () => {
				const token = createJwtToken({
					payload: { payload: "invalid payload" },
					secretKey: getSecretKeyFor("access_token"),
				});

				mockRequest = {
					headers: { authorization: `Bearer ${token}` },
				};
				runVerifyJWT(mockRequest as Request);

				const arg: AppError = mockFn.mock.calls[0][0];
				const expectedErr = new AppError("Forbidden!", 403);

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.statusCode).toBe(expectedErr.statusCode);
				expect(arg.name).toBe(expectedErr.name);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given token without valid user", () => {
			it("should return status 403 and `Forbidden!` message", async () => {
				const id = createObjectId();
				const bearerToken = createBearerToken(id);

				const { body } = await supertest(app)
					.post("/api/v1/tweets")
					.set("Authorization", bearerToken)
					.expect(403);

				expect(body).toEqual({
					status: "fail",
					message: "Forbidden!",
				});
			});
		});

		describe("given expired token", () => {
			it("shouold return status 403 and `jwt expired!` message", async () => {
				const user = await getRandomUser();
				const token = jwt.sign(
					{ userInfo: { id: user?._id?.toString() } },
					getSecretKeyFor("access_token"),
					{ expiresIn: "-1s" }
				);

				mockRequest = {
					headers: { authorization: `Bearer ${token}` },
				};
				runVerifyJWT(mockRequest as Request);

				const arg: TokenExpiredError = mockFn.mock.calls[0][0];
				const expectedErr = new TokenExpiredError(
					"jwt expired",
					new Date("2023-05-04")
				);

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.name).toBe(expectedErr.name);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given token with invalid signature", () => {
			it("should return status 403 and `Forbidden` message", () => {
				const token = jwt.sign({}, "invalid-signature");

				mockRequest = {
					headers: { authorization: `Bearer ${token}` },
				};
				runVerifyJWT(mockRequest as Request);

				const arg: TokenExpiredError = mockFn.mock.calls[0][0];
				const expectedErr = new JsonWebTokenError("invalid signature");

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.name).toBe(expectedErr.name);
				expect(arg.message).toBe(expectedErr.message);
			});
		});
	});

	describe("getEmailTokenExpireTimeNumber", () => {
		it("should always return number `15`", () => {
			const result = getEmailTokenExpireTimeNumber();
			expect(result).toBe(15);
		});
	});

	describe("getTokenExpireTime", () => {
		describe("given access_token", () => {
			it("should return `15m`", () => {
				expect(getTokenExpireTime("access_token")).toBe("15m");
			});
		});

		describe("given refresh_token", () => {
			it("should return `7d`", () => {
				expect(getTokenExpireTime("refresh_token")).toBe("7d");
			});
		});

		describe("given email_token", () => {
			it("should return `15m`", () => {
				expect(getTokenExpireTime("email_token")).toBe("15m");
			});
		});
	});
});
