import Joi from "joi";
import { TweetSchema } from "../models/types/tweetTypes";

type Overrides = "origin" | "likes" | "comments" | "owner";
interface IBasicTweet extends Omit<TweetSchema, Overrides> {
	body?: string;
	owner: string;
}
export interface CreateTweet extends IBasicTweet {
	body: string;
	type: "post";
}
export interface ShareTweet extends IBasicTweet {
	type: "share";
	origin: string;
}
type NewTweet = CreateTweet | ShareTweet;

const tweetSchema = Joi.object<NewTweet>({
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

const santitizeTweetData = (tweet: NewTweet) => {
	return tweetSchema.validate(tweet);
};

export default santitizeTweetData;
