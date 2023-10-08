import Joi from "joi";
import isObjectId from "../lib/isObjectId";

export type GetTweetByIdInput = {
	body: object;
	params: { tweetId: string };
	query: object;
};
export const getTweetByIdSchema = Joi.object<GetTweetByIdInput, true>({
	body: Joi.object({}),
	params: Joi.object({
		tweetId: Joi.string()
			.trim()
			.required()
			.custom(function (value) {
				if (!isObjectId(value)) {
					throw new Error("Invalid tweet ID!");
				}
				return value;
			})
			.messages({
				"string.base": "Tweet ID must be string!",
				"any.required": "Tweet ID is required!",
				"any.custom": "Invalid tweet ID!",
			}),
	}),
	query: Joi.object({}),
});

export type CreateTweetInput = {
	body: {
		body?: string;
	};
	params: object;
	query: object;
};
export const createTweetSchema = Joi.object({
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

export type EditTweetInput = {
	body: {
		body?: string;
	};
	params: {
		tweetId: string;
	};
	query: object;
};
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
