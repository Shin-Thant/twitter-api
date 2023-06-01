import { ErrorResponseBody } from "../config/AppError";

export default function createErrorResponseBody(
	err?: Error,
	status?: "fail" | "error"
): ErrorResponseBody {
	if (!err) {
		return handleNoInitError();
	}

	return handleErrorBody(
		status || "error",
		err.message || "Sometihng went wrong!"
	);
}

function handleNoInitError(): ErrorResponseBody {
	return {
		status: "error",
		message: "Something went wrong!",
	};
}
function handleErrorBody(
	status: "fail" | "error",
	message: string
): ErrorResponseBody {
	return {
		status,
		message,
	};
}
