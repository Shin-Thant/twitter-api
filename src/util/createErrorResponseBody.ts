import { ErrorResponseBody } from "../config/AppError";

export default function createErrorResponseBody({
	error,
	status,
}: {
	error?: Error | string;
	status: "fail" | "error";
}): ErrorResponseBody {
	if (!error) {
		return createDefaultErrorResponseBody({ status });
	}

	return {
		status,
		message:
			typeof error === "string"
				? error
				: error.message || "Sometihng went wrong!",
	};
}

function createDefaultErrorResponseBody({
	status,
}: {
	status: "error" | "fail";
}): ErrorResponseBody {
	return {
		status,
		message: "Something went wrong!",
	};
}
