import createErrorResponseBody from "./createErrorResponseBody";

// TODO: write tests
export function createUnhandledErrorBodyFor(error: Error) {
	if (process.env.NODE_ENV !== "production") {
		return createErrorResponseBody({ status: "error", error });
	}
	return createErrorResponseBody({
		status: "error",
		error: "Internal Server Error!",
	});
}
