import { Request, Response } from "express";
import AppError from "../config/AppError";
import { CommentDoc } from "../models/types/commentTypes";
import { UserDoc } from "../models/types/userTypes";
import {
	createComment,
	findComment,
	findManyComments,
	getCommentCount,
	updateCommentLikes,
} from "../services/commentServices";
import { findTweet, updateTweet } from "../services/tweetServices";
import {
	CreateCommentInput,
	GetCommentByIdInput,
	GetCommentReplies,
	LikeCommentInput,
	UpdateCommentInput,
} from "../validationSchemas/commentSchema";
import { TweetParams } from "./tweetController";

const commentRelationPopulate = [
	{
		path: "origin",
		populate: { path: "owner", select: "-email" },
	},
	{ path: "owner", select: "-email" },
	{
		path: "tweet",
		select: "owner",
		populate: { path: "owner", select: "username" },
	},
	{
		path: "comments",
		populate: [
			{
				path: "origin",
				populate: { path: "owner", select: "-email" },
			},
			{ path: "owner", select: "-email" },
			{
				path: "tweet",
				select: "owner",
				populate: { path: "owner", select: "username" },
			},
			{
				path: "comments",
				select: ["type", "_id", "owner", "-origin"],
				populate: {
					path: "owner",
					select: "-email",
				},
			},
		],
	},
];

export const getTweetComments = async (
	req: Request<TweetParams>,
	res: Response
) => {
	const { tweetId } = req.params;
	const comments = await findManyComments({
		filter: { tweet: tweetId, origin: { $exists: false } },
		options: {
			populate: commentRelationPopulate,
			sort: "-createdAt",
		},
	});

	res.json(comments);
};

export const getCommentReplies = async (
	req: Request<GetCommentReplies["params"]>,
	res: Response
) => {
	const { commentId: originId } = req.params;

	const replies = await findManyComments({
		filter: {
			origin: originId,
		},
		options: {
			populate: commentRelationPopulate,
		},
	});
	res.json(replies);
};

export const addNewComment = async (
	req: Request<
		CreateCommentInput["params"],
		object,
		CreateCommentInput["body"]
	>,
	res: Response
) => {
	const owner = req.user as UserDoc;
	const { body } = req.body;
	const { tweetId } = req.params;

	const foundTweet = await findTweet({
		filter: { _id: tweetId },
	});
	if (!foundTweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}

	const newComment = await createComment({
		type: "comment",
		body,
		owner: owner._id.toString(),
		tweet: tweetId,
	});
	if (!newComment) {
		throw new AppError("Something went wrong!", 500);
	}

	// update tweet's comment count
	foundTweet.commentCount += 1;
	await foundTweet.save();

	res.json(newComment);
};

export const getCommentById = async (
	req: Request<GetCommentByIdInput["params"]>,
	res: Response
) => {
	const { commentId } = req.params;

	const foundComment = await findComment({
		filter: { _id: commentId },
		options: {
			populate: { path: "owner", select: ["username", "name"] },
		},
	});

	res.json(foundComment);
};

export const handleCommentLikes = async (
	req: Request<LikeCommentInput["params"]>,
	res: Response
) => {
	const owner = req.user as UserDoc;
	const { commentId } = req.params;

	const foundComment = await findComment({
		filter: { _id: commentId },
	});
	if (!foundComment) {
		throw new AppError("Invalid comment ID!", 400);
	}

	const isLiked = foundComment.likes.includes(owner._id);

	const updatedComment = await updateCommentLikes({
		action: isLiked ? "unlike" : "like",
		filter: { _id: commentId },
		item: owner._id,
		options: { new: true },
	});

	res.json(updatedComment);
};

export const updateComment = async (
	req: Request<
		UpdateCommentInput["params"] & { tweetId: string },
		object,
		UpdateCommentInput["body"]
	>,
	res: Response
) => {
	const comment = req.comment as CommentDoc;
	const { body } = req.body;

	comment.body = body;
	await comment.save();

	res.json(comment);
};

export const deleteComment = async (req: Request, res: Response) => {
	const comment = req.comment as CommentDoc;

	await comment.deleteOne();

	const totalComments = await getCommentCount({
		filter: { tweet: comment.tweet },
	});
	console.log({ totalComments });

	await updateTweet({
		filter: { _id: comment.tweet },
		update: { $set: { commentCount: totalComments } },
	});

	res.json({ message: "Comment deleted successfully!" });
};
