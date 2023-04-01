import { model, Schema } from "mongoose";

export interface IUser {
	username: string;
	name: string;
	email: string;
	password: string;
	avatar?: string;
}

const userSchema = new Schema<IUser>({
	username: {
		type: String,
		required: [true, "Username is required!"],
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

const User = model<IUser>("User", userSchema);
export default User;
