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

const authTokenSchema = Joi.object<AuthTokenPayload, true>({
	userInfo: Joi.object<AuthTokenPayload["userInfo"], true>({
		id: Joi.string().required(),
	}),
});
export function validateAccessToken({
	payload,
	validateOptions = { abortEarly: true },
}: ValidatorArg) {
	return authTokenSchema.validate(payload, validateOptions);
}

export function validateRefreshToken({
	payload,
	validateOptions = { abortEarly: true },
}: ValidatorArg) {
	return authTokenSchema.validate(payload, validateOptions);
}

const emailTokenSchema = Joi.object({
	id: Joi.string().required(),
});
export function validateEmailToken({
	payload,
	validateOptions = { abortEarly: true },
}: ValidatorArg) {
	return emailTokenSchema.validate(payload, validateOptions);
}