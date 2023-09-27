import { model, Schema } from "mongoose";
import { UserSchema } from "./types/userTypes";

const userSchema = new Schema<UserSchema>(
	{
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
		emailVerified: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
			required: [true, "Password is required!"],
			select: false,
			minlength: [7, "Password must has at least 7 letters!"],
		},
		avatar: {
			type: String,
			default: "",
		},
		following: [
			{
				ref: "User",
				type: Schema.Types.ObjectId,
			},
		],
		counts: {
			followers: {
				type: Number,
				default: 0,
			},
			following: {
				type: Number,
				default: 0,
			},
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

userSchema.virtual("followers", {
	ref: "User",
	localField: "_id",
	foreignField: "following",
});

const User = model<UserSchema>("User", userSchema);
export default User;
