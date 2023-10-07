import { Request, Response } from "express";
import { TypedRequestBody } from "../types/requestTypes";
import { TweetParams } from "./tweetController";
import AppError from "../config/AppError";
import santitizeCommentData from "../lib/validateCommentCreation";
import Comment from "../models/Comment";
import isObjectId from "../lib/isObjectId";
import { findTweet } from "../services/tweetServices";

//* test route
export const getAllComments = async (req: Request, res: Response) => {
	const comments = await Comment.find()
		.populateRelations({ populateComments: true })
		.lean();
	res.json(comments);
};

export type CommentParams = { commentId?: string };

export const getTweetComments = async (
	req: Request<TweetParams>,
	res: Response
) => {
	const { tweetId } = req.params;
	if (!tweetId) {
		throw new AppError("Tweet ID is requried!", 400);
	}

	const comments = await Comment.find({
		tweet: tweetId,
		parent: { $exists: false },
	})
		.populateRelations({ populateComments: true })
		.sort("-createdAt")
		.lean();
	res.json(comments);
};

type NewComment = { body?: string; tweetId?: string };

export const addNewComment = async (
	req: Request<Omit<TweetParams, "commentId">, object, NewComment>,
	res: Response
) => {
	const { user: creator } = req;
	const { body, tweetId } = req.body;
	if (!body || !creator || !tweetId) {
		throw new AppError("All fields are required!", 400);
	}

	if (!isObjectId(tweetId)) {
		throw new AppError("Invalid Tweet ID!", 400);
	}
	const foundTweet = await findTweet({
		filter: { _id: tweetId.toString() },
		options: { lean: true },
	});
	if (!foundTweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}

	const commentData = {
		body,
		creator: creator._id.toString(),
		tweet: tweetId,
	};
	const { value: data, error: inputErr } = santitizeCommentData(commentData);
	if (inputErr) {
		throw inputErr;
	}

	const newComment = await Comment.create(data);
	if (!newComment) {
		throw new AppError("Something went wrong!", 500);
	}

	res.json(newComment);
};

export const getCommentById = async (
	req: Request<CommentParams>,
	res: Response
) => {
	const { commentId } = req.params;
	if (!commentId) {
		throw new AppError("Comment ID is required!", 400);
	}

	const foundComment = await Comment.findById(commentId)
		.populateRelations({ populateComments: true })
		.exec();

	if (!foundComment) {
		throw new AppError("Invalid ID!", 400);
	}
	res.json(foundComment);
};

type UpdateBody = {
	body?: string;
};
export const updateComment = async (
	req: TypedRequestBody<UpdateBody>,
	res: Response
) => {
	const { comment } = req;
	const { body } = req.body;
	if (!comment) {
		throw new AppError("Unauthorized!", 401);
	}
	if (!body) {
		throw new AppError("Comment body is required!", 400);
	}

	comment.body = body;
	await comment.save();

	res.json(comment);
};

export const deleteComment = async (req: Request, res: Response) => {
	const { comment } = req;
	if (!comment) {
		throw new AppError("Unauthorized!", 401);
	}

	await comment.deleteOne();
	res.json({ message: "Comment deleted successfully!" });
};
