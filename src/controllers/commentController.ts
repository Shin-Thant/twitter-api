import { Request, Response } from "express";
import AppError from "../config/AppError";
import isObjectId from "../lib/isObjectId";
import Comment from "../models/Comment";
import { CreateCommentInput } from "../schema/commentSchema";
import {
	createComment,
	findComment,
	findManyComments,
} from "../services/commentServices";
import { findTweet } from "../services/tweetServices";
import { TypedRequestBody } from "../types/requestTypes";
import { TweetParams } from "./tweetController";

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

	const comments = await findManyComments({
		filter: { tweet: tweetId, origin: { $exists: false } },
		options: {
			populate: [
				{ path: "owner", select: "-email" },
				{
					path: "comments",
					populate: { path: "owner", select: "-email" },
				},
			],
			sort: "-createdAt",
			lean: true,
		},
	});

	res.json(comments);
};

export const addNewComment = async (
	req: Request<
		CreateCommentInput["params"],
		object,
		CreateCommentInput["body"]
	>,
	res: Response
) => {
	const { user: owner } = req;
	const { body } = req.body;
	const { tweetId } = req.params;

	if (!body || !owner || !tweetId) {
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

	const newComment = await createComment({
		body,
		owner: owner._id.toString(),
		tweet: tweetId,
	});
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

	const foundComment = await findComment({
		filter: { _id: commentId },
		options: {
			populate: [
				{ path: "owner", select: "-email" },
				{
					path: "comments",
					populate: { path: "owner", select: "-email" },
				},
			],
		},
	});

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
