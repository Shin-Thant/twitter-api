import {
	HydratedDocument,
	Model,
	Query,
	QueryWithHelpers,
	Types,
} from "mongoose";
import { LeanUser, UserRef } from "./userTypes";
import { TweetRef } from "./tweetTypes";

export type CommentSchema = {
	type: "post" | "share";
	body: string;
	owner: UserRef;
	tweet: TweetRef;
	origin?: CommentRef;
	likes: UserRef[];
	comments?: CommentRef[];
};

export interface LeanComment extends CommentSchema {
	_id: Types.ObjectId;
	creator: LeanUser | Types.ObjectId;
	origin?: LeanComment | Types.ObjectId;
	likes: (LeanUser | Types.ObjectId)[];
	comments?: (LeanComment | Types.ObjectId)[];
}

export type CommentDoc = HydratedDocument<CommentSchema>;
export type CommentRef = LeanComment | CommentDoc | Types.ObjectId;

export interface CommentQueryHelpers {
	populateRelations: PopulateCommmentRelations;
}

export type PopulateCommmentRelations = (
	this: CommentQueryHelperThis,
	options?: { populateComments: boolean }
) => QueryWithHelpers<any, CommentDoc, CommentQueryHelpers>;

export type CommentQueryHelperThis = Query<
	any,
	CommentDoc,
	CommentQueryHelpers
>;

export type CommentPostThis = CommentDoc;

export type CommentModel = Model<CommentSchema, CommentQueryHelpers>;
