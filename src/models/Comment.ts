import { model, Schema } from "mongoose";

interface CommentType {
	name: string;
	avatar: string;
}

const commentSchema = new Schema<CommentType>({});

const Comment = model<CommentType>("Comment", commentSchema);
export default Comment;
