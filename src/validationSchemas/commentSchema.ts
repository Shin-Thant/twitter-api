import Joi from "joi";
import { objectIdValidator } from "../util/validationHelpers";
import {
	GetTweetByIdInput,
	TweetIdParam,
	tweetIdParamSchema,
} from "./tweetSchema";
import { Dto } from "./types";

interface CommentIdParam {
	commentId: string;
}
const commentIdParamSchema = Joi.object<CommentIdParam, true>({
	commentId: Joi.string()
		.trim()
		.required()
		.custom(objectIdValidator)
		.messages({
			"string.base": "Comment ID must be string!",
			"any.required": "Comment ID is required!",
			"any.custom": "Invalid comment ID!",
		}),
});

export interface GetCommentsInput extends GetTweetByIdInput {
	query: {
		currentPage?: number;
		itemsPerPage?: number;
		sortBy?: string;
	};
}
export const getCommentsSchema = Joi.object<GetTweetByIdInput, true>({
	body: Joi.object({}),
	params: tweetIdParamSchema,
	query: Joi.object({
		currentPage: Joi.number().optional().min(1).messages({
			"number.base": "Current page must be number!",
			"any.min": "Current page must be at least 1!",
		}),
		itemsPerPage: Joi.number().optional().min(1).max(20).messages({
			"number.base": "Current page must be number!",
			"any.min": "Current page must be at least 1!",
			"any.max": "Current page can't exceed more than 20!",
		}),
	}),
});

export interface GetCommentByIdInput extends Dto {
	params: {
		commentId: string;
	};
}
export const getCommentByIdSchema = Joi.object<GetCommentByIdInput, true>({
	body: Joi.object({}),
	params: commentIdParamSchema,
	query: Joi.object({}),
});

export interface GetCommentReplies extends Dto {
	params: {
		commentId: string;
	};
}
export const getCommentRepliesSchema = Joi.object<GetCommentReplies, true>({
	body: Joi.object({}),
	params: commentIdParamSchema,
	query: Joi.object({}),
});

export interface CreateCommentInput extends Dto {
	body: {
		body: string;
	};
	params: TweetIdParam;
}

export const createCommentSchema = Joi.object<CreateCommentInput, true>({
	body: Joi.object({
		body: Joi.string().trim().required().messages({
			"string.base": "Comment body must be string!",
			"any.required": "Comment body is required!",
		}),
	}),
	params: tweetIdParamSchema,
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
	params: commentIdParamSchema,
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
	params: commentIdParamSchema,
	query: Joi.object({}),
});

export interface DeleteCommentInput extends Dto {
	params: {
		commentId: string;
	};
}
export const deleteCommentSchema = Joi.object<DeleteCommentInput, true>({
	body: Joi.object({}),
	params: commentIdParamSchema,
	query: Joi.object({}),
});

export type LikeCommentInput = DeleteCommentInput;
export const likeCommentSchema = deleteCommentSchema;
