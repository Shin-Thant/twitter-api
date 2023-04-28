import { HydratedDocument, Model, Query, Types } from "mongoose";
import { LeanUser, UserRef } from "../User";
import { CommentRef, LeanComment } from "./commentTypes";

export type TweetSchema = {
	type: "post" | "share";
	owner: UserRef;
	body?: string;
	origin?: TweetRef;
	likes?: UserRef[];
	comments?: CommentRef[];
};

export interface LeanTweet extends TweetSchema {
	_id: Types.ObjectId;
	owner: LeanUser | Types.ObjectId;
	origin?: LeanTweet | Types.ObjectId;
	likes?: (LeanUser | Types.ObjectId)[];
	comments?: (LeanComment | Types.ObjectId)[];
}
export type TweetDoc = HydratedDocument<TweetSchema>;
export type TweetRef = LeanTweet | TweetDoc | Types.ObjectId;

// TODO: change `any` to something
export type QueryThis = Query<any, HydratedDocument<TweetSchema>>;

export type PostQueryThis = HydratedDocument<TweetSchema>;

// model
export type TweetModel = Model<TweetSchema>;
