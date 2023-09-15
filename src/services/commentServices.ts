import { FilterQuery } from "mongoose";
import Comment from "../models/Comment";
import { CommentSchema } from "../models/types/commentTypes";

export async function deleteComments(filter: FilterQuery<CommentSchema>) {
	return Comment.deleteMany(filter);
}
