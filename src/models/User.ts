import { model, Schema } from "mongoose";

interface UserType {
	name: string;
	avatar: string;
}

const userSchema = new Schema<UserType>({
	name: {
		type: String,
		required: [true, "User name is required!"],
	},
	avatar: {
		type: String,
		reuired: [true, "User avatar is required!"],
	},
});

const User = model<UserType>("User", userSchema);
export default User;
