import Joi from "joi";
import { Dto } from "./types";

type LoginInput = {
	email: string;
	password: string;
};

export const loginUserSchema = Joi.object({
	body: Joi.object<LoginInput>({
		email: Joi.string().email().trim().required().messages({
			"string.base": "Email must be string!",
			"string.email": "Invalid email!",
			"any.required": "Email is required!",
		}),
		password: Joi.string().trim().required().messages({
			"string.base": "Password must be string!",
			"any.required": "Password is required!",
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
			"any.required": "Username is required!",
		}),
		name: Joi.string().trim().max(15).required().messages({
			"string.base": "Name must be string!",
			"string.max": "Name must be less than {#limit} characters!",
			"any.required": "Name is required!",
		}),
		email: Joi.string().email().trim().required().messages({
			"string.base": "Email must be string!",
			"string.email": "Invalid email!",
			"any.required": "Email is required!",
		}),
		password: Joi.string().min(6).trim().required().messages({
			"string.base": "Password must be string!",
			"string.min": "Password must have at least 6 characters!",
			"any.required": "Password is required!",
		}),
		avatar: Joi.string().trim().messages({
			"string.base": "Avatar must be string!",
		}),
	}),
	query: Joi.object({}),
	params: Joi.object({}),
});

export interface EmailVerifyInput extends Dto {
	params: {
		token: string;
	};
}
export const emailVerifySchema = Joi.object<EmailVerifyInput, true>({
	body: Joi.object({}),
	params: Joi.object<EmailVerifyInput["params"], true>({
		token: Joi.string().trim().required().messages({
			"base.string": "Token must be string!",
			"any.required": "Token is requried!",
		}),
	}),
	query: Joi.object({}),
});

export interface ForgotPasswordInput extends Dto {
	params: {
		email: string;
	};
}
export const forgotPasswordSchema = Joi.object<ForgotPasswordInput, true>({
	body: Joi.object({}),
	params: Joi.object<ForgotPasswordInput["params"], true>({
		email: Joi.string().trim().email().required().messages({
			"base.string": "Email must be string!",
			"any.required": "Email is requried!",
			"any.email": "Invalid email!",
		}),
	}),
	query: Joi.object({}),
});
