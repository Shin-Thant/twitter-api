/* eslint-disable no-mixed-spaces-and-tabs */
import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { UserSchema } from "../models/User";
import { TweetSchema } from "../models/types/tweetTypes";
import { CommentSchema } from "../models/types/commentTypes";

type User = HydratedDocument<UserSchema>;
type Tweet = HydratedDocument<TweetSchema>;
type Comment = HydratedDocument<CommentSchema>;

declare module "express" {
	interface Request {
		user?: User;
		tweet?: Tweet;
		comment?: Comment;
	}
}
