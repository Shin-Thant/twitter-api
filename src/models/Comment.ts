import { model, ObjectId, Schema } from "mongoose";

interface IComment {
	text: string;
	user: ObjectId;
	tweet: ObjectId;
	origin: ObjectId;
}

const commentSchema = new Schema<IComment>(
	{
		text: {
			type: String,
			required: [true, "Comment text is required!"],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User ID is required!"],
		},
		tweet: {
			type: Schema.Types.ObjectId,
			ref: "Tweet",
			required: [true, "Tweet ID is required!"],
		},
		origin: {
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	},
	{
		timestamps: true,
	}
);

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;
