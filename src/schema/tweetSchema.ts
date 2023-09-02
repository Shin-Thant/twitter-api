import Joi from "joi";

export type CreateTweetInput = {
	body?: string;
};
export const createTweetSchema = Joi.object({
	body: Joi.object<CreateTweetInput>({
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
		body: string;
	};
	params: {
		tweetId: string;
	};
};
export const editTweetSchema = Joi.object({
	body: Joi.object({
		body: Joi.string().trim().required().messages({
			"string.base": "Tweet body must be string!",
			"any.required": "Tweet body is required!",
		}),
	}),
	params: Joi.object<EditTweetInput["params"]>({
		tweetId: Joi.string().trim().required().messages({
			"string.base": "Tweet ID must be string!",
			"any.required": "Tweet ID is required!",
		}),
	}),
	query: Joi.object({}),
});
