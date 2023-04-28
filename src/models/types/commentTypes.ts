import { HydratedDocument, Model, Types } from "mongoose";
import { LeanUser, UserRef } from "../User";

export type CommentSchema = {
	body: string;
	creator: UserRef;
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

export type CommentModel = Model<CommentSchema>;
