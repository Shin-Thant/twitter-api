import { NextFunction, Request, Response } from "express";
import { saveTweetImages } from "../middlewares/saveTweetImages";

let req = {} as Request;
const res = {} as Response;
let next: NextFunction = () => undefined;

const mockNext = jest.fn().mockImplementation((error?: Error) => error);
next = mockNext;

jest.mock("../util/saveImage", () => {
	return {
		saveImage: (_imageInfo: {
			name: string;
			image: Express.Multer.File;
		}) => {
			console.log("gonna throw");

			throw new Error("something");
		},
	};
});

describe("saveTweetImages", () => {
	beforeEach(() => {
		req = {} as Request;
	});

	describe("given files in request object is empty array", () => {
		it("should call next() without any argument", () => {
			saveTweetImages(req, res, next);

			expect(mockNext).toBeCalledTimes(1);
			expect(mockNext).toBeCalledWith();
		});
	});

	describe("given files is not array", () => {
		it("should call next() with error", () => {
			const expectedError = new Error("Invalid image fields!");

			req = { files: { field: "test" } } as unknown as Request;
			saveTweetImages(req, res, next);

			expect(mockNext).toBeCalledTimes(1);
			expect(mockNext).toBeCalledWith(expectedError);
		});
	});

	describe("when saveImage throws error", () => {
		it("should call next() with that error", async () => {
			const expectedError = new Error("something");

			req = { files: [{ filename: "random" }] } as unknown as Request;
			await saveTweetImages(req, res, next);

			expect(mockNext).toBeCalledTimes(1);
			expect(mockNext).toBeCalledWith(expectedError);
		});
	});
});
