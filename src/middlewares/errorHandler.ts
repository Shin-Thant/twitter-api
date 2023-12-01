import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MongooseError } from "mongoose";
import { MulterError } from "multer";
import AppError from "../config/AppError";
import { createImageUploadError } from "../lib/createImageUploadError";
import createErrorResponseBody from "../util/createErrorResponseBody";
import { createUnhandledErrorBodyFor } from "../util/createUnhandledErrorBodyFor";
import {
	isAppError,
	isCastError,
	isJoiValidationError,
	isJwtTokenError,
	isMulterError,
	isTokenExpiredError,
} from "../util/errorHandlerHelpers";
import { LoggerService } from "../services/loggerService";
import { LoggerProvider } from "../util/LoggerProvider";

const logger = new LoggerService(LoggerProvider.getInstance("Error"));

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
	logger.error({ msg: err.message, error: JSON.stringify(err) });

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
			error: err,
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
	if (isAppError(err)) {
		return res
			.status(err.statusCode)
			.json(err.createAppErrorResponseBody());
	}

	//! this condition must be below the `AppError` condition because `AppError` inherits `Error`
	res.status(500).json(createUnhandledErrorBodyFor(err));
};

export default errorHandler;
