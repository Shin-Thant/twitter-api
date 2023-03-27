import { model, Schema } from "mongoose";

interface UserType {
	name: string;
	email: string;
	password: string;
	avatar: string;
}

const userSchema = new Schema<UserType>({
	name: {
		type: String,
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

const User = model<UserType>("User", userSchema);
export default User;
