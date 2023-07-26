import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import createErrorResponseBody from "../util/createErrorResponseBody";
import Joi from "joi";
import logger from "../util/logger";

const errorHandler = (
	err: Error | AppError | Joi.ValidationError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	logger.error(err, err.message);

	if (err.name === "CastError") {
		const badRequest = new Error("Bad Request!");
		return res
			.status(400)
			.json(createErrorResponseBody(badRequest, "fail"));
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
		const invalidTokenErr = new AppError("Unauthorized!", 401);
		return res
			.status(401)
			.json(invalidTokenErr.createAppErrorResponseBody());
	}

	// joi validation error
	if (err.name === "ValidationError") {
		logger.error("joi error");

		return res
			.status(400)
			.json(createErrorResponseBody(err.message, "fail"));
	}

	if (err instanceof AppError) {
		return res
			.status(err.statusCode)
			.json(err.createAppErrorResponseBody());
	}

	console.log("s", err.name);

	// *this condition always has to be behind the `AppError` condition because `AppError` inherit `Error`
	res.status(500).json(createErrorResponseBody(err));
};

export default errorHandler;
