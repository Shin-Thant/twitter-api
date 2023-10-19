import Joi from "joi";
import { objectIdValidator } from "../util/validationHelpers";
import { GetTweetByIdInput, getTweetByIdSchema } from "./tweetSchema";
import { Dto } from "./types";

export type GetCommentsInput = GetTweetByIdInput;

export const getCommentsSchema = getTweetByIdSchema;

export interface GetCommentByIdInput extends Dto {
	params: {
		commentId: string;
	};
}
export const getCommentByIdSchema = Joi.object<GetCommentByIdInput, true>({
	body: Joi.object({}),
	params: Joi.object({
		commentId: Joi.string()
			.trim()
			.required()
			.custom(objectIdValidator)
			.messages({
				"string.base": "Comment ID must be string!",
				"any.required": "Comment ID is required!",
				"any.custom": "Invalid comment ID!",
			}),
	}),
	query: Joi.object({}),
});

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

export interface CreateReplyInput extends Dto {
	body: {
		body: string;
	};
	params: {
		commentId: string;
	};
}
export const createReplySchema = Joi.object<CreateReplyInput, true>({
	body: Joi.object({
		body: Joi.string().trim().required().messages({
			"string.base": "Comment body must be string!",
			"any.required": "Comment body is required!",
		}),
	}),
	params: Joi.object({
		commentId: Joi.string()
			.trim()
			.required()
			.custom(objectIdValidator)
			.messages({
				"string.base": "Comment ID must be string!",
				"any.required": "Comment ID is required!",
				"any.custom": "Invalid comment ID!",
			}),
	}),
	query: Joi.object({}),
});

export interface UpdateCommentInput extends Dto {
	body: {
		body: string;
	};
	params: {
		commentId: string;
	};
}
export const updateCommentSchema = Joi.object<UpdateCommentInput, true>({
	body: Joi.object({
		body: Joi.string().trim().required().messages({
			"string.base": "Comment body must be string!",
			"any.required": "Comment body is required!",
		}),
	}),
	params: Joi.object({
		commentId: Joi.string()
			.trim()
			.required()
			.custom(objectIdValidator)
			.messages({
				"string.base": "Comment ID must be string!",
				"any.required": "Comment ID is required!",
				"any.custom": "Invalid comment ID!",
			}),
	}),
	query: Joi.object({}),
});

export interface DeleteCommentInput extends Dto {
	params: {
		commentId: string;
	};
}
export const deleteCommentSchema = Joi.object<DeleteCommentInput, true>({
	body: Joi.object({}),
	params: Joi.object({
		commentId: Joi.string()
			.trim()
			.required()
			.custom(objectIdValidator)
			.messages({
				"string.base": "Comment ID must be string!",
				"any.required": "Comment ID is required!",
				"any.custom": "Invalid comment ID!",
			}),
	}),
	query: Joi.object({}),
});

export type LikeCommentInput = DeleteCommentInput;
export const likeCommentSchema = deleteCommentSchema;
