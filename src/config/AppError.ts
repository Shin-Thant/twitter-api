export interface IAppError extends Error {
	statusCode: number;
	isOperational: boolean;
	createAppErrorResponseBody: createAppErrorResponseBody;
}
type createAppErrorResponseBody = () => ErrorResponseBody;
export type ErrorResponseBody = {
	status: "fail" | "error";
	message: string;
};

export default class AppError extends Error implements IAppError {
	public statusCode: number;
	public isOperational = true;
	private _status: "fail" | "error";

	constructor(
		message: string,
		statusCode: number,
		status?: "fail" | "error"
	) {
		super(message);
		this.name = "AppError";

		this.statusCode = statusCode;
		this._status = status
			? status
			: statusCode.toString().startsWith("4")
			? "fail"
			: "error";
		Object.setPrototypeOf(this, AppError.prototype);
	}

	public createAppErrorResponseBody() {
		return {
			status: this._status,
			message: this.message,
		};
	}
}
