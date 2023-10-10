import Comment from "../models/Comment";
import { CommentSchema } from "../models/types/commentTypes";
import { DeleteMany, FindMany, FindOne } from "./types";

interface CreateCommentData {
	body: string;
	owner: string;
	tweet: string;
}
export async function createComment(data: CreateCommentData) {
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

export async function deleteComments(args: DeleteMany<CommentSchema>) {
	return await Comment.deleteMany(args.filter, args.options);
}
