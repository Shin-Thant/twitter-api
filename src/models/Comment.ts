import { model, Schema } from "mongoose";
import { CommentModel, CommentSchema } from "./types/commentTypes";

const commentSchema = new Schema<CommentSchema, CommentModel>(
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

// TODO: create middleware for populating nested comments later with optimal knowledge
// commentSchema.pre("find", function () {
// 	console.log("find all");
// });
// commentSchema.pre("findOne", function () {
// 	console.log("find one");
// });

const Comment = model<CommentSchema>("Comment", commentSchema);
export default Comment;
