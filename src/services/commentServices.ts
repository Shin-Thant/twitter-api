import Comment from "../models/Comment";
import { CommentSchema } from "../models/types/commentTypes";
import {
	DeleteMany,
	DeleteOne,
	FindMany,
	FindOne,
	GetCount,
	LikeOne,
	UpdateOne,
} from "./types";

interface CreateCommentData {
	type: "comment" | "reply";
	body: string;
	owner: string;
	tweet: string;
}
export async function createComment(data: CreateCommentData) {
	return await Comment.create(data);
}

interface CreateReplyData extends CreateCommentData {
	type: "reply";
	origin: string;
}
export async function createReply(data: CreateReplyData) {
	return await Comment.create(data);
}

export async function findManyComments(args: FindMany<CommentSchema>) {
	return await Comment.find(args.filter, args.projection, args.options);
}

export async function findComment(args: FindOne<CommentSchema>) {
	return await Comment.findOne(
		args.filter,
		args.projection,
		args.options
	).exec();
}

export async function updateComment(args: UpdateOne<CommentSchema>) {
	return await Comment.findOneAndUpdate(
		args.filter,
		args.update,
		args.options
	);
}

export async function updateCommentLikes(args: LikeOne<CommentSchema>) {
	let update: UpdateOne<CommentSchema>["update"];

	if (args.action === "like") {
		update = {
			$push: {
				likes: args.item,
			},
		};
	} else {
		update = {
			$pull: {
				likes: args.item,
			},
		};
	}

	return await updateComment({
		filter: args.filter,
		update,
		options: args.options,
	});
}

export async function deleteComment(args: DeleteOne<CommentSchema>) {
	return await Comment.findOneAndDelete(args.filter, args.options);
}

export async function deleteManyComments(args: DeleteMany<CommentSchema>) {
	return await Comment.deleteMany(args.filter, args.options);
}

export async function deleteAllReplies({ originId }: { originId: string }) {
	const replies = await findManyComments({ filter: { origin: originId } });

	return await Promise.all(
		replies.map(async (reply) => {
			return await reply.deleteOne();
		})
	);
}

export async function getCommentCount(args: GetCount<CommentSchema>) {
	return await Comment.countDocuments(args.filter, args.options);
}
