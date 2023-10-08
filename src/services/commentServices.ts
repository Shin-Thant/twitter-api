import Comment from "../models/Comment";
import { CommentSchema } from "../models/types/commentTypes";
import { DeleteMany } from "./types";

interface CreateCommentData {
	body: string;
	owner: string;
	tweet: string;
}
export async function createComment(data: CreateCommentData) {
	return await Comment.create(data);
}

export async function deleteComments(args: DeleteMany<CommentSchema>) {
	return await Comment.deleteMany(args.filter, args.options);
}
