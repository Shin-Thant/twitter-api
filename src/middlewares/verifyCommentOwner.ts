import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import Comment from "../models/Comment";
import { CommentParams } from "../controllers/commentController";
import isObjectId from "../lib/isObjectId";

const verifyCommentOwner = async (
	req: Request<CommentParams>,
	res: Response,
	next: NextFunction
) => {
	const { user: owner } = req;
	const { commentId } = req.params;

	if (!owner) {
		throw new AppError("Unauthorized!", 401);
	}
	if (!commentId) {
		throw new AppError("Comment ID is requried!", 400);
	}
	if (!isObjectId(commentId)) {
		throw new AppError("Invalid ID!", 400);
	}

	const foundComment = await Comment.findById(commentId).exec();
	if (!foundComment) {
		throw new AppError("Invalid ID!", 400);
	}

	if (foundComment.owner._id.toString() !== owner._id.toString()) {
		throw new AppError("Unauthorized!", 401);
	}

	req.comment = foundComment;
	next();
};

export default verifyCommentOwner;
