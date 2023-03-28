import joi from "joi";
import { IUser } from "../models/User";

const userJoiSchema = joi.object<IUser>({
	name: joi
		.string()
		.trim()
		.required()
		.error(new Error("Enter valid user name!")),
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
});

const validateUser = (user: IUser) => {
	return userJoiSchema.validate(user);
};

export default validateUser;
