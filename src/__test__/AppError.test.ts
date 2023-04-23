import AppError from "../config/AppError";

function throwAppError() {
	throw new AppError("app error", 404);
}

describe("AppError when called", () => {
	it("should throw AppError", () => {
		expect(() => throwAppError()).toThrow(AppError);
	});

	const appError = new AppError("app error", 404);

	describe("isOperational property", () => {
		it("should be existed", () => {
			expect("isOperational" in appError).toBe(true);
		});
		it("should be true", () => {
			expect(appError.isOperational).toBe(true);
		});
	});

	it("message should be same as argument", () => {
		expect(appError.message).toEqual("app error");
	});

	it("should not have `status` property", () => {
		expect("status" in appError).toBe(false);
	});

	describe("statusCode property", () => {
		it("should be existed", () => {
			expect("statusCode" in appError).toBe(true);
		});
		it("should be number", () => {
			expect(typeof appError.statusCode).toBe("number");
		});
	});

	describe("createAppErrorResponseBody method", () => {
		it("should be existed", () => {
			expect("createAppErrorResponseBody" in appError).toBe(true);
		});

		it("should return error response object", () => {
			const returnValue = {
				status: "fail",
				name: "AppError",
				message: "app error",
			} as const;

			const errorResponseObj = appError.createAppErrorResponseBody();
			expect(errorResponseObj).toEqual(returnValue);
		});
	});
});
