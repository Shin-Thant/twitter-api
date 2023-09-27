import Joi from "joi";
import jwt from "jsonwebtoken";

type JWTPayload = string | jwt.JwtPayload | undefined;
type ValidatorArg = {
	payload: JWTPayload;
	validateOptions?: Joi.ValidationOptions;
};

interface AuthTokenPayload {
	userInfo: {
		id: string;
	};
}

interface EmailTokenPayload {
	id: string;
}

const DEFAULT_VALIDATION_OPTION: Joi.ValidationOptions = {
	abortEarly: true,
	stripUnknown: true,
	allowUnknown: true,
};

const authTokenPayloadSchema = Joi.object<AuthTokenPayload, true>({
	userInfo: Joi.object<AuthTokenPayload["userInfo"], true>({
		id: Joi.string().required(),
	}).required(),
}).required();

export function validateAccessTokenPayload({
	payload,
	validateOptions = DEFAULT_VALIDATION_OPTION,
}: ValidatorArg) {
	return authTokenPayloadSchema.validate(payload, validateOptions);
}

export function validateRefreshTokenPayload({
	payload,
	validateOptions = DEFAULT_VALIDATION_OPTION,
}: ValidatorArg) {
	return authTokenPayloadSchema.validate(payload, validateOptions);
}

const emailTokenPayloadSchema = Joi.object<EmailTokenPayload, true>({
	id: Joi.string().required(),
}).required();

export function validateEmailTokenPayload({
	payload,
	validateOptions = DEFAULT_VALIDATION_OPTION,
}: ValidatorArg) {
	return emailTokenPayloadSchema.validate(payload, validateOptions);
}
