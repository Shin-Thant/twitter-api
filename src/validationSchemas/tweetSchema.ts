import Joi from "joi";
import { objectIdValidator } from "../util/validationHelpers";
import { Dto } from "./types";

export interface TweetIdParam {
	tweetId: string;
}
export const tweetIdParamSchema = Joi.object<TweetIdParam, true>({
	tweetId: Joi.string().trim().required().custom(objectIdValidator).messages({
		"string.base": "Tweet ID must be string!",
		"any.required": "Tweet ID is required!",
		"any.custom": "Invalid tweet ID!",
	}),
});

export interface GetTweetsInput extends Dto {
	query: { currentPage: number; itemsPerPage: number };
}
export const getTweetsSchema = Joi.object<GetTweetsInput, true>({
	body: Joi.object({}),
	params: Joi.object({}),
	query: Joi.object({
		currentPage: Joi.number().required().messages({
			"number.base": "Current page must be number!",
			"any.required": "Current page is required!",
		}),
		itemsPerPage: Joi.number().required().messages({
			"number.base": "Items per page must be number!",
			"any.required": "Items per page is required!",
		}),
	}),
});

export interface GetTweetByIdInput extends Dto {
	params: { tweetId: string };
}
export const getTweetByIdSchema = Joi.object<GetTweetByIdInput, true>({
	body: Joi.object({}),
	params: tweetIdParamSchema,
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
	params: Joi.object({}),
	query: Joi.object({}),
});

export interface ShareTweetInput extends CreateTweetInput {
	params: { tweetId: string };
}
export const shareTweetSchema = Joi.object<ShareTweetInput, true>({
	body: Joi.object({
		body: Joi.string().trim().optional().messages({
			"string.base": "Tweet body must be string!",
		}),
	}),
	params: tweetIdParamSchema,
	query: Joi.object({}),
});

export interface RetweetSchema extends Dto {
	params: { tweetId: string };
}
export const retweetSchema = Joi.object<RetweetSchema, true>({
	body: Joi.object({}),
	params: tweetIdParamSchema,
	query: Joi.object({}),
});

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
	params: tweetIdParamSchema,
	query: Joi.object({}),
});

export type LikeTweetInput = GetTweetByIdInput;
export const likeTweetSchema = getTweetByIdSchema;
