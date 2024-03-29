import joi from "joi";
import { UserSchema } from "../models/types/userTypes";

type NewUser = Omit<UserSchema, "following" | "followers" | "counts">;

const userSchema = joi.object<NewUser>({
	username: joi
		.string()
		.max(15)
		.trim()
		.required()
		.error(new Error("Enter valid username!")),
	name: joi
		.string()
		.trim()
		.max(25)
		.required()
		.error(new Error("Enter valid name!")),
	email: joi
		.string()
		.trim()
		.email()
		.required()
		.error(new Error("Enter valid email!")),
	password: joi
		.string()
		.trim()
		.min(7)
		.required()
		.error(new Error("Enter valid password!")),
	avatar: joi.string().trim().error(new Error("Enter valid avatar!")),
});

const santitizeUserData = (user: NewUser) => {
	return userSchema.validate(user);
};

export default santitizeUserData;
