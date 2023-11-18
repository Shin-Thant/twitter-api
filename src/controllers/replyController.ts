import { Request, Response } from "express";
import AppError from "../config/AppError";
import Comment from "../models/Comment";
import { UserDoc } from "../models/types/userTypes";
import { createReply } from "../services/commentServices";
import { updateTweet } from "../services/tweetServices";
import { CreateReplyInput } from "../validationSchemas/commentSchema";

export const replyComment = async (
	req: Request<CreateReplyInput["params"], object, CreateReplyInput["body"]>,
	res: Response
) => {
	const owner = req.user as UserDoc;
	const { body } = req.body;
	const { commentId: originCommentId } = req.params;

	const foundOrigin = await Comment.findById(originCommentId).exec();
	if (!foundOrigin) {
		throw new AppError("Parent comment not found!", 400);
	}

	const newReply = await createReply({
		type: "reply",
		body,
		origin: originCommentId,
		owner: owner._id.toString(),
		tweet: foundOrigin.tweet._id.toString(),
	});
	if (!newReply) {
		throw new AppError("Something went wrong!", 500);
	}

	await updateTweet({
		filter: { _id: foundOrigin.tweet._id },
		update: { $inc: { commentCount: 1 } },
	});

	res.json(newReply);
};
