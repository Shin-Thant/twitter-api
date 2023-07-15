import Joi from "joi";

export interface CreateTweetInput {
	body: string;
}
export const createTweetSchema = Joi.object({
	body: Joi.object<CreateTweetInput>({
		body: Joi.string().trim().required().messages({
			"string.base": "Tweet body must be string!",
		}),
	}),
	query: Joi.object({}),
	params: Joi.object({}),
});

export type ShareTweetInput = Partial<CreateTweetInput>;
export const shareTweetSchema = createTweetSchema.keys({
	body: Joi.object<ShareTweetInput>({
		body: Joi.string().trim(),
	}),
});
