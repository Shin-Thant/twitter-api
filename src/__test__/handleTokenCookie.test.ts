import { Response } from "express";
import { setTokenCookie } from "../lib/handleTokenCookie";
import AppError from "../config/AppError";
import { MongooseError } from "mongoose";

describe("Token Cookie", () => {
	describe("setTokenCookie", () => {
		describe("given empty token", () => {
			it("should thorw a AppError with status 500 and `Internal Server Error` message", () => {
				const mockResponse: Partial<Response> = {};
				const emptyToken = "";

				const expectedErr = new AppError("Internal Server Error!", 500);

				expect(() =>
					setTokenCookie(mockResponse as Response, emptyToken)
				).toThrow(expectedErr);

				try {
					setTokenCookie(mockResponse as Response, emptyToken);
				} catch (e) {
					const err = e as AppError;

					expect(err).toBeInstanceOf(AppError);
					expect(err.name).toBe(expectedErr.name);
					expect(err.message).toBe(expectedErr.message);
					expect(err.statusCode).toBe(expectedErr.statusCode);
				}
			});
		});
	});
});
