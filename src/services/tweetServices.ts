import { FilterQuery, QueryOptions, Types, UpdateQuery } from "mongoose";
import Tweet from "../models/Tweet";
import { TweetSchema } from "../models/types/tweetTypes";
import { DeleteOne, FindMany, FindOne, GetCount, UpdateOne } from "./types";

type PostTweetContent =
	| { body: string; images?: string[] }
	| { body?: string; images: string[] }
	| { body: string; images: string[] };
export type CreateTweet = {
	type: "post";
	owner: string;
} & PostTweetContent;

export interface ShareTweet {
	type: "share";
	body?: string;
	owner: string;
	origin: string;
}

type NewTweet = CreateTweet | ShareTweet;
export async function createTweet(input: NewTweet) {
	return Tweet.create(input);
}

export async function getTweetCount(args: GetCount<TweetSchema>) {
	return Tweet.countDocuments(args.filter, args.options);
}

export async function findTweet(args: FindOne<TweetSchema>) {
	return await Tweet.findOne(
		args.filter,
		args.projection,
		args.options
	).exec();
}

export async function findManyTweets(args: FindMany<TweetSchema>) {
	return await Tweet.find(args.filter, args.projection, args.options);
}

export async function updateTweet(args: UpdateOne<TweetSchema>) {
	return await Tweet.findOneAndUpdate(args.filter, args.update, args.options);
}

type Filter = FilterQuery<TweetSchema>;
type Update = UpdateQuery<TweetSchema>;
type Options = QueryOptions<TweetSchema>;
type PayloadOptions = {
	action: "like" | "unlike";
	item: Types.ObjectId;
};
export async function handleTweetLikes(
	args: { filter: Filter; options?: Options } & PayloadOptions
) {
	const update: Update =
		args.action === "like"
			? {
					$push: {
						likes: args.item,
					},
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  }
			: {
					$pull: {
						likes: args.item,
					},
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  };

	return await updateTweet({
		filter: args.filter,
		update,
		options: args.options ?? { new: true },
	});
}

export async function deleteTweet(args: DeleteOne<TweetSchema>) {
	return Tweet.findOneAndDelete(args.filter, args.options);
}
