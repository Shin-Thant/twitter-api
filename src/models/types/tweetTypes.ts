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

type SharedTweet = PopulatedShares | Types.ObjectId;

export type PopulatedShares = Pick<
	TweetDoc,
	"_id" | "origin" | "body" | "owner" | "type"
>;

export type TweetSchema = {
	type: "post" | "share";
	owner: UserRef;
	body?: string;
	origin?: TweetRef;
	likes: UserRef[];
	shares: SharedTweet[];
	comments?: CommentRef[];
};

export interface PopulatedTweet extends TweetSchema {
	origin: TweetDoc | LeanTweet;
	owner: UserDoc | LeanUser;
	likes: (UserDoc | LeanUser)[];
	shares: (LeanTweet | TweetDoc)[];
	comments: (CommentDoc | LeanComment)[];
}
export interface UnpopulatedTweet extends TweetSchema, Document {
	origin: Types.ObjectId;
	owner: Types.ObjectId;
	likes: Types.ObjectId[];
	shares: Types.ObjectId[];
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

export type TweetPopulateOptions = {
	populateComments?: boolean;
	populateLikes?: boolean;
	populateShares?: boolean;
};
export type PopulateTweetRelations = (
	this: TweetQueryThis,
	options?: TweetPopulateOptions
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
