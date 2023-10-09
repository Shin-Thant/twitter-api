import Joi from "joi";
import { objectIdValidator } from "../util/validationHelpers";
import { GetTweetByIdInput, getTweetByIdSchema } from "./tweetSchema";
import { Dto } from "./types";

export type GetCommentsInput = GetTweetByIdInput;

export const getCommentsSchema = getTweetByIdSchema;

export interface CreateCommentInput extends Dto {
	body: {
		body: string;
	};
	params: {
		tweetId: string;
	};
}

export const createCommentSchema = Joi.object<CreateCommentInput, true>({
	body: Joi.object({
		body: Joi.string().trim().required().messages({
			"string.base": "Comment body must be string!",
			"any.required": "Comment body is required!",
		}),
	}),
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
