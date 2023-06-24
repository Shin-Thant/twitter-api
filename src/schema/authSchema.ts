import Joi from "joi";

type LoginInput = {
	email: string;
	password: string;
};

export const loginUserSchema = Joi.object({
	body: Joi.object<LoginInput>({
		email: Joi.string().email().trim().required().messages({
			"string.base": "Email must be string!",
			"string.email": "Invalid email!",
		}),
		password: Joi.string().trim().required().messages({
			"string.base": "Password must be string!",
		}),
	}).required(),
	query: Joi.object({}),
	params: Joi.object({}),
});

export interface RegisterInput {
	username: string;
	name: string;
	email: string;
	password: string;
	avatar?: string;
}
export const registerUserSchema = Joi.object({
	body: Joi.object<RegisterInput>({
		username: Joi.string().max(15).trim().required().messages({
			"string.base": "Username must be string!",
			"string.max": "Username must be less than {#limit} characters!",
			"string.required": "Username is required!",
		}),
		name: Joi.string().trim().max(15).required().messages({
			"string.base": "Name must be string!",
			"string.max": "Name must be less than {#limit} characters!",
		}),
		email: Joi.string().email().trim().required().messages({
			"string.base": "Email must be string!",
			"string.email": "Invalid email!",
		}),
		password: Joi.string().min(6).trim().required().messages({
			"string.base": "Password must be string!",
			"string.min": "Password must have at least 6 characters!",
		}),
		avatar: Joi.string().trim().messages({
			"string.base": "Avatar must be string!",
		}),
	}),
	query: Joi.object({}),
	params: Joi.object({}),
});
