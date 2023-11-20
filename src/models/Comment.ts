import { model, Schema } from "mongoose";
import { findManyComments } from "../services/commentServices";
import { updateTweet } from "../services/tweetServices";
import {
	CommentModel,
	CommentQueryHelpers,
	CommentSchema,
} from "./types/commentTypes";

const commentSchema = new Schema<
	CommentSchema,
	CommentModel,
	object,
	CommentQueryHelpers
>(
	{
		type: {
			type: String,
			requried: [true, "Comment type is required!"],
		},
		body: {
			type: String,
			required: [true, "Comment body is required!"],
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Creator ID is required!"],
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: "Tweet",
			requried: true,
		},
		origin: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

commentSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "origin",
});

commentSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function (next) {
		const replies = await findManyComments({
			filter: { origin: this._id },
		});
		if (!replies.length) {
			return next();
		}

		// update tweet for current replies delete
		await updateTweet({
			filter: { _id: this.tweet },
			update: { $inc: { commentCount: replies.length * -1 } },
		});

		await Promise.all(
			replies.map(async (reply) => {
				return await reply.deleteOne();
			})
		);
		next();
	}
);

const Comment = model<CommentSchema, CommentModel>("Comment", commentSchema);
export default Comment;
