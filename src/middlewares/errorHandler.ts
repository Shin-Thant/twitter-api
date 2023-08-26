import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import createErrorResponseBody from "../util/createErrorResponseBody";
import Joi from "joi";
import logger from "../util/logger";
import { MulterError } from "multer";
import { createImageUploadError } from "../lib/createImageUploadError";

type IncomingError = Error | AppError | Joi.ValidationError | MulterError;
const errorHandler = (
	err: IncomingError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	logger.error(err, err.message);

	if (err.name === "CastError") {
		const responseBody = createErrorResponseBody({
			error: "Bad Request",
			status: "fail",
		});
		return res.status(400).json(responseBody);
	}

	// token expired error
	if (err.name === "TokenExpiredError") {
		const responseBody = createErrorResponseBody({
			error: "Token expired!",
			status: "fail",
		});
		return res.status(403).json(responseBody);
	}

	// jwt error
	if (err.name === "JsonWebTokenError") {
		const responseBody = createErrorResponseBody({
			error: "Unauthorized!",
			status: "fail",
		});
		return res.status(401).json(responseBody);
	}

	// joi validation error
	if (err.name === "ValidationError") {
		const responseBody = createErrorResponseBody({
			error: err.message,
			status: "fail",
		});
		return res.status(400).json(responseBody);
	}

	if (err instanceof MulterError) {
		const responseBody = createErrorResponseBody({
			error: createImageUploadError(err),
			status: "fail",
		});
		return res.status(400).json(responseBody);
	}

	// AppError error
	if (isAppErrorInstance(err)) {
		return res
			.status(err.statusCode)
			.json(err.createAppErrorResponseBody());
	}

	// *this condition always has to be behind the `AppError` condition because `AppError` inherit `Error`
	res.status(500).json(
		createErrorResponseBody({ error: err, status: "error" })
	);
};

function isAppErrorInstance(error: IncomingError): error is AppError {
	return error instanceof AppError;
}

export default errorHandler;
