import { FilterQuery, QueryOptions, Types, UpdateQuery } from "mongoose";
import Tweet from "../models/Tweet";
import {
	TweetDoc,
	TweetPopulateOptions,
	TweetSchema,
} from "../models/types/tweetTypes";

type Filter = FilterQuery<TweetSchema>;
type Update = UpdateQuery<TweetSchema>;
type Options = QueryOptions<TweetSchema>;

interface BasicTweet {
	owner: string;
	images?: string[];
}

type PostTweetContent =
	| { body: string }
	| { images: string[] }
	| { body: string; images: string[] };
export type CreateTweet = {
	type: "post";
} & BasicTweet &
	PostTweetContent;

export interface ShareTweet extends BasicTweet {
	type: "share";
	body?: string;
	origin: string;
}
type NewTweet = CreateTweet | ShareTweet;
export async function createTweet(input: NewTweet) {
	return Tweet.create(input);
}

export async function getTweetCount(query: Filter) {
	return Tweet.countDocuments(query);
}

export async function findTweet(filter: Filter, queryOptions?: Options) {
	return Tweet.findOne(filter, {}, queryOptions).exec();
}

export async function findManyTweet(
	filter: Filter,
	queryOptions?: Options,
	populateOptions?: TweetPopulateOptions
) {
	const res = Tweet.find(filter, {}, queryOptions);
	if (populateOptions) {
		res.populateRelations(populateOptions);
	}
	return res.exec();
}

export async function updateTweet(
	filter: Filter,
	update: Update,
	options?: Options
) {
	return Tweet.findOneAndUpdate(filter, update, options);
}

type PayloadOptions = {
	action: "like" | "unlike";
	item: Types.ObjectId;
	options?: Options;
};
export async function handleTweetLikes(
	query: Filter,
	{ action, item, options }: PayloadOptions
) {
	const update: Update =
		action === "like"
			? {
					$push: {
						likes: item,
					},
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  }
			: {
					$pull: {
						likes: item,
					},
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  };
	return updateTweet(query, update, options ?? { new: true });
}

export async function deleteTweet(filter: FilterQuery<TweetDoc>) {
	return Tweet.findOneAndDelete(filter);
}
