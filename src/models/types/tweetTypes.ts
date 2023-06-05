import {
	Document,
	HydratedDocument,
	Model,
	Query,
	QueryWithHelpers,
	Types,
} from "mongoose";
import { LeanUser, UserDoc, UserRef } from "./userTypes";
import { CommentDoc, CommentRef, LeanComment } from "./commentTypes";

export type TweetSchema = {
	type: "post" | "share";
	owner: UserRef;
	body?: string;
	origin?: TweetRef;
	likes: UserRef[];
	shares: UserRef[];
	comments?: CommentRef[];
};

export interface PopulatedTweet extends TweetSchema {
	origin: TweetDoc | LeanTweet;
	owner: UserDoc | LeanUser;
	likes: (UserDoc | LeanUser)[];
	comments: (CommentDoc | LeanComment)[];
}
export interface UnpopulatedTweet extends TweetSchema, Document {
	origin: Types.ObjectId;
	owner: Types.ObjectId;
	likes: Types.ObjectId[];
	comments: Types.ObjectId[];
}

export interface LeanTweet extends TweetSchema {
	_id: Types.ObjectId;
	owner: LeanUser | Types.ObjectId;
	origin?: LeanTweet | Types.ObjectId;
	likes: (LeanUser | Types.ObjectId)[];
	comments?: (LeanComment | Types.ObjectId)[];
}
export type TweetDoc = HydratedDocument<TweetSchema>;
export type TweetRef = LeanTweet | TweetDoc | Types.ObjectId;

export interface TweetQueryHelpers {
	populateRelations: PopulateTweetRelations;
}

type Options = { populateComments?: boolean; populateUser?: boolean };
export type PopulateTweetRelations = (
	this: TweetQueryThis,
	options?: Options
) => QueryWithHelpers<any, TweetDoc, TweetQueryHelpers>;

// TODO: change `any` to something
export type TweetQueryThis = Query<
	any,
	HydratedDocument<TweetSchema>,
	TweetQueryHelpers
>;

export type TweetPostThis = TweetDoc;

// model
export type TweetModel = Model<TweetSchema, TweetQueryHelpers>;
