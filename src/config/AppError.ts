export default class AppError extends Error {
	public statusCode: number;
	private status: "fail" | "error";

	constructor(
		message: string,
		statusCode: number,
		status?: "fail" | "error"
	) {
		super(message);
		this.name = "AppError";

		this.statusCode = statusCode;
		this.status = status
			? status
			: statusCode.toString().startsWith("4")
			? "fail"
			: "error";
		Object.setPrototypeOf(this, AppError.prototype);
	}

	public createAppErrorResponseBody() {
		return {
			status: this.status,
			name: "App Error!",
			message: this.message,
		};
	}
}
