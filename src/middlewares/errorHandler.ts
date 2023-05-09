import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import createErrorResponseBody from "../util/createErrorResponseBody";

const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err.name === "CastError") {
		const badRequest = new Error("Bad Request!");
		return res
			.status(400)
			.json(createErrorResponseBody(badRequest, "error"));
	}

	// token expired error
	if (err.name === "TokenExpiredError") {
		const tokenExpiredErr = new AppError("Token expired!", 403);
		return res
			.status(403)
			.json(tokenExpiredErr.createAppErrorResponseBody());
	}

	// jwt error
	if (err.name === "JsonWebTokenError") {
		console.log("invalid!!!");
		const invalidTokenErr = new AppError(
			"Unauthorized!",
			401
		).createAppErrorResponseBody();
		return res
			.status(401)
			.json(createErrorResponseBody(invalidTokenErr, "fail"));
	}

	// joi validation error
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
