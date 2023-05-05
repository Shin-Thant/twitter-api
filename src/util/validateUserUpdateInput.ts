import Joi from "joi";

export type UpdateReqBody = { name?: string; email?: string; avatar?: string };

const userUpdateSchema = Joi.object<Required<UpdateReqBody>>({
	name: Joi.string()
		.trim()
		.max(25)
		.required()
		.error(new Error("Enter valid user name!")),
	avatar: Joi.string().trim().error(new Error("Enter valid avatar")),
});
interface ValidateUserUpdateInput {
	name: string;
	avatar: string;
}
export const validateUserUpdateInput = (updates: ValidateUserUpdateInput) => {
	return userUpdateSchema.validate({ ...updates });
};
