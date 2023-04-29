import { model, Schema } from "mongoose";
import {
	CommentModel,
	CommentQueryHelpers,
	CommentSchema,
} from "./types/commentTypes";
import {
	deleteAllNestedComments,
	populateCommentRelations,
} from "../schemaMiddlewares/commentMiddlewares";

const commentSchema = new Schema<
	CommentSchema,
	CommentModel,
	object,
	CommentQueryHelpers
>(
	{
		body: {
			type: String,
			required: [true, "Comment body is required!"],
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Creator ID is required!"],
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: "Tweet",
		},
		parent: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
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
	foreignField: "parent",
});

// TODO: catch the error when happens
// commentSchema.pre("find", populateCommentRelations);
// commentSchema.pre("findOne", populateCommentRelations);

commentSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	deleteAllNestedComments
);

// TODO: continue query helper
commentSchema.query.populateRelations = populateCommentRelations;

const Comment = model<CommentSchema, CommentModel>("Comment", commentSchema);
export default Comment;
