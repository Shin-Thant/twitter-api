import Joi from "joi";
import { TweetSchema } from "../models/types/tweetTypes";

const tweetJoiSchema = Joi.object<TweetSchema>({
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

interface BasicTweetData {
	owner: string;
}
export interface CreateTweetType extends BasicTweetData {
	type: "post";
	body: string;
	origin?: string;
}
export interface ShareTweetType extends BasicTweetData {
	type: "share";
	body?: string;
	origin: string;
}
type NewTweet = CreateTweetType | ShareTweetType;

const validateTweet = (tweet: NewTweet) => {
	return tweetJoiSchema.validate(tweet);
};

export default validateTweet;
