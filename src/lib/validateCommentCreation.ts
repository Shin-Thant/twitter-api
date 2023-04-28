import Joi from "joi";
import { CommentSchema } from "../models/types/commentTypes";

type Overrides = "tweet" | "creator" | "parent" | "comments";
interface NewComment extends Omit<CommentSchema, Overrides> {
	tweet: string;
	creator: string;
	parent?: string;
}

const commentSchema = Joi.object<NewComment>({
	body: Joi.string()
		.max(200)
		.trim()
		.required()
		.error(new Error("Valid Comment Body!")),
	tweet: Joi.string()
		.trim()
		.required()
		.error(new Error("Tweet ID must be string!")),
	creator: Joi.string()
		.trim()
		.required()
		.error(new Error("Creator ID must be string!")),
	parent: Joi.string().trim().error(new Error("Parent ID must be string!")),
});

// use this in controller
const santitizeCommentData = (data: NewComment) => {
	return commentSchema.validate(data);
};

export default santitizeCommentData;
