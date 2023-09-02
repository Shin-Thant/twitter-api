import Joi, { ValidationError } from "joi";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { CastError } from "mongoose";
import { MulterError } from "multer";
import AppError from "../config/AppError";
import { IncomingError } from "../middlewares/errorHandler";

const CastErrorSchema = Joi.object<CastError>({
	name: Joi.string().valid("CastError").required(),
	stringValue: Joi.string().required(),
	kind: Joi.string().required(),
	value: Joi.any(),
	path: Joi.string(),
	reason: Joi.alt(Joi.object({}), Joi.allow(null)).optional(),
	model: Joi.any().optional(),
});

export function isCastError(error: IncomingError): error is CastError {
	const validationError = validateCastError(error);
	if (validationError) {
		return false;
	}
	return true;
}
function validateCastError(error: IncomingError): ValidationError | undefined {
	return CastErrorSchema.validate({ ...error }, { allowUnknown: true }).error;
}

export function isTokenExpiredError(
	error: IncomingError
): error is TokenExpiredError {
	return error instanceof TokenExpiredError;
}

export function isJwtTokenError(
	error: IncomingError
): error is JsonWebTokenError {
	return error instanceof JsonWebTokenError;
}

export function isJoiValidationError(
	error: IncomingError
): error is Joi.ValidationError {
	return error instanceof Joi.ValidationError;
}

export function isMulterError(error: IncomingError): error is MulterError {
	return error instanceof MulterError;
}

export function isAppError(error: IncomingError): error is AppError {
	return error instanceof AppError;
}
