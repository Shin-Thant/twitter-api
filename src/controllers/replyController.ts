import { Request, Response } from "express";
import AppError from "../config/AppError";
import Comment from "../models/Comment";
import { CommentParams } from "./commentController";
import santitizeCommentData from "../lib/validateCommentCreation";

type NewReply = { body?: string };

export const replyComment = async (
	req: Request<CommentParams, object, NewReply>,
	res: Response
) => {
	const { user: creator } = req;
	const { body } = req.body;
	const { commentId: parentId } = req.params;

	if (!creator) {
		throw new AppError("Unauthorized!", 400);
	}
	if (!parentId || !body) {
		throw new AppError("All fields are required!", 400);
	}

	const foundParent = await Comment.findById(parentId).exec();
	if (!foundParent) {
		throw new AppError("Parent comment not found!", 400);
	}

	const replyData = {
		body,
		tweet: foundParent._id.toString(),
		origin: parentId,
		owner: creator._id.toString(),
	};
	const { value: data, error: inputErr } = santitizeCommentData(replyData);
	if (inputErr) {
		throw inputErr;
	}

	const newReply = await Comment.create(data);
	if (!newReply) {
		throw new AppError("Something went wrong!", 500);
	}

	res.json(newReply);
};
