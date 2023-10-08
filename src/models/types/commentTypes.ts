import {
	HydratedDocument,
	Model,
	Query,
	QueryWithHelpers,
	Types,
} from "mongoose";
import { LeanUser, UserRef } from "./userTypes";

export type CommentSchema = {
	body: string;
	owner: UserRef;
	tweet: Types.ObjectId;
	parent?: CommentRef;
	comments?: CommentRef[];
};

export interface LeanComment extends CommentSchema {
	_id: Types.ObjectId;
	creator: LeanUser | Types.ObjectId;
	parent?: LeanComment | Types.ObjectId;
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
