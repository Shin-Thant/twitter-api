type ErrorResBody = {
	status: "fail" | "error";
	name: string;
	message: string;
};

export default function createErrorResponseBody(
	err?: Error,
	status?: "fail" | "error"
): ErrorResBody {
	if (!err) {
		return {
			status: "error",
			name: "Error",
			message: "Something went wrong!",
		};
	}
	return {
		status: status || "error",
		name: err.name || "Error",
		message: err.message || "Sometihng went wrong!",
	};
}
