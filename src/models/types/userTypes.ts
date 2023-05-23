import { HydratedDocument, Types } from "mongoose";

export interface UserSchema {
	username: string;
	name: string;
	email: string;
	password: string;
	following: [string | Exclude<UserRef, Types.ObjectId>];
	avatar?: string;
	counts: {
		followers: number;
		following: number;
	};
	followers: [string | Exclude<UserRef, Types.ObjectId>];
}

export type LeanUser = UserSchema & {
	_id: Types.ObjectId;
};
export type UserDoc = HydratedDocument<UserSchema>;
export type UserRef =
	| LeanUser
	| UserDoc
	| Omit<UserDoc, "email">
	| Types.ObjectId;
