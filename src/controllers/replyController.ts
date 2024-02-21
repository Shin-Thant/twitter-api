import { Request, Response } from "express";
import AppError from "../config/AppError";
import Comment from "../models/Comment";
import { UserDoc } from "../models/types/userTypes";
import { createReply } from "../services/commentServices";
import { updateTweet } from "../services/tweetServices";
import { CreateReplyInput } from "../validationSchemas/commentSchema";
import { io } from "../main";
import { Noti, createNotification } from "../services/notificationService";
import { NotiMessage } from "../util/notiMessage";
import { getUserPrivateRoom } from "../redis";
import { logger } from "../util/logger";
import { Emit } from "../socket";

export const replyComment = async (
	req: Request<CreateReplyInput["params"], object, CreateReplyInput["body"]>,
	res: Response
) => {
	const owner = req.user as UserDoc;
	const { body } = req.body;
	const { commentId: originCommentId } = req.params;

	const foundComment = await Comment.findById(originCommentId).exec();
	if (!foundComment) {
		throw new AppError("Parent comment not found!", 400);
	}

	const newReply = await createReply({
		type: "reply",
		body,
		origin: originCommentId,
		owner: owner._id.toString(),
		tweet: foundComment.tweet._id.toString(),
	});
	if (!newReply) {
		throw new AppError("Something went wrong!", 500);
	}

	await updateTweet({
		filter: { _id: foundComment.tweet._id },
		update: { $inc: { commentCount: 1 } },
	});

	const replyOwnComment =
		owner._id.toString() === foundComment.owner._id.toString();
	const userRoom = await getUserPrivateRoom(owner._id.toString());
	if (!replyOwnComment) {
		io.to(foundComment.owner._id.toString()).emit(Emit.REACT, {
			recipient: foundComment.owner._id.toString(),
			doc: foundComment.tweet._id.toString(),
			type: Noti.REPLY,
			message: NotiMessage.getReplyMessage(`@${owner.name}`),
			isRead: false,
			triggerBy: {
				_id: owner._id.toString(),
				name: owner.name,
				username: owner.name,
				avatar: owner.avatar,
			},
		});
		await createNotification({
			docID: foundComment.tweet._id.toString(),
			message: NotiMessage.getReplyMessage(`@${owner.name}`),
			recipientID: foundComment.owner._id.toString(),
			triggerUserID: owner._id.toString(),
			type: Noti.COMMENT,
		});
	} else {
		logger.debug("User private room is not present!");
	}

	res.json(newReply);
};
