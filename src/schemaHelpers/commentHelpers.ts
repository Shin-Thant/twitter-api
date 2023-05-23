import { Document } from "mongoose";
import {
	CommentSchema,
	CommentDoc,
	PopulateCommmentRelations,
	CommentPostThis,
} from "../models/types/commentTypes";
import { CallbackWithoutResultAndOptionalError } from "mongoose";
import Comment from "../models/Comment";
import { UserDoc } from "../models/types/userTypes";

export async function populateCommentAfterCreation(this: CommentPostThis) {
	await this.populate({ path: "creator", select: "-email" });
}

export const populateCommentRelations: PopulateCommmentRelations =
	function (options?: { populateComments: boolean }) {
		const result = this.populate<{ creator: Omit<UserDoc, "email"> }>({
			path: "creator",
			select: "-email",
		});
		if (options?.populateComments) {
			result.populate<{ comments: CommentDoc[] }>({
				path: "comments",
				populate: { path: "creator", select: "-email" },
			});
		}
		return result;
	};

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
