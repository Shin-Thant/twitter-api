import { ErrorResponseBody } from "../config/AppError";

export default function createErrorResponseBody(
	error?: Error | string,
	status?: "fail" | "error"
): ErrorResponseBody {
	if (!error) {
		return createError();
	}

	return {
		status: status || "error",
		message:
			typeof error === "string"
				? error
				: error.message || "Sometihng went wrong!",
	};
}

function createError(): ErrorResponseBody {
	return {
		status: "error",
		message: "Something went wrong!",
	};
}
