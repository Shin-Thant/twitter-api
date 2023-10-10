import Joi from "joi";
import { objectIdValidator } from "../util/validationHelpers";
import { Dto } from "./types";

export interface GetTweetByIdInput extends Dto {
	params: { tweetId: string };
}
export const getTweetByIdSchema = Joi.object<GetTweetByIdInput, true>({
	body: Joi.object({}),
	params: Joi.object({
		tweetId: Joi.string()
			.trim()
			.required()
			.custom(objectIdValidator)
			.messages({
				"string.base": "Tweet ID must be string!",
				"any.required": "Tweet ID is required!",
				"any.custom": "Invalid tweet ID!",
			}),
	}),
	query: Joi.object({}),
});

export interface CreateTweetInput extends Dto {
	body: {
		body?: string;
	};
}
export const createTweetSchema = Joi.object<CreateTweetInput, true>({
	body: Joi.object({
		body: Joi.string().trim().optional().messages({
			"string.base": "Tweet body must be string!",
		}),
	}),
	query: Joi.object({}),
	params: Joi.object({}),
});

export type ShareTweetInput = CreateTweetInput;
export const shareTweetSchema = createTweetSchema;

export interface EditTweetInput extends Dto {
	body: {
		body?: string;
	};
	params: {
		tweetId: string;
	};
}
export const editTweetSchema = Joi.object<EditTweetInput, true>({
	body: Joi.object<EditTweetInput["body"], true>({
		body: Joi.string().trim().optional().messages({
			"string.base": "Tweet body must be string!",
		}),
	}),
	params: Joi.object<EditTweetInput["params"], true>({
		tweetId: Joi.string().trim().required().messages({
			"string.base": "Tweet ID must be string!",
			"any.required": "Tweet ID is required!",
		}),
	}),
	query: Joi.object({}),
});
