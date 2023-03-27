import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";

type ErrorResBody = {
	status: "error";
	name: string;
	message: string;
};
function createErrorResponseBody(err?: Error): ErrorResBody {
	if (!err) {
		return {
			status: "error",
			name: "Error",
			message: "Something went wrong!",
		};
	}
	return {
		status: "error",
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
