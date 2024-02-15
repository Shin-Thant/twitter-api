import { Request, Response } from "express";
import AppError from "../config/AppError";
import { CommentDoc, CommentSchema } from "../models/types/commentTypes";
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
	GetCommentsInput,
	LikeCommentInput,
	UpdateCommentInput,
} from "../validationSchemas/commentSchema";
import PaginationImpl from "../lib/pagination";
import PaginationHelperImpl from "../util/paginationHelper";
import { io } from "../main";
import { Noti, createNotification } from "../services/notificationService";
import { NotiMessage } from "../util/notiMessage";

const paginationHelper = new PaginationHelperImpl();

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
	req: Request<
		GetCommentsInput["params"],
		object,
		object,
		GetCommentsInput["query"]
	>,
	res: Response
) => {
	const { tweetId } = req.params;

	const totalComments = await getCommentCount({
		filter: { tweet: tweetId, origin: { $exists: false } },
	});
	const pagination = new PaginationImpl({
		itemsPerPage: req.query.itemsPerPage ?? 10,
		currentPage: req.query.currentPage ?? 1,
		helper: paginationHelper,
		totalDocs: totalComments,
	});

	// if (pagination.isCurrentPageExceeded()) {
	// 	return res.json(pagination.createPaginationResult([]));
	// }

	const comments = await findManyComments({
		filter: { tweet: tweetId, origin: { $exists: false } },
		options: {
			populate: commentRelationPopulate,
			sort: "-createdAt",
			limit: pagination.itemsPerPage,
			skip: pagination.skip,
		},
	});

	res.json(comments);
	// res.json(pagination.createPaginationResult<CommentSchema[]>(comments));
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

	const commentOwnTweet = owner._id.toString() === foundTweet._id.toString();
	if (!commentOwnTweet) {
		io.to(foundTweet.owner._id.toString()).emit("notify", {
			recipient: foundTweet.owner._id.toString(),
			doc: tweetId,
			type: Noti.COMMENT,
			message: NotiMessage.getCommentMessage(`@${owner.name}`),
			isRead: false,
			triggerBy: {
				_id: owner._id.toString(),
				name: owner.name,
				username: owner.name,
				avatar: owner.avatar,
			},
		});
		await createNotification({
			docID: tweetId,
			message: NotiMessage.getCommentMessage(`@${owner.name}`),
			recipientID: foundTweet.owner._id.toString(),
			triggerUserID: owner._id.toString(),
			type: Noti.COMMENT,
		});
	}

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

export const deleteCommentHandler = async (req: Request, res: Response) => {
	const comment = req.comment as CommentDoc;

	await comment.deleteOne();

	// update tweet for current comment delete
	await updateTweet({
		filter: { _id: comment.tweet },
		update: { $inc: { commentCount: -1 } },
	});

	res.json({ message: "Comment deleted successfully!" });
};
