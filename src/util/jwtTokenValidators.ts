import Joi from "joi";
import jwt from "jsonwebtoken";

type JWTPayload = string | jwt.JwtPayload | undefined;
type ValidatorArg = {
	payload: JWTPayload;
	validateOptions?: Joi.ValidationOptions;
};

const authTokenSchema = Joi.object({
	userInfo: Joi.object({
		id: Joi.string().required(),
	}),
});
export function accessTokenValidator({
	payload,
	validateOptions,
}: ValidatorArg) {
	return authTokenSchema.validate(payload, validateOptions);
}

export function refreshTokenValidator({
	payload,
	validateOptions,
}: ValidatorArg) {
	return authTokenSchema.validate(payload, validateOptions);
}

const emailTokenSchema = Joi.object({
	id: Joi.string().required(),
});
export function emailTokenValidator({
	payload,
	validateOptions,
}: ValidatorArg) {
	return emailTokenSchema.validate(payload, validateOptions);
}
