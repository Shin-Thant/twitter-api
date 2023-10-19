import Joi from "joi";
import { objectIdValidator } from "../util/validationHelpers";
import {
	GetTweetByIdInput,
	TweetIdParam,
	getTweetByIdSchema,
	tweetIdParamSchema,
} from "./tweetSchema";
import { Dto } from "./types";

interface CommentIdParam {
	commentId: string;
}
const commentIdParamSchema = Joi.object<CommentIdParam>({
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

export type GetCommentsInput = GetTweetByIdInput;
export const getCommentsSchema = getTweetByIdSchema;

export interface GetCommentByIdInput extends Dto {
	params: CommentIdParam;
}
export const getCommentByIdSchema = Joi.object<GetCommentByIdInput, true>({
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
	params: CommentIdParam;
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
	params: CommentIdParam;
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
	params: CommentIdParam;
}
export const deleteCommentSchema = Joi.object<DeleteCommentInput, true>({
	body: Joi.object({}),
	params: commentIdParamSchema,
	query: Joi.object({}),
});

export type LikeCommentInput = DeleteCommentInput;
export const likeCommentSchema = deleteCommentSchema;
