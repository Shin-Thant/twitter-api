import { Document, Query } from "mongoose";
import { CommentSchema, CommentDoc } from "../models/types/commentTypes";
import { CallbackWithoutResultAndOptionalError } from "mongoose";
import Comment from "../models/Comment";
import { UserDoc } from "../models/User";

export async function populateCommentRelations(
	this: Query<CommentDoc | CommentDoc[], CommentDoc>,
	next: CallbackWithoutResultAndOptionalError
) {
	this.populate<{ comments: CommentDoc[] }>({
		path: "comments",
		populate: { path: "creator", select: "-email" },
	}).populate<{ creator: Omit<UserDoc, "email"> }>({
		path: "creator",
		select: "-email",
	});
	next();
}

export async function deleteAllNestedComments(
	this: Document<CommentSchema>,
	next: CallbackWithoutResultAndOptionalError
) {
	const replies = await Comment.find({ parent: this._id }).exec();
	if (!replies.length) {
		next();
	}

	//* This implementation is not optimal. Try something later...
	// TODO: fix this in the future
	await Promise.all(
		replies.map(async (reply) => {
			return reply.deleteOne();
		})
	);

	next();
}
