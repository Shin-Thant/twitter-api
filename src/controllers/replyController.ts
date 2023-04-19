import { Request, Response } from "express";
import AppError from "../config/AppError";
import Comment from "../models/Comment";
import { Params } from "./commentController";

type NewReply = { body?: string };

export const replyComment = async (
	req: Request<Params, object, NewReply>,
	res: Response
) => {
	const { user: creator } = req;
	const { body } = req.body;
	const { commentId: parentId } = req.params;

	if (!creator) {
		throw new AppError("Unauthorized!", 400);
	}
	if (!parentId || !body) {
		throw new AppError("Comment body and parent ID are required!", 400);
	}

	const foundParent = await Comment.findById(parentId).exec();
	if (!foundParent) {
		throw new AppError("Invalid ID!", 400);
	}

	const replyData = {
		body,
		tweet: foundParent.tweet,
		parent: parentId,
		creator: creator._id,
	};
	const newReply = await Comment.create(replyData);
	if (!newReply) {
		throw new AppError("Something went wrong!", 500);
	}

	await newReply.populate({ path: "creator", select: "-email" });
	await newReply.populate({
		path: "parent",
		populate: { path: "creator", select: "-email" },
	});
	res.json(newReply);
};
