import Comment from "../models/Comment";
import { CommentSchema } from "../models/types/commentTypes";
import { DeleteMany } from "./types";

export async function deleteComments(args: DeleteMany<CommentSchema>) {
	return Comment.deleteMany(args.filter, args.options);
}
