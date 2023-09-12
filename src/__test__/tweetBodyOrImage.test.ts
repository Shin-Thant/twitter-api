import { NextFunction, Request, Response } from "express";
import { tweetBodyOrImage } from "../middlewares/tweetBodyOrImage";
import AppError from "../config/AppError";

let req = {} as Request;
const res = {} as Response;
let next: NextFunction = () => undefined;

const mockNext = jest.fn().mockImplementation((_err) => undefined);
next = mockNext;

describe("tweetBodyOrImage middleware", () => {
	beforeEach(() => {
		req = {} as Request;
	});

	describe("not given tweet body and images", () => {
		const EXPECTED_ERROR = new AppError(
			"Tweet body or photos must be provided!",
			400
		);

		describe("given tweet body as empty object and images as undefined", () => {
			it("should call `next()` with error", () => {
				req = { body: {}, files: undefined } as Request;

				tweetBodyOrImage(req, res, next);
				expect(mockNext).toBeCalledTimes(1);
				expect(mockNext).toBeCalledWith(EXPECTED_ERROR);
				expect(mockNext.mock.calls[0][0]).toEqual(EXPECTED_ERROR);
			});
		});

		describe("given tweet body as empty object and images as empty array", () => {
			it("should call `next()` with error", () => {
				req = { body: {}, files: [] } as unknown as Request;

				tweetBodyOrImage(req, res, next);
				expect(mockNext).toBeCalledTimes(1);
				expect(mockNext).toBeCalledWith(EXPECTED_ERROR);
				expect(mockNext.mock.calls[0][0]).toEqual(EXPECTED_ERROR);
			});
		});

		describe("given tweet body with random properties and images as undefined", () => {
			it("should call `next()` with error", () => {
				req = {
					body: { name: "hi" },
					files: undefined,
				} as unknown as Request;

				tweetBodyOrImage(req, res, next);
				expect(mockNext).toBeCalledTimes(1);
				expect(mockNext).toBeCalledWith(EXPECTED_ERROR);
				expect(mockNext.mock.calls[0][0]).toEqual(EXPECTED_ERROR);
			});
		});

		describe("given tweet body with random properties and images as empty array", () => {
			it("should call `next()` with error", () => {
				req = {
					body: { name: "hi" },
					files: [],
				} as unknown as Request;

				tweetBodyOrImage(req, res, next);
				expect(mockNext).toBeCalledTimes(1);
				expect(mockNext).toBeCalledWith(EXPECTED_ERROR);
				expect(mockNext.mock.calls[0][0]).toEqual(EXPECTED_ERROR);
			});
		});
	});

	describe("given only tweet body without images", () => {
		it("it should call `next()` without any arguments", () => {
			req = { body: { body: "hi" }, files: [] } as unknown as Request;

			tweetBodyOrImage(req, res, next);
			expect(mockNext).toBeCalledTimes(1);
			expect(mockNext).toBeCalledWith();
		});
	});

	describe("given only images without tweet body", () => {
		it("it should call `next()` without any arguments", () => {
			const mockFile = {};
			req = { body: {}, files: [mockFile] } as unknown as Request;

			tweetBodyOrImage(req, res, next);
			expect(mockNext).toBeCalledTimes(1);
			expect(mockNext).toBeCalledWith();
		});
	});

	describe("given both tweet body and images", () => {
		it("it should call `next()` without any arguments", () => {
			const mockFile = {};
			req = {
				body: { body: "hi" },
				files: [mockFile],
			} as unknown as Request;

			tweetBodyOrImage(req, res, next);
			expect(mockNext).toBeCalledTimes(1);
			expect(mockNext).toBeCalledWith();
		});
	});
});
