import { Request, Response } from "express";
import AppError from "../config/AppError";
import Comment from "../models/Comment";
import { UserDoc } from "../models/User";
import { TypedRequestBody } from "../types";
import { CommentDoc, LeanComment } from "../models/types/commentTypes";

// TODO: add nested comment try getting its parent
// TODO: remove the `creator` field, and use _id from req.user

type Params = { commentId?: string };

export const getAllComments = async (req: Request, res: Response) => {
	const comments = await Comment.find()
		.populate<{ comments: CommentDoc[] }>({
			path: "comments",
			populate: { path: "creator", select: "-email" },
		})
		.populate<{ creator: Omit<UserDoc, "email"> }>({
			path: "creator",
			select: "-email",
		});
	res.json(comments);
};

export const getCommentById = async (req: Request<Params>, res: Response) => {
	const { commentId } = req.params;
	if (!commentId) {
		throw new AppError("Comment ID is required!", 400);
	}

	const foundComment = await Comment.findById(commentId)
		.populate<{ comments: CommentDoc[] }>({
			path: "comments",
			populate: { path: "creator", select: "-email" },
		})
		.populate<{ creator: Omit<UserDoc, "email"> }>({
			path: "creator",
			select: "-email",
		})
		.lean<LeanComment>()
		.exec();

	if (!foundComment) {
		throw new AppError("Invalid ID!", 400);
	}
	res.json(foundComment);
};

type NewComment = { body?: string; tweet?: string };

export const addNewComment = async (
	req: TypedRequestBody<NewComment>,
	res: Response
) => {
	const { user: creator } = req;
	const { body, tweet } = req.body;
	if (!body || !tweet || !creator) {
		throw new AppError("All fields are required!", 400);
	}

	// TODO: validate input data
	const commentData = { body, creator: creator._id, tweet };
	const newComment = await Comment.create(commentData);
	if (!newComment) {
		throw new AppError("Something went wrong!", 500);
	}

	await newComment.populate("creator");
	res.json(newComment);
};

type UpdateBody = {
	body?: string;
};
export const updateComment = async (
	req: Request<Params, UpdateBody>,
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

export const deleteComment = async (req: Request<Params>, res: Response) => {
	const { comment } = req;
	if (!comment) {
		throw new AppError("Unauthorized!", 401);
	}

	await Comment.deleteMany({ parent: comment._id });
	await comment.deleteOne();
	res.json({ message: "Comment deleted successfully!" });
};
