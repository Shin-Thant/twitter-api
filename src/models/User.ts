import { HydratedDocument, model, Schema, Types } from "mongoose";

// TODO: add new field `bio` (optional, string, maxlength = 60)
// TODO: add `followers`, `following` fields

export interface UserSchema {
	username: string;
	name: string;
	email: string;
	password: string;
	avatar?: string;
}

export type LeanUser = UserSchema & { _id: Types.ObjectId };
export type UserDoc = HydratedDocument<UserSchema>;
export type UserRef =
	| LeanUser
	| UserDoc
	| Omit<UserDoc, "email">
	| Types.ObjectId;

const userSchema = new Schema<UserSchema>({
	username: {
		type: String,
		required: [true, "Username is required!"],
		unique: true,
	},
	name: {
		type: String,
		maxlength: [20, "Name is too long!"],
		required: [true, "Name is required!"],
	},
	email: {
		type: String,
		required: [true, "Email is required!"],
	},
	password: {
		type: String,
		required: [true, "Password is required!"],
		select: false,
		minlength: [7, "Password must has at least 7 letters!"],
	},
	avatar: {
		type: String,
		// reuired: [true, "User avatar is required!"],
	},
});

const User = model<UserSchema>("User", userSchema);
export default User;
