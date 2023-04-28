import joi from "joi";
import { UserSchema } from "../models/User";

const userSchema = joi.object<UserSchema>({
	username: joi
		.string()
		.trim()
		.required()
		.error(new Error("Enter valid username!")),
	name: joi
		.string()
		.trim()
		.max(20)
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

const santitizeUserData = (user: UserSchema) => {
	return userSchema.validate(user);
};

export default santitizeUserData;
