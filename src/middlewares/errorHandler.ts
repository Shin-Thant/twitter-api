import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";

type ErrorResBody = {
	status: "fail" | "error";
	name: string;
	message: string;
};
export function createErrorResponseBody(
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

const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err.name === "TokenExpiredError") {
		return res.status(401).json(createErrorResponseBody(err, "error"));
	}

	if (err.name === "JsonWebTokenError") {
		console.log({ err });
		return res.status(403).json(createErrorResponseBody(err, "fail"));
	}

	if (err.name === "ValidationError") {
		console.log(err);

		return res.status(400).json(createErrorResponseBody(err, "fail"));
	}

	if (err instanceof AppError) {
		return res
			.status(err.statusCode)
			.json(err.createAppErrorResponseBody());
	}

	// *this condition always has to be behind the `AppError` condition because `AppError` inherit `Error`
	res.status(500).json(createErrorResponseBody(err));
};

// *handler each error with separate functions
/*
	validation error
	cast error
*/

export default errorHandler;
