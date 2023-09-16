import { createUnhandledErrorBodyFor } from "../util/createUnhandledErrorBodyFor";

describe("createUnhandledErrorBodyFor", () => {
	describe("given an error", () => {
		it("should return status error and given error's message", () => {
			const result = createUnhandledErrorBodyFor(new Error("hi"));
			expect(result).toEqual({
				status: "error",
				message: "hi",
			});
		});
	});
});
