import Joi from "joi";
import { TweetType } from "../models/Tweet";

const tweetJoiSchema = Joi.object<TweetType<string>>({
	type: Joi.string()
		.trim()
		.required()
		.error(new Error("Enter valid tweet type!")),
	body: Joi.string().trim().error(new Error("Enter valid body!")),
	origin: Joi.string().trim().error(new Error("Enter valid tweet origin!")),
	owner: Joi.string()
		.trim()
		.required()
		.error(new Error("Enter valid owner!")),
});

const validateTweet = (tweet: TweetType<string>) => {
	return tweetJoiSchema.validate(tweet);
};

export default validateTweet;
