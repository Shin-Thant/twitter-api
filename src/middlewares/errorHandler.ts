import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MongooseError } from "mongoose";
import { MulterError } from "multer";
import AppError from "../config/AppError";
import { createImageUploadError } from "../lib/createImageUploadError";
import createErrorResponseBody from "../util/createErrorResponseBody";
import {
	isCastError,
	isJoiValidationError,
	isJwtTokenError,
	isMulterError,
	isTokenExpiredError,
} from "../util/errorHandlerHelpers";
import logger from "../util/logger";

export type IncomingError =
	| Error
	| AppError
	| MongooseError
	| TokenExpiredError
	| JsonWebTokenError
	| Joi.ValidationError
	| MulterError;

const errorHandler = (
	err: IncomingError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	logger.error(err, err.message);

	if (isCastError(err)) {
		const responseBody = createErrorResponseBody({
			error: "Bad request!",
			status: "fail",
		});
		return res.status(400).json(responseBody);
	}

	if (isTokenExpiredError(err)) {
		const responseBody = createErrorResponseBody({
			error: "Token expired!",
			status: "fail",
		});
		return res.status(403).json(responseBody);
	}

	if (isJwtTokenError(err)) {
		const responseBody = createErrorResponseBody({
			error: "Unauthorized!",
			status: "fail",
		});
		return res.status(401).json(responseBody);
	}

	if (isJoiValidationError(err)) {
		const responseBody = createErrorResponseBody({
			error: err.message,
			status: "fail",
		});
		return res.status(400).json(responseBody);
	}

	if (isMulterError(err)) {
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
