import { ErrorResponseBody } from "../config/AppError";

export default function createErrorResponseBody({
	error,
	status,
}: {
	error: Error | string;
	status: "fail" | "error";
}): ErrorResponseBody {
	if (typeof error === "string") {
		return { status, message: error };
	}

	return {
		status,
		message: error.message || "Internal Server Error!",
	};
}
