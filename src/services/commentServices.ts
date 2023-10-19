import Comment from "../models/Comment";
import { CommentSchema } from "../models/types/commentTypes";
import { DeleteMany, FindMany, FindOne, LikeOne, UpdateOne } from "./types";

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

export async function findTweetComments({
	filter,
}: {
	filter: FindMany<CommentSchema>["filter"];
}) {
	return await findManyComments({
		filter,
		options: {
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
					populate: { path: "owner", select: "-email" },
				},
			],
			sort: "-createdAt",
			lean: true,
		},
	});
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

export async function deleteComments(args: DeleteMany<CommentSchema>) {
	return await Comment.deleteMany(args.filter, args.options);
}
