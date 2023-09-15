import createErrorResponseBody from "../util/createErrorResponseBody";

describe("createErrorResponseBody", () => {
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
		describe("given error instance with message and status", () => {
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

		describe("given error instance without message and status", () => {
			it("should return `Internal Server Error!` message and given status", () => {
				const result = createErrorResponseBody({
					error: {} as Error,
					status: "error",
				});
				expect(result).toEqual({
					message: "Internal Server Error!",
					status: "error",
				});
			});
		});
	});
});
