import createErrorResponseBody from "../util/createErrorResponseBody";

describe("createErrorResponseBody", () => {
	describe("given no input error but status", () => {
		it("should return object error message and given status", () => {
			const inputStatusArr: ("error" | "fail")[] = ["error", "fail"];

			inputStatusArr.forEach((status) => {
				expect(createErrorResponseBody({ status })).toEqual({
					status,
					message: "Something went wrong!",
				});
			});
		});
	});

	describe("given error string and status", () => {
		it("shoud return given error message and given status", () => {
			const inputs: { error: string; status: "error" | "fail" }[] = [
				{ error: "something", status: "error" },
				{ error: "anything", status: "fail" },
			];

			inputs.forEach((input) => {
				expect(createErrorResponseBody(input)).toEqual({
					status: input.status,
					message: input.error,
				});
			});
		});
	});

	describe("given error instance and status", () => {
		it("should return given error instance message and given status", () => {
			const inputs: { error: Error; status: "error" | "fail" }[] = [
				{ error: new Error("something"), status: "error" },
				{ error: new Error("anything"), status: "fail" },
			];

			inputs.forEach((input) => {
				expect(createErrorResponseBody(input)).toEqual({
					status: input.status,
					message: input.error.message,
				});
			});
		});
	});
});
