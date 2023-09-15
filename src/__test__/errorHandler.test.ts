import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { CastError } from "mongoose";
import { ErrorCode, MulterError } from "multer";
import AppError from "../config/AppError";
import errorHandler from "../middlewares/errorHandler";
import createErrorResponseBody from "../util/createErrorResponseBody";

const mockJson = jest.fn().mockImplementation((body?: any) => undefined);
const mockStatus = jest.fn().mockImplementation((code: number) => undefined);

const req = {} as Request;
const res = {
	status: mockStatus,
	json: mockJson,
} as unknown as Response;
const next: NextFunction = () => undefined;

describe("errorHandler", () => {
	beforeEach(() => {
		mockStatus.mockReturnValue({ json: mockJson });
	});

	describe("given CastError", () => {
		it("should respond with `Bad request!` error message and status `fail`", () => {
			const castError: CastError = {
				...new Error("something!"),
				name: "CastError",
				message: "Cast to ObjectId failed for value...",
				kind: "ObjectId",
				value: "randomId",
				path: "_id",
				stringValue: '"randomId"',
			};

			// call
			errorHandler(castError, req, res, next);

			// status
			const expectedStatus = 400;
			expect(mockStatus).toBeCalledTimes(1);
			expect(mockStatus).toBeCalledWith(expectedStatus);

			// body
			const expectedBody = createErrorResponseBody({
				error: "Bad request!",
				status: "fail",
			});
			expect(mockJson).toBeCalledTimes(1);
			expect(mockJson).toBeCalledWith(expectedBody);
		});
	});

	describe("given TokenExpiredError", () => {
		it("should respond with `Token expired!` message and status `fail`", () => {
			const tokenExpiredError = new TokenExpiredError(
				"Token expired!",
				new Date(Date.now() - 1)
			);

			// call
			errorHandler(tokenExpiredError, req, res, next);

			// status
			const expectedStatus = 403;
			expect(mockStatus).toBeCalledTimes(1);
			expect(mockStatus).toBeCalledWith(expectedStatus);

			// body
			const expectedBody = createErrorResponseBody({
				error: "Token expired!",
				status: "fail",
			});
			expect(mockJson).toBeCalledTimes(1);
			expect(mockJson).toBeCalledWith(expectedBody);
		});
	});

	describe("given JsonWebTokenError", () => {
		it("should respond with `Unauthorized!`message and status `fail`", () => {
			const jwtError = new JsonWebTokenError("token error!");

			// call
			errorHandler(jwtError, req, res, next);

			// status
			const expectedStatus = 401;
			expect(mockStatus).toBeCalledTimes(1);
			expect(mockStatus).toBeCalledWith(expectedStatus);

			// body
			const expectedBody = createErrorResponseBody({
				error: "Unauthorized!",
				status: "fail",
			});
			expect(mockJson).toBeCalledTimes(1);
			expect(mockJson).toBeCalledWith(expectedBody);
		});
	});

	describe("given ValidationError", () => {
		it("should respond with input error message and status `fail`", () => {
			const jwtError = new ValidationError(
				"Name is required!",
				[
					{
						message: "Name is requried!",
						path: ["body", "name"],
						type: "any.required",
					},
				],
				""
			);

			// call
			errorHandler(jwtError, req, res, next);

			// status
			const expectedStatus = 400;
			expect(mockStatus).toBeCalledTimes(1);
			expect(mockStatus).toBeCalledWith(expectedStatus);

			// body
			const expectedBody = createErrorResponseBody({
				error: "Name is required!",
				status: "fail",
			});
			expect(mockJson).toBeCalledTimes(1);
			expect(mockJson).toBeCalledWith(expectedBody);
		});
	});

	describe("given MulterError", () => {
		it("should respond with error message and status `fail`", () => {
			type UnhandledErrorCode = Exclude<
				ErrorCode,
				"LIMIT_FILE_SIZE" | "LIMIT_FILE_COUNT" | "LIMIT_UNEXPECTED_FILE"
			>;
			const unhandledErrorCodes: UnhandledErrorCode[] = [
				"LIMIT_PART_COUNT",
				"LIMIT_FIELD_COUNT",
				"LIMIT_FIELD_KEY",
				"LIMIT_FIELD_VALUE",
			];

			const testSetup: {
				input: { code: ErrorCode; field?: string };
				result?: string;
			}[] = [
				{
					input: { code: "LIMIT_FILE_COUNT", field: undefined },
					result: "Too many images!",
				},
				{
					input: { code: "LIMIT_FILE_SIZE", field: "random" },
					result: "Image too large!",
				},
				{
					input: { code: "LIMIT_UNEXPECTED_FILE" },
					result: "Unexpected image field!",
				},
				...unhandledErrorCodes.map((errCode) => ({
					input: { code: errCode },
				})),
			];

			testSetup.forEach((item) => {
				const multerError = new MulterError(
					item.input.code,
					item.input.code
				);

				errorHandler(multerError, req, res, next);

				// status
				const expectedStatus = 400;
				expect(mockStatus).toBeCalledWith(expectedStatus);

				// body
				const expectedBody = createErrorResponseBody({
					error: item.result || multerError.message,
					status: "fail",
				});
				expect(mockJson).toBeCalledWith(expectedBody);
			});
		});
	});

	describe("given AppError", () => {
		it("should respond with input error message and input status", () => {
			const testSetup: {
				input: { msg: string; statusCode: number };
				result: { msg: string; status: "fail" | "error" };
			}[] = [
				{
					input: { msg: "other thing!", statusCode: 400 },
					result: { msg: "other thing!", status: "fail" },
				},
				{
					input: { msg: "something!", statusCode: 500 },
					result: { msg: "something!", status: "error" },
				},
				{
					input: { msg: "anything!", statusCode: 403 },
					result: { msg: "anything!", status: "fail" },
				},
			];

			testSetup.forEach((item) => {
				const appError = new AppError(
					item.input.msg,
					item.input.statusCode
				);

				errorHandler(appError, req, res, next);

				// status
				const expectedStatus = item.input.statusCode;
				expect(mockStatus).toBeCalledWith(expectedStatus);

				// body
				const expectedBody = createErrorResponseBody({
					error: item.result.msg,
					status: item.result.status,
				});
				expect(mockJson).toBeCalledWith(expectedBody);
			});
		});
	});

	describe("given unhandled error", () => {
		it("should respond with `Something went error!` message and status `error`", () => {
			const unhandledError = new Error("something!");
			unhandledError.name = "Unhandled Error!";

			// call
			errorHandler(unhandledError, req, res, next);

			// status
			const expectedStatus = 500;
			expect(mockStatus).toBeCalledTimes(1);
			expect(mockStatus).toBeCalledWith(expectedStatus);

			// body
			const expectedBody = createErrorResponseBody({
				error: "something!",
				status: "error",
			});
			expect(mockJson).toBeCalledTimes(1);
			expect(mockJson).toBeCalledWith(expectedBody);
		});
	});
});
