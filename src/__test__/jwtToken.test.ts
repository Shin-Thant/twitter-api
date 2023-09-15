import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import AppError from "../config/AppError";
import createToken, { getExpiresTimeFor, getSecretKeyFor } from "../lib/jwt";
import { NextFunction, Request, Response } from "express";
import verifyJWT from "../middlewares/verifyJWT";
import {
	createBearerToken,
	createObjectId,
	getRandomUser,
} from "./util/services";
import { connectDB, disconnectDB } from "../config/database";
import supertest from "supertest";
import app from "../app/app";

describe("JWT token", () => {
	describe("token creation", () => {
		describe("given empty payload", () => {
			const mockJwtTokenSign = jest.spyOn(jwt, "sign");

			it("should throw AppError", () => {
				expect(() => createToken({}, "access_token")).toThrow(AppError);
				expect(() => createToken({}, "access_token")).toThrow(
					"Invalid jwt payload!"
				);
			});
			it("should not call jwt.sign", () => {
				expect(mockJwtTokenSign).not.toHaveBeenCalled();
			});
		});

		describe("given valid payload", () => {
			it("should return token string", () => {
				const mockJwtTokenSign = jest
					.spyOn(jwt, "sign")
					.mockImplementation(() => "mock jwt token");

				const secretKey = getSecretKeyFor("access_token");
				const expiresIn = getExpiresTimeFor("access_token");
				const token = createToken({ name: "john" }, "access_token");

				expect(mockJwtTokenSign).toHaveBeenCalled();
				expect(mockJwtTokenSign).toHaveBeenCalledWith(
					{ name: "john" },
					secretKey,
					{
						expiresIn: expiresIn,
					}
				);
				expect(token).toBe("mock jwt token");
			});
		});
	});

	describe("verify token middleware", () => {
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
			it("should return status 401 and `Unauthorized!` message", () => {
				const token = jwt.sign({}, getSecretKeyFor("access_token"));

				mockRequest = {
					headers: {
						authorization: `Bearer ${token}`,
					},
				};
				runVerifyJWT(mockRequest as Request);

				const arg: AppError = mockFn.mock.calls[0][0];
				const expectedErr = new AppError("Unauthorized!", 401);

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.statusCode).toBe(expectedErr.statusCode);
				expect(arg.name).toBe(expectedErr.name);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given token with invalid payload", () => {
			it("should return status 401 and `Unauthorized!` message", () => {
				const token = createToken(
					{ payload: "invalid payload" },
					"access_token"
				);

				mockRequest = {
					headers: { authorization: `Bearer ${token}` },
				};
				runVerifyJWT(mockRequest as Request);

				const arg: AppError = mockFn.mock.calls[0][0];
				const expectedErr = new AppError("Unauthorized!", 401);

				expect(nextFunction).toHaveBeenCalledWith(expectedErr);
				expect(arg.statusCode).toBe(expectedErr.statusCode);
				expect(arg.name).toBe(expectedErr.name);
				expect(arg.message).toBe(expectedErr.message);
			});
		});

		describe("given token without valid user", () => {
			it("should return status 403 and `Invalid token!` message", async () => {
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
});
