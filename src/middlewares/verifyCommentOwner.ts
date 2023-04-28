import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import { UserDoc } from "../models/User";
import Comment from "../models/Comment";
import { CommentParams } from "../controllers/commentController";
import { isValidObjectId } from "mongoose";

const verifyCommentOwner = async (
	req: Request<CommentParams>,
	res: Response,
	next: NextFunction
) => {
	const { user: owner } = req;
	const { commentId } = req.params;
	if (!owner) {
		console.log("User not found!");
		throw new AppError("Unauthorized!", 401);
	}
	if (!commentId) {
		throw new AppError("Comment ID is requried!", 400);
	}
	if (!isValidObjectId(commentId)) {
		throw new AppError("Invalid ID!", 400);
	}

	const foundComment = await Comment.findById(commentId)
		.populate<{ creator: Omit<UserDoc, "email"> }>({
			path: "creator",
			select: "-email",
		})
		.exec();

	if (!foundComment) {
		throw new AppError("Invalid ID!", 400);
	}

	if (foundComment.creator._id.toString() !== owner._id.toString()) {
		console.log("Not your comment!");
		throw new AppError("Unauthorized!", 401);
	}

	req.comment = foundComment;
	next();
};

export default verifyCommentOwner;
